// src/components/home/FeaturedProducts.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface FeaturedProductsProps {
    products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    const { t } = useLanguage();
    const productName = typeof product.name === 'string'
        ? product.name
        : product.name.bg || product.name.en;

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group"
        >
            <article className="relative">
                {/* Product Image */}
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <Image
                        src={product.primary_image}
                        alt={productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount Badge */}
                    {product.discount_percentage && (
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                            -{product.discount_percentage}%
                        </div>
                    )}

                    {/* Low Stock Badge */}
                    {product.is_low_stock && product.is_in_stock && (
                        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-orange-500 text-white text-[10px] md:text-xs font-medium px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                            {t('product.low_stock', { count: String(product.stock_quantity ?? '') })}
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {!product.is_in_stock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-medium text-xs md:text-sm">{t('product.out_of_stock')}</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h3 className="font-medium text-xs md:text-sm text-gray-900 mb-1 md:mb-1.5 group-hover:text-gray-600 transition-colors line-clamp-2 leading-tight">
                        {productName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                        {product.sale_price ? (
                            <>
                                <span className="text-base md:text-lg font-bold text-gray-900">
                                    {Number(product.sale_price).toFixed(2)} лв
                                </span>
                                <span className="text-xs md:text-sm text-gray-500 line-through">
                                    {Number(product.price).toFixed(2)} лв
                                </span>
                            </>
                        ) : (
                            <span className="text-base md:text-lg font-bold text-gray-900">
                                {Number(product.final_price ?? product.price).toFixed(2)} лв
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}