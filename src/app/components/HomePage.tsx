import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Users, Camera, ArrowRight, ChevronDown, Star, MapPin } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../lib/translations';

interface HomePageProps {
  onNavigate?: (screen: string) => void;
}

const getHeroSlides = (t: any) => [
  {
    image: '/images/hero_sunset.png',
    tag: t('hero.tag1'),
    headline: t('hero.headline1_1'),
    highlight: t('hero.headline1_2'),
    sub: t('hero.sub1'),
  },
  {
    image: '/images/sunset_couple.png',
    tag: t('hero.tag2'),
    headline: t('hero.headline2_1'),
    highlight: t('hero.headline2_2'),
    sub: t('hero.sub2'),
  },
  {
    image: '/images/sunset_family.png',
    tag: t('hero.tag3'),
    headline: t('hero.headline3_1'),
    highlight: t('hero.headline3_2'),
    sub: t('hero.sub3'),
  },
];

const getEmotionCards = (t: any) => [
  {
    image: '/images/sunset_couple.png',
    emoji: '💑',
    label: t('cardsSection.card1Label'),
    title: t('cardsSection.card1Title'),
    desc: t('cardsSection.card1Desc'),
  },
  {
    image: '/images/sunset_family.png',
    emoji: '👨‍👩‍👧‍👦',
    label: t('cardsSection.card2Label'),
    title: t('cardsSection.card2Title'),
    desc: t('cardsSection.card2Desc'),
  },
  {
    image: '/images/sunset_friends.png',
    emoji: '🤝',
    label: t('cardsSection.card3Label'),
    title: t('cardsSection.card3Title'),
    desc: t('cardsSection.card3Desc'),
  },
];

const getHowItWorks = (t: any) => [
  {
    step: '01',
    title: t('howItWorks.step1Title'),
    desc: t('howItWorks.step1Desc'),
    icon: Heart,
    color: '#e8735a',
  },
  {
    step: '02',
    title: t('howItWorks.step2Title'),
    desc: t('howItWorks.step2Desc'),
    icon: Users,
    color: '#d4a574',
  },
  {
    step: '03',
    title: t('howItWorks.step3Title'),
    desc: t('howItWorks.step3Desc'),
    icon: Camera,
    color: '#c47a5a',
  },
  {
    step: '04',
    title: t('howItWorks.step4Title'),
    desc: t('howItWorks.step4Desc'),
    icon: Sparkles,
    color: '#b85c38',
  },
];

const getTestimonials = (t: any) => [
  {
    quote: t('testimonials.t1Quote'),
    name: 'Priya Nair',
    role: t('testimonials.t1Role'),
    stars: 5,
    avatar: '🌅',
  },
  {
    quote: t('testimonials.t2Quote'),
    name: 'Arjun & Meera',
    role: t('testimonials.t2Role'),
    stars: 5,
    avatar: '🌊',
  },
  {
    quote: t('testimonials.t3Quote'),
    name: 'Rohan Mehta',
    role: t('testimonials.t3Role'),
    stars: 5,
    avatar: '🧡',
  },
];

