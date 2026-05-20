import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin } from 'lucide-react';
import { DIGITAL_ACTIONS, REAL_WORLD_EXPERIENCES, DigitalAction, RealWorldExperience } from '../../lib/experienceData';
import { ExperienceModal } from './ExperienceModal';

export function EmotionalExperiences() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: DigitalAction | RealWorldExperience | null;
    type: 'digital' | 'real-world' | 'list-real-world' | null;
  }>({ isOpen: false, action: null, type: null });

  return (
    <section>
      <div className="mb-10 text-center md:text-left">
        <h2 className="font-normal text-3xl mb-3 text-[#2d2520]">Emotional Experiences</h2>
        <p className="font-light text-sm max-w-2xl text-[#8a7968]" style={{ lineHeight: 1.8 }}>
          A collection of digital tools and unforgettable real-world experiences designed to help you emotionally reach loved ones across any distance.
        </p>
      </div>

      {/* Digital Actions */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-5 h-5 text-[#d4a574]" />
          <h3 className="font-normal text-xl text-[#2d2520]">Digital Emotional Actions</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {DIGITAL_ACTIONS.map((a, i) => (
            <motion.button key={a.id}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, border: '1px solid rgba(212,165,116,0.3)', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalState({ isOpen: true, action: a, type: a.id === 'show-real-world' ? 'list-real-world' : 'digital' })}
              className="flex flex-col items-start p-5 rounded-3xl text-left transition-all cursor-pointer group"
              style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: a.bg }}>
                <a.icon className="w-5 h-5" style={{ color: a.color }} />
              </div>
              <p className="font-medium text-sm leading-snug mb-1.5 text-[#2d2520]">{a.label}</p>
              <p className="font-light text-xs leading-relaxed text-[#8a7968]">{a.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Real-World Experiences are now accessed exclusively via the Digital Action button */}

      <ExperienceModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState({ ...modalState, isOpen: false })} 
        action={modalState.action} 
        type={modalState.type} 
      />
    </section>
  );
}
