// src/lib/getCurrentLang.ts
/**
 * Get current language preference
 * - On client: reads from localStorage (set by LanguageContext)
 * - On server: reads from cookies (set by LanguageContext via document.cookie)
 * 
 * This is used for API requests to ensure correct language is sent to backend
 */

type Language = 'bg' | 'en';

/**
 * Get current language (client-side only)
 * Reads from localStorage where LanguageContext stores it
 */
export function getCurrentLang(): Language {
    if (typeof window === 'undefined') {
        // Server-side: default to 'bg'
        // Note: For server-side API calls, the Accept-Language header should be set
        // by reading from cookies in the server component
        return 'bg';
    }
    
    const lang = localStorage.getItem('lang');
    return (lang === 'bg' || lang === 'en') ? lang : 'bg';
}

/**
 * Get current language from cookies (for server-side usage)
 * This should be used in server components that need to make API calls
 */
export async function getCurrentLangFromCookies(): Promise<Language> {
    if (typeof window !== 'undefined') {
        // Client-side: use localStorage instead
        return getCurrentLang();
    }
    
    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const langCookie = cookieStore.get('lang');
        
        if (langCookie?.value === 'en' || langCookie?.value === 'bg') {
            return langCookie.value as Language;
        }
    } catch (error) {
        // If cookies() fails, default to 'bg'
        console.warn('Failed to read lang cookie, defaulting to bg:', error);
    }
    
    return 'bg';
}

