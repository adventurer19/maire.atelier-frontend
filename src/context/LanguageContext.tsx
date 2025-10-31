'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import bg from '@/locales/bg';
import en from '@/locales/en';

type Language = 'bg' | 'en';
type Translations = typeof bg;

interface LangContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (path: string, vars?: Record<string, any>) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

const translations: Record<Language, Translations> = { bg, en };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('bg');

    useEffect(() => {
        const saved = localStorage.getItem('lang');
        if (saved === 'bg' || saved === 'en') {
            setLangState(saved);
            // Also sync cookie
            document.cookie = `lang=${saved}; path=/; max-age=31536000; SameSite=Lax`;
        }
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('lang', newLang);
        // Also set cookie for server components
        document.cookie = `lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    };

    // 🧠 t() с поддръжка на nested ключове (product.in_stock)
    const t = (path: string, vars: Record<string, any> = {}): string => {
        const keys = path.split('.');
        let value: any = translations[lang];
        for (const key of keys) {
            value = value?.[key];
        }
        if (typeof value !== 'string') return path;

        // Подмяна на {{placeholders}}
        return value.replace(/\{\{(.*?)\}\}/g, (_, key) => vars[key.trim()] ?? '');
    };

    return (
        <LangContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LangContext);
    if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
    return ctx;
}
