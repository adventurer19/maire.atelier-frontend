// src/components/products/ProductGallery.tsx
'use client';

import { useState } from 'react';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] md:aspect-[4/5] bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm md:text-base">Няма налични изображения</span>
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
            {/* Main Image */}
            <div 
                className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden touch-pan-y"
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
                
                {/* Image counter for mobile */}
                {images.length > 1 && (
                    <div className="md:hidden absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        {selectedImage + 1} / {images.length}
                    </div>
                )}

                {/* Navigation arrows for desktop */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}
                            disabled={selectedImage === 0}
                            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Previous image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setSelectedImage(prev => Math.min(images.length - 1, prev + 1))}
                            disabled={selectedImage === images.length - 1}
                            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Next image"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails - Hide on mobile if too many, show on desktop */}
            {images.length > 1 && (
                <div className="hidden md:grid grid-cols-4 gap-3 lg:gap-4">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                selectedImage === index
                                    ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                                    : 'border-gray-200 hover:border-gray-400'
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

            {/* Mobile thumbnail dots indicator */}
            {images.length > 1 && (
                <div className="md:hidden flex justify-center gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`h-2 rounded-full transition-all ${
                                selectedImage === index
                                    ? 'w-8 bg-gray-900'
                                    : 'w-2 bg-gray-300'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}