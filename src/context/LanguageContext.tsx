import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationKey } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nearyou_language') as Language;
      if (stored && (stored === 'en' || stored === 'te')) {
        setLanguageState(stored);
      }
    } catch (e) {
      console.warn('Could not read language preference', e);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('nearyou_language', lang);
    } catch (e) {
      // ignore
    }
  };

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let obj: any = translations[language];
    for (const k of keys) {
      if (obj && obj[k]) {
        obj = obj[k];
      } else {
        return key; // fallback to key
      }
    }
    return obj as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
