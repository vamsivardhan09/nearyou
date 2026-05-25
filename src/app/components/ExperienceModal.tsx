import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Upload, Sparkles, Heart } from 'lucide-react';
import { useEffect } from 'react';
import { DigitalAction, RealWorldExperience, REAL_WORLD_EXPERIENCES } from '../../lib/experienceData';
import { recordAndCheckBooking } from '../../lib/fraudProtection';

type ExperienceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  action: DigitalAction | RealWorldExperience | null;
  type: 'digital' | 'real-world' | 'list-real-world' | null;
};

export function ExperienceModal({ isOpen, onClose, action, type }: ExperienceModalProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [receiver, setReceiver] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');

  const [selectedRealWorld, setSelectedRealWorld] = useState<RealWorldExperience | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'keepsake' | 'personal' | 'grand'>('all');
  const [error, setError] = useState('');

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadingStatus, setUploadingStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadingStatus('uploading');
      setTimeout(() => {
        setUploadingStatus('success');
      }, 1000);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedRealWorld(null);
      setCategoryFilter('all');
      setUploadedFile(null);
      setUploadingStatus('idle');
      setError('');
      setStep(1);
      setReceiver(''); setDate(''); setMessage(''); setLocation(''); setBudget('');
    }
  }, [isOpen]);

  if (!isOpen || !action || !type) return null;

  const isDigital = type === 'digital';
  const digitalAction = action as DigitalAction;
  const realWorld = type === 'list-real-world' ? selectedRealWorld : (action as RealWorldExperience);

  const isListingRealWorld = type === 'list-real-world' && !selectedRealWorld;

  const handleSubmit = async () => {
    setError('');
    const fraudCheck = recordAndCheckBooking(receiver);
    if (fraudCheck.isSuspicious) {
      setError(fraudCheck.message);
      return;
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setStep(2); // Success step
    setTimeout(() => {
      onClose();
      setStep(1);
      setReceiver(''); setDate(''); setMessage(''); setLocation(''); setBudget('');
    }, 3000);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-0"
        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-lg rounded-[32px] overflow-hidden relative shadow-2xl border border-black/5"
          style={{ background: '#fdfbf8' }}
        >
          {/* Header Image for Real World */}
          {!isDigital && !isListingRealWorld && realWorld && (
            <div className="h-48 relative">
              <img src={realWorld.image} alt={realWorld.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf8] via-transparent to-transparent" />
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-black/10 backdrop-blur-md text-white hover:bg-black/20 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className={`px-8 ${isDigital || isListingRealWorld ? 'pt-8' : 'pt-2'} pb-8 max-h-[85vh] overflow-y-auto no-scrollbar`}>

            {/* Real World Listing Grid */}
            {isListingRealWorld && (
              <div className="w-full">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-normal text-2xl text-[#2d2520]">Real-World Surprises</h3>
                    <p className="font-light text-sm text-[#8a7968] mt-1">Unforgettable physical moments, coordinated by our team.</p>
                  </div>
                  <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 text-[#8a7968] hover:bg-black/10 hover:text-[#2d2520] transition flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
                  {(['all', 'keepsake', 'personal', 'grand'] as const).map(cat => {
                    const label = {
                      all: 'All Surprises',
                      keepsake: 'Keepsakes (Under ₹500)',
                      personal: 'Personal (₹500 - ₹2000)',
                      grand: 'Grand Events (₹2000+)'
                    }[cat];
                    const active = categoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`text-xs px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all border ${
                          active
                            ? 'bg-[#d4a574] text-white border-[#d4a574]'
                            : 'bg-white text-[#8a7968] border-black/5 hover:border-black/10'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {REAL_WORLD_EXPERIENCES.filter(exp => categoryFilter === 'all' || exp.category === categoryFilter).map((exp, i) => (
                    <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedRealWorld(exp)}
                      className="group cursor-pointer rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-1"
                      style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                      <div className="h-32 relative overflow-hidden">
                        <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] via-[rgba(0,0,0,0.3)] to-transparent" />
                        <div className="absolute top-3 right-3 text-[10px] font-semibold tracking-wide bg-[#fdfbf8] text-[#e8573a] px-2.5 py-1 rounded-full shadow-md border border-black/5">
                          {exp.budget}
                        </div>
                        <div className="absolute bottom-3 left-4 right-4">
                          <span className="text-[9px] uppercase tracking-wider font-semibold text-[#d4a574] mb-0.5 block">
                            {exp.category === 'keepsake' ? 'Keepsake & Art' : exp.category === 'personal' ? 'Personal Surprise' : 'Grand Setup'}
                          </span>
                          <h4 className="text-white font-normal text-sm leading-tight">{exp.title}</h4>
                        </div>
                      </div>
                      <div className="p-4 bg-white flex-grow flex flex-col justify-between">
                        <p className="text-[11px] font-light text-[#8a7968] line-clamp-2 leading-relaxed mb-3">
                          {exp.desc}
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-[#d4a574] font-medium pt-2 border-t border-black/5">
                          <span>{exp.timeline}</span>
                          <span className="group-hover:translate-x-1 transition-transform">Configure →</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Digital Header */}
            {isDigital && (
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#ffffff] border border-black/5 shadow-sm">
                    <digitalAction.icon className="w-6 h-6" style={{ color: '#d4a574' }} />
                  </div>
                  <div>
                    <h3 className="font-normal text-xl text-[#2d2520]">{digitalAction.label}</h3>
                    <p className="font-light text-sm text-[#8a7968]">{digitalAction.desc}</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 text-[#8a7968] hover:bg-black/10 hover:text-[#2d2520] transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Real World Details */}
            {!isDigital && !isListingRealWorld && realWorld && step === 1 && (
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-normal text-2xl text-[#2d2520]">{realWorld.title}</h3>
                  <span className="text-[11px] font-semibold text-white px-2.5 py-1 rounded-full bg-[#e8573a] shadow-sm">
                    {realWorld.budget}
                  </span>
                </div>
                <p className="font-light text-sm leading-relaxed mb-4 text-[#8a7968]">{realWorld.desc}</p>

                {realWorld.flowSteps ? (
                  <div className="mb-6 p-5 rounded-2xl space-y-4" style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.08), rgba(232,87,58,0.03))', border: '1px solid rgba(212,165,116,0.15)' }}>
                    <p className="text-xs font-semibold text-[#d4a574] uppercase tracking-wider mb-1">📦 Delivery & Crafting Workflow</p>
                    <div className="relative border-l border-[#d4a574]/30 ml-2.5 pl-5 space-y-4">
                      {realWorld.flowSteps.map((stepDesc, idx) => (
                        <div key={idx} className="relative">
                          {/* Dot indicator */}
                          <div className="absolute -left-[26px] top-1 w-3.5 h-3.5 rounded-full border-2 border-[#fdfbf8] bg-[#d4a574]" />
                          <div className="text-[11px] font-semibold text-[#2d2520]">Step {idx + 1}</div>
                          <p className="text-[11px] font-light text-[#8a7968] mt-0.5 leading-relaxed">{stepDesc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl mb-6 space-y-3" style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.1), rgba(212,165,116,0.05))', border: '1px solid rgba(212,165,116,0.2)' }}>
                    <p className="text-xs font-medium text-[#d4a574] uppercase tracking-wider">How we do it</p>
                    <p className="font-light text-xs leading-relaxed text-[#8a7968]">{realWorld.teamRole}</p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#ffffff] border border-black/5 shadow-sm text-[#d4a574]">{realWorld.timeline}</span>
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#ffffff] border border-black/5 shadow-sm text-[#d4a574]">Est. {realWorld.budget}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Form Fields */}
            {!isListingRealWorld && (step === 1 ? (
              <div className="space-y-4">
                <input type="text" placeholder="Receiver's Full Name" value={receiver} onChange={e => setReceiver(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 placeholder:text-[#8a7968]/50"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4a574]" />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                      style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
                  </div>
                  {!isDigital ? (
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4a574]" />
                      <input type="text" placeholder="City/Location" value={location} onChange={e => setLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 placeholder:text-[#8a7968]/50"
                        style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
                    </div>
                  ) : (
                    <input type="time"
                      className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                      style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
                  )}
                </div>

                {!isDigital && realWorld && (
                  <select value={budget} onChange={e => setBudget(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%23d4a574%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] transition-all focus:border-[#d4a574]/60"
                    style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                    <option value="" disabled className="bg-[#ffffff] text-[#8a7968]">Select Experience Version</option>
                    <option value="base" className="bg-[#ffffff] text-[#2d2520]">Base Experience ({realWorld.budget})</option>
                    <option value="premium" className="bg-[#ffffff] text-[#2d2520]">Premium Upgrade (+₹499 for premium gift wrap/lettering)</option>
                    <option value="grand" className="bg-[#ffffff] text-[#2d2520]">Exclusive Setup (+₹1,999 for full HD delivery vlog recording)</option>
                  </select>
                )}

                <textarea placeholder="Your emotional notes or specific requests..." rows={3} value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none resize-none transition-all focus:border-[#d4a574]/60 placeholder:text-[#8a7968]/50"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />

                <div>
                  <input
                    type="file"
                    id="modal-file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div
                    onClick={() => document.getElementById('modal-file-upload')?.click()}
                    className="w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#d4a574]/5 hover:border-[#d4a574]/30"
                    style={{
                      borderColor: uploadingStatus === 'success' ? '#5a9e6f' : 'rgba(0,0,0,0.1)',
                      background: uploadingStatus === 'success' ? 'rgba(90,158,111,0.03)' : 'transparent'
                    }}
                  >
                    <Upload className="w-6 h-6 mb-2" style={{ color: uploadingStatus === 'success' ? '#5a9e6f' : '#d4a574' }} />
                    <p className="text-sm font-medium text-[#2d2520]">
                      {uploadingStatus === 'success' 
                        ? 'File Attached Successfully!' 
                        : uploadingStatus === 'uploading'
                        ? 'Attaching...'
                        : (realWorld?.id === 'photo-frame' ? 'Upload Photo for Frame' : 'Upload Memories')}
                    </p>
                    <p className="text-xs font-light text-[#8a7968] text-center mt-1">
                      {uploadingStatus === 'success'
                        ? `${uploadedFile?.name} (${(uploadedFile!.size / 1024 / 1024).toFixed(2)} MB)`
                        : uploadingStatus === 'uploading'
                        ? 'Reading details...'
                        : (realWorld?.id === 'photo-frame' 
                          ? 'Upload the photo to be printed and fitted inside the physical keepsake frame' 
                          : 'Videos, audio notes, or photos for the surprise')}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl text-xs font-semibold border border-red-500/20 text-red-600 bg-red-50 text-center">
                    ⚠️ {error}
                  </div>
                )}

                <button onClick={handleSubmit} disabled={submitting || !receiver}
                  className="w-full py-4 rounded-2xl text-white font-medium text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-60 transition-all hover:opacity-90 shadow-lg shadow-[#d4a574]/15"
                  style={{ background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)' }}>
                  {submitting ? 'Processing...' : (isDigital ? 'Schedule Emotional Delivery' : 'Request Real-World Setup')}
                  {!submitting && <Sparkles className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}>
                  <Heart className="w-10 h-10 text-white fill-white" />
                </div>
                <h3 className="text-2xl font-normal mb-2 text-[#2d2520]">
                  {isDigital ? 'Scheduled Beautifully.' : (realWorld?.category === 'keepsake' ? 'Keepsake Ordered!' : 'Request Received.')}
                </h3>
                <p className="text-sm font-medium text-[#8a7968] max-w-[280px]">
                  {isDigital
                    ? "Your emotional message is set for delivery. They will love it."
                    : (realWorld?.id === 'photo-frame' 
                      ? "Your photo frame surprise order has been placed. We are preparing it for delivery on your chosen date." 
                      : realWorld?.category === 'keepsake'
                      ? "Your custom keepsake artwork order has been registered. We'll start crafting it right away."
                      : "Our coordination team will review your request and contact you within 24 hours to begin planning this unforgettable moment.")}
                </p>
              </div>
            ))}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
