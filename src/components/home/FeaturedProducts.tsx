// src/components/home/FeaturedProducts.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface FeaturedProductsProps {
    products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    const { t, lang } = useLanguage();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Get product name with language support
    const productName = typeof product.name === 'string'
        ? product.name
        : product.name?.[lang] || product.name?.bg || product.name?.en || 'Product';

    // Get image URL with proper fallback
    const getImageUrl = (): string | null => {
        if (imageError) return null;
        
        // Try primary_image first
        if (product.primary_image && !product.primary_image.includes('placeholder')) {
            return product.primary_image;
        }
        
        // Try thumbnail
        if (product.thumbnail && !product.thumbnail.includes('placeholder')) {
            return product.thumbnail;
        }
        
        // Try first image from images array
        if (product.images && product.images.length > 0) {
            const firstImage = product.images[0];
            if (!firstImage.includes('placeholder')) {
                return firstImage;
            }
        }
        
        return null;
    };

    const imageUrl = getImageUrl();
    const hasValidImage = imageUrl && !imageError;

    // Price calculation
    const price = Number(product.final_price ?? product.price) || 0;
    const comparePrice = Number(product.compare_at_price ?? product.sale_price) || null;
    const hasDiscount = comparePrice && comparePrice > price;
    const discountPercent = product.discount_percentage || (hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0);

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group relative flex flex-col h-full"
        >
            <article className="relative flex flex-col h-full">
                {/* Product Image Container - Loro Piana Style */}
                <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-4 md:mb-5">
                    {hasValidImage ? (
                        <>
                            {/* Loading Skeleton */}
                            {imageLoading && (
                                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                            )}
                            
                {/* Product Image */}
                            {imageUrl?.startsWith('http://') || imageUrl?.startsWith('https://') ? (
                                // Use regular img tag for external URLs to avoid Next.js Image optimization issues
                                <img
                                    src={imageUrl}
                                    alt={productName}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                                        imageLoading ? 'opacity-0' : 'opacity-100'
                                    } group-hover:scale-[1.02]`}
                                    onLoad={() => setImageLoading(false)}
                                    onError={() => {
                                        setImageError(true);
                                        setImageLoading(false);
                                    }}
                                    loading="lazy"
                                />
                            ) : (
                                // Use Next.js Image for local images
                    <Image
                                src={imageUrl}
                        alt={productName}
                        fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className={`object-cover transition-all duration-700 ease-out ${
                                    imageLoading ? 'opacity-0' : 'opacity-100'
                                } group-hover:scale-[1.02]`}
                                onLoad={() => setImageLoading(false)}
                                onError={() => {
                                    setImageError(true);
                                    setImageLoading(false);
                                }}
                                priority={false}
                                loading="lazy"
                    />
                            )}

                            {/* Elegant Discount Badge - Sharp Design (same as ProductCard) */}
                            {discountPercent > 0 && (
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 text-[11px] md:text-xs font-normal px-3 md:px-3.5 py-1.5 tracking-wider uppercase border border-gray-300">
                                    -{discountPercent}%
                        </div>
                    )}

                            {/* Low Stock Badge - Minimal */}
                    {product.is_low_stock && product.is_in_stock && (
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-amber-900 text-[11px] md:text-xs font-normal px-3 md:px-3.5 py-1.5 border border-amber-200">
                            {t('product.low_stock', { count: String(product.stock_quantity ?? '') })}
                        </div>
                    )}

                            {/* Out of Stock Overlay - Elegant (same as ProductCard) */}
                    {!product.is_in_stock && (
                                <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] flex items-center justify-center">
                                    <div className="text-center px-4">
                                        <div className="w-12 h-12 border-2 border-gray-300 flex items-center justify-center mx-auto mb-2">
                                            <svg
                                                className="w-6 h-6 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-gray-600 text-xs md:text-sm font-medium uppercase tracking-wide">
                                            {t('product.out_of_stock')}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Hover Overlay - Very Subtle */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/3 transition-colors duration-500 pointer-events-none" />
                        </>
                    ) : (
                        /* Placeholder - Minimal */
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <svg
                                className="w-10 h-10 md:w-12 md:h-12 text-gray-300"
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
                </div>

                {/* Product Info - Elegant Typography */}
                <div className="flex flex-col flex-grow">
                    {/* Product Name - Clean & Minimal */}
                    <h3 className="font-light text-sm md:text-base text-gray-900 mb-3 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2 leading-relaxed tracking-normal">
                        {productName}
                    </h3>

                    {/* Price Section - Elegant & Minimal */}
                    <div className="mt-auto flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-3">
                            {hasDiscount ? (
                            <>
                                    <span className="text-base md:text-lg font-light text-gray-900 tracking-normal">
                                        {price.toFixed(2)} {t('product.currency')}
                                </span>
                                    <span className="text-xs md:text-sm text-gray-400 line-through font-extralight">
                                        {comparePrice?.toFixed(2)} {t('product.currency')}
                                </span>
                            </>
                        ) : (
                                <span className="text-base md:text-lg font-light text-gray-900 tracking-normal">
                                    {price.toFixed(2)} {t('product.currency')}
                                </span>
                            )}
                        </div>
                        
                        {/* Save Amount - Very Subtle */}
                        {hasDiscount && (
                            <span className="text-[11px] text-gray-400 font-extralight tracking-wide">
                                {t('product.save_amount', { amount: ((comparePrice || 0) - price).toFixed(2) })}
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}