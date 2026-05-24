import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
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
  const { displayName, signOut, user, profile } = useAuth();
  const [nudgeIdx, setNudgeIdx] = useState(0);
  const [greetingIdx] = useState(() => Math.floor(Math.random() * 3));
  const [showProfile, setShowProfile] = useState(false);

  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const [dbDates, setDbDates] = useState<any[]>([]);

  useEffect(() => {
    const t = setInterval(() => setNudgeIdx(i => (i + 1) % NUDGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('creator_id', user?.id)
        .order('event_date', { ascending: true });
      if (eventsData) setDbEvents(eventsData);

      const { data: datesData } = await supabase
        .from('important_dates')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: true });
      if (datesData) setDbDates(datesData);
    }
    fetchData();
  }, [user]);

  const nudge = NUDGES[nudgeIdx];
  const greeting = GREETINGS(displayName || 'there')[greetingIdx];

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <div className="min-h-screen font-light pb-28 text-[#2d2520]" style={{ background: '#fdfbf8' }}>

      {/* ── PROFILE SIDE PANEL ─────────────────────────────── */}
      <AnimatePresence>
        {showProfile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
              onClick={() => setShowProfile(false)}
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full z-[70] w-full max-w-sm shadow-2xl"
              style={{ background: '#fdfbf8' }}
            >
              {/* Panel Header */}
              <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.9)' }}>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#d4a574]" />
                  <span className="font-semibold text-sm text-[#2d2520]">My Profile</span>
                </div>
                <button onClick={() => setShowProfile(false)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors">
                  <X className="w-4 h-4 text-[#8a7968]" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-65px)]">

                {/* Avatar & Name */}
                <div className="flex flex-col items-center text-center py-6 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.12), rgba(232,87,58,0.06))', border: '1px solid rgba(212,165,116,0.2)' }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}>
                    {(profile?.full_name || displayName)?.slice(0, 1).toUpperCase() || 'U'}
                  </div>
                  <h2 className="font-bold text-xl text-[#2d2520] mb-1">{profile?.full_name || displayName}</h2>
                  <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(212,165,116,0.15)', color: '#d4a574' }}>nearyou member</span>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-[#8a7968] mb-3">Account Details</h3>

                  <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,165,116,0.1)' }}>
                      <User className="w-4 h-4 text-[#d4a574]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-[#8a7968]">Full Name</p>
                      <p className="font-semibold text-sm text-[#2d2520] mt-0.5">{profile?.full_name || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(90,158,111,0.1)' }}>
                      <Phone className="w-4 h-4" style={{ color: '#5a9e6f' }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-[#8a7968]">Email</p>
                      <p className="font-semibold text-sm text-[#2d2520] mt-0.5">{profile?.email || user?.email || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(122,142,196,0.1)' }}>
                      <Shield className="w-4 h-4" style={{ color: '#7a8ec4' }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-[#8a7968]">Member ID</p>
                      <p className="font-semibold text-sm text-[#2d2520] mt-0.5">{user?.id?.slice(0, 16) || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-[#8a7968] mb-3">Your Journey</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: '2', label: 'Surprises', color: '#f4845f' },
                      { val: '17', label: 'Contributors', color: '#d4a574' },
                      { val: '34', label: 'Memories', color: '#e8573a' },
                    ].map((s, i) => (
                      <div key={i} className="p-3 rounded-2xl text-center" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <p className="font-bold text-xl" style={{ color: s.color }}>{s.val}</p>
                        <p className="text-[10px] font-light text-[#8a7968] mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => { navigate('/dashboard'); setShowProfile(false); }}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-medium transition-all hover:-translate-y-0.5"
                    style={{ background: '#ffffff', border: '1px solid rgba(212,165,116,0.3)', color: '#d4a574', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}
                  >
                    <Heart className="w-4 h-4" />
                    View My Dashboard
                  </button>
                  <button
                    onClick={() => { handleSignOut(); setShowProfile(false); }}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-medium transition-all hover:bg-red-50"
                    style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', color: '#8a7968' }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── STICKY NAV ─────────────────────────────────────── */}
      <div className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: 'rgba(253,251,248,0.92)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-10">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a574] to-[#f4845f] text-[1.7rem] leading-none font-extrabold tracking-tighter lowercase drop-shadow-sm">nearyou.</span>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: 'Home', path: '/home' },
                { label: 'Create Surprise', path: '/create' },
                { label: 'Memory Stories', path: '/gallery' },
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'Packages', path: '/packages' },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[rgba(212,165,116,0.1)] hover:text-[#d4a574]"
                  style={{ color: '#8a7968' }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Notification */}
            <button className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[rgba(212,165,116,0.1)]" style={{ background: 'rgba(212,165,116,0.08)' }}>
              <Bell className="w-4 h-4 text-[#d4a574]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f4845f]" />
            </button>

            {/* Profile Avatar — clickable */}
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl transition-all hover:shadow-md group"
              style={{ background: '#ffffff', border: '1px solid rgba(212,165,116,0.25)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}>
                {displayName?.slice(0, 1).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-[#2d2520] max-w-[100px] truncate">{displayName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8a7968] transition-transform group-hover:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-9">

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
                {dbEvents.length === 0 && (
                  <div className="p-8 text-center rounded-3xl" style={{ border: '1px dashed rgba(0,0,0,0.1)' }}>
                    <p className="text-sm text-[#8a7968]">No scheduled surprises yet.</p>
                  </div>
                )}
                {dbEvents.map((ev, i) => {
                  const eventDate = new Date(ev.event_date);
                  const days = differenceInDays(eventDate, new Date());
                  const pct = 0; // we don't have memories count yet without a join, just keep it 0 or mock
                  return (
                    <motion.div key={ev.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                       onClick={() => navigate(`/event/${ev.id}`)}
                       className="group cursor-pointer rounded-3xl p-5 relative overflow-hidden hover:-translate-y-0.5 transition-all"
                       style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                      <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" style={{ background: '#d4a574' }} />
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest font-semibold block mb-1" style={{ color: '#d4a574' }}>{ev.event_type}</span>
                          <h3 className="font-medium text-lg text-[#2d2520]">{ev.receiver_name}'s Surprise</h3>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full text-[#e8573a] bg-[#e8573a]/10">
                          <Clock className="w-3 h-3" /> {days === 0 ? 'Today!' : `${days}d left`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-light mb-1.5 text-[#8a7968]">
                        <span>Memory Collection</span>
                        <span className="text-[#d4a574] font-medium">0/10</span>
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

            {/* FEEDBACK BUTTON */}
            <section>
              <motion.div
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="rounded-3xl p-6 text-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.1), rgba(232,87,58,0.06))', border: '1px solid rgba(212,165,116,0.2)' }}
              >
                <div className="text-4xl mb-3">💬</div>
                <h3 className="font-semibold text-lg mb-2 text-[#2d2520]">How was your experience?</h3>
                <p className="font-light text-sm text-[#8a7968] mb-5 max-w-sm mx-auto">We'd love to hear what you felt. Your feedback helps us make every moment more special.</p>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 16px 40px rgba(212,165,116,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/feedback')}
                  className="px-7 py-3 rounded-2xl text-white font-medium text-sm shadow-lg inline-flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}
                >
                  ✨ Share Feedback
                </motion.button>
              </motion.div>
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
                {dbDates.length === 0 && (
                  <p className="text-xs text-center text-[#8a7968] py-4">No upcoming dates saved.</p>
                )}
                {dbDates.map((item, i) => {
                  const itemDate = new Date(item.date);
                  const days = differenceInDays(itemDate, new Date());
                  const urgent = days <= 14;
                  return (
                    <div key={item.id} className={`flex items-center gap-3 py-3 ${i < dbDates.length - 1 ? 'border-b border-black/5' : ''}`}>
                      <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center bg-black/5 border border-black/10 flex-shrink-0">
                        <span className="text-[9px] uppercase font-medium text-[#8a7968]">{itemDate.toLocaleDateString('en-IN', { month: 'short' })}</span>
                        <span className="text-sm font-semibold text-[#d4a574]">{itemDate.getDate()}</span>
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

            {/* UPCOMING UPDATES */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#d4a574]" />
                  <h2 className="font-normal text-lg text-[#2d2520]">Upcoming Updates</h2>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full text-[#d4a574] bg-[rgba(212,165,116,0.15)]">New</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'AI Voice Cloning for Memories', desc: 'Create voice notes that sound exactly like you.', tag: 'Next Week' },
                  { title: 'Physical Keepsake Delivery', desc: 'Turn digital memories into beautiful photo books.', tag: 'Coming Soon' }
                ].map((update, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-2xl relative overflow-hidden group" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,165,116,0.1)' }}>
                          <Sparkles className="w-3.5 h-3.5 text-[#d4a574]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-xs mb-1 text-[#2d2520]">{update.title}</h3>
                          <p className="font-light text-[11px] leading-relaxed text-[#8a7968]">{update.desc}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded-lg flex-shrink-0" style={{ background: 'rgba(212,165,116,0.15)', color: '#d4a574' }}>{update.tag}</span>
                    </div>
                  </motion.div>
                ))}
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
