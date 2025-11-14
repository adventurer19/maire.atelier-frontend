// src/components/products/MobileFiltersButton.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductFilters from './ProductFilters';
import type { Category } from '@/lib/api/categories';
import { useLanguage } from '@/context/LanguageContext';

interface MobileFiltersButtonProps {
    categories: Category[];
    currentCategory?: string;
}

export default function MobileFiltersButton({ categories, currentCategory }: MobileFiltersButtonProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [startY, setStartY] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const priceRangeRef = useRef<{ min: string; max: string }>({ min: '', max: '' });
    const { t } = useLanguage();

    // Initialize price range from URL params when modal opens
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Initialize price range from URL
            priceRangeRef.current = {
                min: searchParams.get('price_min') || '',
                max: searchParams.get('price_max') || '',
            };
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, searchParams]);

    // Handle swipe down to close
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches[0].clientY < 100) return; // Only allow drag from top area
        setStartY(e.touches[0].clientY);
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        setCurrentY(e.touches[0].clientY);
        const diff = e.touches[0].clientY - startY;
        if (diff > 0 && modalRef.current) {
            modalRef.current.style.transform = `translateY(${diff}px)`;
            modalRef.current.style.opacity = `${1 - diff / 300}`;
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        const diff = currentY - startY;
        if (diff > 100 && modalRef.current) {
            setIsOpen(false);
        }
        if (modalRef.current) {
            modalRef.current.style.transform = '';
            modalRef.current.style.opacity = '';
        }
        setIsDragging(false);
        setStartY(0);
        setCurrentY(0);
    };

    return (
        <>
            {/* Filters Button - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 text-sm font-medium text-gray-900 shadow-sm hover:shadow-md min-h-[44px] touch-manipulation"
            >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>{t('filters.title') || 'Филтри'}</span>
            </button>

            {/* Filters Modal */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden transition-all duration-300"
                        role="dialog"
                        aria-modal="true"
                        aria-label={t('filters.title') || 'Филтри за продукти'}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Drag Handle */}
                        <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
                            <h2 className="text-xl font-semibold text-gray-900">{t('filters.title') || 'Филтри'}</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-95"
                                aria-label={t('common.close') || 'Затвори'}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Filters Content - Scrollable */}
                        <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                            <div className="px-5 py-4">
                                <ProductFilters
                                    categories={categories}
                                    currentCategory={currentCategory}
                                    variant="mobile"
                                    onPriceRangeChange={(range) => {
                                        priceRangeRef.current = range;
                                    }}
                                />
                            </div>
                        </div>

                        {/* Footer - Apply Button */}
                        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-white/95 border-t border-gray-100 px-5 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                            <button
                                onClick={() => {
                                    // Apply price filter if there are price values
                                    const params = new URLSearchParams(searchParams.toString());
                                    const priceRange = priceRangeRef.current;
                                    
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
                                    setIsOpen(false);
                                }}
                                className="w-full px-6 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 active:scale-[0.98] transition-all duration-200 text-base min-h-[52px] touch-manipulation shadow-lg"
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