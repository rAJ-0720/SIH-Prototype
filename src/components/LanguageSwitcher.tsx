import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { languages, type LangCode } from '@/i18n';
import { useLanguage } from '@/language-context';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = languages.find(l => l.code === lang) ?? languages[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 transition-colors"
      >
        <Globe className="w-4.5 h-4.5 text-stone-600" />
        <span className="text-sm font-medium text-stone-700 hidden sm:inline">{current.nativeName}</span>
        <span className="text-base sm:hidden">{current.flag}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-card-hover border border-stone-200 py-2 z-50 max-h-80 overflow-y-auto scrollbar-hide animate-scale-in">
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code as LangCode); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50 transition-colors text-left ${
                lang === l.code ? 'bg-primary-50' : ''
              }`}
            >
              <span className="text-lg">{l.flag}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${lang === l.code ? 'text-primary-700' : 'text-stone-700'}`}>{l.nativeName}</p>
                <p className="text-[11px] text-stone-400">{l.name}</p>
              </div>
              {lang === l.code && <Check className="w-4 h-4 text-primary-600" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
