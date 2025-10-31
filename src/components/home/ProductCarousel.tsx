// src/components/home/ProductCarousel.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';

interface ProductCarouselProps {
    products: Product[];
    collectionSlug?: string;
}

export default function ProductCarousel({ products, collectionSlug }: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-rotate every 4 seconds
    useEffect(() => {
        if (products.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [products.length, isPaused]);

    if (!products || products.length === 0) {
        return null;
    }

    const currentProduct = products[currentIndex];
    const productName = typeof currentProduct.name === 'string'
        ? currentProduct.name
        : currentProduct.name?.bg || currentProduct.name?.en || 'Product';

    // Get image with fallback
    const getImageUrl = () => {
        if (currentProduct.primary_image && !currentProduct.primary_image.includes('placeholder')) {
            return currentProduct.primary_image;
        }
        if (currentProduct.thumbnail && !currentProduct.thumbnail.includes('placeholder')) {
            return currentProduct.thumbnail;
        }
        if (currentProduct.images && currentProduct.images.length > 0) {
            const firstImage = currentProduct.images[0];
            if (!firstImage.includes('placeholder')) {
                return firstImage;
            }
        }
        return null;
    };

    const imageUrl = getImageUrl();
    const price = Number(currentProduct.final_price || currentProduct.price) || 0;
    const comparePrice = Number(currentProduct.compare_at_price) || null;
    const hasDiscount = comparePrice && comparePrice > price;
    const discountPercent = hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

    return (
        <div
            className="relative h-full w-full group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
        >
            {/* Product Card - Postcard style with tall image */}
            <div className="relative w-full h-full bg-white rounded-xl overflow-hidden transition-all duration-700 ease-out shadow-lg group-hover:shadow-2xl border border-gray-100 flex flex-col">
                {/* Image Section - Slightly shorter aspect ratio */}
                <Link
                    href={`/products/${currentProduct.slug}`}
                    className="relative w-full aspect-[1/0.85] overflow-hidden bg-white flex items-center justify-center"
                >
                    {imageUrl ? (
                        <>
                            {/* Discount Badge */}
                            {hasDiscount && (
                                <div className="absolute top-4 right-4 z-20 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                    -{discountPercent}%
                                </div>
                            )}
                            <div className="relative w-full h-full flex items-center justify-center bg-white">
                                <Image
                                    src={imageUrl}
                                    alt={productName}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-contain object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                                    priority={currentIndex === 0}
                                    unoptimized
                                />
                            </div>
                            {/* CTA Button Overlay on Hover - Modern UX Pattern */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10 pointer-events-none">
                                <div className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-50 hover:scale-105 whitespace-nowrap pointer-events-auto">
                                    Разгледай Продукта
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <svg
                                className="w-24 h-24 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}
                </Link>

                {/* Product Info Section - Optimized Layout */}
                <div className="px-5 py-4 border-t border-gray-100 bg-white">
                    {/* Product Name */}
                    <Link href={`/products/${currentProduct.slug}`}>
                        <h3 className="font-serif font-medium text-gray-900 text-base mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors leading-snug">
                            {productName}
                        </h3>
                    </Link>
                    
                    {/* Price Section */}
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                            {hasDiscount ? (
                                <>
                                    <span className="text-xl font-bold text-gray-900">
                                        {price.toFixed(2)} лв
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                        {comparePrice?.toFixed(2)} лв
                                    </span>
                                </>
                            ) : (
                                <span className="text-xl font-bold text-gray-900">
                                    {price.toFixed(2)} лв
                                </span>
                            )}
                        </div>
                        {hasDiscount && (
                            <span className="text-xs text-red-600 font-medium mt-0.5">
                                Спестете {((comparePrice || 0) - price).toFixed(2)} лв
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Arrows - Subtle and Minimalist */}
            {products.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
                        }}
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm text-gray-900 rounded-full w-10 h-10 items-center justify-center shadow-md transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 z-20 border border-gray-200"
                        aria-label="Previous product"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentIndex((prev) => (prev + 1) % products.length);
                        }}
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm text-gray-900 rounded-full w-10 h-10 items-center justify-center shadow-md transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 z-20 border border-gray-200"
                        aria-label="Next product"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Pagination Dots - Above product info */}
            {products.length > 1 && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {products.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentIndex(index);
                            }}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentIndex
                                    ? 'w-8 h-2 bg-gray-900'
                                    : 'w-2 h-2 bg-gray-900/40 hover:bg-gray-900/60 cursor-pointer'
                            }`}
                            aria-label={`Go to product ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
