// src/components/products/Pagination.tsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PaginationMeta } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface PaginationProps {
    pagination: PaginationMeta;
}

export default function Pagination({ pagination }: PaginationProps) {
    const searchParams = useSearchParams();
    const { t } = useLanguage();
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
        <nav className="flex items-center justify-center gap-1.5 md:gap-2 flex-wrap">
            {/* Previous */}
            {current_page > 1 && (
                <Link
                    href={createPageUrl(current_page - 1)}
                    className="px-4 py-2.5 md:py-2 bg-gray-900 text-white text-xs md:text-sm font-light hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 min-h-[44px] md:min-h-[auto] flex items-center justify-center touch-manipulation border-2 border-gray-900"
                >
                    ← {t('common.previous')}
                </Link>
            )}

            {/* Page Numbers */}
            <div className="flex gap-1 md:gap-2">
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-2 md:px-4 py-2 text-gray-500 text-xs md:text-sm">
                                ...
                            </span>
                        );
                    }

                    const isActive = page === current_page;
                    return (
                        <Link
                            key={page}
                            href={createPageUrl(page as number)}
                            className={`px-3 md:px-4 py-2 text-xs md:text-sm font-light transition-all duration-300 min-h-[44px] md:min-h-[auto] flex items-center justify-center touch-manipulation ${
                                isActive
                                    ? 'bg-gray-900 text-white border-2 border-gray-900'
                                    : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100'
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
                    className="px-4 py-2.5 md:py-2 bg-gray-900 text-white text-xs md:text-sm font-light hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 min-h-[44px] md:min-h-[auto] flex items-center justify-center touch-manipulation border-2 border-gray-900"
                >
                    {t('common.next')} →
                </Link>
            )}
        </nav>
    );
}