import { useNavigate, useParams } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Settings, Calendar, Clock, Upload, Eye, Share2,
  Image as ImageIcon, Users, CheckCircle, Heart
} from 'lucide-react';

export function SingleEventDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-light pb-24 text-[#2d2520]" style={{ background: '#fdfbf8' }}>

      {/* ── TOP NAV ──────────────────────────────────── */}
      <div className="sticky top-0 z-50 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.88)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-[#8a7968] hover:text-[#d4a574] font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>

          <h1 className="font-medium text-lg tracking-wide text-[#2d2520]">Event Dashboard</h1>

          <button className="w-10 h-10 rounded-full border border-black/8 flex items-center justify-center transition-colors hover:bg-black/5 text-[#d4a574]">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 space-y-8">

        {/* ── HERO CARD ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 50%, #c43018 100%)', boxShadow: '0 12px 40px rgba(212,165,116,0.25)' }}
        >
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative z-10 flex flex-col h-full">
            <div className="inline-block px-4 py-1.5 rounded-full border border-white/30 bg-white/15 text-xs font-semibold tracking-wide mb-6 w-fit">
              Birthday Experience
            </div>

            <h2 className="text-4xl md:text-5xl font-light mb-2 leading-tight">Mom's Birthday Surprise</h2>
            <p className="text-white/80 text-lg font-light mb-8">For Sarah Johnson</p>

            <div className="flex flex-wrap items-center gap-6 mb-12 text-sm font-medium text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>May 25, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>7 days until reveal</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => navigate(`/event/${id}/upload`)} className="bg-white text-[#e8573a] px-6 py-3 rounded-full flex items-center gap-2 font-semibold text-sm hover:scale-105 transition-transform shadow-md">
                <Upload className="w-4 h-4" /> Upload Memories
              </button>
              <button onClick={() => navigate('/gallery')} className="bg-white/15 text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold text-sm hover:bg-white/25 transition-colors">
                <Eye className="w-4 h-4" /> View Story Gallery
              </button>
              <button className="bg-white/15 text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold text-sm hover:bg-white/25 transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ── LEFT COLUMN ──────────────────────────────── */}
          <div className="space-y-8">

            {/* Event Progress */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-3xl p-8 border border-black/5 shadow-md bg-[#ffffff]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-[#2d2520]">Event Progress</h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#d4a574] to-[#e8573a] text-white">
                  60% Complete
                </span>
              </div>

              <div className="h-2 rounded-full w-full bg-black/5 mb-8 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#d4a574] to-[#e8573a] w-[60%]" />
              </div>

              <div className="p-4 rounded-2xl bg-[#fafafa] border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[#8a7968]">
                  <ImageIcon className="w-5 h-5 text-[#d4a574]" />
                  <span className="font-semibold text-sm">Memories Collected</span>
                </div>
                <span className="font-bold text-[#d4a574]">12/20</span>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-3xl p-8 border border-black/5 shadow-md bg-[#ffffff]">
              <h3 className="text-xl font-medium text-[#2d2520] mb-8">Recent Activity</h3>

              <div className="space-y-6">
                {[
                  { name: 'Emma T.', action: 'uploaded a video', time: '2 hours ago', icon: Upload, bg: '#d4a574' },
                  { name: 'Michael R.', action: 'joined the experience', time: '5 hours ago', icon: CheckCircle, bg: '#e8573a' },
                  { name: 'Lisa P.', action: 'wrote a heartfelt message', time: '1 day ago', icon: Heart, bg: '#e8507a' },
                  { name: 'David S.', action: 'uploaded 3 photos', time: '1 day ago', icon: Upload, bg: '#d4a574' },
                  { name: 'James K.', action: 'added a memory', time: '2 days ago', icon: Upload, bg: '#d4a574' },
                ].map((act, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 mt-1" style={{ background: act.bg }}>
                      <act.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2d2520]">
                        {act.name} <span className="font-medium text-[#8a7968]">{act.action}</span>
                      </p>
                      <p className="text-xs font-medium text-[#8a7968] mt-1">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-3.5 rounded-2xl border border-black/8 text-[#2d2520] hover:bg-black/4 font-semibold text-sm transition-colors">
                View All Activity
              </button>
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN ─────────────────────────────── */}
          <div className="space-y-8">

            {/* Surprise Countdown */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="rounded-3xl p-8 border border-[#d4a574]/25 shadow-md"
              style={{ background: 'rgba(212,165,116,0.06)' }}>
              <h3 className="text-xl font-medium text-[#2d2520] mb-6">Surprise Countdown</h3>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { val: '7', label: 'Days' },
                  { val: '14', label: 'Hours' },
                  { val: '32', label: 'Mins' },
                  { val: '18', label: 'Secs' },
                ].map((t, i) => (
                  <div key={i} className="bg-white border border-black/5 shadow-sm rounded-2xl p-4 flex flex-col items-center justify-center aspect-square">
                    <span className="text-2xl md:text-3xl font-medium text-[#d4a574]">{t.val}</span>
                    <span className="text-[10px] uppercase font-bold text-[#8a7968] tracking-wider mt-1 hidden sm:block">{t.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pending Invitations */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="rounded-3xl p-8 border border-black/5 shadow-md bg-[#ffffff]">
              <h3 className="text-xl font-medium text-[#2d2520] mb-6">Pending Invitations</h3>

              <div className="space-y-3 mb-8">
                {[
                  { name: 'Anna M.', email: 'anna@email.com' },
                  { name: 'Tom R.', email: 'tom@email.com' },
                  { name: 'Sophie L.', email: 'sophie@email.com' },
                  { name: 'Chris P.', email: 'chris@email.com' },
                ].map((person, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#fafafa] border border-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#d4a574]/10 border border-[#d4a574]/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#d4a574]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#2d2520]">{person.name}</p>
                        <p className="text-xs font-medium text-[#8a7968] mt-0.5">{person.email}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full border border-black/8 bg-[#fafafa] text-[10px] font-bold tracking-wide text-[#8a7968]">
                      Pending
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full py-3.5 rounded-2xl border border-black/8 text-[#2d2520] font-semibold text-sm hover:bg-black/4 transition-colors flex items-center justify-center gap-2">
                <Users className="w-4 h-4" /> Resend Invitations
              </button>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}
