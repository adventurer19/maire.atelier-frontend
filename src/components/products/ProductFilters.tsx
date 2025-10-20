// src/components/products/ProductFilters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    const handleCategoryChange = (categoryId: string) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId) {
            params.set('category', categoryId);
        } else {
            params.delete('category');
        }
        params.delete('page');
        router.push(`/products?${params.toString()}`);
    };

    const handlePriceFilter = () => {
        const params = new URLSearchParams(searchParams);
        if (priceRange.min) params.set('min_price', priceRange.min);
        if (priceRange.max) params.set('max_price', priceRange.max);
        params.delete('page');
        router.push(`/products?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('/products');
    };

    return (
        <div className="bg-white rounded-lg p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Филтри</h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900"
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
                            className={`text-sm w-full text-left py-1 ${
                                !searchParams.get('category') ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Всички
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleCategoryChange('1')}
                            className={`text-sm w-full text-left py-1 ${
                                searchParams.get('category') === '1' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Рокли
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleCategoryChange('2')}
                            className={`text-sm w-full text-left py-1 ${
                                searchParams.get('category') === '2' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Блузи
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleCategoryChange('3')}
                            className={`text-sm w-full text-left py-1 ${
                                searchParams.get('category') === '3' ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Панталони
                        </button>
                    </li>
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
                    />
                    <input
                        type="number"
                        placeholder="До"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-600">В наличност</span>
                </label>
                <label className="flex items-center gap-2 mt-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-600">Намаление</span>
                </label>
            </div>
        </div>
    );
}