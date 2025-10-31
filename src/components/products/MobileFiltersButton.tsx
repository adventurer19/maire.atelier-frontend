// src/components/products/MobileFiltersButton.tsx
'use client';

import { useState, useEffect } from 'react';
import ProductFilters from './ProductFilters';
import type { Category } from '@/lib/api/categories';
import { useLanguage } from '@/context/LanguageContext';

interface MobileFiltersButtonProps {
    categories: Category[];
    currentCategory?: string;
}

export default function MobileFiltersButton({ categories, currentCategory }: MobileFiltersButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Filters Button - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>{t('filters.title') || 'Филтри'}</span>
            </button>

            {/* Filters Modal */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Modal Content */}
                    <div
                        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max_h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300"
                        role="dialog"
                        aria-modal="true"
                        aria-label={t('filters.title') || 'Филтри за продукти'}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between z-10">
                            <h2 className="text-lg font-semibold text-gray-900">{t('filters.title') || 'Филтри'}</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 -mr-2 text-gray-500 hover:text-gray-900 rounded-md transition-colors"
                                aria-label={t('common.close') || 'Затвори'}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Filters Content - Scrollable */}
                        <div className="overflow-y-auto p-4 pb-24" style={{ maxHeight: 'calc(85vh - 140px)' }}>
                            <ProductFilters
                                categories={categories}
                                currentCategory={currentCategory}
                            />
                        </div>

                        {/* Footer - Apply Button */}
                        <div className="sticky bottom-0 bg-white border-t px-4 py-4 shadow-lg">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                {t('filters.apply') || 'Приложи филтри'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}