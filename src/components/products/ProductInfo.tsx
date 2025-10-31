'use client';

import { useState } from 'react';
import AddToCartButton from './AddToCartButton';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface ProductInfoProps {
    product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const { t } = useLanguage();
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id || null);
    const [quantity, setQuantity] = useState(1);

    const productName =
        typeof product.name === 'string'
            ? product.name
            : product.name?.bg || product.name?.en;

    const shortDescription =
        typeof product.short_description === 'string'
            ? product.short_description
            : product.short_description?.bg || product.short_description?.en;

    const selectedVariantData = product.variants.find(v => v.id === selectedVariant);

    const price = selectedVariantData?.final_price || product.final_price || product.price;

    return (
        <div className="space-y-4 md:space-y-6">
            {/* ✅ Name & Description */}
            <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2 leading-tight">
                    {productName}
                </h1>
                {shortDescription && (
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {shortDescription}
                    </p>
                )}
            </div>

            {/* ✅ Dynamic Price */}
            <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                    {Number(price).toFixed(2)} лв
                </span>

                {product.discount_percentage && (
                    <>
                        <span className="text-lg md:text-xl text-gray-500 line-through">
                            {Number(product.price || product.compare_at_price || 0).toFixed(2)} лв
                        </span>
                        <span className="bg-red-500 text-white text-xs md:text-sm font-bold px-2 py-1 rounded">
                            -{product.discount_percentage}%
                        </span>
                    </>
                )}
            </div>

            {/* ✅ Stock Info */}
            <div>
                {selectedVariantData ? (
                    selectedVariantData.is_in_stock ? (
                        <p className="text-green-600 flex items-center gap-2 text-sm md:text-base">
                            ✅ {t('product.in_stock')} ({selectedVariantData.stock_quantity})
                        </p>
                    ) : (
                        <p className="text-red-600 flex items-center gap-2 text-sm md:text-base">
                            ❌ {t('product.out_of_stock')}
                        </p>
                    )
                ) : (
                    <p className="text-gray-500 text-sm md:text-base">{t('product.choose_variant')}</p>
                )}
            </div>

            {/* ✅ Variants */}
            {product.variants?.length > 0 && (
                <div>
                    <label className="block text-sm md:text-base font-medium text-gray-900 mb-2 md:mb-3">
                        {t('product.choose_variant')}:
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-2">
                        {product.variants.map((variant) => {
                            const isSelected = selectedVariant === variant.id;
                            const isDisabled =
                                !variant.is_active || !variant.is_in_stock;

                            const colorAttr = variant.attributes.find(
                                (a) => a.slug === 'color'
                            );
                            const sizeAttr = variant.attributes.find(
                                (a) => a.slug === 'size'
                            );

                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant.id)}
                                    disabled={isDisabled}
                                    className={`px-4 py-3.5 md:py-3 border-2 rounded-lg text-sm md:text-sm font-medium transition-colors min-h-[56px] md:min-h-[auto] ${
                                        isSelected
                                            ? 'border-gray-900 bg-gray-900 text-white'
                                            : 'border-gray-300 text-gray-700 hover:border-gray-900 active:bg-gray-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {/* show color + size */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-left">
                                            {colorAttr && (
                                                <span className="flex items-center gap-2">
                                                    <span
                                                        className="inline-block w-4 h-4 md:w-4 md:h-4 rounded-full border border-gray-300 flex-shrink-0"
                                                        style={{
                                                            backgroundColor: colorAttr.hex_color || '#ccc',
                                                        }}
                                                    ></span>
                                                    <span className="text-xs md:text-sm">{colorAttr.value}</span>
                                                </span>
                                            )}
                                            {sizeAttr && (
                                                <span className="block text-xs text-gray-600 mt-1 md:mt-1">
                                                    Размер: {sizeAttr.value}
                                                </span>
                                            )}
                                        </div>

                                        <span className="text-sm md:text-sm font-semibold whitespace-nowrap">
                                            {Number(variant.final_price || variant.price || 0).toFixed(2)} лв
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ✅ Quantity Selector */}
            <div>
                <label className="block text-sm md:text-base font-medium text-gray-900 mb-2 md:mb-3">
                    {t('product.quantity')}:
                </label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-4 py-3 md:py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors min-h-[48px] md:min-h-[auto]"
                            aria-label="Decrease quantity"
                        >
                            <span className="text-lg md:text-base">−</span>
                        </button>
                        <span className="px-6 md:px-6 py-3 md:py-2 border-x-2 border-gray-300 font-medium text-base md:text-sm min-w-[60px] text-center">
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
                            className="px-4 py-3 md:py-2 hover:bg-gray-100 active:bg-gray-200 transition-colors min-h-[48px] md:min-h-[auto]"
                            aria-label="Increase quantity"
                        >
                            <span className="text-lg md:text-base">+</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ Add to Cart - Sticky on mobile */}
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

                <button className="w-full px-6 py-4 md:py-4 border-2 border-gray-900 text-gray-900 font-medium rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-base md:text-base min-h-[48px]">
                    ❤️ {t('product.add_to_wishlist')}
                </button>
            </div>

            {/* ✅ Categories */}
            {product.categories?.length > 0 && (
                <div className="pt-4 md:pt-6 border-t border-gray-200">
                    <p className="text-xs md:text-sm text-gray-600">
                        {t('product.categories')}:{' '}
                        <span className="font-medium">
                            {product.categories
                                .map((cat) =>
                                    typeof cat.name === 'string'
                                        ? cat.name
                                        : cat.name.bg
                                )
                                .join(', ')}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
