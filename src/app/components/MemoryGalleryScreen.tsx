import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Heart, Play, MessageSquare, Calendar, User, Share2, Download, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';

interface MemoryGalleryScreenProps {
  onNavigate?: (screen: string) => void;
}

export function MemoryGalleryScreen({ onNavigate }: MemoryGalleryScreenProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'photo' | 'video' | 'message'>('all');
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // Mock gallery load
    const t = setTimeout(() => {
      setMemories([
        { id: '1', media_type: 'photo', file_url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300', uploader_name: 'Rahul', created_at: new Date().toISOString() },
        { id: '2', media_type: 'message', message: 'Happy birthday!', uploader_name: 'Priya', created_at: new Date().toISOString() },
      ]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [id]);

  const filteredMemories = filter === 'all' 
    ? memories 
    : memories.filter((m) => {
        // Map UI filters to database types
        if (filter === 'message') return m.media_type === 'message' || m.media_type === 'text';
        return m.media_type === filter;
      });

  const filterOptions = [
    { id: 'all', label: 'All Memories', count: memories.length },
    { id: 'photo', label: 'Photos', count: memories.filter((m) => m.media_type === 'photo').length },
    { id: 'video', label: 'Videos', count: memories.filter((m) => m.media_type === 'video').length },
    { id: 'message', label: 'Messages', count: memories.filter((m) => m.media_type === 'message' || m.media_type === 'text').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf8] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#d4a574]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#2d2520] font-light" style={{ background: '#fdfbf8' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#ffffff]/85 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(id ? `/event/${id}` : '/')}
              className="flex items-center gap-2 text-[#8a7968] hover:text-[#d4a574] font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Gallery link copied!');
                }}
                variant="outline"
                className="border border-black/10 text-[#2d2520] font-medium rounded-xl hover:bg-black/5 bg-[#ffffff] shadow-sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilter(option.id as any)}
                className={`px-6 py-3 rounded-xl whitespace-nowrap font-medium transition-all border ${
                  filter === option.id
                    ? 'bg-gradient-to-r from-[#d4a574] to-[#e8573a] text-white border-transparent shadow-lg shadow-[#d4a574]/15'
                    : 'bg-[#ffffff] text-[#8a7968] border-black/10 hover:bg-black/5'
                }`}
              >
                {option.label}
                <span className="ml-2 opacity-75">({option.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl mb-4 text-[#2d2520] font-light">
            Your <span className="text-[#d4a574] font-medium">Memory Gallery</span>
          </h1>
          <p className="text-lg text-[#8a7968]">
            A collection of emotional moments preserved forever
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <Card className="p-6 bg-[#ffffff] rounded-2xl border-black/5 text-center shadow-md">
            <div className="text-3xl mb-2 text-[#d4a574] font-light">{memories.length}</div>
            <div className="text-sm font-medium text-[#8a7968]">Total Memories</div>
          </Card>
          <Card className="p-6 bg-[#ffffff] rounded-2xl border-black/5 text-center shadow-md">
            <div className="text-3xl mb-2 text-[#d4a574] font-light">
              {new Set(memories.map(m => m.uploader_name)).size}
            </div>
            <div className="text-sm font-medium text-[#8a7968]">Contributors</div>
          </Card>
          <Card className="p-6 bg-[#ffffff] rounded-2xl border-black/5 text-center shadow-md">
            <div className="text-3xl mb-2 text-[#d4a574] font-light">∞</div>
            <div className="text-sm font-medium text-[#8a7968]">Emotions Shared</div>
          </Card>
        </div>

        {/* Memory Grid */}
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredMemories.map((memory, index) => (
              <motion.div
                key={memory.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card
                  className="overflow-hidden rounded-3xl border-black/5 hover:border-[#d4a574]/35 hover:shadow-xl hover:shadow-[#d4a574]/10 transition-all duration-500 bg-[#ffffff] h-full flex flex-col"
                >
                  {memory.media_type === 'message' || memory.media_type === 'text' ? (
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mb-6 border border-black/5">
                          <MessageSquare className="w-8 h-8 text-[#d4a574]" />
                        </div>
                        <p className="text-[#2d2520] mb-6 leading-relaxed italic">"{memory.message}"</p>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-black/5 mt-auto">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#8a7968]" />
                          <span className="text-sm font-medium text-[#8a7968]">{memory.uploader_name}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="relative aspect-square overflow-hidden flex-shrink-0 bg-[#fafafa]">
                        {memory.media_type === 'video' ? (
                          <video 
                            src={memory.file_url} 
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageWithFallback
                            src={memory.file_url}
                            alt="Memory"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                          />
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-end bg-[#ffffff] border-t border-black/5">
                        <div className="flex items-center justify-between text-sm mt-auto">
                          <div className="flex items-center gap-2 text-[#8a7968]">
                            <User className="w-4 h-4 text-[#d4a574]" />
                            <span className="font-medium text-[#2d2520]">{memory.uploader_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#8a7968]">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">{new Date(memory.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State for filtered results */}
        {filteredMemories.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-[#8a7968]/30" />
            <h3 className="text-xl font-medium mb-2 text-[#2d2520]">No memories yet</h3>
            <p className="text-[#8a7968] font-medium mb-6">Upload your first {filter === 'all' ? 'memory' : filter} to get started</p>
            <Button
              onClick={() => navigate(id ? `/event/${id}/upload` : '/upload')}
              className="bg-gradient-to-r from-[#d4a574] to-[#e8573a] text-white font-medium px-8 py-6 rounded-2xl shadow-lg shadow-[#d4a574]/15 hover:opacity-90 transition-opacity border-0"
            >
              Upload Memory
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
