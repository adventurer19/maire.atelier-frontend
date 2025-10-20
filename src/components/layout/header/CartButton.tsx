// src/components/layout/header/CartButton.tsx
'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CartButton() {
    const { itemCount, isLoading } = useCart();

    return (
        <Link
            href="/cart"
            className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={`Shopping cart with ${itemCount} items`}
        >
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
            </svg>

            {/* Loading indicator */}
            {isLoading && (
                <span className="absolute -top-1 -right-1 w-5 h-5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75 animate-ping"></span>
        </span>
            )}

            {/* Item count badge */}
            {!isLoading && itemCount > 0 && (
                <span
                    className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-medium rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center animate-in zoom-in duration-200"
                    aria-label={`${itemCount} items in cart`}
                >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
            )}
        </Link>
    );
}