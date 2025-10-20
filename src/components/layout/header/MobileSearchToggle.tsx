// src/components/layout/header/MobileSearchToggle.tsx
'use client';

import { useState, Suspense } from 'react';
import SearchBar from './SearchBar';

export default function MobileSearchToggle() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Search Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search"
                aria-expanded={isOpen}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            {/* Mobile Search Bar - Expandable */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b px-4 py-4 animate-in slide-in-from-top-2 shadow-lg">
                    <Suspense fallback={<SearchBarSkeleton />}>
                        <SearchBar onClose={() => setIsOpen(false)} />
                    </Suspense>
                </div>
            )}
        </>
    );
}

function SearchBarSkeleton() {
    return (
        <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" />
    );
}