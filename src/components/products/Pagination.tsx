// src/components/products/Pagination.tsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PaginationMeta } from '@/types';

interface PaginationProps {
    pagination: PaginationMeta;
}

export default function Pagination({ pagination }: PaginationProps) {
    const searchParams = useSearchParams();
    const { current_page, last_page } = pagination;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        return `/products?${params.toString()}`;
    };

    const pages = [];
    for (let i = 1; i <= last_page; i++) {
        if (
            i === 1 ||
            i === last_page ||
            (i >= current_page - 1 && i <= current_page + 1)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }

    return (
        <nav className="flex items-center justify-center gap-2">
            {/* Previous */}
            {current_page > 1 && (
                <Link
                    href={createPageUrl(current_page - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    ← Предишна
                </Link>
            )}

            {/* Page Numbers */}
            <div className="flex gap-2">
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-500">
                ...
              </span>
                        );
                    }

                    const isActive = page === current_page;
                    return (
                        <Link
                            key={page}
                            href={createPageUrl(page as number)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-gray-900 text-white'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            {/* Next */}
            {current_page < last_page && (
                <Link
                    href={createPageUrl(current_page + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Следваща →
                </Link>
            )}
        </nav>
    );
}