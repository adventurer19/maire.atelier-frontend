// src/app/(shop)/wishlist/page.tsx
'use client';

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

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {products.map((product) => {
                    const productName =
                        typeof product.name === 'string'
                            ? product.name
                            : product.name?.bg || product.name?.en || '';

                    const price = Number(product.final_price || product.price) || 0;
                    const comparePrice = Number(product.compare_at_price) || null;

                    // Get first variant or default
                    const defaultVariant = product.variants?.[0];

                    return (
                        <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden border border-gray-200">
                            {/* Remove button */}
                            <button
                                onClick={() => handleRemove(product.id)}
                                disabled={removeFromWishlist.isPending}
                                className="absolute top-2 right-2 md:top-3 md:right-3 z-10 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-red-50 active:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50 touch-manipulation"
                                aria-label={t('wishlist.remove')}
                            >
                                <XIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            </button>

                            {/* Product Image */}
                            <Link href={`/products/${product.slug}`}>
                                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                                    <Image
                                        src={product.primary_image || '/placeholder-category.svg'}
                                        alt={productName}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {product.discount_percentage && (
                                        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                                            -{product.discount_percentage}%
                                        </div>
                                    )}

                                    {!product.is_in_stock && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white font-medium">
                                                {t('product.out_of_stock')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            {/* Product Info */}
                            <div className="p-3 md:p-4">
                                <Link href={`/products/${product.slug}`}>
                                    <h3 className="font-medium text-xs md:text-sm text-gray-900 mb-1.5 md:mb-2 hover:text-gray-600 transition-colors line-clamp-2 leading-tight">
                                        {productName}
                                    </h3>
                                </Link>

                                <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
                                    {comparePrice && comparePrice > price ? (
                                        <>
                                            <span className="text-base md:text-lg font-bold text-gray-900">
                                                {price.toFixed(2)} лв
                                            </span>
                                            <span className="text-xs md:text-sm text-gray-500 line-through">
                                                {comparePrice.toFixed(2)} лв
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-base md:text-lg font-bold text-gray-900">
                                            {price.toFixed(2)} лв
                                        </span>
                                    )}
                                </div>

                                {/* Add to Cart Button */}
                                {defaultVariant ? (
                                    <AddToCartButton
                                        productId={product.id}
                                        variantId={defaultVariant.id}
                                        quantity={1}
                                        className="w-full text-xs md:text-sm min-h-[40px] md:min-h-[44px]"
                                        disabled={!product.is_in_stock || !defaultVariant.is_in_stock}
                                    />
                                ) : (
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="block w-full px-3 md:px-4 py-2 text-center bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors text-xs md:text-sm min-h-[40px] md:min-h-[44px] flex items-center justify-center touch-manipulation"
                                    >
                                        {t('wishlist.add_to_cart')}
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
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

