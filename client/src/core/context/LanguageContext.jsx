// core/context/LanguageContext.jsx — i18n Provider (Arabic / French)
import { createContext, useContext, useState, useCallback } from 'react';
import ar from '../../locales/ar.json';
import fr from '../../locales/fr.json';

const LOCALES = { ar, fr };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('pulmo-lang') || 'ar';
  });

  const switchLang = useCallback((newLang) => {
    setLang(newLang);
    localStorage.setItem('pulmo-lang', newLang);
    // Update HTML dir and lang attributes
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  }, []);

  // t(key) — dot-notation access e.g. t('nav.home')
  const t = useCallback((key) => {
    const parts = key.split('.');
    let val = LOCALES[lang];
    for (const p of parts) {
      val = val?.[p];
    }
    return val ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
