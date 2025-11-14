// src/components/home/ProductCarousel.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import type { Product } from '@/types';

interface ProductCarouselProps {
    products: Product[];
    collectionSlug?: string;
}

export default function ProductCarousel({ products, collectionSlug }: ProductCarouselProps) {
    const { t, lang } = useLanguage();
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
        : currentProduct.name?.[lang] || currentProduct.name?.bg || currentProduct.name?.en || 'Product';

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
            {/* Product Card - Sharp, Clean Design (Loro Piana Style) */}
            <div className="relative w-full h-full bg-white overflow-hidden transition-all duration-300 ease-out shadow-sm group-hover:shadow-md border border-gray-300 flex flex-col">
                {/* Image Section - Sharp Design */}
                <Link
                    href={`/products/${currentProduct.slug}`}
                    className="relative w-full aspect-[1/0.85] overflow-hidden bg-gray-50 flex items-center justify-center"
                >
                    {imageUrl ? (
                        <>
                            {/* Discount Badge - Sharp Design */}
                            {hasDiscount && (
                                <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm text-gray-900 text-[11px] md:text-xs font-normal px-3 md:px-3.5 py-1.5 tracking-wider uppercase border border-gray-300">
                                    -{discountPercent}%
                                </div>
                            )}
                            <div className="relative w-full h-full flex items-center justify-center bg-white">
                                <Image
                                    src={imageUrl}
                                    alt={productName}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                                    priority={currentIndex === 0}
                                    unoptimized
                                />
                            </div>
                            {/* CTA Button Overlay on Hover - Sharp Design */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10 pointer-events-none">
                                <div className="px-6 py-3 bg-white text-gray-900 font-medium border border-gray-900 shadow-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-50 whitespace-nowrap pointer-events-auto">
                                    {t('product.view_product')}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 border-b border-gray-200">
                            <svg
                                className="w-16 h-16 md:w-20 md:h-20 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}
                </Link>

                {/* Product Info Section - Sharp, Clean Typography */}
                <div className="px-5 py-4 border-t border-gray-300 bg-white">
                    {/* Product Name */}
                    <Link href={`/products/${currentProduct.slug}`}>
                        <h3 className="font-light text-base md:text-lg text-gray-900 mb-3 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2 leading-relaxed tracking-normal">
                            {productName}
                        </h3>
                    </Link>
                    
                    {/* Price Section - Elegant & Minimal */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-3">
                            {hasDiscount ? (
                                <>
                                    <span className="text-lg md:text-xl font-light text-gray-900 tracking-normal">
                                        {price.toFixed(2)} {t('product.currency')}
                                    </span>
                                    <span className="text-sm md:text-base text-gray-400 line-through font-extralight">
                                        {comparePrice?.toFixed(2)} {t('product.currency')}
                                    </span>
                                </>
                            ) : (
                                <span className="text-lg md:text-xl font-light text-gray-900 tracking-normal">
                                    {price.toFixed(2)} {t('product.currency')}
                                </span>
                            )}
                        </div>
                        {hasDiscount && (
                            <span className="text-[11px] text-gray-400 font-extralight tracking-wide">
                                {t('product.save_amount', { amount: ((comparePrice || 0) - price).toFixed(2) })}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Arrows - Sharp, Clean Design */}
            {products.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
                        }}
                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm text-gray-900 w-10 h-10 items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md opacity-0 group-hover:opacity-100 z-20 border border-gray-300"
                        aria-label={t('common.previous')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentIndex((prev) => (prev + 1) % products.length);
                        }}
                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm text-gray-900 w-10 h-10 items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md opacity-0 group-hover:opacity-100 z-20 border border-gray-300"
                        aria-label={t('common.next')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Pagination Dots - Sharp, Minimal Design */}
            {products.length > 1 && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10 items-center">
                    {products.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentIndex(index);
                            }}
                            className={`transition-all duration-300 ${
                                index === currentIndex
                                    ? 'w-8 h-0.5 bg-gray-900'
                                    : 'w-8 h-0.5 bg-gray-900/30 hover:bg-gray-900/50 cursor-pointer'
                            }`}
                            aria-label={t('product.go_to_product', { number: index + 1 })}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
