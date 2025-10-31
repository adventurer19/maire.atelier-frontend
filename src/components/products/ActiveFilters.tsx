// src/components/products/ActiveFilters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/lib/api/categories';

interface ActiveFiltersProps {
    categories: Category[];
}

export default function ActiveFilters({ categories }: ActiveFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

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
        return typeof cat.name === 'string' ? cat.name : cat.name.bg || cat.name.en;
    };

    return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Активни филтри:</span>

            {category && (
                <button
                    onClick={() => removeFilter('category')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                >
                    <span>{getCategoryName(category)}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {(priceMin || priceMax) && (
                <button
                    onClick={removePriceFilter}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                >
                    <span>Цена: {priceMin || '0'} - {priceMax || '∞'} лв</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {inStock === '1' && (
                <button
                    onClick={() => removeFilter('in_stock')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                >
                    <span>В наличност</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {hasFilters && (
                <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 underline ml-2 transition-colors"
                >
                    Изчисти всички
                </button>
            )}
        </div>
    );
}