// src/app/(shop)/wishlist/page.tsx
'use client';

import { useState } from 'react';
import { useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import AddToCartButton from '@/components/products/AddToCartButton';
import type { Product } from '@/types';

export default function WishlistPage() {
    const { t, lang } = useLanguage();
    const { products, isLoading, isError, error } = useWishlist();
    const removeFromWishlist = useRemoveFromWishlist();

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">{t('wishlist.loading')}</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="text-red-600 mb-4">
                        <p className="text-xl font-bold">{t('wishlist.error')}</p>
                        <p className="text-sm mt-2">{error?.message || 'Something went wrong'}</p>
                    </div>
                    <Link
                        href="/products"
                        className="inline-block px-8 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                    >
                        {t('wishlist.continue_shopping')}
                    </Link>
                </div>
            </div>
        );
    }

    // Empty wishlist
    if (!products || products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="mb-6">
                        <HeartIcon className="w-24 h-24 mx-auto text-gray-300" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{t('wishlist.empty_title')}</h1>
                    <p className="text-gray-600 mb-8">{t('wishlist.empty_desc')}</p>
                    <Link
                        href="/products"
                        className="inline-block px-8 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                    >
                        {t('wishlist.continue_shopping')}
                    </Link>
                </div>
            </div>
        );
    }

    // Handle remove from wishlist
    const handleRemove = (productId: number) => {
        removeFromWishlist.mutate(productId);
    };

    return (
        <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
            <div className="mb-4 md:mb-6 lg:mb-8">
                <h1 className="text-2xl md:text-3xl font-serif font-bold">{t('wishlist.title')}</h1>
                <p className="text-gray-600 mt-2 text-sm md:text-base">
                    {products.length}{' '}
                    {lang === 'bg'
                        ? products.length === 1
                            ? 'продукт'
                            : 'продукти'
                        : products.length === 1
                            ? 'product'
                            : 'products'}
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {products.map((product) => {
                    return (
                        <WishlistProductCard
                            key={product.id}
                            product={product}
                            onRemove={handleRemove}
                            isRemoving={removeFromWishlist.isPending}
                            t={t}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// Wishlist Product Card Component
function WishlistProductCard({
    product,
    onRemove,
    isRemoving,
    t,
}: {
    product: Product;
    onRemove: (productId: number) => void;
    isRemoving: boolean;
    t: (path: string) => string;
}) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

                    const productName =
                        typeof product.name === 'string'
                            ? product.name
                            : product.name?.bg || product.name?.en || '';

                    const price = Number(product.final_price || product.price) || 0;
                    const comparePrice = Number(product.compare_at_price) || null;

                    // Get first variant or default
                    const defaultVariant = product.variants?.[0];

    // Get image URL with proper fallback (same logic as ProductCard)
    const getImageUrl = (): string | null => {
        if (imageError) return null;

        // Try primary_image first
        if (
            product.primary_image &&
            product.primary_image.trim() !== '' &&
            !product.primary_image.includes('placeholder') &&
            product.primary_image !== 'null'
        ) {
            return product.primary_image;
        }

        // Try thumbnail
        if (
            product.thumbnail &&
            product.thumbnail.trim() !== '' &&
            !product.thumbnail.includes('placeholder') &&
            product.thumbnail !== 'null'
        ) {
            return product.thumbnail;
        }

        // Try first image from images array
        if (product.images && product.images.length > 0) {
            const firstImage = product.images[0];
            if (
                firstImage &&
                firstImage.trim() !== '' &&
                !firstImage.includes('placeholder') &&
                firstImage !== 'null'
            ) {
                return firstImage;
            }
        }

        return null;
    };

    const imageUrl = getImageUrl();
    const hasValidImage = imageUrl && !imageError;

                    return (
        <div className="group relative flex flex-col h-full">
                            {/* Remove button */}
                            <button
                onClick={() => onRemove(product.id)}
                disabled={isRemoving}
                className="absolute top-2 right-2 md:top-3 md:right-3 z-20 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 active:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50 touch-manipulation border border-gray-300"
                                aria-label={t('wishlist.remove')}
                            >
                                <XIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>

            <article className="relative flex flex-col h-full">
                {/* Product Image Container - Sharp, Clean Design (same as ProductCard) */}
                <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-4 md:mb-5">
                    {hasValidImage ? (
                        <>
                            {/* Loading Skeleton */}
                            {imageLoading && (
                                <div className="absolute inset-0 bg-gray-100 animate-pulse z-0" />
                            )}

                            {/* Product Image - Use img tag for external URLs (same as ProductCard) */}
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
                                    src={imageUrl || '/placeholder-category.svg'}
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
                            {product.discount_percentage && product.discount_percentage > 0 && (
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 text-[11px] md:text-xs font-normal px-3 md:px-3.5 py-1.5 tracking-wider uppercase border border-gray-300 z-10">
                                            -{product.discount_percentage}%
                                        </div>
                                    )}

                            {/* Low Stock Badge - Sharp */}
                            {product.is_low_stock && product.is_in_stock && (
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-amber-900 text-[11px] md:text-xs font-normal px-3 md:px-3.5 py-1.5 border border-amber-200 z-10">
                                    {t('product.low_stock', { count: String(product.stock_quantity ?? '') })}
                                </div>
                            )}

                            {/* Out of Stock Overlay - Elegant (same as ProductCard) */}
                                    {!product.is_in_stock && (
                                <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] flex items-center justify-center z-10">
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
                        /* Placeholder - Minimal (same as ProductCard) */
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
                            </Link>

                {/* Product Info - Elegant Typography (same as ProductCard) */}
                <div className="flex flex-col flex-grow">
                    {/* Product Name - Clean & Minimal */}
                    <h3 className="font-light text-sm md:text-base text-gray-900 mb-3 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2 leading-relaxed tracking-normal">
                                        {productName}
                                    </h3>

                    {/* Price Section - Elegant & Minimal */}
                    <div className="mt-auto flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-3">
                                    {comparePrice && comparePrice > price ? (
                                        <>
                                    <span className="text-base md:text-lg font-light text-gray-900 tracking-normal">
                                        {price.toFixed(2)} {t('product.currency')}
                                            </span>
                                    <span className="text-xs md:text-sm text-gray-400 line-through font-extralight">
                                        {comparePrice.toFixed(2)} {t('product.currency')}
                                            </span>
                                        </>
                                    ) : (
                                <span className="text-base md:text-lg font-light text-gray-900 tracking-normal">
                                    {price.toFixed(2)} {t('product.currency')}
                                </span>
                            )}
                        </div>

                        {/* Save Amount - Very Subtle */}
                        {comparePrice && comparePrice > price && (
                            <span className="text-[11px] text-gray-400 font-extralight tracking-wide">
                                {t('product.save_amount', { amount: ((comparePrice || 0) - price).toFixed(2) })}
                                        </span>
                                    )}
                                </div>

                    {/* Add to Cart Button - Wishlist specific */}
                    <div className="mt-4">
                                {defaultVariant ? (
                                    <AddToCartButton
                                        productId={product.id}
                                        variantId={defaultVariant.id}
                                        quantity={1}
                                className="w-full"
                                        disabled={!product.is_in_stock || !defaultVariant.is_in_stock}
                                    />
                                ) : (
                                    <Link
                                        href={`/products/${product.slug}`}
                                className="block w-full px-6 py-4 md:py-4 bg-gray-900 text-white font-light hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 text-center min-h-[48px] flex items-center justify-center"
                                    >
                                        {t('wishlist.add_to_cart')}
                                    </Link>
                                )}
                            </div>
                        </div>
            </article>
        </div>
    );
}

// Icons
function HeartIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
        </svg>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function LoadingSpinner() {
    return (
        <svg
            className="animate-spin h-8 w-8 mx-auto text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

