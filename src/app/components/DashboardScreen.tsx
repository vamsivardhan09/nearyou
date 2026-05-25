import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Calendar, Users, Clock, Loader2, Sparkles, CalendarHeart, Gift, Star,
  CheckCircle2, LogOut, ArrowLeft, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { differenceInDays, formatDistanceToNow, addDays, isBefore } from 'date-fns';

interface DashboardScreenProps {
  onNavigate?: (screen: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const navigate = useNavigate();
  const { user, displayName, signOut } = useAuth();
  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : 'CN';
  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const [events, setEvents] = useState<any[]>([]);
  const [recentMemories, setRecentMemories] = useState<any[]>([]);
  const [importantDates, setImportantDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State for Add Date form
  const [showAddDate, setShowAddDate] = useState(false);
  const [newDate, setNewDate] = useState({ title: '', date: '', type: 'birthday' });

  // Fetch data from localStorage on mount/user change
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    // 1. Fetch events
    const customEventsStr = localStorage.getItem('nearyou_events');
    const customEvents = customEventsStr ? JSON.parse(customEventsStr) : [];
    
    const formattedCustom = customEvents.map((ev: any) => ({
      id: ev.id,
      event_type: ev.event_type,
      receiver_name: ev.receiver_name,
      event_date: ev.event_date,
      progress: ev.progress || 10,
      memoriesCount: localStorage.getItem(`nearyou_memories_${ev.id}`) 
        ? JSON.parse(localStorage.getItem(`nearyou_memories_${ev.id}`) || '[]').length 
        : ev.memoriesCount || 0,
      targetMemories: ev.targetMemories || 15
    }));

    const defaultEvents = [
      {
        id: 'demo_event_1',
        event_type: 'birthday',
        receiver_name: 'Mom',
        event_date: addDays(new Date(), 12).toISOString(),
        progress: 60,
        memoriesCount: 12,
        targetMemories: 20
      }
    ];

    setEvents([...formattedCustom, ...defaultEvents]);

    // 2. Fetch important dates
    const customDatesStr = localStorage.getItem('nearyou_important_dates');
    const customDates = customDatesStr ? JSON.parse(customDatesStr) : [];

    const defaultDates = [
      { id: '1', title: "Mom's Birthday", date: addDays(new Date(), 12).toISOString(), type: 'birthday' },
      { id: '2', title: 'Our Anniversary', date: addDays(new Date(), 45).toISOString(), type: 'anniversary' },
    ];

    setImportantDates([...customDates, ...defaultDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

    // 3. Fetch recent memories
    const allMemories: any[] = [];
    customEvents.forEach((ev: any) => {
      const memStr = localStorage.getItem(`nearyou_memories_${ev.id}`);
      if (memStr) {
        const mems = JSON.parse(memStr);
        mems.forEach((m: any) => {
          allMemories.push({
            id: m.id,
            media_type: m.media_type,
            contributor_name: m.contributor_name,
            created_at: m.created_at || new Date().toISOString(),
            events: { receiver_name: ev.receiver_name }
          });
        });
      }
    });

    const defaultMemories = [
      { id: '1', media_type: 'photo', contributor_name: 'Rahul', created_at: new Date().toISOString(), events: { receiver_name: 'Mom' } }
    ];

    setRecentMemories([...allMemories, ...defaultMemories].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));

    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [user]);

  // Live countdown trigger
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(t => t + 1), 60000); // tick every minute
    return () => clearInterval(t);
  }, []);

  const handleAddDate = () => {
    if (!newDate.title || !newDate.date) return;
    const newEntry = { 
      id: `date_${Date.now()}`, 
      user_id: user?.id || 'local_user',
      title: newDate.title, 
      date: new Date(newDate.date).toISOString(), 
      type: newDate.type,
      created_at: new Date().toISOString()
    };
    
    const customDatesStr = localStorage.getItem('nearyou_important_dates');
    const customDates = customDatesStr ? JSON.parse(customDatesStr) : [];
    localStorage.setItem('nearyou_important_dates', JSON.stringify([newEntry, ...customDates]));
    
    setImportantDates(prev => [...prev, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setShowAddDate(false);
    setNewDate({ title: '', date: '', type: 'birthday' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdfbf8' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#d4a574' }} />
      </div>
    );
  }


  return (
    <div className="min-h-screen font-light pb-28 text-[#2d2520]" style={{ background: '#fdfbf8' }}>

      {/* ── STICKY NAV ──────────────────────────────────── */}
      <div
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/home')} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#d4a574]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}>
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-normal tracking-wide text-base text-[#2d2520]">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl animate-fade-in" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white" style={{ background: 'linear-gradient(135deg,#d4a574,#e8573a)' }}>{initials}</div>
              <span className="text-xs font-medium text-[#2d2520] max-w-[100px] truncate">{displayName}</span>
            </div>
            <button onClick={handleSignOut} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors">
              <LogOut className="w-4 h-4 text-[#8a7968]" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">

        {/* ── HEADER INTRO ──────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-light text-3xl md:text-4xl mb-3 text-[#2d2520]">
            Emotional Connections
          </h1>
          <p className="font-light text-sm" style={{ color: '#8a7968', lineHeight: 1.8 }}>
            Welcome back. Track the surprises you are building, remember important dates, and see the memories pouring in.
          </p>
        </motion.div>

        {/* ── EMOTIONAL EXPERIENCE CARDS ────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4a574]" />
              <h2 className="font-normal text-lg text-[#2d2520]">Active Experiences</h2>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="text-xs font-medium px-4 py-2 rounded-full transition-all text-[#d4a574] hover:bg-black/5 border border-[#d4a574]/30"
              style={{ background: 'rgba(212,165,116,0.05)' }}
            >
              + New Experience
            </button>
          </div>

          {events.length === 0 ? (
            <div className="rounded-3xl p-10 text-center" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)' }}>
              <Heart className="w-10 h-10 mx-auto mb-4 text-[#d4a574]/40" />
              <h3 className="font-normal text-lg mb-2 text-[#2d2520]">No active experiences</h3>
              <p className="font-light text-sm text-[#8a7968] mb-6">Start bringing your people together for a beautiful surprise.</p>
              <button
                onClick={() => navigate('/create')}
                className="px-6 py-3 rounded-2xl text-white font-medium text-sm shadow-md"
                style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}
              >
                Create an Experience
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {events.map((event, i) => {
                const daysUntil = differenceInDays(new Date(event.event_date), new Date());
                const isPast = daysUntil < 0;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="group cursor-pointer rounded-3xl p-6 relative overflow-hidden transition-all hover:-translate-y-1"
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Decorative gradient blob */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" style={{ background: '#d4a574' }} />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <span className="text-[10px] tracking-widest uppercase font-semibold mb-2 block" style={{ color: '#d4a574' }}>
                            {event.event_type?.replace('_', ' ')}
                          </span>
                          <h3 className="font-medium text-xl text-[#2d2520] leading-tight">
                            {event.receiver_name}'s Surprise
                          </h3>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 border border-black/5">
                          <Gift className="w-4 h-4 text-[#d4a574]" />
                        </div>
                      </div>

                      {/* Status / Countdown */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                        <div className="flex items-center gap-2">
                          {isPast ? (
                            <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-black/5 border border-black/5 text-[#8a7968]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Revealed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}>
                              <Clock className="w-3.5 h-3.5" /> {daysUntil === 0 ? 'Today!' : `${daysUntil} days left`}
                            </span>
                          )}
                          <span className="text-xs font-light text-[#8a7968]">
                            {new Date(event.event_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        {!isPast && (
                          <button className="text-[10px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full border transition-colors hover:bg-black/5 text-[#d4a574]" style={{ borderColor: 'rgba(212,165,116,0.3)' }}>
                            Reschedule
                          </button>
                        )}
                      </div>

                      {/* Mini Progress */}
                      <div className="mt-auto pt-5 border-t border-[rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-between text-[#8a7968] text-xs font-light mb-2">
                          <span>Memory Collection</span>
                          <span className="text-[#d4a574] font-medium">
                            {event.memoriesCount || 0}/{event.targetMemories || 15}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              background: 'linear-gradient(90deg, #d4a574, #e8573a)',
                              width: `${Math.min(100, Math.round(((event.memoriesCount || 0) / (event.targetMemories || 15)) * 100))}%`
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        <div className="grid md:grid-cols-2 gap-8">

          {/* ── IMPORTANT DATES ───────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <CalendarHeart className="w-5 h-5 text-[#d4a574]" />
                <h2 className="font-normal text-lg text-[#2d2520]">Saved Emotional Dates</h2>
              </div>
              <button
                onClick={() => setShowAddDate(!showAddDate)}
                className="text-xs font-medium text-[#d4a574]"
              >
                + Add Date
              </button>
            </div>

            <AnimatePresence>
              {showAddDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div className="p-4 rounded-2xl" style={{ background: '#ffffff', border: '1px solid rgba(212,165,116,0.3)' }}>
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="e.g., Partner's Birthday"
                        className="w-full text-sm font-medium px-3 py-2.5 rounded-xl outline-none text-[#2d2520]"
                        style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}
                        value={newDate.title}
                        onChange={e => setNewDate({ ...newDate, title: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <input
                          type="date"
                          className="flex-1 text-sm font-medium px-3 py-2.5 rounded-xl outline-none text-[#2d2520]"
                          style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}
                          value={newDate.date}
                          onChange={e => setNewDate({ ...newDate, date: e.target.value })}
                        />
                        <button
                          onClick={handleAddDate}
                          className="px-4 py-2 rounded-xl text-white text-xs font-medium shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              {importantDates.map((dateItem, i) => {
                const isUpcoming = !isBefore(new Date(dateItem.date), new Date());
                const days = isUpcoming ? differenceInDays(new Date(dateItem.date), new Date()) : -1;
                const showReminder = isUpcoming && days <= 10 && days >= 0;

                return (
                  <motion.div
                    key={dateItem.id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center p-4 rounded-2xl"
                    style={{
                      background: '#ffffff',
                      border: showReminder ? '1px solid rgba(212,165,116,0.4)' : '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0" style={{ background: 'rgba(212,165,116,0.1)' }}>
                      <Star className="w-4 h-4 text-[#d4a574]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-[#2d2520]">{dateItem.title}</p>
                      <p className="text-xs font-light mt-0.5" style={{ color: '#8a7968' }}>
                        {new Date(dateItem.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    {showReminder && (
                      <div className="flex flex-col items-end flex-shrink-0 ml-2">
                        <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,165,116,0.15)', color: '#d4a574' }}>
                          Reminder
                        </span>
                        <span className="text-xs font-light mt-1 text-[#8a7968]">In {days} days</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ── PENDING INVITATIONS ─────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-[#d4a574]" />
              <h2 className="font-normal text-lg text-[#2d2520]">Pending Invitations</h2>
            </div>

            <div className="rounded-3xl p-6 mb-8" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/5">
                <div>
                  <p className="text-sm font-medium text-[#2d2520]">Aunt Sarah</p>
                  <p className="text-xs font-light text-[#8a7968]">Sent 2 days ago</p>
                </div>
                <button className="text-xs font-medium px-3 py-1.5 rounded-full transition-opacity hover:opacity-80" style={{ background: 'rgba(212,165,116,0.1)', color: '#d4a574' }}>Remind</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#2d2520]">Cousin Rahul</p>
                  <p className="text-xs font-light text-[#8a7968]">Sent 3 days ago</p>
                </div>
                <button className="text-xs font-medium px-3 py-1.5 rounded-full transition-opacity hover:opacity-80" style={{ background: 'rgba(212,165,116,0.1)', color: '#d4a574' }}>Remind</button>
              </div>
            </div>
          </section>

          {/* ── RECENT ACTIVITIES / TIMELINE ──────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-[#d4a574]" />
              <h2 className="font-normal text-lg text-[#2d2520]">Recent Memories</h2>
            </div>

            <div className="rounded-3xl p-6" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              {recentMemories.length === 0 ? (
                <p className="text-sm font-light text-center text-[#8a7968] py-8">
                  No memories uploaded yet. Share your experience links with friends and family!
                </p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {recentMemories.map((mem, i) => {
                    const typeMap: Record<string, string> = { photo: '📸', video: '🎬', voice: '🎤', text: '💬', message: '💬' };
                    return (
                      <div key={mem.id || i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-black/5 border border-black/10">
                            {typeMap[mem.media_type] || '✨'}
                          </div>
                          {i !== recentMemories.length - 1 && (
                            <div className="w-px h-full my-1 bg-black/5" />
                          )}
                        </div>
                        <div className="pb-4 pt-1">
                          <p className="text-sm font-normal text-[#2d2520]">
                            <span className="font-medium text-[#d4a574]">{mem.contributor_name}</span> shared a {mem.media_type}
                          </p>
                          <p className="text-xs font-light text-[#8a7968] mt-1">
                            For {mem.events?.receiver_name || 'an experience'} · {formatDistanceToNow(new Date(mem.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
