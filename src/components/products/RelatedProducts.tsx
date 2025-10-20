// src/components/products/RelatedProducts.tsx
import { api } from '@/lib/api/client';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
    categoryId?: number;
    currentProductId: number;
}

export default async function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
    if (!categoryId) return null;

    const { data: products } = await api.getProducts({
        category_id: categoryId,
        per_page: 4,
    });

    const relatedProducts = products.filter(p => p.id !== currentProductId).slice(0, 4);

    if (relatedProducts.length === 0) return null;

    return (
        <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">
                Свързани продукти
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}