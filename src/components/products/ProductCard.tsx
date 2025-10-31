'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
    const [imageError, setImageError] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const productName =
        typeof product.name === 'string'
            ? product.name
            : product.name?.bg || product.name?.en;

    const price = Number(product.price) || 0;
    const salePrice = Number(product.sale_price) || null;

    // Get image with fallback chain
    const getImageUrl = () => {
        // Try primary_image first (if not placeholder)
        if (product.primary_image && !product.primary_image.includes('placeholder')) {
            return product.primary_image;
        }
        
        // Try thumbnail (if not placeholder)
        if (product.thumbnail && !product.thumbnail.includes('placeholder')) {
            return product.thumbnail;
        }
        
        // Try first image from images array (if not placeholder)
        if (product.images && product.images.length > 0) {
            const firstImage = product.images[0];
            if (!firstImage.includes('placeholder')) {
                return firstImage;
            }
        }
        
        // No valid image available
        return null;
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        const currentSrc = target.src;
        let nextImage: string | null = null;
        
        // Build fallback chain
        const fallbacks: string[] = [];
        
        // Add thumbnail if exists and not placeholder
        if (product.thumbnail && !product.thumbnail.includes('placeholder')) {
            fallbacks.push(product.thumbnail);
        }
        
        // Add all images from array that are not placeholders
        if (product.images && product.images.length > 0) {
            product.images.forEach(img => {
                if (!img.includes('placeholder') && !fallbacks.includes(img)) {
                    fallbacks.push(img);
                }
            });
        }
        
        // Try next fallback
        const currentIndex = fallbacks.findIndex(fb => currentSrc.includes(fb));
        if (currentIndex >= 0 && currentIndex < fallbacks.length - 1) {
            nextImage = fallbacks[currentIndex + 1];
        } else if (fallbacks.length > 0 && currentIndex === -1) {
            // Current image not in fallback list, try first fallback
            nextImage = fallbacks[0];
        }
        
        if (nextImage) {
            target.src = nextImage;
            setCurrentImageIndex(prev => prev + 1);
        } else {
            // All attempts failed - show placeholder
            setImageError(true);
        }
    };

    const imageUrl = getImageUrl();

    return (
        <Link href={`/products/${product.slug}`} className="group">
            <article className="relative">
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                    {imageError || !imageUrl ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg
                                className="w-16 h-16 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    ) : (
                        <img
                            src={imageUrl}
                            alt={productName || 'Product'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                            loading="lazy"
                        />
                    )}

                    {product.discount_percentage && (
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                            -{product.discount_percentage}%
                        </div>
                    )}

                    {product.is_low_stock && product.is_in_stock && (
                        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-orange-500 text-white text-[10px] md:text-xs font-medium px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                            Малко количество
                        </div>
                    )}

                    {!product.is_in_stock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-medium text-sm md:text-base">Изчерпан</span>
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="font-medium text-sm md:text-base text-gray-900 mb-1.5 md:mb-2 group-hover:text-gray-600 transition-colors line-clamp-2 leading-tight">
                        {productName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                        {salePrice ? (
                            <>
                                <span className="text-base md:text-lg font-bold text-gray-900">
                                    {salePrice.toFixed(2)} лв
                                </span>
                                <span className="text-xs md:text-sm text-gray-500 line-through">
                                    {price.toFixed(2)} лв
                                </span>
                            </>
                        ) : (
                            <span className="text-base md:text-lg font-bold text-gray-900">
                                {price.toFixed(2)} лв
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}
