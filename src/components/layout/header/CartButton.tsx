// src/components/layout/header/CartButton.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartButton() {
    const [itemCount, setItemCount] = useState(0);

    // Later: Replace with real cart state (Zustand/Context)
    useEffect(() => {
        // Fetch cart count from localStorage or API
        const count = 0; // Placeholder
        setItemCount(count);
    }, []);

    return (
        <Link
            href="/cart"
            className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={`Shopping cart with ${itemCount} items`}
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>

            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-medium rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
            )}
        </Link>
    );
}