// src/components/products/ProductSort.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductSort() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('sort', value);
        } else {
            params.delete('sort');
        }
        params.delete('page'); // Reset to page 1
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                Подреди по:
            </label>
            <select
                id="sort"
                onChange={(e) => handleSort(e.target.value)}
                value={searchParams.get('sort') || 'newest'}
                className="px-3 py-2.5 md:py-2 border-2 border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[44px] md:min-h-[auto] touch-manipulation"
            >
                <option value="newest">По подразбиране</option>
                <option value="price_asc">Цена: Ниска към Висока</option>
                <option value="price_desc">Цена: Висока към Ниска</option>
                <option value="name_asc">Име: А-Я</option>
                <option value="name_desc">Име: Я-А</option>
            </select>
        </div>
    );
}