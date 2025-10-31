// src/lib/getTranslations.ts
import { cookies, headers } from 'next/headers';
import bg from '@/locales/bg';
import en from '@/locales/en';

type Language = 'bg' | 'en';
type Translations = typeof bg;

const translations: Record<Language, Translations> = { bg, en };

/**
 * Get translations function for server components
 * Reads language from cookies, Accept-Language header, or defaults to 'bg'
 */
export async function getTranslations() {
    let lang: Language = 'bg';

    try {
        // Try to get from cookie first
        const cookieStore = await cookies();
        const langCookie = cookieStore.get('lang');
        if (langCookie?.value === 'en' || langCookie?.value === 'bg') {
            lang = langCookie.value as Language;
        } else {
            // Fallback to Accept-Language header
            const headersList = await headers();
            const acceptLanguage = headersList.get('accept-language');
            if (acceptLanguage?.startsWith('en')) {
                lang = 'en';
            }
        }
    } catch (error) {
        // If cookies/headers fail, default to 'bg'
        console.warn('Failed to read language preference, defaulting to bg:', error);
        lang = 'bg';
    }

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

    return t;
}

