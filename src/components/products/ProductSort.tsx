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
        <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-2 w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md touch-manipulation min-h-[44px]"
            >
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs font-normal">{t('filters.sort_by') || 'Подреди по:'}</span>
                    <span className="text-gray-900 font-medium">{currentLabel}</span>
                </div>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <div
                        className="fixed inset-0 bg-black/20 z-40 sm:hidden"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />
                    <div className="absolute right-0 top-full mt-2 min-w-[200px] w-[calc(100vw-3.5rem)] sm:w-56 max-w-[calc(100vw-2rem)] sm:max-w-none bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        <ul className="py-1.5">
                            {sortOptions.map((option) => {
                                const label = option.label[lang] || option.label.bg;
                                const isActive = option.value === currentSort;
                                return (
                                    <li key={option.value}>
                                        <button
                                            onClick={() => handleSort(option.value)}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 ${
                                                isActive
                                                    ? 'bg-gray-100 text-gray-900 font-semibold'
                                                    : 'text-gray-700 hover:bg-gray-50 font-medium'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}