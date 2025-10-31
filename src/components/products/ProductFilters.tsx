'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/lib/api/categories';

interface ProductFiltersProps {
    categories: Category[];
    currentCategory?: string;
}

export default function ProductFilters({ categories, currentCategory }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

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

    return (
        <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Филтри</h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    Изчисти
                </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Категории</h3>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`text-sm w-full text-left py-1 transition-colors ${
                                !currentCategory
                                    ? 'text-gray-900 font-medium'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Всички
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <button
                                onClick={() => handleCategoryChange(cat.slug)}
                                className={`text-sm w-full text-left py-1 transition-colors ${
                                    currentCategory === cat.slug
                                        ? 'text-gray-900 font-medium'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {typeof cat.name === 'string'
                                    ? cat.name
                                    : cat.name.bg || cat.name.en}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Цена (лв)</h3>
                <div className="flex gap-2 mb-2">
                    <input
                        type="number"
                        placeholder="От"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        min="0"
                    />
                    <input
                        type="number"
                        placeholder="До"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        min="0"
                    />
                </div>
                <button
                    onClick={handlePriceFilter}
                    className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Приложи
                </button>
            </div>

            {/* Availability */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Наличност</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={searchParams.get('in_stock') === '1'}
                        onChange={(e) => handleAvailabilityChange(e.target.checked)}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-600">Само продукти в наличност</span>
                </label>
            </div>
        </div>
    );
}