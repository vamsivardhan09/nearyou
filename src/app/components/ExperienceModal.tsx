import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Upload, Sparkles, Heart } from 'lucide-react';
import { useEffect } from 'react';
import { DigitalAction, RealWorldExperience, REAL_WORLD_EXPERIENCES } from '../../lib/experienceData';
import { recordAndCheckBooking } from '../../lib/fraudProtection';
import { supabase } from '../../lib/supabaseClient';

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

  // Custom Detail Fields
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [extraText1, setExtraText1] = useState('');
  const [extraSelect1, setExtraSelect1] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [isManualUpi, setIsManualUpi] = useState(false);

  // Discount Codes State
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [suggestedCode, setSuggestedCode] = useState('');

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadingStatus, setUploadingStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const getBookingPrice = (): number => {
    let base = 0;
    if (isDigital) {
      base = 99;
    } else if (realWorld) {
      base = realWorld.priceRupees;
      if (budget === 'premium') base += 499;
      if (budget === 'grand') base += 1999;
    }
    if (discountPercent > 0) {
      if (realWorld?.id === 'photo-frame' && (!budget || budget === 'base' || budget === '')) {
        return 224;
      }
      base = Math.max(0, Math.round(base * (1 - discountPercent / 100)));
    }
    return base;
  };

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
      setWhatsappNumber(''); setRecipientEmail(''); setExtraText1(''); setExtraSelect1('');
      setPaymentMethod('upi'); setCardNumber(''); setCardExpiry(''); setCardCvv(''); setUpiId('');
      setUtrNumber(''); setPaymentScreenshot(''); setScreenshotFileName(''); setIsManualUpi(false);
      setDiscountCodeInput(''); setAppliedCode(''); setDiscountPercent(0); setSuggestedCode('');
    }
  }, [isOpen]);

  if (!isOpen || !action || !type) return null;

  const isDigital = type === 'digital';
  const digitalAction = action as DigitalAction;
  const realWorld = type === 'list-real-world' ? selectedRealWorld : (action as RealWorldExperience);

  const isListingRealWorld = type === 'list-real-world' && !selectedRealWorld;

  const renderDynamicFields = () => {
    if (isDigital) {
      switch (digitalAction.id) {
        case 'note':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Emotional Tone</label>
                <select value={extraSelect1} onChange={e => setExtraSelect1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                  <option value="romantic">Romantic & Warm</option>
                  <option value="sorry">Apologetic & Sweet</option>
                  <option value="encouraging">Encouraging & Motivating</option>
                  <option value="playful">Playful & Funny</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Heartfelt Message</label>
                <textarea rows={3} placeholder="Write what you want them to feel..." value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        case 'voice':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Recipient Phone Number</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Voice Message Script (What should the voice note say?)</label>
                <textarea rows={3} placeholder="If you'd like us to record/read a message, type the script here. Or upload your voice recording below." value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        case 'video':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Recipient's Email Address</label>
                <input type="email" placeholder="their-email@domain.com" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Cinematic Title / Video Dedication Message</label>
                <textarea rows={3} placeholder="Type the message that will pop up before the video starts playing..." value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        case 'whatsapp':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Recipient's WhatsApp Number</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">WhatsApp Surprise Message</label>
                <textarea rows={3} placeholder="Enter the emotional text message to send on WhatsApp..." value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        case 'email':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Recipient's Email Address</label>
                <input type="email" placeholder="love-of-my-life@email.com" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Email Subject</label>
                <input type="text" placeholder="Something special just for you..." value={extraText1} onChange={e => setExtraText1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Email Surprise Message Body</label>
                <textarea rows={3} placeholder="Compose your beautiful, long letter here..." value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        case 'appreciate':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">What do you appreciate most about them?</label>
                <textarea rows={4} placeholder="Type down all the little things that make them special to you..." value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        case 'schedule':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Preferred Time of Day</label>
                <input type="time" value={extraText1} onChange={e => setExtraText1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">What message/action should trigger then?</label>
                <textarea rows={3} placeholder="Define details of what content will trigger..." value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        default:
          return null;
      }
    } else if (realWorld) {
      switch (realWorld.id) {
        case 'photo-frame':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Delivery Address</label>
                <textarea rows={2} placeholder="Complete physical address with pincode..." value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Frame Border Material</label>
                <select value={extraSelect1} onChange={e => setExtraSelect1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                  <option value="classic">Classic Teak Wood</option>
                  <option value="minimalist">Minimalist Matte Black</option>
                  <option value="vintage">Vintage Distressed White</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Surprise Greeting Card Text</label>
                <textarea rows={2} placeholder="Message printed on the calligraphy card..." value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        case 'sketch-portrait':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Delivery Address</label>
                <textarea rows={2} placeholder="Complete physical address with pincode..." value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Portrait Medium</label>
                <select value={extraSelect1} onChange={e => setExtraSelect1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                  <option value="pencil">Traditional Charcoal Pencil</option>
                  <option value="water">Watercolor Portrait Print</option>
                  <option value="digital">Premium Digital Illustration</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Artist Instructions / Notes</label>
                <textarea rows={2} placeholder="Specify key features, styling details, background wishes..." value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        case 'blood-art':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Delivery Address</label>
                <textarea rows={2} placeholder="Complete physical address with pincode..." value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Couple Initials / Name to Draw</label>
                <input type="text" placeholder="e.g. Harsha + Priya" value={extraText1} onChange={e => setExtraText1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Background Accent Style</label>
                <select value={extraSelect1} onChange={e => setExtraSelect1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                  <option value="crimson">Crimson & Gold Splatter</option>
                  <option value="onyx">Modern Charcoal Slate Base</option>
                  <option value="rosegold">Soft Pastel Rose Tint</option>
                </select>
              </div>
            </div>
          );
        case 'tattoos':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Delivery Address</label>
                <textarea rows={2} placeholder="Complete physical address with pincode..." value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Nicknames / Inside Joke Words</label>
                <input type="text" placeholder="e.g. 'Cutiepie', 'Potato Head', '3AM Talks'" value={extraText1} onChange={e => setExtraText1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Quantity Sheet</label>
                <select value={extraSelect1} onChange={e => setExtraSelect1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                  <option value="1">1 Standard Sheet (10 Tattoos)</option>
                  <option value="2">2 Standard Sheets (20 Tattoos)</option>
                </select>
              </div>
            </div>
          );
        case 'singer':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Doorstep Performance Address</label>
                <textarea rows={2} placeholder="Address where the singer should perform..." value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Song Requests (comma separated)</label>
                <input type="text" placeholder="e.g. Perfect, Tum Hi Ho, Kabira" value={extraText1} onChange={e => setExtraText1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Genre Style</label>
                <select value={extraSelect1} onChange={e => setExtraSelect1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                  <option value="acoustic">Acoustic Keyboard & Vocals</option>
                  <option value="guitar">Acoustic Guitar & Vocals</option>
                  <option value="retro">Violin Instrumental Surprise</option>
                </select>
              </div>
            </div>
          );
        case 'cafe':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Preferred Cafe Location Name & Area</label>
                <input type="text" placeholder="e.g. Third Wave Coffee, Indiranagar" value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Coffee Cup Custom Calligraphy Message</label>
                <input type="text" placeholder="e.g. 'Will you marry me?' or 'Congrats Harsha!'" value={extraText1} onChange={e => setExtraText1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Song to Play on Entry</label>
                <input type="text" placeholder="e.g. Can't Help Falling in Love" value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        case 'wall':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Setup Address / Room Location</label>
                <textarea rows={2} placeholder="Address where room setup should happen..." value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Fairy Lights Color Scheme</label>
                <select value={extraSelect1} onChange={e => setExtraSelect1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                  <option value="warm">Warm Golden Yellow</option>
                  <option value="white">Cool Ice White</option>
                  <option value="sunset">Sunset Pinkish Glow</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Layout Grid Pattern</label>
                <select value={extraText1} onChange={e => setExtraText1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                  <option value="heart">Heart Shape Collage Pattern</option>
                  <option value="timeline">Chronological Story-Timeline</option>
                  <option value="grid">Elegant Symmetric Gallery Matrix</option>
                </select>
              </div>
            </div>
          );
        case 'cinema':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Theater Multiplex Name & City</label>
                <input type="text" placeholder="e.g. PVR Forum Mall, Bangalore" value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">On-Screen Message Text</label>
                <input type="text" placeholder="e.g. Happy Anniversary my love! From Harsha" value={extraText1} onChange={e => setExtraText1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Expected Movie Name & Show Details</label>
                <input type="text" placeholder="e.g. Avatar 3, 7:15 PM Evening Show" value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        case 'led':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">LED Screen Location / Junction Preference</label>
                <input type="text" placeholder="e.g. Sony World Signal, Koramangala" value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Billboard Heading Title</label>
                <input type="text" placeholder="e.g. PROUD OF YOU VAMSI!" value={extraText1} onChange={e => setExtraText1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Subtitle / Message Details</label>
                <textarea rows={2} placeholder="Small description message to print below the main title..." value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        case 'room':
          return (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Decoration Address / Hotel Room Details</label>
                <textarea rows={2} placeholder="Complete venue address..." value={location} onChange={e => setLocation(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 resize-none"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Balloon Decoration Theme Color</label>
                <select value={extraSelect1} onChange={e => setExtraSelect1(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                  <option value="rose">Metallic Rose Gold & Crimson Red</option>
                  <option value="golden">Golden Amber Light & Pearl White</option>
                  <option value="neon">Cosmopolitan Neon Blue & Pink (Party Theme)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Access Instructions / Surprise Timings</label>
                <input type="text" placeholder="e.g. Helper will unlock / please coordinate with hotel front desk" value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                  style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
              </div>
            </div>
          );
        default:
          return null;
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    setError('');
    if (step === 1) {
      const fraudCheck = recordAndCheckBooking(receiver || whatsappNumber || recipientEmail || 'Receiver');
      if (fraudCheck.isSuspicious) {
        setError(fraudCheck.message);
        return;
      }
      // Suggest random discount code
      const codes = ['LOVE10', 'SURPRISE15', 'NEARNEW20', 'FOREVER25'];
      const randomCode = codes[Math.floor(Math.random() * codes.length)];
      setSuggestedCode(randomCode);
      setStep(2); // Go to Payment Page
      return;
    }

    if (paymentMethod === 'upi' && isManualUpi) {
      if (!utrNumber || utrNumber.trim().length !== 12) {
        setError('Please enter a valid 12-digit UTR/Transaction reference number.');
        return;
      }
      if (!paymentScreenshot) {
        setError('Please upload your payment screenshot to verify.');
        return;
      }
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));

    // Save booking to localStorage nearyou_bookings & Supabase
    try {
      const existing = localStorage.getItem('nearyou_bookings');
      const bookings = existing ? JSON.parse(existing) : [];
      
      const newBooking = {
        id: 'NY-' + Date.now().toString().slice(-6) + Math.floor(10 + Math.random() * 90),
        recipientName: receiver || 'Recipient',
        targetDate: date || new Date().toISOString().split('T')[0],
        message: message || '',
        location: location || 'Digital Delivery',
        budget: budget || 'base',
        whatsappNumber: whatsappNumber || null,
        recipientEmail: recipientEmail || null,
        extraText1: extraText1 || null,
        extraSelect1: extraSelect1 || null,
        surpriseTitle: isDigital ? digitalAction.label : (realWorld?.title || ''),
        surpriseType: isDigital ? 'digital' : 'real-world',
        price: getBookingPrice(),
        paymentMethod: paymentMethod + (isManualUpi ? ' (Manual UPI Verification)' : ' (Auto Success)'),
        utrNumber: isManualUpi ? (utrNumber || null) : null,
        paymentScreenshot: isManualUpi ? (paymentScreenshot || null) : null,
        appliedDiscountCode: appliedCode || null,
        status: isManualUpi ? 'Pending Verification' : 'Approved',
        createdAt: new Date().toLocaleString()
      };
      
      bookings.push(newBooking);
      localStorage.setItem('nearyou_bookings', JSON.stringify(bookings));

      // Save to Supabase (non-blocking, fails gracefully if tables aren't created yet)
      try {
        const { error } = await supabase.from('nearyou_bookings').insert([newBooking]);
        if (error) {
          console.warn('Failed to save booking to Supabase:', error.message);
        }
      } catch (dbErr) {
        console.warn('Supabase DB connection error:', dbErr);
      }
    } catch (e) {
      console.error('Failed to save booking', e);
    }

    setSubmitting(false);
    setStep(3); // Success step
    setTimeout(() => {
      onClose();
      setStep(1);
      setReceiver(''); setDate(''); setMessage(''); setLocation(''); setBudget('');
      setWhatsappNumber(''); setRecipientEmail(''); setExtraText1(''); setExtraSelect1('');
      setPaymentMethod('upi'); setCardNumber(''); setCardExpiry(''); setCardCvv(''); setUpiId('');
      setUtrNumber(''); setPaymentScreenshot(''); setScreenshotFileName(''); setIsManualUpi(false);
      setDiscountCodeInput(''); setAppliedCode(''); setDiscountPercent(0); setSuggestedCode('');
    }, 4000);
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

                 {/* Form Fields & Payment & Success Steps */}
            {!isListingRealWorld && (
              step === 1 ? (
                <div className="space-y-4">
                  {/* Common Name/Date configuration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Recipient's Full Name</label>
                      <input type="text" placeholder="Receiver's Full Name" value={receiver} onChange={e => setReceiver(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 placeholder:text-[#8a7968]/50"
                        style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Target Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4a574]" />
                        <input type="date" value={date} onChange={e => setDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60"
                          style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
                      </div>
                    </div>
                  </div>

                  {/* Version Upgrades (for real world) */}
                  {!isDigital && realWorld && (
                    <div>
                      <label className="text-xs font-semibold text-[#8a7968] mb-1.5 block">Experience Version</label>
                      <select value={budget} onChange={e => setBudget(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%23d4a574%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] transition-all focus:border-[#d4a574]/60"
                        style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                        <option value="" disabled className="bg-[#ffffff] text-[#8a7968]">Select Experience Version</option>
                        <option value="base" className="bg-[#ffffff] text-[#2d2520]">Base Experience ({realWorld.budget})</option>
                        <option value="premium" className="bg-[#ffffff] text-[#2d2520]">Premium Upgrade (+₹499 for premium gift wrap/lettering)</option>
                        <option value="grand" className="bg-[#ffffff] text-[#2d2520]">Exclusive Setup (+₹1,999 for full HD delivery vlog recording)</option>
                      </select>
                    </div>
                  )}

                  {/* Specific Action Config Fields */}
                  {renderDynamicFields()}

                  {/* Attachment/Upload Option */}
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
                    <div className="p-4 rounded-2xl text-xs font-semibold border border-red-500/20 text-red-600 bg-red-50 text-center animate-shake">
                      ⚠️ {error}
                    </div>
                  )}

                  <button onClick={handleSubmit} disabled={submitting || (!receiver && !whatsappNumber && !recipientEmail)}
                    className="w-full py-4 rounded-2xl text-white font-medium text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-60 transition-all hover:opacity-90 shadow-lg shadow-[#d4a574]/15"
                    style={{ background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)' }}>
                    {isDigital ? 'Proceed to Payment' : 'Proceed to Checkout'}
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              ) : step === 2 ? (
                /* Step 2: Payment/Checkout Page */
                <div className="space-y-5">
                  <div className="text-center pb-2 border-b border-black/5">
                    <span className="text-xs tracking-widest uppercase font-semibold block mb-1 text-[#d4a574]">Secure Checkout</span>
                    <h3 className="font-normal text-2xl text-[#2d2520]">Surprise Booking Summary</h3>
                  </div>

                  {/* Summary Details */}
                  <div className="p-5 rounded-2xl space-y-2.5 text-xs" style={{ background: '#fafafa', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="flex justify-between">
                      <span className="font-light text-[#8a7968]">Surprise Choice</span>
                      <span className="font-semibold text-[#2d2520]">{isDigital ? digitalAction.label : realWorld?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-light text-[#8a7968]">Target Date</span>
                      <span className="font-semibold text-[#2d2520]">{date || 'Scheduled'}</span>
                    </div>
                    {budget && (
                      <div className="flex justify-between">
                        <span className="font-light text-[#8a7968]">Upgrade Package</span>
                        <span className="font-semibold text-[#2d2520] capitalize">{budget}</span>
                      </div>
                    )}
                    {appliedCode && (
                      <div className="flex justify-between text-emerald-600">
                        <span className="font-light">Discount Applied ({appliedCode})</span>
                        <span className="font-semibold">-{discountPercent}%</span>
                      </div>
                    )}
                    <div className="border-t border-black/5 pt-2 flex justify-between text-sm font-semibold mt-1">
                      <span className="text-[#2d2520]">Total Amount</span>
                      <span className="text-[#e8573a]">₹{getBookingPrice().toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Discount Code Section */}
                  <div className="p-4 rounded-2xl bg-white border border-black/5 space-y-3">
                    {suggestedCode && !appliedCode && (
                      <div className="p-3 rounded-xl text-[11px] bg-[#d4a574]/10 border border-[#d4a574]/20 text-[#2d2520] flex items-center justify-between">
                        <span>✨ Try suggested code: <strong className="font-bold">{suggestedCode}</strong></span>
                        <button 
                          onClick={() => {
                            setDiscountCodeInput(suggestedCode);
                            setAppliedCode(suggestedCode);
                            const percent = parseInt(suggestedCode.match(/\d+/)?.[0] || '10', 10);
                            setDiscountPercent(percent);
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold bg-[#d4a574] text-white rounded-lg hover:opacity-90 transition"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    
                    {appliedCode ? (
                      <div className="flex items-center justify-between text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                        <span>✅ Code <strong>{appliedCode}</strong> applied ({discountPercent}% Off!)</span>
                        <button 
                          onClick={() => {
                            setAppliedCode('');
                            setDiscountPercent(0);
                            setDiscountCodeInput('');
                          }}
                          className="text-[#e8573a] hover:underline text-[10px] font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Promo or Discount Code" 
                          value={discountCodeInput} 
                          onChange={e => setDiscountCodeInput(e.target.value.toUpperCase())}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const code = discountCodeInput.trim();
                              if (code) {
                                setAppliedCode(code);
                                const percent = parseInt(code.match(/\d+/)?.[0] || '10', 10);
                                setDiscountPercent(percent);
                              }
                            }
                          }}
                          className="flex-grow px-4 py-2.5 rounded-xl text-xs font-medium outline-none border border-black/10 focus:border-[#d4a574] placeholder:text-[#8a7968]/50"
                          style={{ background: '#fafafa' }}
                        />
                        <button 
                          onClick={() => {
                            const code = discountCodeInput.trim();
                            if (code) {
                              setAppliedCode(code);
                              const percent = parseInt(code.match(/\d+/)?.[0] || '10', 10);
                              setDiscountPercent(percent);
                            }
                          }}
                          className="px-4 text-xs font-semibold bg-[#2d2520] text-white rounded-xl hover:opacity-90 transition"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="text-xs font-semibold text-[#8a7968] mb-2 block">Choose Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { id: 'upi', label: 'UPI / QR', icon: '📱' },
                        { id: 'card', label: 'Card Payment', icon: '💳' },
                        { id: 'netbanking', label: 'Net Banking', icon: '🏦' }
                      ] as const).map(method => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`py-3 px-2 rounded-xl text-center text-xs font-medium border flex flex-col items-center justify-center gap-1 transition-all ${
                            paymentMethod === method.id
                              ? 'bg-[#d4a574]/10 border-[#d4a574] text-[#d4a574]'
                              : 'bg-white border-black/5 text-[#8a7968] hover:border-black/10'
                          }`}
                        >
                          <span className="text-lg">{method.icon}</span>
                          <span>{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Inputs */}
                  <div className="p-5 rounded-2xl bg-white border border-black/5">
                    {paymentMethod === 'upi' ? (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 border border-slate-100">
                          {/* Styled QR Code matching the Nearyou premium brand theme */}
                          <div className="relative p-[6px] rounded-[32px] overflow-hidden mb-3 shadow-lg flex items-center justify-center"
                               style={{
                                 background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)',
                                 width: '185px',
                                 height: '185px',
                                 boxShadow: '0 10px 25px rgba(212, 165, 116, 0.25)'
                               }}>
                            <div className="w-full h-full rounded-[26px] bg-white p-3 flex items-center justify-center overflow-hidden">
                              <img src="/images/payment_qr.jpg" alt="UPI QR Code" className="w-full h-full object-contain" />
                            </div>
                          </div>
                          
                          {/* Payment details to show when scanning */}
                          <div className="w-full text-center space-y-1 bg-white p-3 rounded-2xl border border-black/5 mb-2">
                            <span className="text-[10px] font-semibold text-[#8a7968] uppercase tracking-wider block">Payee Details</span>
                            <p className="text-xs font-semibold text-[#2d2520]">Nearyou Surprises Pvt Ltd</p>
                            <p className="text-[10px] font-mono text-[#8a7968]">UPI ID: nearyou@ybl</p>
                            <p className="text-[11px] font-semibold text-[#e8573a] mt-1">Amount: ₹{getBookingPrice().toLocaleString('en-IN')}</p>
                          </div>
                          <p className="text-[10px] text-[#8a7968] text-center">Scan using GooglePay, PhonePe, Paytm, or BHIM</p>
                        </div>

                        {/* Direct booking screenshot validation option */}
                        <div className="flex items-start gap-2.5 p-3 rounded-2xl border border-dashed border-[#d4a574]/40 bg-[#d4a574]/5">
                          <input 
                            type="checkbox" 
                            id="manual-upi-toggle" 
                            checked={isManualUpi} 
                            onChange={e => setIsManualUpi(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-black/10 text-[#d4a574] focus:ring-[#d4a574]"
                          />
                          <label htmlFor="manual-upi-toggle" className="text-xs font-medium text-[#2d2520] cursor-pointer">
                            <span className="font-semibold text-[#d4a574] block">Book without direct payment</span>
                            Pay manually via the QR above & upload proof screenshot below to request booking validation.
                          </label>
                        </div>

                        {isManualUpi ? (
                          <div className="space-y-4 pt-3 border-t border-black/5">
                            <div>
                              <label className="text-[11px] font-semibold text-[#8a7968] mb-1.5 block">12-Digit UPI Transaction ID / UTR Number *</label>
                              <input 
                                type="text" 
                                placeholder="Enter 12-digit UTR (e.g. 612345678901)" 
                                value={utrNumber} 
                                onChange={e => setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                className="w-full px-4 py-3.5 rounded-xl text-xs font-medium outline-none border border-black/10 focus:border-[#d4a574] placeholder:text-[#8a7968]/50"
                                style={{ background: '#fafafa' }}
                              />
                            </div>
                            
                            <div>
                              <label className="text-[11px] font-semibold text-[#8a7968] mb-1.5 block">Upload Payment Screenshot *</label>
                              <input 
                                type="file" 
                                id="payment-screenshot-upload" 
                                className="hidden" 
                                accept="image/*"
                                onChange={e => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    setScreenshotFileName(file.name);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setPaymentScreenshot(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <div 
                                onClick={() => document.getElementById('payment-screenshot-upload')?.click()}
                                className="w-full border-2 border-dashed border-black/10 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition hover:bg-[#d4a574]/5"
                                style={{
                                  borderColor: paymentScreenshot ? '#5a9e6f' : 'rgba(0,0,0,0.1)',
                                  background: paymentScreenshot ? 'rgba(90,158,111,0.03)' : 'transparent'
                                }}
                              >
                                <Upload className="w-5 h-5 mb-2" style={{ color: paymentScreenshot ? '#5a9e6f' : '#d4a574' }} />
                                <span className="text-xs font-medium text-[#2d2520]">
                                  {paymentScreenshot ? 'Screenshot Uploaded!' : 'Click to Upload Screenshot'}
                                </span>
                                {screenshotFileName ? (
                                  <span className="text-[10px] text-[#8a7968] mt-1 font-mono">{screenshotFileName}</span>
                                ) : (
                                  <span className="text-[10px] text-[#8a7968] mt-1">Upload the successful transaction screen photo</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfcbank)" value={upiId} onChange={e => setUpiId(e.target.value)}
                              className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 placeholder:text-[#8a7968]/50"
                              style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
                          </div>
                        )}
                      </div>
                    ) : paymentMethod === 'card' ? (
                      <div className="space-y-3">
                        <div>
                          <input type="text" placeholder="Card Number (16 Digits)" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g,'').slice(0,16))}
                            className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 placeholder:text-[#8a7968]/50"
                            style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Expiry MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value.slice(0,5))}
                            className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 placeholder:text-[#8a7968]/50"
                            style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
                          <input type="password" placeholder="CVV" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g,'').slice(0,3))}
                            className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none transition-all focus:border-[#d4a574]/60 placeholder:text-[#8a7968]/50"
                            style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <select className="w-full px-5 py-4 rounded-2xl text-sm font-medium outline-none appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%23d4a574%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center]"
                          style={{ background: '#fafafa', border: '1.5px solid rgba(0,0,0,0.08)', color: '#2d2520' }}>
                          <option value="">Select Popular Bank</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="axis">Axis Bank</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 rounded-2xl text-xs font-semibold border border-red-500/20 text-red-600 bg-red-50 text-center animate-shake">
                      ⚠️ {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-4 rounded-2xl font-medium text-xs border border-black/8 text-[#8a7968] hover:bg-black/5 transition-all"
                    >
                      Back
                    </button>
                    
                    {/* Only display/enable the primary book button if manual details are fulfilled (when manual check is toggled) */}
                    {(!isManualUpi || (utrNumber.trim().length === 12 && paymentScreenshot)) ? (
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-grow py-4 rounded-2xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-lg shadow-[#d4a574]/15"
                        style={{ background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)' }}
                      >
                        {submitting 
                          ? 'Confirming Transaction...' 
                          : isManualUpi 
                          ? 'Book Event with Proof' 
                          : `Pay & Book Surprise (₹${getBookingPrice().toLocaleString('en-IN')})`}
                      </button>
                    ) : (
                      <div className="flex-grow p-3 rounded-2xl bg-amber-50 border border-amber-100 text-[10px] text-amber-700 font-semibold text-center flex items-center justify-center">
                        ⚠️ Please enter 12-digit UTR & upload Screenshot to show the Book Button.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Step 3: Success Screen */
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}>
                    <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-normal mb-2 text-[#2d2520]">
                    🎉 Booking Complete!
                  </h3>
                  <p className="text-sm font-medium text-[#8a7968] max-w-[290px] leading-relaxed">
                    {isDigital
                      ? "Payment received. Your emotional delivery has been scheduled and will trigger automatically."
                      : "Booking confirmed! Payment of ₹" + getBookingPrice().toLocaleString('en-IN') + " received. Our team has already locked in the slot and started preparation."}
                  </p>
                </div>
              )
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
