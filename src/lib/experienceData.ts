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
  { id: 'note',        label: 'Quick Emotional Note',         icon: MessageCircle, color: '#d4a574', bg: 'rgba(212,165,116,0.12)', desc: 'A heartfelt message right now' },
  { id: 'voice',       label: 'Voice Surprise',               icon: Mic,           color: '#c19466', bg: 'rgba(193,148,102,0.12)', desc: 'Your voice, their heart' },
  { id: 'video',       label: 'Video Memory',                 icon: Video,         color: '#e07b54', bg: 'rgba(224,123,84,0.12)',  desc: 'A cinematic moment' },
  { id: 'whatsapp',    label: 'WhatsApp Surprise',            icon: Send,          color: '#5a9e6f', bg: 'rgba(90,158,111,0.1)',   desc: 'Straight to their phone' },
  { id: 'email',       label: 'Email Surprise',               icon: Mail,          color: '#7a8ec4', bg: 'rgba(122,142,196,0.1)',  desc: 'A beautiful inbox moment' },
  { id: 'appreciate',  label: 'Appreciation Message',         icon: Sparkles,      color: '#c19466', bg: 'rgba(193,148,102,0.12)', desc: 'Tell them they matter' },
  { id: 'show-real-world', label: 'Real-World Surprises',     icon: MapPin,        color: '#c19466', bg: 'rgba(193,148,102,0.12)', desc: 'Unforgettable physical moments' },
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
};

export const REAL_WORLD_EXPERIENCES: RealWorldExperience[] = [
  {
    id: 'cinema',
    title: 'Cinema Theater Surprise',
    desc: 'Project your emotional message or memory video on the big screen right before their movie starts.',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800',
    timeline: 'Requires 3-5 days notice',
    budget: '$150 - $400',
    teamRole: 'We coordinate with local theater management, handle media formatting, and time the surprise perfectly with the projectionist.'
  },
  {
    id: 'led',
    title: 'Public LED Screen Message',
    desc: 'Light up their city. Display a massive, beautifully designed emotional message on a digital billboard they drive by.',
    image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800',
    timeline: 'Requires 7 days notice',
    budget: '$300 - $1000+',
    teamRole: 'We secure ad slots, design the cinematic typography, and ensure optimal timing for when they pass by.'
  },
  {
    id: 'room',
    title: 'Room Decoration Surprise',
    desc: 'Transform their living space into an immersive memory lane with polaroids, warm lighting, and flowers.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
    timeline: 'Requires 2 days notice',
    budget: '$100 - $250',
    teamRole: 'We partner with local decorators or roommates/family to set up the space secretly while they are out.'
  },
  {
    id: 'flashmob',
    title: 'Flash Mob Experience',
    desc: 'A cinematic, highly choreographed public surprise to their favorite song in the middle of their day.',
    image: 'https://images.unsplash.com/photo-1533147670608-2a2f9775d3a4?w=800',
    timeline: 'Requires 14 days notice',
    budget: '$500 - $1500',
    teamRole: 'We hire local dancers, manage choreography, secure public permits, and capture the whole moment on video.'
  },
  {
    id: 'proposal',
    title: 'Proposal Setup',
    desc: 'The ultimate emotional moment, meticulously planned. You just have to bring the ring and the words.',
    image: 'https://images.unsplash.com/photo-1518104593124-ac2e82a5eb9b?w=800',
    timeline: 'Requires 14-30 days notice',
    budget: '$500 - $2000+',
    teamRole: 'We handle location scouting, floral arrangements, hidden photography, and a seamless emotional timeline.'
  },
  {
    id: 'cafe',
    title: 'Cafe Surprise',
    desc: 'Their regular coffee run turns into a memory. A custom cup, a live musician, or a hidden message from you.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    timeline: 'Requires 3 days notice',
    budget: '$50 - $150',
    teamRole: 'We coordinate with the baristas and cafe owner to execute the surprise flawlessly during their daily routine.'
  },
  {
    id: 'airport',
    title: 'Airport Welcome Surprise',
    desc: 'Turn a tiring flight into an emotional homecoming with a coordinated family/friends welcome and beautiful signage.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    timeline: 'Requires 5 days notice',
    budget: '$100 - $300',
    teamRole: 'We organize the contributors, design premium welcome boards, and track flight delays to ensure perfect timing.'
  },
  {
    id: 'radio',
    title: 'Radio Message',
    desc: 'A heartfelt message and their favorite song played on their favorite local radio station during their commute.',
    image: 'https://images.unsplash.com/photo-1588661601614-2394c8e7fb2a?w=800',
    timeline: 'Requires 7 days notice',
    budget: '$100 - $400',
    teamRole: 'We negotiate with radio producers to secure a prime time slot and ensure your message is read beautifully.'
  },
  {
    id: 'singer',
    title: 'Live Singer Surprise',
    desc: 'A talented local musician shows up at their door or workplace to sing a song that means the world to you both.',
    image: 'https://images.unsplash.com/photo-1516280440502-a27170a75f3a?w=800',
    timeline: 'Requires 5 days notice',
    budget: '$150 - $350',
    teamRole: 'We audition local talent, brief them on the emotional context, and coordinate their arrival.'
  },
  {
    id: 'prank',
    title: 'Emotional Prank Surprise',
    desc: 'Start with a mild, harmless annoyance that suddenly reveals itself to be a massive outpouring of love and memories.',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800',
    timeline: 'Requires 10 days notice',
    budget: '$200 - $600',
    teamRole: 'We script the scenario, hire actors if necessary, and ensure the reveal is caught on camera without stressing the receiver.'
  },
  {
    id: 'photographer',
    title: 'Hidden Photographer Surprise',
    desc: 'We arrange a beautiful moment (like a picnic) while a hidden photographer captures their genuine emotional reactions.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    timeline: 'Requires 7 days notice',
    budget: '$250 - $600',
    teamRole: 'We book premium lifestyle photographers, plan the hiding spots, and deliver beautifully edited high-res galleries.'
  },
  {
    id: 'wall',
    title: 'Emotional Memory Wall',
    desc: 'An art gallery style installation of your best memories together, set up in a public or private space for them to discover.',
    image: 'https://images.unsplash.com/photo-1507643179773-3e975d7ac515?w=800',
    timeline: 'Requires 7 days notice',
    budget: '$150 - $500',
    teamRole: 'We print museum-quality photos, source easels or frames, and set up the installation perfectly before they arrive.'
  }
];
