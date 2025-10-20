// src/components/products/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const productName = typeof product.name === 'string'
        ? product.name
        : product.name.bg || product.name.en;

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group block"
        >
            <article className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <Image
                        src={product.primary_image}
                        alt={productName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges - Stacked for mobile */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
                        {product.discount_percentage && (
                            <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-md">
                                -{product.discount_percentage}%
                            </span>
                        )}
                        {product.is_featured && (
                            <span className="bg-yellow-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-md">
                                ⭐ Топ
                            </span>
                        )}
                        {product.is_low_stock && product.is_in_stock && (
                            <span className="bg-orange-500 text-white text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-md">
                                Малко
                            </span>
                        )}
                    </div>

                    {/* Out of Stock Overlay */}
                    {!product.is_in_stock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-gray-900 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded font-medium">
                                Изчерпан
                            </span>
                        </div>
                    )}

                    {/* Quick View Button - Desktop only */}
                    <div className="hidden md:block absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-full bg-white text-gray-900 py-2 rounded font-medium hover:bg-gray-100 transition-colors text-sm">
                            Бърз преглед
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                    {/* Categories - Smaller on mobile */}
                    {product.categories && product.categories.length > 0 && (
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2 line-clamp-1">
                            {product.categories.map(c =>
                                typeof c.name === 'string' ? c.name : c.name.bg || c.name.en
                            ).join(' • ')}
                        </p>
                    )}

                    {/* Product Name - Responsive font */}
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors leading-snug">
                        {productName}
                    </h3>

                    {/* Price - Responsive layout */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {product.sale_price ? (
                            <>
                                <span className="text-base sm:text-lg font-bold text-red-600">
                                    {product.sale_price} лв
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500 line-through">
                                    {product.price} лв
                                </span>
                            </>
                        ) : (
                            <span className="text-base sm:text-lg font-bold text-gray-900">
                                {product.price} лв
                            </span>
                        )}
                    </div>

                    {/* Stock Status - Mobile friendly */}
                    {product.is_low_stock && product.is_in_stock && (
                        <p className="text-[10px] sm:text-xs text-orange-600 mt-1.5 sm:mt-2 font-medium">
                            ⚠️ Остават {product.stock_quantity} бр.
                        </p>
                    )}
                </div>
            </article>
        </Link>
    );
}