// src/components/layout/header/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import SearchBar from './SearchBar';
import CartButton from './CartButton';
import { Suspense } from 'react';

export default function Header() {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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

                        {/* Wishlist - Hidden on smallest screens */}
                        <Link
                            href="/wishlist"
                            className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Wishlist"
                        >
                            <HeartIcon />
                        </Link>

                        {/* Account - Hidden on smallest screens */}
                        <Link
                            href="/account"
                            className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Account"
                        >
                            <UserIcon />
                        </Link>

                        {/* Cart - Always visible */}
                        <Suspense fallback={<CartButtonSkeleton />}>
                            <CartButton />
                        </Suspense>
                    </nav>
                </div>

                {/* Mobile Search Bar - Expandable */}
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

// Icons
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

// Skeleton components
function SearchBarSkeleton() {
    return (
        <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />
    );
}

function CartButtonSkeleton() {
    return (
        <div className="h-10 w-10 bg-gray-100 rounded-full animate-pulse" />
    );
}