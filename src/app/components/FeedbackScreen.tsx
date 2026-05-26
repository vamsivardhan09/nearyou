import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, CheckCircle2, Star } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export function FeedbackScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from('nearyou_feedback').insert([{
        user_id: user?.id || 'anonymous',
        rating,
        message: feedback,
        created_at: new Date().toISOString()
      }]);
      
      if (error) {
        console.warn('Supabase feedback insert failed, saving locally:', error.message);
        // Fallback to local storage if DB fails or doesn't exist
        const existing = JSON.parse(localStorage.getItem('nearyou_feedbacks') || '[]');
        localStorage.setItem('nearyou_feedbacks', JSON.stringify([...existing, { rating, feedback, date: new Date().toISOString() }]));
      }
      
      setSubmitted(true);
      setTimeout(() => navigate('/home'), 3000);
    } catch (err) {
      console.error(err);
      // Fallback
      setSubmitted(true);
      setTimeout(() => navigate('/home'), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center font-light text-[#2d2520]" style={{ background: '#fdfbf8' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-md"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl mb-3">Thank You!</h2>
          <p className="text-[#8a7968] mb-8 leading-relaxed">Your feedback means the world to us. It helps us craft even more beautiful emotional experiences.</p>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#d4a574]">Redirecting back to home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-light pb-24 text-[#2d2520]" style={{ background: '#fdfbf8' }}>
      <div className="sticky top-0 z-50 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium hover:text-[#d4a574] transition-colors" style={{ color: '#8a7968' }}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="font-medium tracking-widest text-sm text-[#2d2520]">Feedback</span>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 pt-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <span className="text-4xl mb-4 block">💬</span>
            <h1 className="text-3xl mb-3">How was your experience?</h1>
            <p className="text-sm text-[#8a7968] leading-relaxed">
              We'd love to hear what you felt. Your feedback helps us make every moment more special.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-[32px] border border-black/5 shadow-xl shadow-black/5">
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#8a7968] mb-4">Rate Your Experience</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="p-2 transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-10 h-10 transition-colors ${
                        (hoveredRating || rating) >= star 
                          ? 'fill-[#d4a574] text-[#d4a574]' 
                          : 'fill-transparent text-black/10'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-semibold text-[#8a7968] mb-3 block">Tell us more (Optional)</label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={5}
                placeholder="What did you love? What could we improve?"
                className="w-full p-4 rounded-2xl text-sm outline-none transition-colors resize-none"
                style={{ 
                  background: '#fafafa', 
                  border: '1.5px solid rgba(0,0,0,0.06)',
                  color: '#2d2520'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(212,165,116,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.06)'}
              />
            </div>

            <button
              type="submit"
              disabled={rating === 0 || submitting}
              className="w-full py-4 rounded-2xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}
            >
              {submitting ? 'Sending...' : (
                <>
                  Submit Feedback <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
