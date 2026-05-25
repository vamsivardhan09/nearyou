import { useNavigate, useParams } from 'react-router';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Heart, CheckCircle2, Clock, Users, ArrowRight, Camera, MessageCircle, Mic, Video
} from 'lucide-react';
import { PACKAGES } from '../../lib/packagesData';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function PackageDetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const pkg = PACKAGES.find(p => p.id === id);
  
  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center font-light text-[#2d2520]" style={{ background: '#fdfbf8' }}>
        <p>Package not found.</p>
        <button onClick={() => navigate('/packages')} className="ml-4 font-medium underline text-[#d4a574]">Go back</button>
      </div>
    );
  }

  const goBack = () => navigate('/packages');
  const startExperience = () => navigate(`/create?type=${pkg.id}`);

  const premiumAccent = '#d4a574';

  return (
    <div className="min-h-screen font-light pb-24 text-[#2d2520]" style={{ background: '#fdfbf8' }}>

      {/* ── STICKY NAV ──────────────────────────────────── */}
      <div
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#d4a574]"
            style={{ color: '#8a7968' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="font-medium tracking-widest text-sm text-[#2d2520]">Experience Details</span>
          <div className="w-16" />
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative h-[60vh] md:h-[70vh] flex flex-col overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, rgba(253,251,248,0.1) 0%, rgba(253,251,248,0.98) 100%)` }}
          />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-end max-w-4xl mx-auto w-full px-6 pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-[#d4a574]/30" style={{ background: 'rgba(212,165,116,0.15)', backdropFilter: 'blur(8px)' }}>
              <pkg.icon className="w-4 h-4 text-[#d4a574]" />
              <span className="text-xs font-medium tracking-widest uppercase text-[#d4a574]">Premium Package</span>
            </div>
            
            <h1 className="font-light leading-tight mb-4 text-[#2d2520]" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
              {pkg.title}
            </h1>
            
            <p className="font-light text-lg md:text-xl text-[#8a7968] max-w-2xl leading-relaxed mb-6">
              {pkg.tagline}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-2xl font-normal text-[#2d2520]">{pkg.price}</span>
              <div className="w-px h-6 bg-black/10" />
              <span className="text-sm font-medium text-[#8a7968]">One-time payment</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── THE STORY ───────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Heart className="w-8 h-8 mx-auto mb-6 text-[#d4a574]" />
            <h2 className="font-light text-3xl mb-8 leading-tight text-[#2d2520]">
              We handle everything beautifully for you.
            </h2>
            <p className="font-medium text-base md:text-lg leading-relaxed text-[#8a7968]" style={{ lineHeight: 2 }}>
              {pkg.story} You don't have to worry about coordinating with relatives or chasing people for videos. 
              Our team takes care of the emotional curation, the planning, and the cinematic execution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT WE HANDLE ──────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: '#fafafa' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs tracking-widest uppercase font-semibold mb-3 block text-[#d4a574]">The Process</span>
            <h2 className="font-light text-3xl text-[#2d2520]">How our team creates magic.</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Family Collaboration', desc: 'We quietly reach out to the family members and friends you specify, guiding them on how to share their memories.', icon: Users },
              { title: 'Video & Voice Collection', desc: 'Our platform securely collects high-quality videos, voice notes, and heartfelt written messages from everyone involved.', icon: Mic },
              { title: 'Cinematic Storytelling', desc: 'Our editors weave the collected media into a breathtaking, emotionally resonant cinematic story.', icon: Video },
              { title: 'Surprise Coordination', desc: 'We help you plan the perfect reveal moment, ensuring they experience the surprise beautifully.', icon: Camera }
            ].map((step, i) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl"
                style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}
              >
                <step.icon className="w-8 h-8 mb-5 text-[#d4a574]" />
                <h3 className="font-medium text-lg mb-3 text-[#2d2520]">{step.title}</h3>
                <p className="font-medium text-sm leading-relaxed text-[#8a7968]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES & TIMELINE ─────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="font-light text-2xl mb-8 text-[#2d2520]">Everything included</h3>
            <div className="space-y-4">
              {pkg.features.map(f => (
                <div key={f} className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#d4a574]" />
                  <span className="font-medium text-base text-[#8a7968]" style={{ lineHeight: 1.6 }}>{f}</span>
                </div>
              ))}
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#d4a574]" />
                <span className="font-medium text-base text-[#8a7968]" style={{ lineHeight: 1.6 }}>Dedicated emotional coordinator</span>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#d4a574]" />
                <span className="font-medium text-base text-[#8a7968]" style={{ lineHeight: 1.6 }}>Unlimited media storage</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="font-light text-2xl mb-8 text-[#2d2520]">Timeline Expectations</h3>
            
            <div className="relative pl-6 space-y-8 before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-black/10">
              {[
                { time: 'Day 1', text: 'You share your story and recipient details.' },
                { time: 'Day 2-5', text: 'We contact friends and collect emotional media.' },
                { time: 'Day 6-10', text: 'Our team edits and crafts the cinematic experience.' },
                { time: 'Reveal Day', text: 'The beautiful surprise is delivered and cherished.' }
              ].map((t, i) => (
                <div key={t.time} className="relative">
                  <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border-2" style={{ background: '#ffffff', borderColor: premiumAccent }} />
                  <span className="text-xs font-bold uppercase tracking-widest mb-1 block text-[#d4a574]">{t.time}</span>
                  <p className="font-medium text-sm text-[#8a7968]">{t.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── RATINGS & REVIEWS SECTION ────────────────────── */}
      <section className="py-16 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs tracking-widest uppercase font-semibold mb-3 block text-[#d4a574]">Reviews</span>
            <h2 className="font-light text-3xl text-[#2d2520]">What loved ones felt.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl text-center border border-black/5" style={{ background: '#fafafa' }}>
              <h3 className="text-5xl font-light text-[#e8573a] mb-2">{pkg.rating}</h3>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-[#d4a574]" />
                ))}
              </div>
              <p className="text-xs text-[#8a7968]">Average customer rating</p>
            </div>
            <div className="p-6 rounded-2xl text-center border border-black/5" style={{ background: '#fafafa' }}>
              <h3 className="text-5xl font-light text-[#e8573a] mb-2">99.8%</h3>
              <p className="text-xs font-medium text-[#2d2520] mb-2">On-Time Delivery</p>
              <p className="text-xs text-[#8a7968]">Guaranteed execution</p>
            </div>
            <div className="p-6 rounded-2xl text-center border border-black/5" style={{ background: '#fafafa' }}>
              <h3 className="text-5xl font-light text-[#e8573a] mb-2">{pkg.reviews}+</h3>
              <p className="text-xs font-medium text-[#2d2520] mb-2">Surprises Completed</p>
              <p className="text-xs text-[#8a7968]">Across 25+ cities</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { author: "Aditya R.", rating: 5, date: "2 days ago", comment: "Absolutely tear-jerking experience. My family was blown away by the storytelling quality. Every rupee spent was worth the emotions." },
              { author: "Sania M.", rating: 5, date: "1 week ago", comment: "The coordination was flawless. I didn't have to chase anyone. They did everything with such care and delivered it exactly on time." }
            ].map((rev, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-black/5" style={{ background: '#fafafa' }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold text-sm text-[#2d2520]">{rev.author}</span>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current text-[#d4a574]" />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-[#8a7968]">{rev.date}</span>
                </div>
                <p className="text-xs font-light leading-relaxed text-[#8a7968]">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="pt-10 px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)' }}
          >
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10">
              <MessageCircle className="w-10 h-10 mx-auto mb-6 text-white" />
              <h2 className="font-light text-3xl md:text-4xl text-white mb-4">Start this journey today.</h2>
              <p className="font-medium text-white/90 text-sm md:text-base max-w-lg mx-auto mb-10 leading-relaxed">
                Give us the details, and let our team start gathering the emotions that will make this unforgettable.
              </p>
              
              <button
                onClick={startExperience}
                className="px-10 py-5 rounded-2xl text-base font-medium flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105"
                style={{ background: '#ffffff', color: '#e8573a', boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
              >
                Book Now <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
