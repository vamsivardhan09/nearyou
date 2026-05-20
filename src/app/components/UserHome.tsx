import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, PlusCircle, LogOut, Bell, Gift, Clock, Star, ArrowRight, Users, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PACKAGES } from '../../lib/packagesData';
import { EmotionalExperiences } from './EmotionalExperiences';
import { addDays, differenceInDays } from 'date-fns';

const GREETINGS = (name: string) => [
  `Hi ${name}, welcome back 👋`,
  `Good to see you again, ${name} 💛`,
  `Welcome to Nearyou, ${name} ✨`,
];

const NUDGES = [
  { icon: '💛', text: '3 contributors haven\'t uploaded yet', action: 'Nudge Them', color: '#d4a574' },
  { icon: '🎬', text: '2 new videos added for Mom\'s Birthday', action: 'Preview', color: '#e07b54' },
  { icon: '📅', text: 'Mom\'s Birthday is in 7 days!', action: 'View Plan', color: '#c19466' },
  { icon: '💌', text: 'Your surprise is 80% ready — finish it!', action: 'Complete', color: '#d4a574' },
];

const MOCK_EVENTS = [
  { id: '1', name: 'Mom', type: 'Birthday Experience', date: addDays(new Date(), 7), memories: 12, target: 20 },
  { id: '2', name: 'Arjun & Priya', type: 'Couple Surprise', date: addDays(new Date(), 32), memories: 5, target: 15 },
];

const MOCK_DATES = [
  { id: '1', title: "Mom's Birthday", date: addDays(new Date(), 7) },
  { id: '2', title: 'Parents Anniversary', date: addDays(new Date(), 40) },
  { id: '3', title: "Sister's Graduation", date: addDays(new Date(), 68) },
];

const MEMORIES = [
  { id: '1', title: "Dad's 60th Birthday", date: '12 Jan 2026', emoji: '🎂', memories: 24 },
  { id: '2', title: "Couple Anniversary Trip", date: '14 Feb 2026', emoji: '💑', memories: 18 },
];

