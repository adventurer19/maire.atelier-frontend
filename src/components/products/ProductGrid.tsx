// src/components/products/ProductGrid.tsx
'use client';

import ProductCard from './ProductCard';
import Pagination from './Pagination';
import { Product, PaginationMeta } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface ProductGridProps {
    products: Product[];
    pagination?: PaginationMeta;
}

export default function ProductGrid({ products, pagination }: ProductGridProps) {
    const { t } = useLanguage();

    if (products.length === 0) {
        return (
            <div className="text-center py-12 md:py-16">
                <svg
                    className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-3 md:mb-4"
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
                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                    {t('productsPage.empty_title')}
                </h3>
                <p className="text-sm md:text-base text-gray-600 px-4">
                    {t('productsPage.empty_desc')}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="mt-8 md:mt-12">
                    <Pagination pagination={pagination} />
                </div>
            )}
        </>
    );
}