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
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    {t('common.previous')}
                </a>
            )}

            <span className="px-4 py-2 text-gray-700">
                {t('common.page_of', { current: String(current_page), last: String(last_page) })}
            </span>

            {current_page < last_page && (
                <a
                    href={`?page=${current_page + 1}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    {t('common.next')}
                </a>
            )}
        </div>
    );
}


