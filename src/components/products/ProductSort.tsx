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
            <label htmlFor="sort" className="text-sm text-gray-600">
                Подреди по:
            </label>
            <select
                id="sort"
                onChange={(e) => handleSort(e.target.value)}
                defaultValue={searchParams.get('sort') || ''}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
                <option value="">По подразбиране</option>
                <option value="price-asc">Цена: Ниска към Висока</option>
                <option value="price-desc">Цена: Висока към Ниска</option>
                <option value="name-asc">Име: А-Я</option>
                <option value="name-desc">Име: Я-А</option>
                <option value="new">Нови първи</option>
            </select>
        </div>
    );
}