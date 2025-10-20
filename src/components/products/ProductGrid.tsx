// src/components/products/ProductGrid.tsx
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import { Product, PaginationMeta } from '@/types';

interface ProductGridProps {
    products: Product[];
    pagination?: PaginationMeta;
}

export default function ProductGrid({ products, pagination }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Няма намерени продукти
                </h3>
                <p className="text-gray-600">
                    Опитайте с различни филтри или критерии за търсене
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="mt-12">
                    <Pagination pagination={pagination} />
                </div>
            )}
        </>
    );
}