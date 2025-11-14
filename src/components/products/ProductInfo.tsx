'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlist, useToggleWishlist } from '@/hooks/useWishlist';

interface ProductInfoProps {
    product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id || null);
    const [quantity, setQuantity] = useState(1);
    const { products: wishlistItems } = useWishlist();
    const toggleWishlist = useToggleWishlist();
    
    // Check if product is in wishlist
    // If wishlist fails to load (e.g., user not logged in), we treat it as not in wishlist
    const isInWishlist = wishlistItems?.some((p) => p.id === product.id) || false;

    const productName =
        typeof product.name === 'string'
            ? product.name
            : product.name?.[lang] || product.name?.bg || product.name?.en;

    const shortDescription =
        typeof product.short_description === 'string'
            ? product.short_description
            : product.short_description?.[lang] || product.short_description?.bg || product.short_description?.en;

    const selectedVariantData = product.variants.find(v => v.id === selectedVariant);

    const price = Number(selectedVariantData?.final_price || product.final_price || product.price) || 0;
    const comparePrice = Number(product.compare_at_price || product.price) || null;
    const hasDiscount = comparePrice && comparePrice > price;
    const discountPercent = product.discount_percentage || (hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0);

    // Handle wishlist toggle
    const handleToggleWishlist = async () => {
        // Check if user is logged in by checking localStorage token
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            await toggleWishlist.mutateAsync(product.id);
        } catch (error: any) {
            console.error('Failed to toggle wishlist:', error);
            
            // If error is 401 (unauthorized), redirect to login
            if (error?.response?.status === 401 || error?.status === 401) {
                localStorage.removeItem('auth_token');
                router.push('/login');
            }
        }
    };

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Name & Description - Elegant Typography */}
            <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-3 md:mb-4 leading-tight tracking-tight">
                    {productName}
                </h1>
                {shortDescription && (
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light">
                        {shortDescription}
                    </p>
                )}
            </div>

            {/* Dynamic Price - Elegant & Minimal */}
            <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
                <span className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                    {price.toFixed(2)} {t('product.currency')}
                </span>

                {hasDiscount && (
                    <>
                        <span className="text-xl md:text-2xl text-gray-400 line-through font-extralight">
                            {comparePrice?.toFixed(2)} {t('product.currency')}
                        </span>
                        <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-xs md:text-sm font-normal px-3 py-1.5 border border-gray-300 tracking-wider uppercase">
                            -{discountPercent}%
                        </span>
                    </>
                )}
            </div>

            {/* Stock Info - Elegant */}
            <div>
                {selectedVariantData ? (
                    selectedVariantData.is_in_stock ? (
                        <p className="text-gray-600 flex items-center gap-2 text-sm md:text-base font-light">
                            <span className="w-2 h-2 bg-green-500"></span>
                            {t('product.in_stock')} ({selectedVariantData.stock_quantity})
                        </p>
                    ) : (
                        <p className="text-gray-600 flex items-center gap-2 text-sm md:text-base font-light">
                            <span className="w-2 h-2 bg-gray-400"></span>
                            {t('product.out_of_stock')}
                        </p>
                    )
                ) : (
                    <p className="text-gray-500 text-sm md:text-base font-light">{t('product.choose_variant')}</p>
                )}
            </div>

            {/* Variants - Sharp Design */}
            {product.variants?.length > 0 && (
                <div>
                    <label className="block text-sm md:text-base font-light text-gray-900 mb-3 md:mb-4">
                        {t('product.choose_variant')}:
                    </label>

                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-3">
                        {product.variants.map((variant) => {
                            const isSelected = selectedVariant === variant.id;
                            const isDisabled =
                                !variant.is_active || !variant.is_in_stock;

                            // Only show size attribute (no colors)
                            const sizeAttr = variant.attributes.find(
                                (a) => a.slug === 'size'
                            ) || variant.attributes[0]; // Fallback to first attribute if size not found

                            // Use size field if available, otherwise use attribute value
                            const sizeValue = (variant as any).size || sizeAttr?.value || '';

                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant.id)}
                                    disabled={isDisabled}
                                    className={`px-4 py-3.5 md:py-3 border-2 text-sm md:text-sm font-light transition-all duration-300 min-h-[56px] md:min-h-[50px] ${
                                        isSelected
                                            ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                                            : 'border-gray-300 text-gray-700 hover:border-gray-400 active:bg-gray-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {/* Show only size */}
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <span className="text-base md:text-lg font-medium">
                                            {sizeValue}
                                                </span>
                                        <span className="text-xs text-gray-500 font-light">
                                            {Number(variant.final_price || variant.price || 0).toFixed(2)} {t('product.currency')}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Quantity Selector - Sharp Design */}
            <div>
                <label className="block text-sm md:text-base font-light text-gray-900 mb-3 md:mb-4">
                    {t('product.quantity')}:
                </label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-4 py-3 md:py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-300 min-h-[48px] md:min-h-[auto] border-r-2 border-gray-300"
                            aria-label="Decrease quantity"
                        >
                            <span className="text-lg md:text-base font-light">−</span>
                        </button>
                        <span className="px-6 md:px-6 py-3 md:py-2 border-r-2 border-gray-300 font-light text-base md:text-sm min-w-[60px] text-center">
                            {quantity}
                        </span>
                        <button
                            onClick={() =>
                                setQuantity(
                                    Math.min(
                                        selectedVariantData?.stock_quantity ||
                                        product.stock_quantity ||
                                        1,
                                        quantity + 1
                                    )
                                )
                            }
                            className="px-4 py-3 md:py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-300 min-h-[48px] md:min-h-[auto]"
                            aria-label="Increase quantity"
                        >
                            <span className="text-lg md:text-base font-light">+</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Add to Cart - Sharp Design */}
            <div className="space-y-3 pb-4 md:pb-0">
                <AddToCartButton
                    productId={product.id}
                    variantId={selectedVariant}
                    quantity={quantity}
                    disabled={
                        !selectedVariantData ||
                        !selectedVariantData.is_in_stock ||
                        !selectedVariantData.is_active
                    }
                />

                <button
                    onClick={handleToggleWishlist}
                    disabled={toggleWishlist.isPending}
                    className={`w-full px-6 py-4 md:py-4 border font-light hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 text-base md:text-base min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${
                        isInWishlist
                            ? 'border-gray-300 bg-gray-50 text-gray-900'
                            : 'border-gray-300 text-gray-900 hover:border-gray-400'
                    }`}
                >
                    {toggleWishlist.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner className="h-5 w-5" />
                            {t('wishlist.loading')}
                        </span>
                    ) : isInWishlist ? (
                        <span className="flex items-center justify-center gap-2">
                            <HeartIconFilled className="w-5 h-5" />
                            {t('wishlist.remove')}
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <HeartIcon className="w-5 h-5" />
                            {t('product.add_to_wishlist')}
                        </span>
                    )}
                </button>
            </div>

            {/* Categories - Elegant */}
            {product.categories?.length > 0 && (
                <div className="pt-4 md:pt-6 border-t border-gray-300">
                    <p className="text-xs md:text-sm text-gray-600 font-light">
                        {t('product.categories')}:{' '}
                        <span className="font-normal">
                            {product.categories
                                .map((cat) =>
                                    typeof cat.name === 'string'
                                        ? cat.name
                                        : cat.name?.[lang] || cat.name?.bg || cat.name?.en
                                )
                                .join(', ')}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}

// Icons
function HeartIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    );
}

function HeartIconFilled({ className }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    );
}

function LoadingSpinner({ className }: { className?: string }) {
    return (
        <svg
            className={`animate-spin ${className || 'h-5 w-5'} text-gray-900`}
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
