'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import SearchBar from './SearchBar';
import CartButton from './CartButton';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// ============================
// HEADER COMPONENT
// ============================
export default function Header() {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // ✅ Функция за зареждане на потребителя
    const loadUser = () => {
        startTransition(async () => {
            try {
                const res = await fetch('/api/auth/me', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user ?? null);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            }
        });
    };

    // ✅ Взимаме текущия потребител при mount
    useEffect(() => {
        loadUser();
    }, []);

    // ✅ Слушаме за промени в localStorage (когато се логне потребителят)
    useEffect(() => {
        const handleStorageChange = () => {
            loadUser();
        };

        // Слушаме за промени в localStorage
        window.addEventListener('storage', handleStorageChange);
        
        // Слушаме за custom event за login/register
        window.addEventListener('auth-state-change', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-state-change', handleStorageChange);
        };
    }, []);

    // ✅ Проверяваме на интервал (fallback за когато потребителят се логне в друг таб)
    // Но само ако няма user (за да не правиме ненужни заявки)
    useEffect(() => {
        if (user) return; // Не проверяваме ако вече имаме user
        
        const interval = setInterval(() => {
            loadUser();
        }, 10000); // Проверяваме всеки 10 секунди само ако няма user

        return () => clearInterval(interval);
    }, [user]);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container px-3 md:px-4 lg:px-6">
                {/* Main Header Row */}
                <div className="flex h-14 md:h-16 lg:h-20 items-center justify-between gap-1.5 md:gap-2 lg:gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4 xl:mx-8">
                        <Suspense fallback={<SearchBarSkeleton />}>
                            <SearchBar />
                        </Suspense>
                    </div>

                    {/* Actions */}
                    <nav className="flex items-center gap-1 md:gap-2 lg:gap-4">
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                            aria-label="Search"
                        >
                            <SearchIcon />
                        </button>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                            aria-label="Wishlist"
                        >
                            <HeartIcon />
                        </Link>

                        {/* Account / Auth */}
                        <AuthDropdown user={user} onUserChange={loadUser} />

                        {/* 🌍 Language Switcher */}
                        <LanguageDropdown />

                        {/* 🛒 Cart */}
                        <Suspense fallback={<CartButtonSkeleton />}>
                            <CartButton />
                        </Suspense>
                    </nav>
                </div>

                {/* Mobile Search Bar */}
                {mobileSearchOpen && (
                    <div className="md:hidden pb-3 px-3 animate-in slide-in-from-top-2">
                        <Suspense fallback={<SearchBarSkeleton />}>
                            <SearchBar onSearch={() => setMobileSearchOpen(false)} />
                        </Suspense>
                    </div>
                )}
            </div>
        </header>
    );
}

// ============================
// AUTH DROPDOWN COMPONENT
// ============================
function AuthDropdown({ user, onUserChange }: { user: any; onUserChange?: () => void }) {
    const { t } = useLanguage();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        try { localStorage.removeItem('auth_token'); } catch {}
        // Dispatch event за да се обновят другите компоненти
        window.dispatchEvent(new Event('auth-state-change'));
        if (onUserChange) onUserChange();
        router.push("/");
        router.refresh();
        setOpen(false);
    };

    // Ако потребителят е влязъл, иконката води директно до account
    if (user) {
        return (
            <Link
                href="/account"
                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors relative"
                aria-label={t('auth.account')}
                title={t('auth.account')}
            >
                <UserIcon />
            </Link>
        );
    }

    // Ако потребителят не е влязъл, показваме dropdown с login/register
    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={t('auth.login')}
            >
                <UserIcon />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-48 py-1 z-50 animate-in fade-in-0 zoom-in-95">
                    <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 text-gray-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        {t('auth.login')}
                    </Link>
                    <Link
                        href="/register"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 text-gray-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        {t('auth.register')}
                    </Link>
                </div>
            )}

            {/* Click outside to close */}
            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                />
            )}
        </div>
    );
}

// ============================
// LANGUAGE DROPDOWN COMPONENT
// ============================
function LanguageDropdown() {
    const { lang, setLang } = useLanguage();
    const [open, setOpen] = useState(false);

    const languages = [
        { code: 'bg', label: 'Български', flag: '🇧🇬' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Change language"
            >
                <Globe className="w-5 h-5 text-gray-600" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-36 py-1 z-50 animate-in fade-in-0 zoom-in-95">
                    {languages.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => {
                                setLang(l.code);
                                setOpen(false);
                            }}
                            className={`flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm ${
                                l.code === lang
                                    ? 'bg-gray-900 text-white font-semibold'
                                    : 'hover:bg-gray-100 text-gray-800'
                            }`}
                        >
                            <span>{l.flag}</span>
                            {l.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================
// ICONS & SKELETONS
// ============================
function SearchIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}
function HeartIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );
}
function UserIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}
function SearchBarSkeleton() {
    return <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />;
}
function CartButtonSkeleton() {
    return <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse" />;
}
