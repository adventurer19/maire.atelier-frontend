import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }: { product: Product }) {
    const productName =
        typeof product.name === 'string'
            ? product.name
            : product.name?.bg || product.name?.en;

    const price = Number(product.price) || 0;
    const salePrice = Number(product.sale_price) || null;

    return (
        <Link href={`/products/${product.slug}`} className="group">
            <article className="relative">
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <Image
                        src={product.primary_image}
                        alt={productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {product.discount_percentage && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{product.discount_percentage}%
                        </div>
                    )}

                    {product.is_low_stock && product.is_in_stock && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
                            Малко количество
                        </div>
                    )}

                    {!product.is_in_stock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-medium">Изчерпан</span>
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors line-clamp-2">
                        {productName}
                    </h3>

                    <div className="flex items-center gap-2">
                        {salePrice ? (
                            <>
                                <span className="text-lg font-bold text-gray-900">
                                    {salePrice.toFixed(2)} лв
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    {price.toFixed(2)} лв
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">
                                {price.toFixed(2)} лв
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}
