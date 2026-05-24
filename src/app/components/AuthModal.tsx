import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, ArrowRight, Sparkles, Heart, RotateCcw, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// ── Constants ──────────────────────────────────────────────────────────────
const OTP_LENGTH = 6;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function Spinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className="w-4 h-4 rounded-full border-2 border-white border-t-transparent flex-shrink-0"
    />
  );
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState<'details' | 'otp' | 'success'>('details');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setFullName(''); setEmail(''); setStage('details');
        setOtp(Array(OTP_LENGTH).fill('')); setError('');
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const nameValid = fullName.trim().length >= 2;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canContinue = nameValid && emailValid && !sending;

  // ── Step 1: Send OTP via Supabase ──────────────────────────────────────
  const handleSendOtp = async () => {
    if (!nameValid) { setError('Please enter your full name (min 2 characters).'); return; }
    if (!emailValid) { setError('Please enter a valid email address.'); return; }
    setError('');
    setSending(true);

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        // This data is stored in the user's metadata and used to create the profile
        data: { full_name: fullName.trim() },
        shouldCreateUser: true,
      },
    });

    setSending(false);

    if (authError) {
      setError(authError.message || 'Failed to send code. Please try again.');
      return;
    }

    setStage('otp');
    setCountdown(60);
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────
  const handleVerify = async (code: string) => {
    if (code.length < OTP_LENGTH || verifying) return;
    setVerifying(true);
    setError('');

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code,
      type: 'email',
    });

    if (verifyError || !data.user) {
      setError(verifyError?.message || 'Invalid or expired code. Please try again.');
      setVerifying(false);
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      return;
    }

    // ── Upsert the profile with the name the user entered ────────────────
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
    }, { onConflict: 'id' });

    setStage('success');
    await new Promise(r => setTimeout(r, 1100));
    setVerifying(false);
    onSuccess();
    onClose();
  };

  // ── OTP box helpers ────────────────────────────────────────────────────
  const handleOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/, '').slice(-1);
    const next = [...otp]; next[i] = digit; setOtp(next);
    setError('');
    if (digit && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
    if (next.every(d => d !== '') && digit) handleVerify(next.join(''));
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      const next = [...otp]; next[i - 1] = ''; setOtp(next);
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted.length === OTP_LENGTH) {
      setOtp(pasted.split(''));
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      setTimeout(() => handleVerify(pasted), 100);
    }
  };

  const filledCount = otp.filter(d => d !== '').length;
  const canSubmit = filledCount === OTP_LENGTH && !verifying;
  const firstName = fullName.trim().split(' ')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={stage !== 'success' ? onClose : undefined}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(253,251,248,0.7)', backdropFilter: 'blur(14px)' }}
          />

          {/* ── Modal ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed z-50 left-0 right-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[460px]"
            style={{
              borderRadius: '28px 28px 0 0',
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 -10px 80px rgba(0,0,0,0.03), 0 40px 80px rgba(0,0,0,0.1)',
            }}
          >
            {/* Warm glow edge */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.4), transparent)', marginBottom: '2px' }} />

            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(0,0,0,0.1)' }} />
            </div>

            <div className="px-7 pt-4 pb-8">
              <AnimatePresence mode="wait">

                {/* ── SUCCESS ── */}
                {stage === 'success' && (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10">
                    <motion.div
                      initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #f4845f, #e8573a)' }}>
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="font-bold text-2xl mb-2 text-[#2d2520]">
                      Welcome, {firstName}! 🎉
                    </motion.h3>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                      className="text-sm" style={{ color: '#8a7968' }}>
                      Opening your emotional space…
                    </motion.p>
                  </motion.div>
                )}

                {/* ── DETAILS STAGE ── */}
                {stage === 'details' && (
                  <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-7">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}>
                          <Heart className="w-5 h-5 text-white fill-current" />
                        </div>
                        <div>
                          <h2 className="font-bold text-lg leading-tight text-[#2d2520]">Join Nearyou</h2>
                          <p className="text-xs" style={{ color: '#8a7968' }}>Your emotional memory space</p>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(0,0,0,0.04)' }}
                      >
                        <X className="w-4 h-4" style={{ color: '#2d2520' }} />
                      </button>
                    </div>

                    {/* Full Name */}
                    <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: '#8a7968' }}>
                      Full Name
                    </label>
                    <div
                      className="flex items-center rounded-2xl overflow-hidden mb-4 transition-all"
                      style={{
                        background: '#fafafa',
                        border: `1px solid ${nameValid && fullName ? 'rgba(212,165,116,0.6)' : !fullName ? 'rgba(0,0,0,0.08)' : 'rgba(248,113,113,0.6)'}`,
                      }}
                    >
                      <div className="flex items-center px-4 py-3.5">
                        <User className="w-4 h-4" style={{ color: 'rgba(212,165,116,0.7)' }} />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && canContinue && handleSendOtp()}
                        placeholder="e.g. Vamsi Krishna"
                        autoComplete="name"
                        className="flex-1 pr-4 py-3.5 bg-transparent outline-none text-sm font-medium"
                        style={{ color: '#2d2520', caretColor: '#d4a574' }}
                      />
                    </div>

                    {/* Email */}
                    <label className="block text-xs font-semibold mb-2 tracking-wide uppercase" style={{ color: '#8a7968' }}>
                      Email Address
                    </label>
                    <div
                      className="flex items-center rounded-2xl overflow-hidden mb-6 transition-all"
                      style={{
                        background: '#fafafa',
                        border: `1px solid ${emailValid ? 'rgba(212,165,116,0.6)' : !email ? 'rgba(0,0,0,0.08)' : 'rgba(248,113,113,0.6)'}`,
                      }}
                    >
                      <div className="flex items-center px-4 py-3.5">
                        <Mail className="w-4 h-4" style={{ color: 'rgba(212,165,116,0.7)' }} />
                      </div>
                      <input
                        type="email"
                        inputMode="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && canContinue && handleSendOtp()}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="flex-1 pr-4 py-3.5 bg-transparent outline-none text-sm font-medium"
                        style={{ color: '#2d2520', caretColor: '#d4a574' }}
                      />
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(244,132,95,0.35)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSendOtp}
                      disabled={!canContinue}
                      className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg, #f4845f 0%, #e8573a 100%)' }}
                    >
                      {sending ? <Spinner /> : <><span>Send Verification Code</span><ArrowRight className="w-4 h-4" /></>}
                    </motion.button>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="text-xs text-center mt-3" style={{ color: '#f87171' }}>
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Trust footer */}
                    <div className="flex items-center justify-center gap-6 mt-6">
                      {['🔒 Secure', '✨ Private', '💛 Free'].map(l => (
                        <span key={l} className="text-[11px]" style={{ color: '#8a7968' }}>{l}</span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── OTP STAGE ── */}
                {stage === 'otp' && (
                  <motion.div key="otp"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-7">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}>
                          <Heart className="w-5 h-5 text-white fill-current" />
                        </div>
                        <div>
                          <h2 className="font-bold text-lg leading-tight text-[#2d2520]">Check Your Email</h2>
                          <p className="text-xs" style={{ color: '#8a7968' }}>6-digit code sent</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setStage('details'); setOtp(Array(OTP_LENGTH).fill('')); setError(''); }}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(0,0,0,0.04)' }}
                      >
                        <RotateCcw className="w-4 h-4" style={{ color: '#2d2520' }} />
                      </button>
                    </div>

                    {/* Email hint */}
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6"
                      style={{ background: 'rgba(212,165,116,0.08)', border: '1px solid rgba(212,165,116,0.2)' }}>
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#d4a574' }} />
                      <p className="text-xs" style={{ color: '#8a7968' }}>
                        Code sent to <span className="font-bold" style={{ color: '#d4a574' }}>{email}</span>
                      </p>
                    </div>

                    <p className="text-sm font-medium mb-5 text-center" style={{ color: '#8a7968' }}>
                      Hey <span className="font-bold" style={{ color: '#d4a574' }}>{firstName}</span>, enter your 6-digit code 🔐
                    </p>

                    {/* OTP Boxes */}
                    <div className="flex gap-2 justify-center mb-6" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <motion.input
                          key={i}
                          ref={el => { inputRefs.current[i] = el; }}
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: i * 0.05, type: 'spring', stiffness: 420, damping: 24 }}
                          type="tel"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKey(i, e)}
                          disabled={verifying}
                          className="w-11 h-14 outline-none text-center font-bold text-xl rounded-2xl transition-all disabled:opacity-40"
                          style={{
                            background: digit ? 'rgba(212,165,116,0.1)' : '#fafafa',
                            border: `2px solid ${error ? 'rgba(248,113,113,0.7)' : digit ? '#d4a574' : 'rgba(0,0,0,0.06)'}`,
                            color: digit ? '#d4a574' : '#2d2520',
                            caretColor: '#d4a574',
                          }}
                        />
                      ))}
                    </div>

                    {/* Verify button */}
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(244,132,95,0.35)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleVerify(otp.join(''))}
                      disabled={!canSubmit}
                      className="w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 mb-5 transition-all"
                      style={{ background: 'linear-gradient(135deg, #f4845f 0%, #e8573a 100%)' }}
                    >
                      {verifying ? <Spinner /> : <><span>Verify & Enter</span><Sparkles className="w-4 h-4" /></>}
                    </motion.button>

                    {/* Resend */}
                    <div className="text-center">
                      {countdown > 0 ? (
                        <p className="text-xs" style={{ color: '#8a7968' }}>
                          Resend in <span style={{ color: '#d4a574' }}>{countdown}s</span>
                        </p>
                      ) : (
                        <button
                          onClick={() => { setOtp(Array(OTP_LENGTH).fill('')); handleSendOtp(); }}
                          className="text-xs font-medium hover:opacity-70 transition-opacity"
                          style={{ color: '#d4a574' }}
                        >
                          Didn't get it? Resend code
                        </button>
                      )}
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="text-xs text-center mt-3" style={{ color: '#f87171' }}>
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
