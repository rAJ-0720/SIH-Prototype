import { createContext, useContext, useState, type ReactNode } from 'react';
import { type LangCode, t as translate, type TKey } from './i18n';

export type Role = 'artisan' | 'buyer';

interface LanguageContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  role: Role;
  setRole: (role: Role) => void;
  t: (key: TKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en');
  const [role, setRole] = useState<Role>('artisan');

  const t = (key: TKey) => translate(lang, key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, role, setRole, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
