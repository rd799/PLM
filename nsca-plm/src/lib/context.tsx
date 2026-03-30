'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lang, t } from '@/i18n/translations';

type Theme = 'dark' | 'light';

interface AppContextType {
  theme: Theme;
  lang: Lang;
  toggleTheme: () => void;
  toggleLang: () => void;
  T: (key: string) => string;
}

const AppContext = createContext<AppContextType>({
  theme: 'dark',
  lang: 'vi',
  toggleTheme: () => {},
  toggleLang: () => {},
  T: (key: string) => key,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Lang>('vi');

  useEffect(() => {
    const savedTheme = localStorage.getItem('plm_theme') as Theme;
    const savedLang = localStorage.getItem('plm_lang') as Lang;
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('plm_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('plm_lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(prev => prev === 'vi' ? 'en' : 'vi');
  const T = (key: string) => t[key]?.[lang] || key;

  return (
    <AppContext.Provider value={{ theme, lang, toggleTheme, toggleLang, T }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
