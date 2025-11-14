// src/components/products/ProductGallery.tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] md:aspect-[4/5] bg-gray-50 border border-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-sm md:text-base font-light">{t('product.no_images') || 'No images available'}</span>
            </div>
        );
    }

    // Swipe handlers for mobile
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(0);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && selectedImage < images.length - 1) {
            setSelectedImage(prev => prev + 1);
        }
        if (isRightSwipe && selectedImage > 0) {
            setSelectedImage(prev => prev - 1);
        }
    };

    return (
        <div className="space-y-3 md:space-y-4">
            {/* Main Image - Sharp Design */}
            <div 
                className="relative aspect-[4/5] bg-gray-50 border border-gray-300 overflow-hidden touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <img
                    src={images[selectedImage]}
                    alt={`${productName} - ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                />
                
                {/* Image counter for mobile - Sharp Design */}
                {images.length > 1 && (
                    <div className="md:hidden absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-normal px-3 py-1.5 border border-gray-300 tracking-wide">
                        {selectedImage + 1} / {images.length}
                    </div>
                )}

                {/* Navigation arrows for desktop - Sharp Design */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}
                            disabled={selectedImage === 0}
                            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm text-gray-900 w-10 h-10 items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                            aria-label={t('common.previous')}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setSelectedImage(prev => Math.min(images.length - 1, prev + 1))}
                            disabled={selectedImage === images.length - 1}
                            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm text-gray-900 w-10 h-10 items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                            aria-label={t('common.next')}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails - Sharp Design */}
            {images.length > 1 && (
                <div className="hidden md:grid grid-cols-4 gap-3 lg:gap-4">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`aspect-square overflow-hidden border-2 transition-all ${
                                selectedImage === index
                                    ? 'border-gray-900 shadow-md'
                                    : 'border-gray-300 hover:border-gray-400'
                            }`}
                            aria-label={`View image ${index + 1}`}
                        >
                            <img
                                src={image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Mobile thumbnail dots indicator - Sharp Design */}
            {images.length > 1 && (
                <div className="md:hidden flex justify-center gap-2 items-center">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`transition-all duration-300 ${
                                selectedImage === index
                                    ? 'w-8 h-0.5 bg-gray-900'
                                    : 'w-8 h-0.5 bg-gray-900/30 hover:bg-gray-900/50'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}