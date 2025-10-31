import Link from 'next/link';
import { FC } from 'react';
import { useLanguage } from '@/context/LanguageContext';

/**
 * Универсален компонент за празно състояние (empty state)
 * Използвай го на страници без резултати — категории, продукти и т.н.
 */

interface EmptyStateProps {
    title?: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({
                                                    title,
                                                    description,
                                                    actionLabel,
                                                    actionHref = '/',
                                                }) => {
    const { t } = useLanguage();
    const finalTitle = title ?? t('productsPage.empty_title');
    const finalDesc = description ?? t('productsPage.empty_desc');
    const finalAction = actionLabel ?? t('common.go_home');
    return (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            {/* Иконка */}
            <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
            </svg>

            {/* Заглавие */}
            <h3 className="text-lg font-medium text-gray-900 mb-2">{finalTitle}</h3>

            {/* Описание */}
            <p className="text-gray-500 mb-6">{finalDesc}</p>

            {/* CTA бутон */}
            <Link
                href={actionHref}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
                {finalAction}
            </Link>
        </div>
    );
};
