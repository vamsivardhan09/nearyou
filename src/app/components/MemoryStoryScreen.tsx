import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, Play, Pause, Mic, MessageSquare, Calendar, Share2,
  Lock, Globe, Upload, Plus, ChevronDown, Music, Image as ImageIcon, Video
} from 'lucide-react';
import { STORY_TEMPLATES } from './GalleryHomeScreen';

// ─── Mock memory data per template ──────────────────────────────────────────
const MOCK_MEMORIES: Record<string, any[]> = {
  'mom-memories': [
    { id: '1', type: 'photo', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80', author: 'Rahul', date: '2020-03-08', caption: 'Happy Women\'s Day, Amma 🌸 You are my whole world.', emotion: '💕' },
    { id: '2', type: 'message', message: 'Mom, I still remember how you stayed up all night when I had fever. I never said it enough — thank you. I love you more than words.', author: 'Priya', date: '2021-05-12', emotion: '🥹' },
    { id: '3', type: 'photo', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=80', author: 'Arun', date: '2019-10-14', caption: 'Your kitchen always smelled like home. Still does.', emotion: '🌺' },
    { id: '4', type: 'voice', author: 'Deepa', date: '2022-01-01', caption: 'New Year voice note to Amma', duration: '0:42', emotion: '🎙️' },
    { id: '5', type: 'message', message: 'The way you laugh at your own jokes — that is my favorite sound in the whole world. Don\'t ever stop.', author: 'Kiran', date: '2023-04-22', emotion: '😂❤️' },
    { id: '6', type: 'photo', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=700&q=80', author: 'Rahul', date: '2018-12-25', caption: 'Christmas morning, 2018. You made everything magical.', emotion: '🎄' },
  ],
  'dad-tribute': [
    { id: '1', type: 'photo', url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=700&q=80', author: 'Arjun', date: '2021-06-19', caption: 'Father\'s Day. Dad, your silent strength shaped everything I am.', emotion: '🦁' },
    { id: '2', type: 'message', message: 'I never told you how much that long drive meant to me. You didn\'t say much. You didn\'t need to. I felt safe.', author: 'Meera', date: '2022-09-03', emotion: '🙏' },
    { id: '3', type: 'voice', author: 'Arjun', date: '2023-01-26', caption: 'Dad\'s favorite old song — I recorded him humming it', duration: '1:15', emotion: '🎵' },
    { id: '4', type: 'photo', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=700&q=80', author: 'Meera', date: '2020-08-15', caption: 'Independence Day. You always said freedom starts at home.', emotion: '🇮🇳' },
  ],
  'couple-journey': [
    { id: '1', type: 'photo', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=700&q=80', author: 'Aryan', date: '2019-02-14', caption: 'Our first Valentine\'s Day. I was so nervous. You made it easy.', emotion: '💑' },
    { id: '2', type: 'message', message: 'Three years ago you said yes. I still can\'t believe I get to do life with you. Every single day.', author: 'Aryan', date: '2022-02-14', emotion: '💍' },
    { id: '3', type: 'photo', url: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=700&q=80', author: 'Neha', date: '2020-12-31', caption: 'New Year\'s Eve on that rooftop. Remember the rain? Best night.', emotion: '🌧️❤️' },
    { id: '4', type: 'voice', author: 'Neha', date: '2021-08-20', caption: 'Surprise voice message on our anniversary ✨', duration: '2:03', emotion: '🎙️' },
    { id: '5', type: 'message', message: 'You laugh at all my bad jokes. That\'s how I know it\'s real.', author: 'Aryan', date: '2023-07-07', emotion: '😄' },
  ],
  'friendship-story': [
    { id: '1', type: 'photo', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80', author: 'Siddharth', date: '2017-06-10', caption: 'First day of college. We had no idea what was coming. Best decision — meeting you.', emotion: '✨' },
    { id: '2', type: 'message', message: 'You called me at 3am. Didn\'t ask why. Just said "I\'m coming." That\'s a friend.', author: 'Pooja', date: '2020-11-15', emotion: '🫂' },
    { id: '3', type: 'photo', url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=700&q=80', author: 'Karthik', date: '2022-03-20', caption: 'The Goa trip that almost didn\'t happen. Best 72 hours of my life.', emotion: '🏖️' },
    { id: '4', type: 'voice', author: 'Pooja', date: '2023-09-12', caption: 'A birthday voice note 6 years in the making', duration: '3:21', emotion: '🎂' },
  ],
  'family-forever': [
    { id: '1', type: 'photo', url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=700&q=80', author: 'Vikram', date: '2018-10-02', caption: 'Gandhi Jayanti family lunch. That old dining table holds so many stories.', emotion: '🏡' },
    { id: '2', type: 'message', message: 'Home is not a place. It\'s the four of us around that table arguing over what to watch on TV.', author: 'Ananya', date: '2021-04-15', emotion: '📺❤️' },
    { id: '3', type: 'photo', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=700&q=80', author: 'Vikram', date: '2023-01-14', caption: 'Pongal 2023. Same traditions, new memories.', emotion: '🌾' },
  ],
  'birthday-moments': [
    { id: '1', type: 'photo', url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=700&q=80', author: 'Kavya', date: '2023-05-20', caption: 'Your 25th! A quarter century of being the most wonderful person I know.', emotion: '🎂' },
    { id: '2', type: 'message', message: 'Another year older, another year of watching you become more brilliantly yourself. Happy Birthday, star. 🌟', author: 'Rohan', date: '2022-05-20', emotion: '⭐' },
    { id: '3', type: 'voice', author: 'Kavya', date: '2021-05-20', caption: 'Surprise singing at midnight 🎵', duration: '1:48', emotion: '🎵' },
    { id: '4', type: 'photo', url: 'https://images.unsplash.com/photo-1549294117-97b3aaec3304?w=700&q=80', author: 'Rohan', date: '2020-05-20', caption: 'Lockdown birthday — we made it magical anyway.', emotion: '🎉' },
  ],
};

// ─── Voice Note Player ────────────────────────────────────────────────────────
function VoiceNotePlayer({ memory, accent }: { memory: any; accent: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: 'rgba(0,0,0,0.04)' }}>
      <button
        onClick={() => setPlaying(!playing)}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-transform hover:scale-105"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
      >
        {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full flex-shrink-0 transition-all duration-300"
              style={{
                width: 2,
                height: playing ? Math.random() * 20 + 8 : Math.sin(i * 0.5) * 8 + 12,
                background: i < 12 && playing ? accent : `${accent}55`,
              }}
            />
          ))}
        </div>
        <p className="text-xs font-medium text-[#8a7968]">{memory.duration}</p>
      </div>
      <Music className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
    </div>
  );
}

// ─── Memory Card ──────────────────────────────────────────────────────────────
function MemoryCard({ memory, template, index }: { memory: any; template: typeof STORY_TEMPLATES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="flex gap-5"
    >
      {/* Timeline line & dot */}
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 shadow-md" style={{ background: template.accentLight, border: `2px solid ${template.accent}` }}>
          <span>{memory.emotion}</span>
        </div>
        <div className="w-px flex-1 mt-2" style={{ background: `${template.accent}22`, minHeight: 32 }} />
      </div>

      {/* Card body */}
      <div className="flex-1 pb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color: template.textAccent }}>{memory.author}</span>
          <span className="text-[10px] text-[#8a7968] font-medium flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(memory.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="rounded-3xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          {memory.type === 'photo' && (
            <div>
              <div className="relative overflow-hidden" style={{ maxHeight: 280 }}>
                <img src={memory.url} alt="memory" className="w-full object-cover" style={{ maxHeight: 280 }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {memory.caption && (
                <div className="p-5 border-t border-black/5">
                  <p className="text-sm font-medium text-[#2d2520] leading-relaxed italic">"{memory.caption}"</p>
                </div>
              )}
            </div>
          )}

          {memory.type === 'video' && (
            <div>
              <div className="relative bg-black/5 flex items-center justify-center" style={{ height: 200 }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: template.accent }}>
                  <Play className="w-7 h-7 text-white ml-1" />
                </div>
                <Video className="absolute top-3 right-3 w-5 h-5 text-[#8a7968]" />
              </div>
              {memory.caption && (
                <div className="p-5 border-t border-black/5">
                  <p className="text-sm font-medium text-[#2d2520] leading-relaxed italic">"{memory.caption}"</p>
                </div>
              )}
            </div>
          )}

          {memory.type === 'voice' && (
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Mic className="w-4 h-4" style={{ color: template.accent }} />
                <p className="text-sm font-semibold text-[#2d2520]">{memory.caption}</p>
              </div>
              <VoiceNotePlayer memory={memory} accent={template.accent} />
            </div>
          )}

          {memory.type === 'message' && (
            <div className="p-6">
              <MessageSquare className="w-5 h-5 mb-3" style={{ color: template.accent }} />
              <p className="text-[#2d2520] leading-relaxed font-medium italic text-base">
                "{memory.message}"
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function MemoryStoryScreen() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const template = STORY_TEMPLATES.find((t) => t.id === templateId) ?? STORY_TEMPLATES[0];
  const memories = MOCK_MEMORIES[template.id] ?? [];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShare(true);
    setTimeout(() => setShowShare(false), 2500);
  };

  return (
    <div className="min-h-screen font-light pb-24" style={{ background: template.bg }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b border-black/5" style={{ background: `${template.bg}ee` }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/gallery')}
            className="flex items-center gap-2 font-medium transition-colors"
            style={{ color: template.textAccent }}
          >
            <ArrowLeft className="w-5 h-5" />
            Stories
          </button>
          <div className="flex items-center gap-3">
            {/* Privacy toggle */}
            <button
              onClick={() => setIsPublic(!isPublic)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all"
              style={{
                borderColor: `${template.accent}40`,
                background: isPublic ? template.accentLight : 'transparent',
                color: template.textAccent,
              }}
            >
              {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              {isPublic ? 'Public' : 'Private'}
            </button>
            {/* Share */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white transition-all"
              style={{ background: template.accent }}
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Copied toast */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-full text-white text-sm font-semibold shadow-lg"
            style={{ background: template.accent }}
          >
            Link copied! ✓
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-6">
        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden mb-10 mt-6"
          style={{ minHeight: 280 }}
        >
          <img
            src={template.image}
            alt={template.label}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-70`} />
          <div className="relative z-10 p-10 flex flex-col justify-end" style={{ minHeight: 280 }}>
            <span className="text-5xl mb-3">{template.emoji}</span>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-2">{template.label}</h1>
            <p className="text-white/85 font-medium text-base max-w-md">{template.tagline}</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                {memories.length} Memories
              </div>
              <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                {new Set(memories.map((m) => m.author)).size} Contributors
              </div>
              <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                ∞ Emotions
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12 px-4"
        >
          <p className="text-lg font-medium italic" style={{ color: template.textAccent }}>
            {template.quote}
          </p>
        </motion.div>

        {/* Timeline heading */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-medium text-[#2d2520]">Memory Timeline</h2>
          <button
            onClick={() => navigate(`/gallery/${templateId}/upload`)}
            className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-2xl text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${template.accent}, ${template.accent}bb)`, boxShadow: `0 6px 20px ${template.accent}30` }}
          >
            <Plus className="w-4 h-4" />
            Add Memory
          </button>
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {memories.map((memory, i) => (
            <MemoryCard key={memory.id} memory={memory} template={template} index={i} />
          ))}
        </div>

        {/* Add memory CTA at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate(`/gallery/${templateId}/upload`)}
          className="mt-4 mb-8 rounded-3xl p-8 text-center cursor-pointer border-2 border-dashed transition-all hover:border-solid"
          style={{
            borderColor: `${template.accent}40`,
            background: template.accentLight,
          }}
        >
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: template.accentLight, border: `2px solid ${template.accent}` }}>
            <Plus className="w-7 h-7" style={{ color: template.accent }} />
          </div>
          <p className="font-semibold text-[#2d2520] mb-1">Add a new memory</p>
          <p className="text-sm font-medium text-[#8a7968]">Upload photos, videos, voice notes, or write an emotional message</p>
        </motion.div>
      </div>
    </div>
  );
}
