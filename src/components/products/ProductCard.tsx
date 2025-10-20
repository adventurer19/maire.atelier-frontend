// src/components/products/ProductCard.tsx
import Link from 'next/link';
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
            className="group"
        >
            <article className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <img
                        src={product.primary_image}
                        alt={productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.discount_percentage && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{product.discount_percentage}%
              </span>
                        )}
                        {product.is_featured && (
                            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                ⭐ Топ продукт
              </span>
                        )}
                        {product.is_low_stock && product.is_in_stock && (
                            <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
                Малко количество
              </span>
                        )}
                    </div>

                    {/* Out of Stock Overlay */}
                    {!product.is_in_stock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-gray-900 text-white px-4 py-2 rounded font-medium">
                Изчерпан
              </span>
                        </div>
                    )}

                    {/* Quick View Button (hover) */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-full bg-white text-gray-900 py-2 rounded font-medium hover:bg-gray-100 transition-colors">
                            Бърз преглед
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
                        {productName}
                    </h3>

                    {/* Categories */}
                    {product.categories && product.categories.length > 0 && (
                        <p className="text-xs text-gray-500 mb-2">
                            {product.categories.map(c => typeof c.name === 'string' ? c.name : c.name.bg).join(', ')}
                        </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        {product.sale_price ? (
                            <>
                <span className="text-lg font-bold text-gray-900">
                  {product.sale_price.toFixed(2)} лв
                </span>
                                <span className="text-sm text-gray-500 line-through">
                  {product.price.toFixed(2)} лв
                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">
                {product.price.toFixed(2)} лв
              </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <p className={`text-xs mt-2 ${product.is_in_stock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.is_in_stock ? '✓ В наличност' : '✗ Няма наличност'}
                    </p>
                </div>
            </article>
        </Link>
    );
}