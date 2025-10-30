'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import SearchBar from './SearchBar';
import CartButton from './CartButton';
import LogoutButton from '@/components/auth/LogoutButton';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// ============================
// HEADER COMPONENT
// ============================
export default function Header() {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isPending, startTransition] = useTransition();

    // ✅ Взимаме текущия потребител
    useEffect(() => {
        startTransition(async () => {
            try {
                const res = await fetch('/api/auth/me', { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user ?? null);
                }
            } catch {
                setUser(null);
            }
        });
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container">
                {/* Main Header Row */}
                <div className="flex h-16 md:h-20 items-center justify-between gap-2 md:gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
                        <Suspense fallback={<SearchBarSkeleton />}>
                            <SearchBar />
                        </Suspense>
                    </div>

                    {/* Actions */}
                    <nav className="flex items-center gap-2 md:gap-4">
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Search"
                        >
                            <SearchIcon />
                        </button>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Wishlist"
                        >
                            <HeartIcon />
                        </Link>

                        {/* Account / Auth */}
                        {user ? (
                            <>
                <span className="hidden sm:flex text-sm text-gray-700">
                  Hi, {user.name}
                </span>
                                <LogoutButton />
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Login"
                            >
                                <UserIcon />
                            </Link>
                        )}

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
                    <div className="md:hidden pb-4 animate-in slide-in-from-top-2">
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
