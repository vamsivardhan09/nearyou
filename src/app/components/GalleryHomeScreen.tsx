import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Lock, Globe, Sparkles, Camera, Mic, MessageSquare } from 'lucide-react';

export const STORY_TEMPLATES = [
  {
    id: 'mom-memories',
    label: 'Mom Memories',
    emoji: '🌸',
    tagline: 'A lifetime of love, warmth, and care',
    desc: 'Celebrate the woman who shaped your world — her sacrifices, hugs, and endless love preserved forever.',
    gradient: 'from-rose-400 to-pink-500',
    bg: '#fff5f7',
    accent: '#e8507a',
    accentLight: 'rgba(232,80,122,0.08)',
    textAccent: '#e8507a',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    quote: '"A mother\'s love is the fuel that enables a normal human being to do the impossible."',
  },
  {
    id: 'dad-tribute',
    label: 'Dad Tribute',
    emoji: '🦁',
    tagline: 'Strong, steady, and always there',
    desc: 'Honor the man who stood tall for your family — his strength, wisdom, and quiet love told through time.',
    gradient: 'from-blue-700 to-indigo-600',
    bg: '#f3f5ff',
    accent: '#3b5bdb',
    accentLight: 'rgba(59,91,219,0.08)',
    textAccent: '#3b5bdb',
    image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80',
    quote: '"A father\'s love is forever imprinted on his child\'s heart."',
  },
  {
    id: 'couple-journey',
    label: 'Couple Journey',
    emoji: '💑',
    tagline: 'Every chapter of your love story',
    desc: 'From the first glance to forever — your relationship told through beautiful shared moments.',
    gradient: 'from-amber-400 to-orange-500',
    bg: '#fffaf2',
    accent: '#d4a574',
    accentLight: 'rgba(212,165,116,0.08)',
    textAccent: '#c48a3f',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
    quote: '"In all the world, there is no heart for me like yours."',
  },
  {
    id: 'friendship-story',
    label: 'Friendship Story',
    emoji: '✨',
    tagline: 'The bonds that never break',
    desc: 'Celebrate the friends who became family — the laughs, the late nights, and the memories that last forever.',
    gradient: 'from-violet-500 to-purple-600',
    bg: '#faf5ff',
    accent: '#7c3aed',
    accentLight: 'rgba(124,58,237,0.08)',
    textAccent: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    quote: '"Friendship is the only cement that will ever hold the world together."',
  },
  {
    id: 'family-forever',
    label: 'Family Forever',
    emoji: '🏡',
    tagline: 'Where love begins and never ends',
    desc: 'Your family story — the home you grew in, the values you carry, and the love that binds across generations.',
    gradient: 'from-emerald-500 to-teal-600',
    bg: '#f0fdf4',
    accent: '#059669',
    accentLight: 'rgba(5,150,105,0.08)',
    textAccent: '#047857',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&q=80',
    quote: '"Family is not an important thing, it\'s everything."',
  },
  {
    id: 'birthday-moments',
    label: 'Birthday Moments',
    emoji: '🎂',
    tagline: 'Every year, a new beautiful chapter',
    desc: 'Mark another trip around the sun with an emotional collection of birthday memories, wishes, and milestones.',
    gradient: 'from-yellow-400 to-amber-500',
    bg: '#fffef0',
    accent: '#d97706',
    accentLight: 'rgba(217,119,6,0.08)',
    textAccent: '#b45309',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
    quote: '"Today is the oldest you\'ve ever been and the youngest you\'ll ever be again."',
  },
];

export function GalleryHomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-light pb-24" style={{ background: '#fdfbf8' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md border-b border-black/5" style={{ background: 'rgba(255,255,255,0.88)' }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}>
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h1 className="font-medium text-[#2d2520] text-lg leading-none">Memory Stories</h1>
              <p className="text-xs text-[#8a7968] font-medium mt-0.5">Choose your emotional template</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#8a7968]">
            <Lock className="w-3.5 h-3.5" />
            Private by default
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10">
        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 border border-[#d4a574]/25 bg-[#d4a574]/8" style={{ background: 'rgba(212,165,116,0.08)' }}>
            <Sparkles className="w-3.5 h-3.5 text-[#d4a574]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#d4a574]">Cinematic Memory Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-[#2d2520] mb-4 leading-tight">
            Every relationship has a<br />
            <span className="text-[#d4a574] font-medium">story worth telling.</span>
          </h2>
          <p className="text-[#8a7968] max-w-xl mx-auto font-medium leading-relaxed">
            Choose a template that matches your most precious relationship. Upload your memories and watch them transform into a cinematic emotional journey.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: Camera, text: 'Photos & Videos' },
              { icon: Mic, text: 'Voice Notes' },
              { icon: MessageSquare, text: 'Emotional Messages' },
              { icon: Globe, text: 'Shareable Stories' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ffffff] border border-black/6 shadow-sm text-xs font-semibold text-[#8a7968]" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <f.icon className="w-3.5 h-3.5 text-[#d4a574]" />
                {f.text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Template grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {STORY_TEMPLATES.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => navigate(`/gallery/${template.id}`)}
              className="group cursor-pointer rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden flex-shrink-0">
                <img
                  src={template.image}
                  alt={template.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  style={{ transform: 'scale(1)', transitionProperty: 'transform' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.6)] via-[rgba(0,0,0,0.1)] to-transparent`} />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-2xl">{template.emoji}</span>
                    <h3 className="text-white font-medium text-lg leading-tight">{template.label}</h3>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${template.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg`}>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: template.textAccent }}>{template.tagline}</p>
                <p className="text-sm font-medium text-[#8a7968] leading-relaxed flex-1">{template.desc}</p>

                <div className="mt-5 pt-5 border-t border-black/5 flex items-center justify-between">
                  <div className="flex gap-2">
                    {['📷', '🎙️', '💬'].map((icon) => (
                      <span key={icon} className="text-base">{icon}</span>
                    ))}
                  </div>
                  <button
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    style={{ background: template.accentLight, color: template.textAccent }}
                  >
                    Start Story <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center rounded-3xl p-12 mb-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)' }}
        >
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10">
            <Heart className="w-10 h-10 text-white/80 mx-auto mb-4 fill-white/20" />
            <h3 className="text-2xl font-light text-white mb-2">Your memories deserve to be preserved beautifully.</h3>
            <p className="text-white/85 font-medium text-sm max-w-md mx-auto mb-8">Not just stored — but told as a story that moves hearts and honors the relationships that matter most.</p>
            <button
              onClick={() => navigate('/gallery/couple-journey')}
              className="px-8 py-4 rounded-2xl font-medium text-[#e8573a] transition-all hover:scale-105"
              style={{ background: '#ffffff', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
            >
              Begin Your First Story ✨
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
