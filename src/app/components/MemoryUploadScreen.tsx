import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Upload, Image, Video, Mic, MessageSquare, Check, Plus, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { uploadToCloudinary } from '../../lib/cloudinary';

interface MemoryUploadScreenProps {
  onNavigate?: (screen: string) => void;
}

export function MemoryUploadScreen({ onNavigate }: MemoryUploadScreenProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [uploadedItems, setUploadedItems] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'voice' | 'message'>('photo');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchMemories();
  }, [id]);

  const fetchMemories = async () => {
    // Mock local fetch
    setTimeout(() => {
      setUploadedItems([
        { id: 'mock1', contributor_name: 'Rahul', media_type: 'photo' },
        { id: 'mock2', contributor_name: 'Priya', media_type: 'message', text_content: 'Love you!' }
      ]);
    }, 500);
  };

  const uploadTypes = [
    { id: 'photo', label: 'Photos', icon: Image, color: 'from-orange-200 to-pink-200' },
    { id: 'video', label: 'Videos', icon: Video, color: 'from-purple-200 to-pink-200' },
    { id: 'voice', label: 'Voice Note', icon: Mic, color: 'from-blue-200 to-purple-200' },
    { id: 'message', label: 'Message', icon: MessageSquare, color: 'from-amber-200 to-orange-200' },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!contributorName.trim()) {
      setError("Please enter your name before uploading.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      // Mock upload to local state
      await new Promise(r => setTimeout(r, 800));
      const newItem = {
        id: `mock_${Date.now()}`,
        contributor_name: contributorName,
        media_type: activeTab,
      };
      setUploadedItems(prev => [newItem, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMessage = async () => {
    if (!message.trim()) return;
    if (!contributorName.trim()) {
      setError("Please enter your name before uploading.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      // Mock save message to local state
      await new Promise(r => setTimeout(r, 600));
      const newItem = {
        id: `mock_${Date.now()}`,
        contributor_name: contributorName,
        media_type: 'text',
        text_content: message,
      };
      setUploadedItems(prev => [newItem, ...prev]);
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Saving message failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#2d2520] font-light" style={{ background: '#fdfbf8' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#ffffff]/85 backdrop-blur-md border-b border-black/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(id ? `/event/${id}` : '/')}
            className="flex items-center gap-2 text-[#8a7968] hover:text-[#d4a574] font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <Button
            onClick={() => navigate(id ? `/event/${id}/gallery` : '/gallery')}
            className="bg-gradient-to-r from-[#d4a574] to-[#e8573a] text-white rounded-xl hover:opacity-90 font-medium transition-opacity border-0 shadow-md shadow-[#d4a574]/15"
          >
            View Gallery
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl mb-4 text-[#2d2520] font-light">
            Add Your <span className="text-[#d4a574] font-medium">Memories</span>
          </h1>
          <p className="text-lg text-[#8a7968]">
            Upload photos, videos, voice notes, or write emotional messages
          </p>
        </div>

        {error && (
          <div className="max-w-5xl mx-auto mb-6 p-4 bg-red-50/50 border border-red-500/20 rounded-xl text-red-500 font-medium text-sm text-center">
            {error}
          </div>
        )}

        {/* Contributor Name Input */}
        <div className="max-w-xl mx-auto mb-8">
          <Label className="text-[#8a7968] font-medium mb-2 block">Your Name</Label>
          <Input
            value={contributorName}
            onChange={(e) => setContributorName(e.target.value)}
            placeholder="How should the receiver know you by?"
            className="h-14 rounded-xl border-black/10 bg-[#ffffff] font-medium text-[#2d2520] focus:border-[#d4a574] focus:ring-[#d4a574] placeholder:text-[#8a7968]/50 shadow-sm"
          />
        </div>

        {/* Upload Type Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {uploadTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id as any)}
              className={`p-6 rounded-2xl border transition-all ${activeTab === type.id
                  ? 'border-[#d4a574] bg-[#d4a574]/5 shadow-md shadow-[#d4a574]/5'
                  : 'border-black/5 hover:border-black/10 bg-[#ffffff] shadow-sm'
                }`}
            >
              <type.icon
                className={`w-8 h-8 mx-auto mb-3 ${activeTab === type.id ? 'text-[#d4a574]' : 'text-[#8a7968]'
                  }`}
              />
              <p className={`text-sm font-medium ${activeTab === type.id ? 'text-[#2d2520]' : 'text-[#8a7968]'}`}>
                {type.label}
              </p>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Zone */}
          <div>
            <Card className="p-8 bg-[#ffffff] rounded-3xl border-black/5 shadow-md shadow-black/5 relative">
              {uploading && (
                <div className="absolute inset-0 z-10 bg-[#ffffff]/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-[#d4a574] mb-4" />
                  <p className="text-[#2d2520] font-medium">Uploading your memory...</p>
                </div>
              )}
              {activeTab === 'message' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center border border-black/5">
                      <MessageSquare className="w-6 h-6 text-[#d4a574]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-[#2d2520]">Emotional Message</h3>
                      <p className="text-sm font-medium text-[#8a7968]">Write from your heart</p>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Share your thoughts, memories, and emotions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[250px] rounded-xl border-black/10 bg-[#fafafa] font-medium text-[#2d2520] focus:border-[#d4a574] focus:ring-[#d4a574] focus:ring-offset-0 resize-none placeholder:text-[#8a7968]/50 shadow-inner"
                  />

                  <Button
                    onClick={handleSaveMessage}
                    disabled={uploading || !message.trim()}
                    className="w-full bg-gradient-to-r from-[#d4a574] to-[#e8573a] font-medium text-white py-6 rounded-2xl shadow-lg shadow-[#d4a574]/15 hover:opacity-90 transition-opacity border-0"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Save Message
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4a574]/10 to-[#e8573a]/10 flex items-center justify-center border border-black/5`}
                    >
                      {activeTab === 'photo' && <Image className="w-6 h-6 text-[#d4a574]" />}
                      {activeTab === 'video' && <Video className="w-6 h-6 text-[#d4a574]" />}
                      {activeTab === 'voice' && <Mic className="w-6 h-6 text-[#d4a574]" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-[#2d2520]">
                        Upload {uploadTypes.find((t) => t.id === activeTab)?.label}
                      </h3>
                      <p className="text-sm font-medium text-[#8a7968]">Drag & drop or click to browse</p>
                    </div>
                  </div>

                  <label className="border-2 border-dashed border-black/10 rounded-2xl p-12 text-center hover:border-[#d4a574] hover:bg-[#d4a574]/5 transition-all cursor-pointer block relative">
                    <input
                      type="file"
                      className="hidden"
                      accept={activeTab === 'photo' ? 'image/*' : activeTab === 'video' ? 'video/*' : 'audio/*'}
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    <Upload className="w-16 h-16 mx-auto mb-4 text-[#d4a574]" />
                    <h4 className="text-lg font-medium mb-2 text-[#2d2520]">Drop your files here</h4>
                    <p className="text-sm font-medium text-[#8a7968] mb-4">or click to browse</p>
                    <div className="bg-gradient-to-r from-[#d4a574] to-[#e8573a] text-white font-medium px-6 py-2 rounded-xl inline-flex items-center mx-auto hover:opacity-90 transition-opacity shadow-md shadow-[#d4a574]/15">
                      <Plus className="w-4 h-4 mr-2" />
                      Choose Files
                    </div>
                  </label>

                  <div className="text-xs font-medium text-[#8a7968] space-y-1">
                    {activeTab === 'photo' && <p>• Supported formats: JPG, PNG, HEIC (Max 10MB each)</p>}
                    {activeTab === 'video' && <p>• Supported formats: MP4, MOV (Max 100MB each)</p>}
                    {activeTab === 'voice' && <p>• Supported formats: MP3, WAV (Max 5 minutes)</p>}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Timeline Preview */}
          <div>
            <Card className="p-6 bg-[#ffffff] rounded-3xl border-black/5 shadow-md shadow-black/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-[#2d2520]">Memory Timeline</h3>
                <span className="text-sm font-medium text-[#8a7968]">{uploadedItems.length} items</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {uploadedItems.length === 0 ? (
                  <p className="text-center font-medium text-[#8a7968] py-8">No memories uploaded yet.</p>
                ) : (
                  uploadedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[#fafafa] border border-black/5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#ffffff] flex items-center justify-center flex-shrink-0 border border-black/5 shadow-sm">
                        {item.media_type === 'photo' && <Image className="w-6 h-6 text-[#d4a574]" />}
                        {item.media_type === 'video' && <Video className="w-6 h-6 text-[#d4a574]" />}
                        {item.media_type === 'voice' && <Mic className="w-6 h-6 text-[#d4a574]" />}
                        {(item.media_type === 'message' || item.media_type === 'text') && <MessageSquare className="w-6 h-6 text-[#d4a574]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#2d2520] truncate font-medium">{item.contributor_name}</p>
                        <p className="text-xs font-medium text-[#8a7968]">
                          {item.media_type === 'text' || item.media_type === 'message' ? item.text_content.substring(0, 30) + '...' : 'Uploaded media'}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-black/5">
                <Button
                  onClick={() => navigate(id ? `/event/${id}/gallery` : '/gallery')}
                  className="w-full bg-gradient-to-r from-[#d4a574] to-[#e8573a] text-white font-medium py-6 rounded-2xl shadow-lg shadow-[#d4a574]/15 hover:opacity-90 transition-opacity border-0"
                >
                  Continue to Gallery
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
