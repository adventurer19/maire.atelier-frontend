// src/components/products/ProductSort.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const sortOptions = [
    { value: 'newest', label: { bg: 'По подразбиране', en: 'Default' } },
    { value: 'price_asc', label: { bg: 'Цена: Ниска → Висока', en: 'Price: Low → High' } },
    { value: 'price_desc', label: { bg: 'Цена: Висока → Ниска', en: 'Price: High → Low' } },
    { value: 'name_asc', label: { bg: 'Име: А-Я', en: 'Name: A-Z' } },
    { value: 'name_desc', label: { bg: 'Име: Я-А', en: 'Name: Z-A' } },
];

export default function ProductSort() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { lang, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentSort = searchParams.get('sort') || 'newest';
    const currentOption = sortOptions.find(opt => opt.value === currentSort) || sortOptions[0];
    const currentLabel = currentOption.label[lang] || currentOption.label.bg;

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== 'newest') {
            params.set('sort', value);
        } else {
            params.delete('sort');
        }
        params.delete('page'); // Reset to page 1
        router.push(`/products?${params.toString()}`);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-light text-gray-700 hover:text-gray-900 transition-colors touch-manipulation"
            >
                <span className="text-gray-600">{t('filters.sort_by') || 'Подреди по:'}</span>
                <span className="text-gray-900 font-light">{currentLabel}</span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 shadow-lg z-50">
                    <ul className="py-2">
                        {sortOptions.map((option) => {
                            const label = option.label[lang] || option.label.bg;
                            const isActive = option.value === currentSort;
                            return (
                                <li key={option.value}>
                                    <button
                                        onClick={() => handleSort(option.value)}
                                        className={`w-full text-left px-4 py-2.5 text-sm font-light transition-colors ${
                                            isActive
                                                ? 'bg-gray-50 text-gray-900 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}