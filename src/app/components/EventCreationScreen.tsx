import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Heart, Calendar, User, MapPin,
  MessageSquare, Users, AlertTriangle, CheckCircle2, Loader2,
  Sparkles,
} from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

interface EventCreationScreenProps {
  onNavigate?: (screen: string) => void;
}

// ── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  eventType: string;
  receiverName: string;
  relationship: string;
  eventDate: string;
  city: string;
  emotionalStory: string;
  favoriteSongs: string;
  importantPeople: string;
  memories: string;
  invites: string;
}

// ── Constants ────────────────────────────────────────────────────────────────
const EVENT_TYPES = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂', desc: 'A milestone worth celebrating across every mile' },
  { id: 'couple', label: 'Long Distance Couple', emoji: '💑', desc: 'Keep love alive when distance tries to dim it' },
  { id: 'parents', label: 'Parents Tribute', emoji: '🙏', desc: 'Honor those who gave you everything' },
  { id: 'appreciation', label: 'Appreciation', emoji: '🌸', desc: 'Tell someone the difference they made in your life' },
  { id: 'reunion', label: 'Reunion Surprise', emoji: '🤗', desc: 'Make the moment of coming together unforgettable' },
  { id: 'achievement', label: 'Achievement Celebration', emoji: '🏆', desc: 'Celebrate a triumph with everyone who cheered you on' },
  { id: 'loneliness', label: 'Loneliness Support', emoji: '🕊️', desc: 'Let someone feel loved when they need it most' },
  { id: 'other', label: 'Something Else', emoji: '✨', desc: 'Every emotional story deserves to be told' },
];

const RELATIONSHIP_OPTIONS = [
  'Son / Daughter', 'Partner / Spouse', 'Parent', 'Friend', 'Sibling', 'Colleague', 'Other',
];

const STEPS = [
  { num: 1, label: 'Experience' },
  { num: 2, label: 'About Them' },
  { num: 3, label: 'Your Story' },
  { num: 4, label: 'Invite' },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function StepPill({ step, current }: { step: typeof STEPS[0]; current: number }) {
  const done = current > step.num;
  const active = current === step.num;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-400"
        style={{
          background: done ? '#d4a574' : active ? 'rgba(212,165,116,0.1)' : '#ffffff',
          border: active ? '1.5px solid #d4a574' : done ? 'none' : '1.5px solid rgba(0,0,0,0.06)',
        }}
      >
        {done
          ? <CheckCircle2 className="w-4 h-4 text-white" />
          : <span className="text-xs font-medium" style={{ color: active ? '#d4a574' : '#8a7968' }}>{step.num}</span>
        }
      </div>
      <span className="text-xs font-medium hidden sm:block" style={{ color: active ? '#2d2520' : '#8a7968' }}>{step.label}</span>
    </div>
  );
}

function FieldLabel({ icon: Icon, label, optional }: { icon: any; label: string; optional?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: '#8a7968' }}>
      <Icon className="w-4 h-4" style={{ color: '#d4a574' }} />
      {label}
      {optional && <span className="text-xs font-normal" style={{ color: '#8a7968' }}>(optional)</span>}
    </label>
  );
}

function inputClass() {
  return 'w-full bg-[#fafafa] outline-none text-sm font-medium rounded-2xl px-4 py-3.5 transition-all placeholder:text-[#8a7968]/50';
}
const inputStyle = {
  border: '1.5px solid rgba(0,0,0,0.08)',
  color: '#2d2520',
};
const inputFocusStyle = {
  border: '1.5px solid rgba(212,165,116,0.6)',
  boxShadow: '0 0 0 3px rgba(212,165,116,0.1)',
};