const FLOATING_MESSAGES = [
  { emoji: '🌅', text: '"Miss you so much..."', from: 'Mumbai → London' },
  { emoji: '💌', text: '"Thinking of you always"', from: 'New York → Delhi' },
  { emoji: '🫂', text: '"Wish I was there"', from: 'Sydney → Chennai' },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const { language, setLanguage, t } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState<'explore' | 'create'>('explore');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [floatIndex, setFloatIndex] = useState(0);
  const navigate = useNavigate();

  const HERO_SLIDES = getHeroSlides(t);
  const EMOTION_CARDS = getEmotionCards(t);
  const HOW_IT_WORKS = getHowItWorks(t);
  const TESTIMONIALS = getTestimonials(t);

  useEffect(() => {
    const tInterval = setInterval(() => {
      setCurrentSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(tInterval);
  }, [HERO_SLIDES.length]);

  useEffect(() => {
    const tInterval = setInterval(() => {
      setFloatIndex(i => (i + 1) % FLOATING_MESSAGES.length);
    }, 3500);
    return () => clearInterval(tInterval);
  }, []);

  const handleCTA = (intent: 'explore' | 'create') => {
    setAuthIntent(intent);
    setAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    navigate('/home');
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="min-h-screen" style={{ background: '#fdfbf8', color: '#2d2520' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Background slideshow */}
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt="Emotional sunset beach"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
            {/* Deep cinematic gradient overlay */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(180deg, rgba(253,251,248,0.4) 0%, rgba(253,251,248,0.2) 35%, rgba(253,251,248,0.7) 70%, rgba(253,251,248,1) 100%)'
            }} />
            {/* Side vignette */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.6) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.4) 100%)'
            }} />
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <nav className="relative z-30 flex items-center justify-between px-6 md:px-14 pt-7">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#2d2520] text-[2rem] font-extrabold tracking-tighter lowercase drop-shadow-sm">
              nearyou<span style={{ color: '#d4a574' }}>.</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-sm text-[#2d2520] font-medium border border-[#2d2520]/20 rounded-full px-3 py-2 backdrop-blur-sm hover:bg-white/50 transition-all shadow-sm outline-none appearance-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.7)' }}
            >
              <option value="en">🌐 EN</option>
              <option value="te">🌐 తెలుగు</option>
            </select>
            <button
              onClick={() => handleCTA('explore')}
              className="text-sm text-[#2d2520] font-medium border border-[#2d2520]/20 rounded-full px-6 py-2 backdrop-blur-sm hover:bg-white/50 transition-all shadow-sm"
            >
              {t('nav.signIn')}
            </button>
          </motion.div>
        </nav>

        {/* Slide indicators */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="transition-all duration-500 rounded-full"
              style={{
                width: i === currentSlide ? '28px' : '8px',
                height: '8px',
                background: i === currentSlide ? '#d4a574' : 'rgba(45,37,32,0.15)',
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-20 flex-1 flex flex-col justify-end px-6 md:px-14 pb-36 md:pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              {/* Tag pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(244,132,95,0.25)', border: '1px solid rgba(244,132,95,0.5)' }}
              >
                <Heart className="w-3 h-3 fill-current text-rose-400 animate-pulse" />
                <span className="text-xs font-semibold tracking-widest uppercase text-rose-300">
                  {slide.tag}
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-bold leading-[1.1] mb-2 text-[#2d2520] drop-shadow-sm whitespace-pre-line"
                style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
              >
                {slide.headline}
              </h1>
              <h1
                className="font-bold leading-[1.1] mb-6 whitespace-pre-line"
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                  background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {slide.highlight}
              </h1>

              <p className="text-[#8a7968] font-light text-lg leading-relaxed mb-10 max-w-lg">
                {slide.sub}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 20px 40px rgba(212,165,116,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCTA('create')}
                  className="px-9 py-4 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  {t('hero.ctaCreate')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.9)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCTA('explore')}
                  className="px-9 py-4 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all text-[#2d2520] shadow-sm"
                  style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)', backdropFilter: 'blur(12px)' }}
                >
                  {t('hero.ctaExplore')} <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating live message bubble */}
        <div className="absolute right-8 md:right-16 top-1/3 z-30 hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={floatIndex}
              initial={{ opacity: 0, x: 30, y: 0 }}
              animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ opacity: { duration: 0.5 }, x: { duration: 0.5 }, y: { duration: 4, repeat: Infinity } }}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <div className="text-2xl">{FLOATING_MESSAGES[floatIndex].emoji}</div>
              <div>
                <p className="text-[#2d2520] font-semibold text-sm">{FLOATING_MESSAGES[floatIndex].text}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <p className="text-[#8a7968] text-xs">{FLOATING_MESSAGES[floatIndex].from}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-4 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl"
            style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(212,165,116,0.35)' }}
          >
            <Heart className="w-4 h-4 fill-current text-rose-400 animate-pulse" />
            <div>
              <p className="text-[#2d2520] font-bold text-sm">{t('hero.statsCount')}</p>
              <p className="text-[#8a7968] text-xs">{t('hero.statsDesc')}</p>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1"
        >
          <span className="text-[#8a7968]/50 text-xs tracking-widest uppercase font-semibold">{t('hero.scroll')}</span>
          <ChevronDown className="w-5 h-5 text-[#8a7968]/50" />
        </motion.div>
      </section>

      {/* ── EMOTION STATEMENT BAND ───────────────────────────── */}
      <section className="py-16 px-6" style={{ background: 'linear-gradient(135deg, #fdfbf8 0%, #fafafa 100%)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="font-light leading-relaxed" style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', color: 'rgba(45,37,32,0.6)' }}>
            {t('emotionStatement.part1')}{' '}
            <span className="font-semibold text-[#2d2520]">{t('emotionStatement.part2')}</span>{' '}
            <span style={{ color: '#d4a574' }}>
              {t('emotionStatement.part3')}
            </span>
          </p>
        </motion.div>
      </section>

      {/* ── EMOTIONAL EXPERIENCE CARDS ───────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#fdfbf8' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#d4a574' }}>
              {t('cardsSection.tag')}
            </span>
            <h2 className="font-bold mt-3 mb-4 text-[#2d2520]" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              {t('cardsSection.headline1')}<br />
              <span style={{
                background: 'linear-gradient(135deg, #d4a574, #f4845f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>{t('cardsSection.headline2')}</span>
            </h2>
            <p className="font-light max-w-lg mx-auto text-base" style={{ color: 'rgba(45,37,32,0.6)', lineHeight: 1.8 }}>
              {t('cardsSection.sub')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {EMOTION_CARDS.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onClick={() => handleCTA('explore')}
                className="group cursor-pointer rounded-3xl overflow-hidden relative"
                style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ objectPosition: 'center 20%' }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.7) 40%, transparent 100%)'
                  }} />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="text-3xl mb-3">{card.emoji}</div>
                    <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-3 inline-block"
                      style={{ background: 'rgba(212,165,116,0.15)', color: '#d4a574' }}>
                      {card.label}
                    </span>
                    <h3 className="text-[#2d2520] font-bold text-xl mb-2 leading-tight">{card.title}</h3>
                    <p className="text-[#8a7968] text-sm font-light leading-relaxed">{card.desc}</p>
                    <div className="mt-5 flex items-center gap-2 text-rose-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>{t('cardsSection.createMoment')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOLDEN HOUR QUOTE BANNER ─────────────────────────── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero_sunset.png"
            alt="Sunset"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 60%' }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(253,251,248,0.85)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-8">🌅</div>
            <blockquote
              className="font-light italic text-[#2d2520] leading-relaxed mb-8"
              style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}
            >
              {t('quoteSection.quote')}
            </blockquote>
            <p style={{ color: '#d4a574' }} className="font-bold text-sm tracking-widest uppercase">
              {t('quoteSection.author')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#d4a574' }}>
              {t('howItWorks.tag')}
            </span>
            <h2 className="font-bold mt-3 mb-4 text-[#2d2520] whitespace-pre-line" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              {t('howItWorks.headline')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 p-8 rounded-3xl group transition-all duration-500 hover:shadow-xl"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
                }}
              >
                <div className="flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}33` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <span className="text-5xl font-bold block" style={{ color: `${item.color}22` }}>
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-[#2d2520]">{item.title}</h3>
                  <p className="font-light text-sm leading-relaxed" style={{ color: '#8a7968' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: '#fdfbf8' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-widest uppercase font-semibold" style={{ color: '#d4a574' }}>
              {t('testimonials.tag')}
            </span>
            <h2 className="font-bold mt-3 text-[#2d2520]" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
              {t('testimonials.headline1')}<br />
              <span style={{
                background: 'linear-gradient(135deg, #d4a574, #f4845f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>{t('testimonials.headline2')}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((tItem, i) => (
              <motion.div
                key={tItem.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-8 rounded-3xl flex flex-col shadow-sm"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: tItem.stars }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-current" style={{ color: '#d4a574' }} />
                  ))}
                </div>

                <p className="font-light italic leading-relaxed mb-6 flex-1" style={{ color: '#8a7968', lineHeight: 1.9, fontSize: '0.95rem' }}>
                  {tItem.quote}
                </p>

                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: 'rgba(212,165,116,0.15)' }}>
                    {tItem.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#2d2520]">{tItem.name}</p>
                    <p className="font-light text-xs mt-0.5" style={{ color: '#8a7968' }}>{tItem.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/sunset_family.png"
            alt="Sunset family"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 25%' }}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(253,251,248,0.92) 100%)'
          }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-6">🌇</div>
            <h2 className="font-bold text-[#2d2520] mb-4 whitespace-pre-line" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
              {t('ctaSection.headline')}
            </h2>
            <p className="font-light mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: '#8a7968', fontSize: '1.1rem' }}>
              {t('ctaSection.sub')}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(212,165,116,0.3)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCTA('create')}
                className="px-10 py-5 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #d4a574 0%, #e8573a 100%)' }}
              >
                <Heart className="w-5 h-5 fill-current" />
                {t('ctaSection.btnCreate')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,1)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCTA('explore')}
                className="px-10 py-5 rounded-2xl font-medium text-base flex items-center justify-center gap-2 text-[#2d2520] transition-all shadow-sm"
                style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.06)', backdropFilter: 'blur(8px)' }}
              >
                {t('ctaSection.btnExplore')} <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 text-center" style={{ background: '#fdfbf8', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="w-4 h-4 fill-current" style={{ color: '#d4a574' }} />
          <span className="font-bold tracking-tight text-[#2d2520] text-lg lowercase">nearyou<span style={{ color: '#d4a574' }}>.</span></span>
        </div>
        <p className="text-xs font-light" style={{ color: '#8a7968' }}>
          {t('footer.text')}
        </p>
      </footer>

      {/* Auth modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
}