export function UserHome() {
  const navigate = useNavigate();
  const { displayName, signOut } = useAuth();
  const [nudgeIdx, setNudgeIdx] = useState(0);
  const [greetingIdx] = useState(() => Math.floor(Math.random() * 3));

  useEffect(() => {
    const t = setInterval(() => setNudgeIdx(i => (i + 1) % NUDGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  const nudge = NUDGES[nudgeIdx];
  const greeting = GREETINGS(displayName || 'there')[greetingIdx];

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <div className="min-h-screen font-light pb-28 text-[#2d2520]" style={{ background: '#fdfbf8' }}>

      {/* NAV */}
      <div className="sticky top-0 z-50 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a574] to-[#f4845f] text-[1.6rem] leading-none font-extrabold tracking-tighter lowercase font-logo drop-shadow-sm">nearyou.</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,165,116,0.1)' }}>
              <Bell className="w-3.5 h-3.5 text-[#d4a574]" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#f4845f]" />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ background: 'linear-gradient(135deg,#d4a574,#e8573a)' }}>
              {displayName?.slice(0,1).toUpperCase() || 'U'}
            </div>
            <button onClick={handleSignOut} className="text-xs font-light px-3 py-1.5 rounded-xl transition-colors hover:bg-black/5" style={{ color: '#8a7968' }}>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-7 space-y-9">

        {/* HERO */}
        <section>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: '#d4a574' }}>Your emotional space</p>
            <h1 className="font-light text-3xl md:text-4xl mb-3 text-[#2d2520]">{greeting}</h1>
            <p className="font-light text-sm max-w-lg" style={{ color: '#8a7968', lineHeight: 1.8 }}>
              Craft memories, schedule surprises, and stay emotionally connected — even from far away.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-3 mt-5">
            {[
              { icon: Gift, val: '2', label: 'Active Surprises', color: '#f4845f' },
              { icon: Users, val: '17', label: 'Contributors', color: '#f9c56f' },
              { icon: Star, val: '34', label: 'Memories', color: '#e8573a' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                <div>
                  <p className="text-lg font-medium leading-none text-[#2d2520]">{s.val}</p>
                  <p className="text-[10px] font-light mt-0.5" style={{ color: '#8a7968' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => navigate('/create')} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium text-white shadow-lg" style={{ background: 'linear-gradient(135deg,#d4a574,#e8573a)', boxShadow: '0 6px 20px rgba(212,165,116,0.3)' }}>
              <PlusCircle className="w-4 h-4" /> Create Surprise
            </button>
            <button onClick={() => navigate('/gallery')} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-colors hover:bg-white" style={{ background: '#ffffff', color: '#d4a574', border: '1px solid rgba(212,165,116,0.3)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              📖 Memory Stories
            </button>
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-colors hover:bg-white" style={{ background: '#ffffff', color: '#8a7968', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
              My Dashboard
            </button>
          </motion.div>
        </section>

        {/* EMOTION SYNC */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg,rgba(212,165,116,0.1),rgba(244,132,95,0.05))', border: '1px solid rgba(212,165,116,0.2)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <AnimatePresence mode="wait">
              <motion.span key={nudgeIdx} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="text-xl flex-shrink-0">{nudge.icon}</motion.span>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p key={`t-${nudgeIdx}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-sm font-medium truncate text-[#2d2520]">{nudge.text}</motion.p>
            </AnimatePresence>
          </div>
          <button className="text-xs font-medium px-3 py-1.5 rounded-xl flex-shrink-0 text-white transition-opacity hover:opacity-80" style={{ background: nudge.color }}>{nudge.action}</button>
        </motion.section>

        {/* EMOTIONAL EXPERIENCES (Replaces Quick Actions) */}
        <EmotionalExperiences />

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-9">

            {/* SCHEDULED SURPRISES */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#d4a574]" />
                  <h2 className="font-normal text-xl text-[#2d2520]">Scheduled Surprises</h2>
                </div>
                <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-[#d4a574] flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
              <div className="space-y-4">
                {MOCK_EVENTS.map((ev, i) => {
                  const days = differenceInDays(ev.date, new Date());
                  const pct = Math.round((ev.memories / ev.target) * 100);
                  return (
                    <motion.div key={ev.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                       onClick={() => navigate(`/event/${ev.id}`)}
                       className="group cursor-pointer rounded-3xl p-5 relative overflow-hidden hover:-translate-y-0.5 transition-all"
                       style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                      <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ background: '#d4a574' }} />
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest font-semibold block mb-1" style={{ color: '#d4a574' }}>{ev.type}</span>
                          <h3 className="font-medium text-lg text-[#2d2520]">{ev.name}'s Surprise</h3>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full text-[#e8573a] bg-[#e8573a]/10">
                          <Clock className="w-3 h-3" /> {days === 0 ? 'Today!' : `${days}d left`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-light mb-1.5 text-[#8a7968]">
                        <span>Memory Collection</span>
                        <span className="text-[#d4a574] font-medium">{ev.memories}/{ev.target}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.05)' }}>
                        <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#d4a574,#e8573a)' }}
                           initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* PACKAGES */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-normal text-xl text-[#2d2520]">Curated Packages</h2>
                <button onClick={() => navigate('/packages')} className="text-sm font-medium text-[#d4a574] flex items-center gap-1">Explore all <ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {PACKAGES.slice(0, 3).map((pkg, i) => (
                  <motion.div key={pkg.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    onClick={() => navigate(`/package/${pkg.id}`)}
                    className="group cursor-pointer rounded-3xl overflow-hidden shadow-sm" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="h-40 relative">
                      <ImageWithFallback src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <h3 className="text-white font-medium text-sm">{pkg.title}</h3>
                        <p className="text-white/80 text-[11px] font-light mt-0.5">{pkg.tagline}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* UPCOMING UPDATES */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#d4a574]" />
                  <h2 className="font-normal text-xl text-[#2d2520]">Upcoming Updates</h2>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-medium px-3 py-1 rounded-full text-[#d4a574] bg-[rgba(212,165,116,0.15)]">What's New</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: 'AI Voice Cloning for Memories', desc: 'Create voice notes that sound exactly like you, preserving your emotional tone forever.', tag: 'Next Week' },
                  { title: 'Physical Keepsake Delivery', desc: 'Turn digital memories into beautifully crafted physical photo books delivered globally.', tag: 'Coming Soon' }
                ].map((update, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-3xl relative overflow-hidden group" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                    <div className="absolute top-0 right-0 p-4">
                      <span className="text-[10px] font-medium px-2 py-1 rounded-lg" style={{ background: 'rgba(212,165,116,0.15)', color: '#d4a574' }}>{update.tag}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ background: 'rgba(212,165,116,0.1)' }}>
                      <Sparkles className="w-4 h-4 text-[#d4a574]" />
                    </div>
                    <h3 className="font-semibold text-sm mb-2 text-[#2d2520]">{update.title}</h3>
                    <p className="font-light text-xs leading-relaxed text-[#8a7968]">{update.desc}</p>
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4a574]/20 rounded-3xl transition-colors pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* PREVIOUS EXPERIENCES */}
            <section>
              <h2 className="font-normal text-xl mb-5 text-[#2d2520]">Previous Experiences</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {MEMORIES.map((m, i) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{m.emoji}</span>
                      <div>
                        <p className="font-medium text-sm text-[#2d2520]">{m.title}</p>
                        <p className="font-light text-xs text-[#8a7968]">{m.date}</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-[#d4a574]">{m.memories} memories collected</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR */}
          <div className="md:col-span-4 space-y-7">

            {/* UPCOMING DATES */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-[#d4a574]" />
                <h2 className="font-normal text-lg text-[#2d2520]">Upcoming Dates</h2>
              </div>
              <div className="rounded-3xl p-5" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                {MOCK_DATES.map((item, i) => {
                  const days = differenceInDays(item.date, new Date());
                  const urgent = days <= 14;
                  return (
                    <div key={item.id} className={`flex items-center gap-3 py-3 ${i < MOCK_DATES.length - 1 ? 'border-b border-black/5' : ''}`}>
                      <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center bg-black/5 border border-black/10 flex-shrink-0">
                        <span className="text-[9px] uppercase font-medium text-[#8a7968]">{item.date.toLocaleDateString('en-IN', { month: 'short' })}</span>
                        <span className="text-sm font-semibold text-[#d4a574]">{item.date.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[#2d2520] truncate">{item.title}</p>
                        <p className="text-xs font-light" style={{ color: urgent ? '#e8573a' : '#8a7968' }}>
                          {days === 0 ? 'Today!' : `In ${days} days`}
                        </p>
                      </div>
                      {urgent && <span className="w-2 h-2 rounded-full bg-[#e8573a] flex-shrink-0" />}
                    </div>
                  );
                })}
                <button onClick={() => navigate('/dashboard')} className="w-full mt-3 py-2.5 rounded-xl text-xs font-medium transition-colors hover:bg-[rgba(212,165,116,0.2)]" style={{ background: 'rgba(212,165,116,0.1)', color: '#d4a574' }}>
                  + Add Important Date
                </button>
              </div>
            </section>

            {/* REMINDERS */}
            <section>
              <h2 className="font-normal text-lg mb-4 text-[#2d2520]">Reminders</h2>
              <div className="rounded-3xl p-5 space-y-3" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                {[
                  { text: 'Nudge Aunt Sarah for Mom\'s surprise', time: '2 days ago', color: '#d4a574' },
                  { text: 'Complete video for Arjun\'s anniversary', time: 'Due in 5 days', color: '#e8573a' },
                ].map((r, i) => (
                  <div key={i} className={`flex items-start gap-3 py-2 ${i === 0 ? 'border-b border-black/5' : ''}`}>
                    <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: r.color }} />
                    <div>
                      <p className="text-sm font-medium text-[#2d2520]">{r.text}</p>
                      <p className="text-xs font-light mt-0.5" style={{ color: '#8a7968' }}>{r.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* STORY SPOTLIGHT */}
            <section>
              <h2 className="font-normal text-lg mb-4 text-[#2d2520]">Story Spotlight</h2>
              <div className="rounded-3xl p-5" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                <div className="flex gap-1 mb-3">{[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-[#d4a574] text-[#d4a574]" />)}</div>
                <p className="font-light text-sm italic leading-relaxed mb-3 text-[#8a7968]" style={{ lineHeight: 1.9 }}>
                  "My dad has never cried in front of us. That day he wept watching all the voices of people he loves come together."
                </p>
                <p className="text-sm font-medium text-[#2d2520]">Rohan M.</p>
                <p className="text-xs font-light text-[#8a7968]">Parents Tribute Experience</p>
              </div>
            </section>
          </div>
        </div>
      </div>

    </div>
  );
}