// ── Main component ────────────────────────────────────────────────────────────
export function EventCreationScreen({ onNavigate }: EventCreationScreenProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const initialType = searchParams.get('type');
  const [step, setStep] = useState(initialType ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [earlyWarning, setEarlyWarning] = useState(false);

  const [form, setForm] = useState<FormData>({
    eventType: searchParams.get('type') || '',
    receiverName: '',
    relationship: '',
    eventDate: '',
    city: '',
    emotionalStory: '',
    favoriteSongs: '',
    importantPeople: '',
    memories: '',
    invites: '',
  });

  const set = (key: keyof FormData, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (key === 'eventDate' && val) {
      const days = differenceInDays(new Date(val), new Date());
      setEarlyWarning(days < 7);
    }
  };

  const canNext = () => {
    if (step === 1) return !!form.eventType;
    if (step === 2) return !!form.receiverName && !!form.eventDate;
    if (step === 3) return !!form.emotionalStory;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Mock local event creation
      await new Promise(r => setTimeout(r, 600));
      const mockEventId = `local_evt_${Date.now()}`;
      navigate(`/event/${mockEventId}`);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (step < 4) setStep(s => s + 1);
    else handleSubmit();
  };

  const back = () => {
    if (step > 1) {
      if (step === 2 && searchParams.get('type')) {
        navigate(-1);
      } else {
        setStep(s => s - 1);
      }
    }
    else navigate(-1);
  };

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen font-light text-[#2d2520]" style={{ background: '#fdfbf8' }}>

      {/* ── STICKY NAV ──────────────────────────────────── */}
      <div
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={back} className="flex items-center gap-2 text-sm font-medium hover:text-[#d4a574] transition-colors" style={{ color: '#8a7968' }}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}
              >
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="text-sm font-medium tracking-widest text-[#2d2520]">Nearyou</span>
            </div>
            <div className="w-16" />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex-1 flex justify-center">
                  <StepPill step={s} current={step} />
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="h-px flex-1 transition-all duration-500"
                    style={{ background: step > s.num ? 'rgba(212,165,116,0.6)' : 'rgba(0,0,0,0.06)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6 py-10 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >

            {/* ── STEP 1: Experience Type ── */}
            {step === 1 && (
              <div>
                <div className="text-center mb-10">
                  <span className="text-xs tracking-widest uppercase font-semibold block mb-2 text-[#d4a574]">Step 1 of 4</span>
                  <h1 className="font-light text-3xl mb-3 text-[#2d2520]">What's the occasion?</h1>
                  <p className="font-light text-sm text-[#8a7968]" style={{ lineHeight: 1.8 }}>
                    Every emotional story starts here. Choose the type of experience you want to create.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {EVENT_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => set('eventType', type.id)}
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all hover:bg-black/5"
                      style={{
                        background: form.eventType === type.id ? 'rgba(212,165,116,0.08)' : '#ffffff',
                        border: form.eventType === type.id ? '1.5px solid rgba(212,165,116,0.6)' : '1.5px solid rgba(0,0,0,0.06)',
                        boxShadow: form.eventType === type.id ? '0 4px 20px rgba(212,165,116,0.15)' : '0 2px 8px rgba(0,0,0,0.02)',
                      }}
                    >
                      <span className="text-2xl flex-shrink-0">{type.emoji}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-[#2d2520]">{type.label}</p>
                        <p className="font-light text-xs mt-0.5 leading-relaxed text-[#8a7968]">{type.desc}</p>
                      </div>
                      {form.eventType === type.id && (
                        <CheckCircle2 className="w-5 h-5 ml-auto flex-shrink-0 text-[#d4a574]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 2: About Them ── */}
            {step === 2 && (
              <div>
                <div className="text-center mb-10">
                  <span className="text-xs tracking-widest uppercase font-semibold block mb-2 text-[#d4a574]">Step 2 of 4</span>
                  <h1 className="font-light text-3xl mb-3 text-[#2d2520]">Tell us about them.</h1>
                  <p className="font-light text-sm text-[#8a7968]" style={{ lineHeight: 1.8 }}>
                    Who is this experience for? The more we know, the more personal the experience becomes.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <FieldLabel icon={User} label="Their name" />
                    <input
                      className={inputClass()}
                      style={inputStyle}
                      placeholder="e.g., Priya, Dad, Meera..."
                      value={form.receiverName}
                      onChange={e => set('receiverName', e.target.value)}
                      onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={e => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>

                  {/* Relationship */}
                  <div>
                    <FieldLabel icon={Heart} label="Your relationship" optional />
                    <div className="flex flex-wrap gap-2">
                      {RELATIONSHIP_OPTIONS.map(r => (
                        <button
                          key={r}
                          onClick={() => set('relationship', r)}
                          className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
                          style={{
                            background: form.relationship === r ? 'rgba(212,165,116,0.1)' : '#ffffff',
                            border: form.relationship === r ? '1.5px solid rgba(212,165,116,0.6)' : '1.5px solid rgba(0,0,0,0.06)',
                            color: form.relationship === r ? '#d4a574' : '#8a7968',
                            boxShadow: form.relationship === r ? 'none' : '0 1px 4px rgba(0,0,0,0.02)',
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Event Date */}
                  <div>
                    <FieldLabel icon={Calendar} label="When is the occasion?" />
                    <input
                      type="date"
                      className={inputClass()}
                      style={inputStyle}
                      value={form.eventDate}
                      onChange={e => set('eventDate', e.target.value)}
                      onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={e => Object.assign(e.target.style, inputStyle)}
                    />
                    {/* 7-day warning */}
                    <AnimatePresence>
                      {earlyWarning && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-start gap-3 mt-3 px-4 py-3 rounded-xl"
                          style={{ background: 'rgba(212,165,116,0.08)', border: '1px solid rgba(212,165,116,0.2)' }}
                        >
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#d4a574]" />
                          <p className="text-xs font-medium leading-relaxed text-[#8a7968]">
                            We recommend planning at least <strong>7 days ahead</strong> so our team can beautifully prepare your emotional experience. You can still proceed, but more time means a more powerful outcome.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* City */}
                  <div>
                    <FieldLabel icon={MapPin} label="Their city or location" optional />
                    <input
                      className={inputClass()}
                      style={inputStyle}
                      placeholder="e.g., Mumbai, Delhi, Bangalore..."
                      value={form.city}
                      onChange={e => set('city', e.target.value)}
                      onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={e => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Your Story ── */}
            {step === 3 && (
              <div>
                <div className="text-center mb-10">
                  <span className="text-xs tracking-widest uppercase font-semibold block mb-2 text-[#d4a574]">Step 3 of 4</span>
                  <h1 className="font-light text-3xl mb-3 text-[#2d2520]">Share your story.</h1>
                  <p className="font-light text-sm text-[#8a7968]" style={{ lineHeight: 1.8 }}>
                    This is the heart of the experience. Our team reads every word to craft something truly personal.
                  </p>
                </div>

                {/* Team process note */}
                <div
                  className="flex items-start gap-4 p-5 rounded-2xl mb-8"
                  style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}
                >
                  <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#d4a574]" />
                  <div>
                    <p className="text-sm font-medium mb-1 text-[#2d2520]">Our team personally collaborates with you</p>
                    <p className="text-xs font-light leading-relaxed text-[#8a7968]" style={{ lineHeight: 1.8 }}>
                      We contact the friends and family members you mention below, collect their emotional videos, voice notes, and surprise messages — and weave them into a cinematic experience.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Main story */}
                  <div>
                    <FieldLabel icon={MessageSquare} label="Your emotional story" />
                    <textarea
                      rows={5}
                      className={inputClass()}
                      style={{ ...inputStyle, resize: 'none', lineHeight: '1.8' }}
                      placeholder={`Tell us about ${form.receiverName || 'them'}... What makes your bond special? What do you want them to feel when they experience this? What memories do you cherish together?`}
                      value={form.emotionalStory}
                      onChange={e => set('emotionalStory', e.target.value)}
                      onFocus={e => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
                      onBlur={e => Object.assign(e.target.style, inputStyle)}
                    />
                    <p className="text-xs font-light mt-1.5 text-[#8a7968]/80">
                      Be as honest and open as you want. This is private.
                    </p>
                  </div>

                  {/* Important people */}
                  <div>
                    <FieldLabel icon={Users} label="Important people to involve" optional />
                    <textarea
                      rows={3}
                      className={inputClass()}
                      style={{ ...inputStyle, resize: 'none' }}
                      placeholder="Names of friends and family we should reach out to... (e.g., Rahul — best friend, Aunty Meena — her favorite person)"
                      value={form.importantPeople}
                      onChange={e => set('importantPeople', e.target.value)}
                      onFocus={e => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
                      onBlur={e => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>

                  {/* Memories */}
                  <div>
                    <FieldLabel icon={Heart} label="A memory that defines your bond" optional />
                    <textarea
                      rows={3}
                      className={inputClass()}
                      style={{ ...inputStyle, resize: 'none' }}
                      placeholder="A moment in time you both remember... a trip, a conversation, a shared joke..."
                      value={form.memories}
                      onChange={e => set('memories', e.target.value)}
                      onFocus={e => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
                      onBlur={e => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: Invite ── */}
            {step === 4 && (
              <div>
                <div className="text-center mb-10">
                  <span className="text-xs tracking-widest uppercase font-semibold block mb-2 text-[#d4a574]">Step 4 of 4</span>
                  <h1 className="font-light text-3xl mb-3 text-[#2d2520]">Invite contributors.</h1>
                  <p className="font-light text-sm text-[#8a7968]" style={{ lineHeight: 1.8 }}>
                    Who should be part of this surprise? Add their details and we'll guide them through contributing their memories.
                  </p>
                </div>

                {/* What contributors do */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: '📸', label: 'Upload their favorite photos' },
                    { icon: '🎤', label: 'Record a voice message' },
                    { icon: '🎬', label: 'Share a short video' },
                    { icon: '💬', label: 'Write an emotional note' },
                  ].map(item => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 p-4 rounded-2xl"
                      style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <p className="text-xs font-medium text-[#8a7968]" style={{ lineHeight: 1.6 }}>{item.label}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <FieldLabel icon={Users} label="Email addresses to invite" optional />
                  <textarea
                     rows={5}
                    className={inputClass()}
                    style={{ ...inputStyle, resize: 'none' }}
                    placeholder={`One email per line:\nrahul@example.com\npriya@example.com\nauntmeena@example.com`}
                    value={form.invites}
                    onChange={e => set('invites', e.target.value)}
                    onFocus={e => Object.assign(e.target.style, { ...inputStyle, ...inputFocusStyle })}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                  <p className="text-xs font-light mt-1.5 text-[#8a7968]/80">
                    You can also share an invite link after creating the experience.
                  </p>
                </div>

                {/* Summary preview */}
                <div
                  className="mt-8 p-6 rounded-2xl"
                  style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <p className="text-xs tracking-widest uppercase font-semibold mb-4 text-[#d4a574]">Experience Summary</p>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-light text-[#8a7968]" style={{ minWidth: 100 }}>Occasion</span>
                      <span className="font-medium capitalize text-[#2d2520]">
                        {EVENT_TYPES.find(e => e.id === form.eventType)?.label || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-light text-[#8a7968]" style={{ minWidth: 100 }}>For</span>
                      <span className="font-medium text-[#2d2520]">{form.receiverName || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-light text-[#8a7968]" style={{ minWidth: 100 }}>Date</span>
                      <span className="font-medium text-[#2d2520]">
                        {form.eventDate ? new Date(form.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 rounded-xl text-sm font-medium border border-red-500/20 text-red-400 bg-red-50/50">
                    {error}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── FIXED BOTTOM CTA ────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 backdrop-blur-md px-6 py-5"
        style={{
          background: 'rgba(255,255,255,0.85)',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 1 && (
            <button
              onClick={back}
              disabled={loading}
              className="px-6 py-4 rounded-2xl font-medium text-sm flex items-center gap-2 transition-all hover:bg-black/5"
              style={{ border: '1.5px solid rgba(0,0,0,0.08)', color: '#8a7968' }}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}

          <button
            onClick={next}
            disabled={!canNext() || loading}
            className="flex-1 py-4 rounded-2xl text-white font-medium text-base flex items-center justify-center gap-2 relative overflow-hidden transition-all"
            style={{
              background: canNext() && !loading
                ? 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)'
                : '#fafafa',
              boxShadow: canNext() && !loading ? '0 8px 32px rgba(212,165,116,0.2)' : 'none',
              color: canNext() && !loading ? '#ffffff' : '#8a7968',
              border: canNext() && !loading ? 'none' : '1px solid rgba(0,0,0,0.06)'
            }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {step === 4 ? 'Create My Experience' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
