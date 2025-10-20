// src/components/layout/header/SearchBar.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        startTransition(() => {
            router.push(`/products?search=${encodeURIComponent(query)}`);
        });
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full">
            <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Търси продукти..."
                className={cn(
                    "w-full h-10 pl-4 pr-10 rounded-lg border border-gray-200",
                    "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent",
                    "transition-all duration-200",
                    isPending && "opacity-50 cursor-wait"
                )}
            />
            <button
                type="submit"
                disabled={isPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </form>
    );
}