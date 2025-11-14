// src/components/products/ActiveFilters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/lib/api/categories';
import { useLanguage } from '@/context/LanguageContext';

interface ActiveFiltersProps {
    categories: Category[];
}

export default function ActiveFilters({ categories }: ActiveFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, lang } = useLanguage();

    const category = searchParams.get('category');
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    const inStock = searchParams.get('in_stock');
    const sort = searchParams.get('sort');

    // Check if any filters are active
    const hasFilters = category || priceMin || priceMax || inStock;

    if (!hasFilters) return null;

    const removeFilter = (filterKey: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(filterKey);
        params.delete('page'); // Reset to first page
        router.push(`/products?${params.toString()}`);
    };

    const removePriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('price_min');
        params.delete('price_max');
        params.delete('page');
        router.push(`/products?${params.toString()}`);
    };

    const clearAllFilters = () => {
        const params = new URLSearchParams();
        if (sort) params.set('sort', sort); // Keep sort option
        router.push(`/products?${params.toString()}`);
    };

    const getCategoryName = (slug: string) => {
        const cat = categories.find(c => c.slug === slug);
        if (!cat) return slug;
        return typeof cat.name === 'string' ? cat.name : cat.name?.[lang] || cat.name?.bg || cat.name?.en;
    };

    return (
        <div className="mb-5">
            <div className="flex flex-wrap items-center gap-2.5 bg-gray-50 rounded-xl border border-gray-100 px-4 py-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mr-1">{t('filters.active') || 'Активни филтри'}</span>

                {category && (
                    <button
                        onClick={() => removeFilter('category')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 border border-gray-200 shadow-sm"
                    >
                        <span>{getCategoryName(category)}</span>
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {(priceMin || priceMax) && (
                    <button
                        onClick={removePriceFilter}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 border border-gray-200 shadow-sm"
                    >
                        <span>{t('filters.price') || 'Цена'}: {priceMin || '0'} - {priceMax || '∞'}</span>
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {inStock === '1' && (
                    <button
                        onClick={() => removeFilter('in_stock')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 border border-gray-200 shadow-sm"
                    >
                        <span>{t('filters.only_in_stock') || 'В наличност'}</span>
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {hasFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="ml-auto text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-white active:bg-gray-50"
                    >
                        {t('filters.clear_all') || 'Изчисти всички'}
                    </button>
                )}
            </div>
        </div>
    );
}