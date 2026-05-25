import { MessageCircle, Calendar, Mic, Video, Bell, Send, Mail, Sparkles, MapPin } from 'lucide-react';

export type DigitalAction = {
  id: string;
  label: string;
  icon: any;
  color: string;
  bg: string;
  desc: string;
};

export const DIGITAL_ACTIONS: DigitalAction[] = [
  { id: 'show-real-world', label: 'Real-World Surprises',     icon: MapPin,        color: '#e8573a', bg: 'rgba(232,87,58,0.12)',   desc: 'Unforgettable physical moments' },
  { id: 'note',        label: 'Quick Emotional Note',         icon: MessageCircle, color: '#d4a574', bg: 'rgba(212,165,116,0.12)', desc: 'A heartfelt message right now' },
  { id: 'voice',       label: 'Voice Surprise',               icon: Mic,           color: '#c19466', bg: 'rgba(193,148,102,0.12)', desc: 'Your voice, their heart' },
  { id: 'video',       label: 'Video Memory',                 icon: Video,         color: '#e07b54', bg: 'rgba(224,123,84,0.12)',  desc: 'A cinematic moment' },
  { id: 'whatsapp',    label: 'WhatsApp Surprise',            icon: Send,          color: '#5a9e6f', bg: 'rgba(90,158,111,0.1)',   desc: 'Straight to their phone' },
  { id: 'email',       label: 'Email Surprise',               icon: Mail,          color: '#7a8ec4', bg: 'rgba(122,142,196,0.1)',  desc: 'A beautiful inbox moment' },
  { id: 'appreciate',  label: 'Appreciation Message',         icon: Sparkles,      color: '#c19466', bg: 'rgba(193,148,102,0.12)', desc: 'Tell them they matter' },
  { id: 'schedule',    label: 'Scheduled Delivery',           icon: Calendar,      color: '#c47e5a', bg: 'rgba(196,126,90,0.12)',  desc: 'Deliver at the perfect time' },
];

export type RealWorldExperience = {
  id: string;
  title: string;
  desc: string;
  image: string;
  timeline: string;
  budget: string;
  teamRole: string;
  priceRupees: number;
  category: 'keepsake' | 'personal' | 'grand';
  flowSteps?: string[];
};

export const REAL_WORLD_EXPERIENCES: RealWorldExperience[] = [
  {
    id: 'photo-frame',
    title: 'Photo Frame with Surprise',
    desc: 'Send a physical premium wooden photo frame containing a custom memory photo, paired with an emotional surprise message card.',
    image: '/images/photo_frame.png',
    timeline: 'Delivered in 2-4 days',
    budget: '₹224',
    priceRupees: 224,
    category: 'keepsake',
    teamRole: 'We print your custom photo on high-gloss archival paper, frame it in a premium wooden border, design your surprise message, and courier the package right to their doorstep.',
    flowSteps: [
      'Enter delivery date & upload your favorite photo in the form.',
      'We professionally print and fit your memory photo into a premium wooden frame.',
      'We design and print your surprise emotional message card with elegant calligraphy.',
      'The package is surprise-wrapped and dispatched via express courier to deliver on your requested date.'
    ]
  },
  {
    id: 'sketch-portrait',
    title: 'Custom Sketch Portrait',
    desc: 'A hand-drawn pencil/digital sketch of your favorite photo together, created by a professional local artist.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
    timeline: 'Requires 4 days notice',
    budget: '₹399',
    priceRupees: 399,
    category: 'keepsake',
    teamRole: 'Our network of local sketch artists hand-craft your portrait digitally or on canvas, package it securely, and deliver it with a customized gift tag.'
  },
  {
    id: 'blood-art',
    title: 'Blood Art & Fingerprints',
    desc: 'A custom symbolic canvas artwork combining beautiful fingerprint patterns and emotional blood-art calligraphy representing deep connection.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600',
    timeline: 'Requires 3 days notice',
    budget: '₹499',
    priceRupees: 499,
    category: 'keepsake',
    teamRole: 'We create a custom artistic canvas rendering of your combined fingerprint outlines styled with premium dark red organic ink calligraphy of your names/vows.'
  },
  {
    id: 'tattoos',
    title: 'Custom Temporary Tattoos',
    desc: 'A custom sheet of skin-safe, temporary tattoos designed using your shared symbols, nicknames, or inside joke icons.',
    image: 'https://images.unsplash.com/photo-1590247813693-5541f1c609fd?w=600',
    timeline: 'Requires 2 days notice',
    budget: '₹299',
    priceRupees: 299,
    category: 'keepsake',
    teamRole: 'Our graphics team designs custom silhouette art for your icons/symbols and prints a premium sheet of long-lasting temporary tattoos, shipped with instructions.'
  },
  {
    id: 'singer',
    title: 'Live Singer Doorstep',
    desc: 'A professional local musician arrives at their doorstep or workplace to sing a custom acoustic set of songs that hold special meaning for you both.',
    image: '/images/music_surprise.png',
    timeline: 'Requires 3 days notice',
    budget: '₹1,499',
    priceRupees: 1499,
    category: 'personal',
    teamRole: 'We audition local talent, brief them on the emotional context, help select the perfect songs, and coordinate their arrival surprise.'
  },
  {
    id: 'cafe',
    title: 'Cafe Message & Song',
    desc: 'We coordinate with their favorite local cafe to serve them a customized coffee cup with your message, and play their favorite song when they walk in.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    timeline: 'Requires 3 days notice',
    budget: '₹799',
    priceRupees: 799,
    category: 'personal',
    teamRole: 'We coordinate with the baristas to execute the custom cup, queue their special song on the cafe speakers, and hand over a secret letter.'
  },
  {
    id: 'wall',
    title: 'Personalized Memory Wall',
    desc: 'A mini-art gallery style layout of 10-15 printed memories set up on easel stands in a cozy room or private space.',
    image: 'https://images.unsplash.com/photo-1507643179773-3e975d7ac515?w=800',
    timeline: 'Requires 5 days notice',
    budget: '₹1,199',
    priceRupees: 1199,
    category: 'personal',
    teamRole: 'We print museum-quality copies of your memories, source mini-easel displays, and set them up with delicate fairy lighting in their room or venue.'
  },
  {
    id: 'cinema',
    title: 'Cinema Theater Surprise',
    desc: 'Project your emotional message or memory video on the big screen right before their movie starts in a local multiplex.',
    image: '/images/cinema_surprise.png',
    timeline: 'Requires 5 days notice',
    budget: '₹4,999',
    priceRupees: 4999,
    category: 'grand',
    teamRole: 'We coordinate with local theater multiplex management, format your videos/messages for the theater projector, and time the surprise perfectly with the showtime.'
  },
  {
    id: 'led',
    title: 'Public LED Screen Message',
    desc: 'Display a massive, beautifully animated billboard message on a busy highway or commercial hub they pass through.',
    image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800',
    timeline: 'Requires 7 days notice',
    budget: '₹7,499',
    priceRupees: 7499,
    category: 'grand',
    teamRole: 'We secure premium digital billboard slots, design clean high-impact typography, and ensure the message runs exactly during their commute schedule.'
  },
  {
    id: 'room',
    title: 'Room Decoration Surprise',
    desc: 'A full romantic or celebratory room makeover with LED string lights, customized photo balloons, and fresh flowers while they are away.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
    timeline: 'Requires 2 days notice',
    budget: '₹2,499',
    priceRupees: 2499,
    category: 'grand',
    teamRole: 'We coordinate setup with decorators or trusted helpers, providing premium metallic helium balloons, custom hanging photostrips, and warm fairy lights.'
  }
];
