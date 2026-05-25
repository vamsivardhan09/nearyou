import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Star, ArrowRight, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PACKAGES } from '../../lib/packagesData';

interface PackageListingScreenProps {
  onNavigate?: (screen: string) => void;
}

export function PackageListingScreen({ onNavigate }: PackageListingScreenProps) {
  const navigate = useNavigate();

  const goBack = () => navigate('/');
  const viewDetails = (pkgId: string) => navigate(`/package/${pkgId}`);
  const createCustom = () => navigate('/create');

  return (
    <div className="min-h-screen font-light pb-24 text-[#2d2520]" style={{ background: '#fdfbf8' }}>

      {/* ── STICKY NAV ──────────────────────────────────── */}
      <div
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#d4a574]"
            style={{ color: '#8a7968' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}
            >
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-medium tracking-widest text-sm text-[#2d2520]">Nearyou</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="pt-16 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs tracking-widest uppercase font-semibold mb-4 block text-[#d4a574]">
              Emotional Experience Packages
            </span>
            <h1
              className="font-light leading-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#2d2520' }}
            >
              Transform distance into<br />
              <em className="not-italic text-[#d4a574] font-medium">emotional presence.</em>
            </h1>
            <p className="font-medium leading-relaxed max-w-xl mx-auto text-[#8a7968]" style={{ lineHeight: 1.9 }}>
              Every package below is a hand-crafted emotional experience — not a product.
              Our team personally gathers stories, voices, and memories to create something your loved one will feel forever.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── PACKAGES ────────────────────────────────────── */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {PACKAGES.map((pkg, i) => {
            const premiumAccent = '#d4a574';
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => viewDetails(pkg.id)}
                className="group cursor-pointer rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all hover:-translate-y-1"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                }}
              >
                {/* Image side */}
                <div className="w-full md:w-2/5 h-60 md:h-auto relative overflow-hidden">
                  <ImageWithFallback
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(255,255,255,0.8)] to-transparent md:hidden" />
                  <div className="absolute bottom-4 left-4 md:hidden">
                    <pkg.icon className="w-6 h-6 text-[#d4a574]" />
                  </div>
                </div>

                {/* Content side */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative">
                  {/* Desktop icon */}
                  <div className="hidden md:flex absolute top-8 right-8 w-12 h-12 rounded-2xl items-center justify-center bg-[#fafafa] border border-black/5 shadow-sm">
                    <pkg.icon className="w-5 h-5" style={{ color: premiumAccent }} />
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-normal text-2xl text-[#2d2520]">{pkg.title}</h2>
                    {pkg.tag && (
                      <span
                        className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium"
                        style={{ background: 'rgba(212,165,116,0.1)', color: premiumAccent }}
                      >
                        {pkg.tag}
                      </span>
                    )}
                  </div>
                  
                  <p className="font-medium text-base leading-relaxed mb-6 text-[#8a7968]">
                    {pkg.tagline}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="text-lg font-medium text-[#2d2520]">{pkg.price}</span>
                    <div className="w-px h-4 bg-black/10" />
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(212,165,116,0.1)' }}>
                      <Star className="w-3.5 h-3.5 fill-current text-[#d4a574]" />
                      <span className="text-xs font-medium text-[#8a7968]">
                        {pkg.rating} Rating
                      </span>
                    </div>
                    <span className="text-xs font-medium text-[#8a7968]">
                      {pkg.reviews.toLocaleString()} stories created
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-black/5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/create?type=${pkg.id}`);
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)' }}
                    >
                      Book Now
                    </button>
                    <span className="text-xs font-semibold text-[#8a7968] group-hover:text-[#d4a574] transition-colors flex items-center gap-1">
                      View Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CUSTOM EXPERIENCE CTA ───────────────────────── */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
            style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
          >
            <Sparkles className="w-8 h-8 mx-auto mb-4 text-[#d4a574]" />
            <h2 className="font-light mb-3 text-[#2d2520]" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
              Don't see your occasion?
            </h2>
            <p className="font-medium mb-8 max-w-lg mx-auto text-sm leading-relaxed text-[#8a7968]" style={{ lineHeight: 1.9 }}>
              We create completely custom emotional experiences — from reunions and retirements
              to loneliness support and achievement celebrations. Just tell us your story.
            </p>
            <button
              onClick={createCustom}
              className="px-8 py-4 rounded-2xl font-medium text-white flex items-center gap-2 mx-auto transition-all hover:scale-105 shadow-lg shadow-[#d4a574]/20"
              style={{ background: 'linear-gradient(135deg, #d4a574, #e8573a)' }}
            >
              Create Custom Experience <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
