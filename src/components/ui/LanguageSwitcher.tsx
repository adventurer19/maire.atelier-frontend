'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState, useTransition } from 'react';

const languages = [
    { code: 'bg', label: 'BG' },
    { code: 'en', label: 'EN' },
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const switchLanguage = (lang: string) => {
        if (lang === locale) return;
        const segments = pathname.split('/');
        segments[1] = lang;
        startTransition(() => router.push(segments.join('/')));
        setOpen(false);
    };

    return (
        <div className="relative">
            {/* Бутонът с иконка */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Change language"
            >
                <Globe className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dropdown меню */}
            {open && (
                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-28 py-1 z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => switchLanguage(lang.code)}
                            disabled={isPending}
                            className={`block w-full text-left px-3 py-1.5 text-sm ${
                                lang.code === locale
                                    ? 'bg-gray-900 text-white font-semibold'
                                    : 'hover:bg-gray-100 text-gray-800'
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
