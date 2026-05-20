import { motion } from 'framer-motion';
import { MessageCircle, Calendar, Mic, Video, Bell, Send, Mail, Sparkles } from 'lucide-react';

const ACTIONS = [
  { id: 'note',        label: 'Send Quick Note',              icon: MessageCircle, color: '#d4a574', bg: 'rgba(212,165,116,0.12)', desc: 'A heartfelt message right now' },
  { id: 'schedule',   label: 'Schedule Message',             icon: Calendar,      color: '#c19466', bg: 'rgba(193,148,102,0.12)', desc: 'Deliver at the perfect moment' },
  { id: 'voice',      label: 'Voice Message',                icon: Mic,           color: '#e07b54', bg: 'rgba(224,123,84,0.12)',  desc: 'Your voice, their heart' },
  { id: 'video',      label: 'Video Surprise',               icon: Video,         color: '#c47e5a', bg: 'rgba(196,126,90,0.12)',  desc: 'Schedule a cinematic moment' },
  { id: 'reminder',   label: 'Memory Reminder',              icon: Bell,          color: '#d4a574', bg: 'rgba(212,165,116,0.12)', desc: 'Never miss what matters' },
  { id: 'whatsapp',   label: 'WhatsApp Surprise',            icon: Send,          color: '#5a9e6f', bg: 'rgba(90,158,111,0.1)',   desc: 'Straight to their phone' },
  { id: 'email',      label: 'Email Surprise',               icon: Mail,          color: '#7a8ec4', bg: 'rgba(122,142,196,0.1)',  desc: 'A beautiful inbox moment' },
  { id: 'appreciate', label: 'Appreciation Message',         icon: Sparkles,      color: '#c19466', bg: 'rgba(193,148,102,0.12)', desc: 'Tell them how much they matter' },
];

interface QuickActionsProps {
  onAction: (id: string, label: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-[#d4a574]" />
        <h2 className="font-normal text-xl" style={{ color: '#2d2520' }}>Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACTIONS.map((a, i) => (
          <motion.button key={a.id}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(212,165,116,0.18)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAction(a.id, a.label)}
            className="flex flex-col items-start p-4 rounded-2xl text-left transition-all cursor-pointer"
            style={{ background: '#fff', border: '1px solid rgba(212,165,116,0.15)', boxShadow: '0 2px 12px rgba(212,165,116,0.06)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: a.bg }}>
              <a.icon className="w-5 h-5" style={{ color: a.color }} />
            </div>
            <p className="font-normal text-xs leading-snug mb-1" style={{ color: '#2d2520' }}>{a.label}</p>
            <p className="font-light text-[11px] leading-snug" style={{ color: '#8a7968' }}>{a.desc}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
