'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/lib/api/categories';
import { useLanguage } from '@/context/LanguageContext';

interface ProductFiltersProps {
    categories: Category[];
    currentCategory?: string;
    variant?: 'default' | 'mobile';
    onPriceRangeChange?: (priceRange: { min: string; max: string }) => void;
}

export default function ProductFilters({ categories, currentCategory, variant = 'default', onPriceRangeChange }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, lang } = useLanguage();

    // Initialize price range from URL params
    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('price_min') || '',
        max: searchParams.get('price_max') || '',
    });

    const handleCategoryChange = (categorySlug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categorySlug) {
            params.set('category', categorySlug);
        } else {
            params.delete('category');
        }
        params.delete('page'); // Reset to first page when filtering
        router.push(`/products?${params.toString()}`);
    };

    const handlePriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (priceRange.min) {
            params.set('price_min', priceRange.min);
        } else {
            params.delete('price_min');
        }

        if (priceRange.max) {
            params.set('price_max', priceRange.max);
        } else {
            params.delete('price_max');
        }

        params.delete('page'); // Reset to first page
        router.push(`/products?${params.toString()}`);
    };

    const handleAvailabilityChange = (checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        if (checked) {
            params.set('in_stock', '1');
        } else {
            params.delete('in_stock');
        }
        params.delete('page');
        router.push(`/products?${params.toString()}`);
    };

    const clearFilters = () => {
        setPriceRange({ min: '', max: '' });
        router.push('/products');
    };

    const isMobile = variant === 'mobile';
    
    return (
        <div className={`bg-white ${isMobile ? '' : 'border border-gray-200 shadow-sm'} ${isMobile ? 'p-0' : 'p-4 md:p-6'}`}>
            {!isMobile && (
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-base md:text-lg font-light text-gray-900 tracking-tight">{t('filters.title') || 'Филтри'}</h2>
                    <button
                        onClick={clearFilters}
                        className="text-xs md:text-sm text-gray-600 hover:text-gray-900 active:text-gray-700 transition-colors touch-manipulation py-1 px-2"
                    >
                        {t('filters.clear') || 'Изчисти'}
                    </button>
                </div>
            )}
            
            {isMobile && (
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-500 hover:text-gray-900 active:text-gray-700 transition-colors touch-manipulation py-1.5 px-3 -ml-3 rounded-lg hover:bg-gray-50"
                    >
                        {t('filters.clear') || 'Изчисти всички'}
                    </button>
                </div>
            )}

            {/* Categories */}
            <div className={`${isMobile ? 'mb-6' : 'mb-4 md:mb-6'}`}>
                <h3 className={`${isMobile ? 'text-sm font-medium' : 'text-xs md:text-sm font-light'} text-gray-900 mb-3 tracking-tight`}>{t('filters.categories') || 'Категории'}</h3>
                <ul className={`space-y-1 ${isMobile ? '' : 'max-h-[200px] md:max-h-none overflow-y-auto'}`}>
                    <li>
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`${isMobile ? 'text-sm py-2.5 px-3 rounded-lg' : 'text-xs md:text-sm py-1.5 md:py-1 px-2'} w-full text-left transition-all touch-manipulation ${
                                !currentCategory
                                    ? 'text-gray-900 font-semibold bg-gray-100'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:text-gray-700'
                            }`}
                        >
                            {t('filters.all') || 'Всички'}
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <button
                                onClick={() => handleCategoryChange(cat.slug)}
                                className={`${isMobile ? 'text-sm py-2.5 px-3 rounded-lg' : 'text-xs md:text-sm py-1.5 md:py-1 px-2'} w-full text-left transition-all touch-manipulation ${
                                    currentCategory === cat.slug
                                        ? 'text-gray-900 font-semibold bg-gray-100'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:text-gray-700'
                                }`}
                            >
                                {typeof cat.name === 'string'
                                    ? cat.name
                                    : cat.name?.[lang] || cat.name?.bg || cat.name?.en}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Range */}
            <div className={`${isMobile ? 'mb-6' : 'mb-4 md:mb-6'}`}>
                <h3 className={`${isMobile ? 'text-sm font-medium mb-3' : 'text-xs md:text-sm font-light mb-2 md:mb-3'} text-gray-900 tracking-tight`}>{t('filters.price') || 'Цена (лв)'}</h3>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder={t('filters.price_from') || 'От'}
                        value={priceRange.min}
                        onChange={(e) => {
                            const newRange = { ...priceRange, min: e.target.value };
                            setPriceRange(newRange);
                            if (onPriceRangeChange) onPriceRangeChange(newRange);
                        }}
                        className={`w-full px-4 py-3 border ${isMobile ? 'border-gray-200' : 'border-2 border-gray-300'} text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 rounded-lg min-h-[48px] transition-all duration-200`}
                        min="0"
                    />
                    <input
                        type="number"
                        placeholder={t('filters.price_to') || 'До'}
                        value={priceRange.max}
                        onChange={(e) => {
                            const newRange = { ...priceRange, max: e.target.value };
                            setPriceRange(newRange);
                            if (onPriceRangeChange) onPriceRangeChange(newRange);
                        }}
                        className={`w-full px-4 py-3 border ${isMobile ? 'border-gray-200' : 'border-2 border-gray-300'} text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 rounded-lg min-h-[48px] transition-all duration-200`}
                        min="0"
                    />
                </div>
                {!isMobile && (
                    <button
                        onClick={handlePriceFilter}
                        className="w-full mt-3 px-4 py-3 bg-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 rounded-lg min-h-[48px] touch-manipulation border-2 border-gray-900"
                    >
                        {t('filters.apply') || 'Приложи'}
                    </button>
                )}
            </div>

            {/* Availability */}
            <div>
                <h3 className={`${isMobile ? 'text-sm font-medium mb-3' : 'text-xs md:text-sm font-light mb-2 md:mb-3'} text-gray-900 tracking-tight`}>{t('filters.availability') || 'Наличност'}</h3>
                <label className={`flex items-center gap-3 cursor-pointer touch-manipulation ${isMobile ? 'py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors' : 'py-1'}`}>
                    <input
                        type="checkbox"
                        checked={searchParams.get('in_stock') === '1'}
                        onChange={(e) => handleAvailabilityChange(e.target.checked)}
                        className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5 md:w-4 md:h-4'} border-gray-300 text-gray-900 focus:ring-gray-900 rounded`}
                    />
                    <span className={`${isMobile ? 'text-sm' : 'text-xs md:text-sm'} text-gray-700 font-medium`}>{t('filters.only_in_stock') || 'Само продукти в наличност'}</span>
                </label>
            </div>
        </div>
    );
}