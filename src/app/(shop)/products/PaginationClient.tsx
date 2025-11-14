'use client';

import { useLanguage } from '@/context/LanguageContext';

interface PaginationProps {
    current_page: number;
    last_page: number;
}

export default function PaginationClient({ current_page, last_page }: PaginationProps) {
    const { t } = useLanguage();
    return (
        <div className="flex items-center justify-center gap-2">
            {current_page > 1 && (
                <a
                    href={`?page=${current_page - 1}`}
                    className="px-4 py-2.5 md:py-2 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 min-h-[44px] md:min-h-[auto] flex items-center justify-center touch-manipulation border-2 border-gray-900"
                >
                    {t('common.previous')}
                </a>
            )}

            <span className="px-4 py-2 text-gray-700 font-light text-sm md:text-base">
                {t('common.page_of', { current: String(current_page), last: String(last_page) })}
            </span>

            {current_page < last_page && (
                <a
                    href={`?page=${current_page + 1}`}
                    className="px-4 py-2.5 md:py-2 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 min-h-[44px] md:min-h-[auto] flex items-center justify-center touch-manipulation border-2 border-gray-900"
                >
                    {t('common.next')}
                </a>
            )}
        </div>
    );
}


