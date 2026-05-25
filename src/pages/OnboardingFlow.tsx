import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, Sparkles, User, Phone, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OTP_LENGTH = 4;
const DEMO_OTP = '1234';

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 10);
  return d.length <= 5 ? d : `${d.slice(0, 5)} ${d.slice(5)}`;
}

function Spinner() {
  return (
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className="w-5 h-5 rounded-full border-2 border-white border-t-transparent" />
  );
}

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { loginWithName } = useAuth();
  const [stage, setStage] = useState<'splash' | 'details' | 'otp' | 'success'>('splash');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const nameValid = fullName.trim().length >= 2;
  const phoneValid = phone.length === 10;
  const firstName = fullName.trim().split(' ')[0];

  const handleSendOtp = async () => {
    if (!nameValid) { setError('Enter your full name (min 2 chars).'); return; }
    if (!phoneValid) { setError('Enter a valid 10-digit number.'); return; }
    setError(''); setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setSending(false); setStage('otp'); setCountdown(30);
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  };

  const handleOtpChange = (i: number, val: string) => {
    const d = val.replace(/\D/, '').slice(-1);
    const next = [...otp]; next[i] = d; setOtp(next); setError('');
    if (d && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
    if (next.every(x => x !== '') && d) handleVerify(next.join(''));
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      const next = [...otp]; next[i - 1] = ''; setOtp(next);
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    if (code.length < OTP_LENGTH || verifying) return;
    setVerifying(true);
    setError('');

    // Mock OTP Verification
    await new Promise(r => setTimeout(r, 600));
    if (code !== DEMO_OTP) {
      setError(`Wrong OTP. Demo: ${DEMO_OTP}`); setVerifying(false);
      setOtp(Array(OTP_LENGTH).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 100); return;
    }

    loginWithName(fullName.trim(), phone);

    setStage('success');
    await new Promise(r => setTimeout(r, 1400));
    navigate('/home', { replace: true });
  };

  const filledCount = otp.filter(d => d !== '').length;

  // ── SPLASH ───────────────────────────────────────────────────────────────────
  const SplashScreen = (
    <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }}
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: '#fdfbf8' }}>
      
      {/* Top right Admin Portal trigger */}
      <button 
        onClick={() => navigate('/admin')}
        className="absolute top-6 right-6 z-20 px-3.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-[#d4a574]/30 text-[#d4a574] bg-[#d4a574]/5 hover:bg-[#d4a574]/10 transition-all flex items-center gap-1 shadow-sm"
      >
        <span>Admin Portal</span>
        <span>🛡️</span>
      </button>
      {/* Orbs */}
      {[
        { size: 'w-80 h-80', pos: '-top-20 -left-20', color: 'rgba(212,165,116,0.2)', delay: 0 },
        { size: 'w-96 h-96', pos: '-bottom-24 -right-16', color: 'rgba(224,123,84,0.15)', delay: 1 },
      ].map((o, i) => (
        <motion.div key={i} animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, delay: o.delay }}
          className={`absolute ${o.size} ${o.pos} rounded-full pointer-events-none`}
          style={{ background: `radial-gradient(circle,${o.color},transparent 70%)` }} />
      ))}
      <div className="relative z-10 flex flex-col flex-1 px-8 pt-20 pb-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10">
          <div className="mb-2 mt-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8855a] via-[#c19466] to-[#d4a574] text-[4rem] leading-none font-extrabold tracking-tighter lowercase font-logo drop-shadow-sm">nearyou.</span>
          </div>
          <p className="text-[#8a7968] text-base font-light tracking-wide">Emotional storytelling across distance</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex-1">
          <h1 className="font-normal leading-tight mb-4" style={{ fontSize: 'clamp(2.5rem,10vw,4rem)', color: '#2d2520' }}>
            Be present,{' '}<span style={{ color: '#d4a574' }}>even when</span>{' '}you can't be there.
          </h1>
          <p className="font-light text-lg leading-relaxed" style={{ color: '#8a7968' }}>
            Collect memories, voices and love from everyone who matters — and gift it all at once.
          </p>
        </motion.div>

        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => setStage('details')}
          className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-white font-medium text-lg relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#d4a574,#e07b54)' }}>
          <motion.div className="absolute inset-0" animate={{ x: ['100%', '-100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 2 }}
            style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)', width: '60%' }} />
          <span>Get Started</span><ArrowRight className="w-5 h-5" />
        </motion.button>
        <p className="text-[#5a4030] text-xs text-center mt-5 font-light">By continuing you agree to our Terms & Privacy</p>
        
        {/* Admin Portal below small icon */}
        <div className="mt-6 flex flex-col items-center justify-center gap-1.5 pt-3 border-t border-[#d4a574]/10">
          <div 
            onClick={() => navigate('/admin')}
            className="w-8 h-8 rounded-full bg-[#d4a574]/10 flex items-center justify-center cursor-pointer hover:bg-[#d4a574]/20 transition-all hover:scale-105"
          >
            <Shield className="w-4 h-4 text-[#d4a574]" />
          </div>
          <button 
            onClick={() => navigate('/admin')} 
            className="text-xs text-center text-[#d4a574]/80 hover:text-[#d4a574] hover:underline font-medium"
          >
            Admin Control Login
          </button>
        </div>
      </div>
    </motion.div>
  );

  // ── DETAILS ──────────────────────────────────────────────────────────────────
  const DetailsScreen = (
    <motion.div key="details" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: '#fdfbf8' }}>
      
      {/* Top right Admin Portal trigger */}
      <button 
        onClick={() => navigate('/admin')}
        className="absolute top-6 right-6 z-20 px-3.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-[#d4a574]/30 text-[#d4a574] bg-[#d4a574]/5 hover:bg-[#d4a574]/10 transition-all flex items-center gap-1 shadow-sm"
      >
        <span>Admin Portal</span>
        <span>🛡️</span>
      </button>
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 7, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(212,165,116,0.15),transparent 70%)' }} />

      <div className="relative z-10 flex flex-col flex-1 px-8 pt-16 pb-10">
        <div className="mb-12 pt-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8855a] via-[#c19466] to-[#d4a574] text-5xl font-extrabold tracking-tighter lowercase font-logo drop-shadow-sm">nearyou.</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <h2 className="font-normal text-4xl mb-2" style={{ color: '#2d2520' }}>Tell us about you</h2>
          <p className="text-base font-light" style={{ color: '#8a7968' }}>We'll personalise your emotional space</p>
        </motion.div>

        {/* Full Name */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4">
          <label className="block text-xs font-light mb-2 tracking-wide uppercase" style={{ color: '#8a7968' }}>Full Name</label>
          <div className="flex items-center rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.75)', border: `1.5px solid ${nameValid ? 'rgba(212,165,116,0.6)' : 'rgba(212,165,116,0.2)'}`, backdropFilter: 'blur(8px)' }}>
            <div className="px-4 py-4"><User className="w-4 h-4" style={{ color: '#c4a882' }} /></div>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && nameValid && phoneValid && handleSendOtp()}
              placeholder="e.g. Vamsi Krishna" autoComplete="name"
              className="flex-1 pr-4 bg-transparent outline-none text-base font-light placeholder:font-light" style={{ color: '#2d2520' }} />
            {nameValid && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="pr-4"><CheckCircle2 className="w-4 h-4 text-[#d4a574]" /></motion.div>}
          </div>
        </motion.div>

        {/* Mobile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
          <label className="block text-xs font-light mb-2 tracking-wide uppercase" style={{ color: '#8a7968' }}>Mobile Number</label>
          <div className="flex items-center rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.75)', border: `1.5px solid ${phoneValid ? 'rgba(212,165,116,0.6)' : 'rgba(212,165,116,0.2)'}`, backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center gap-1.5 px-4 py-4 border-r" style={{ borderColor: 'rgba(212,165,116,0.2)', flexShrink: 0 }}>
              <span className="text-lg">🇮🇳</span><span className="font-light text-sm" style={{ color: '#d4a574' }}>+91</span>
            </div>
            <div className="flex items-center flex-1 px-4 gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#c4a882' }} />
              <input type="tel" inputMode="numeric" value={formatPhone(phone)}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onKeyDown={e => e.key === 'Enter' && nameValid && phoneValid && handleSendOtp()}
                placeholder="98765 43210"
                className="flex-1 bg-transparent outline-none text-base font-light placeholder:font-light" style={{ color: '#2d2520' }} />
              {phoneValid && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-4 h-4 text-[#d4a574]" /></motion.div>}
            </div>
          </div>
          {phone.length > 0 && phone.length < 10 && (
            <p className="text-[11px] font-light mt-1.5 ml-1" style={{ color: '#c4a882' }}>{10 - phone.length} more digits</p>
          )}
        </motion.div>

        {error && <p className="text-[#e07b54] text-sm font-light mb-4 text-center">{error}</p>}

        <motion.button whileHover={{ scale: nameValid && phoneValid ? 1.02 : 1 }} whileTap={{ scale: 0.97 }}
          onClick={handleSendOtp} disabled={!nameValid || !phoneValid || sending}
          className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-white font-medium text-base relative overflow-hidden disabled:opacity-40 transition-opacity"
          style={{ background: 'linear-gradient(135deg,#d4a574,#e07b54)' }}>
          {sending ? <Spinner /> : <><span>Send OTP</span><ArrowRight className="w-5 h-5" /></>}
        </motion.button>

        <div className="flex items-center justify-center gap-6 mt-8">
          {['🔒 Secure', '✨ Private', '💛 Free'].map(l => (
            <span key={l} className="text-xs font-light" style={{ color: '#5a4030' }}>{l}</span>
          ))}
        </div>
        {/* Admin Portal below small icon */}
        <div className="mt-8 flex flex-col items-center justify-center gap-1.5 pt-5 border-t border-[#d4a574]/10">
          <div 
            onClick={() => navigate('/admin')}
            className="w-8 h-8 rounded-full bg-[#d4a574]/10 flex items-center justify-center cursor-pointer hover:bg-[#d4a574]/20 transition-all hover:scale-105"
          >
            <Shield className="w-4 h-4 text-[#d4a574]" />
          </div>
          <button 
            onClick={() => navigate('/admin')} 
            className="text-xs text-center text-[#d4a574]/80 hover:text-[#d4a574] hover:underline font-medium"
          >
            Admin Control Login
          </button>
        </div>
      </div>
    </motion.div>
  );

  // ── OTP ───────────────────────────────────────────────────────────────────────
  const OtpScreen = (
    <motion.div key="otp" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: '#fdfbf8' }}>
      <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(224,123,84,0.15),transparent 70%)' }} />

      <div className="relative z-10 flex flex-col flex-1 px-8 pt-16 pb-10">
        <div className="flex items-center gap-5 mb-12 pt-2">
          <button onClick={() => { setStage('details'); setOtp(Array(OTP_LENGTH).fill('')); setError(''); }}
            className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors" style={{ background: 'rgba(212,165,116,0.08)' }}>
            <ArrowRight className="w-5 h-5 rotate-180" style={{ color: '#8a7968' }} />
          </button>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8855a] via-[#c19466] to-[#d4a574] text-[2.75rem] leading-none font-extrabold tracking-tighter lowercase font-logo drop-shadow-sm">nearyou.</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <h2 className="font-normal text-4xl mb-2" style={{ color: '#2d2520' }}>Hey {firstName}! 👋</h2>
          <p className="text-base font-light" style={{ color: '#8a7968' }}>Code sent to +91 {formatPhone(phone)}</p>
        </motion.div>

        {/* Demo hint */}
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-8"
          style={{ background: 'rgba(212,165,116,0.08)', border: '1px solid rgba(212,165,116,0.2)' }}>
          <Sparkles className="w-4 h-4 flex-shrink-0" style={{ color: '#d4a574' }} />
          <p className="text-sm font-light" style={{ color: '#8a6a50' }}>
            Demo mode · Use OTP{' '}
            <span className="font-bold tracking-[0.3em] px-2 py-0.5 rounded" style={{ color: '#d4a574', background: 'rgba(212,165,116,0.15)' }}>
              {DEMO_OTP}
            </span>
          </p>
        </div>

        {/* OTP Boxes */}
        <div className="flex gap-4 justify-center mb-6">
          {otp.map((digit, i) => (
            <motion.input key={i} ref={el => { inputRefs.current[i] = el; }}
              initial={{ opacity: 0, y: 16, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 400, damping: 24 }}
              type="tel" inputMode="numeric" maxLength={1} value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKey(i, e)} disabled={verifying}
              className="w-16 h-16 outline-none text-center font-normal transition-all disabled:opacity-50"
              style={{
                borderRadius: 16, fontSize: '1.6rem',
                background: digit ? 'rgba(212,165,116,0.12)' : 'rgba(255,255,255,0.9)',
                border: error ? '2px solid rgba(192,90,58,0.6)' : digit ? '2px solid rgba(212,165,116,0.8)' : i === filledCount ? '2px solid rgba(212,165,116,0.5)' : '1.5px solid rgba(212,165,116,0.22)',
                color: '#2d2520', backdropFilter: 'blur(8px)',
                boxShadow: digit ? '0 4px 14px rgba(212,165,116,0.2)' : 'none',
              }} />
          ))}
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {otp.map((d, i) => (
            <motion.div key={i} animate={{ width: d ? 24 : 8, background: d ? '#d4a574' : 'rgba(212,165,116,0.2)' }}
              transition={{ duration: 0.25 }} className="h-1.5 rounded-full" />
          ))}
        </div>

        {error && <p className="text-[#e07b54] text-sm text-center font-light mb-4">{error}</p>}

        <motion.button whileHover={{ scale: filledCount === OTP_LENGTH ? 1.02 : 1 }} whileTap={{ scale: 0.97 }}
          onClick={() => handleVerify(otp.join(''))} disabled={filledCount < OTP_LENGTH || verifying}
          className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-white font-medium text-base disabled:opacity-40 mb-5 transition-all relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#d4a574,#e07b54)' }}>
          {verifying ? <Spinner /> : <><span>Verify & Continue</span><Sparkles className="w-5 h-5" /></>}
        </motion.button>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm font-light" style={{ color: '#5a4030' }}>Resend in <span style={{ color: '#d4a574' }}>{countdown}s</span></p>
          ) : (
            <button onClick={() => { setOtp(Array(OTP_LENGTH).fill('')); handleSendOtp(); }}
              className="text-sm font-light" style={{ color: '#d4a574' }}>
              Didn't receive it? Resend OTP
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  const SuccessScreen = (
    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.08 }}
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: '#fdfbf8' }}>
      {[1,2,3].map(i => (
        <motion.div key={i} className="absolute rounded-full border" style={{ borderColor: `rgba(212,165,116,${0.4 - i * 0.1})` }}
          initial={{ width: 80, height: 80, opacity: 0.8 }}
          animate={{ width: 80 + i * 120, height: 80 + i * 120, opacity: 0 }}
          transition={{ duration: 1.5, delay: i * 0.2, ease: 'easeOut' }} />
      ))}
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.2 }}
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
        style={{ background: 'linear-gradient(135deg,#d4a574,#e07b54)' }}>
        <CheckCircle2 className="w-12 h-12 text-white" />
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="font-normal text-4xl mb-3" style={{ color: '#2d2520' }}>
        Welcome, {firstName}! 🎉
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
        className="font-light text-base" style={{ color: '#8a7968' }}>
        Opening your emotional space…
      </motion.p>
      <motion.div className="absolute bottom-12 left-8 right-8 h-0.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(212,165,116,0.1)' }}>
        <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#d4a574,#e07b54)' }}
          initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.2, ease: 'easeInOut' }} />
      </motion.div>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {stage === 'splash'   && SplashScreen}
      {stage === 'details'  && DetailsScreen}
      {stage === 'otp'      && OtpScreen}
      {stage === 'success'  && SuccessScreen}
    </AnimatePresence>
  );
}
