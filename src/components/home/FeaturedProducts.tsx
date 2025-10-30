// src/components/home/FeaturedProducts.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface FeaturedProductsProps {
    products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
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
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{product.discount_percentage}%
                        </div>
                    )}

                    {/* Low Stock Badge */}
                    {product.is_low_stock && product.is_in_stock && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
                            Малко количество
                        </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {!product.is_in_stock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-medium">Изчерпан</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h3 className="font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors line-clamp-2">
                        {productName}
                    </h3>
                    <div className="flex items-center gap-2">
                        {product.sale_price ? (
                            <>
      <span className="text-lg font-bold text-gray-900">
        {Number(product.sale_price).toFixed(2)} лв
      </span>
                                <span className="text-sm text-gray-500 line-through">
        {Number(product.price).toFixed(2)} лв
      </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">
      {Number(product.final_price ?? product.price).toFixed(2)} лв
    </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}