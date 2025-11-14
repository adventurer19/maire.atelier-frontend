'use client';

import { useState, useEffect, useTransition, Suspense, useCallback } from 'react';
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

    // ✅ Функция за зареждане на потребителя (memoized to prevent recreations)
    const loadUser = useCallback(() => {
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
    }, []); // Empty deps - function doesn't depend on any props/state

    // ✅ Взимаме текущия потребител при mount
    useEffect(() => {
        loadUser();
    }, [loadUser]);

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
    }, [loadUser]);

    // ✅ Проверяваме на интервал (fallback за когато потребителят се логне в друг таб)
    // Но само ако няма user и само веднъж на минута (намалено от 10 секунди)
    useEffect(() => {
        if (user) return; // Не проверяваме ако вече имаме user
        
        // Increase interval to 60 seconds to reduce API calls
        const interval = setInterval(() => {
            loadUser();
        }, 60000); // Проверяваме всеки 60 секунди само ако няма user

        return () => clearInterval(interval);
    }, [user, loadUser]);

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

    // Ако потребителят е влязъл, показваме dropdown с опции
    if (user) {
        return (
            <div className="relative">
                <button
                    onClick={() => setOpen((o) => !o)}
                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors relative"
                aria-label={t('auth.account')}
                title={t('auth.account')}
            >
                <UserIcon />
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg w-56 py-2 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-light text-gray-900 truncate">
                                {typeof user.name === 'string' ? user.name : user.name?.bg || user.name?.en || user.email}
                            </p>
                            <p className="text-xs font-light text-gray-600 truncate mt-1">
                                {user.email}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <Link
                            href="/account"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-light hover:bg-gray-50 text-gray-900 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            {t('auth.account')}
                        </Link>
                        <Link
                            href="/account/settings"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-light hover:bg-gray-50 text-gray-900 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            {t('auth.edit_profile')}
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-light hover:bg-gray-50 text-gray-900 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            {t('auth.logout')}
                        </button>
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
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg w-48 py-2 z-50">
                    <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-light hover:bg-gray-50 text-gray-900 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        {t('auth.login')}
                    </Link>
                    <Link
                        href="/register"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-light hover:bg-gray-50 text-gray-900 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
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
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg w-44 py-2 z-50">
                    {languages.map((l) => (
                        <button
                            key={l.code}
                            onClick={() => {
                                setLang(l.code);
                                setOpen(false);
                            }}
                            className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-light transition-colors ${
                                l.code === lang
                                    ? 'bg-gray-50 text-gray-900 border-l-2 border-gray-400'
                                    : 'hover:bg-gray-50 text-gray-900'
                            }`}
                        >
                            <span className="text-base">{l.flag}</span>
                            <span className="flex-1">{l.label}</span>
                            {l.code === lang && (
                                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
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
