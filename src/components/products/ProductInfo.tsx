// src/components/products/ProductInfo.tsx
'use client';

import { useState } from 'react';
import AddToCartButton from './AddToCartButton';
import { Product } from '@/types';

interface ProductInfoProps {
    product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id);
    const [quantity, setQuantity] = useState(1);

    const productName = typeof product.name === 'string'
        ? product.name
        : product.name.bg || product.name.en;

    const shortDescription = typeof product.short_description === 'string'
        ? product.short_description
        : product.short_description?.bg || product.short_description?.en;

    return (
        <div className="space-y-6">
            {/* Product Name */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                    {productName}
                </h1>
                {shortDescription && (
                    <p className="text-gray-600">{shortDescription}</p>
                )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
                {product.sale_price ? (
                    <>
            <span className="text-3xl font-bold text-gray-900">
              {product.sale_price.toFixed(2)} лв
            </span>
                        <span className="text-xl text-gray-500 line-through">
              {product.price.toFixed(2)} лв
            </span>
                        <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
              -{product.discount_percentage}%
            </span>
                    </>
                ) : (
                    <span className="text-3xl font-bold text-gray-900">
            {product.price.toFixed(2)} лв
          </span>
                )}
            </div>

            {/* Stock Status */}
            <div>
                {product.is_in_stock ? (
                    <p className="flex items-center gap-2 text-green-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        В наличност ({product.stock_quantity} бр.)
                    </p>
                ) : (
                    <p className="flex items-center gap-2 text-red-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Няма в наличност
                    </p>
                )}

                {product.is_low_stock && product.is_in_stock && (
                    <p className="text-orange-600 text-sm mt-1">
                        ⚠️ Само {product.stock_quantity} броя останали!
                    </p>
                )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                        Изберете вариант:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {product.variants.map((variant) => (
                            <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant.id)}
                                disabled={!variant.is_active || variant.stock_quantity === 0}
                                className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedVariant === variant.id
                                        ? 'border-gray-900 bg-gray-900 text-white'
                                        : 'border-gray-300 text-gray-700 hover:border-gray-900'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {variant.variant_name || `Вариант ${variant.id}`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Quantity */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                    Количество:
                </label>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                            -
                        </button>
                        <span className="px-6 py-2 border-x border-gray-300 font-medium">
              {quantity}
            </span>
                        <button
                            onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                            className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
                <AddToCartButton
                    productId={product.id}
                    variantId={selectedVariant}
                    quantity={quantity}
                    disabled={!product.is_in_stock}
                />

                <button className="w-full px-6 py-4 border-2 border-gray-900 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Добави в любими
                </button>
            </div>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Категории:{' '}
                        {product.categories.map((cat, index) => (
                            <span key={cat.id}>
                {index > 0 && ', '}
                                <span className="text-gray-900">
                  {typeof cat.name === 'string' ? cat.name : cat.name.bg}
                </span>
              </span>
                        ))}
                    </p>
                </div>
            )}

            {/* Features */}
            <div className="pt-6 border-t border-gray-200">
                <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Безплатна доставка над 100 лв
                    </li>
                    <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Връщане до 14 дни
                    </li>
                    <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Гаранция за качество
                    </li>
                </ul>
            </div>
        </div>
    );
}