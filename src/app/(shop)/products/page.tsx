// src/app/(shop)/products/page.tsx
import { Suspense } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import { productsApi } from '@/lib/api/products';

interface ProductsPageProps {
    searchParams: {
        page?: string;
        category?: string;
        sort?: string;
        search?: string;
        sale?: string;
        featured?: string;
    };
}

export const metadata = {
    title: 'Продукти | MAIRE ATELIER',
    description: 'Разгледайте нашата пълна колекция от модни дрехи',
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const page = Number(searchParams.page) || 1;
    const categoryId = searchParams.category ? Number(searchParams.category) : undefined;

    // Fetch products from API (Server Component)
    const productsData = await productsApi.getProducts({
        page,
        per_page: 12,
        category_id: categoryId,
    });
    console.log(productsData);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                        Продукти
                    </h1>
                    <p className="text-gray-600">
                        Открийте нашата колекция от {productsData.meta?.total || 0} продукта
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <ProductFilters />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Sort & View Options */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-gray-600">
                                Показани {productsData.data.length} от {productsData.meta?.total || 0} продукта
                            </p>
                            <ProductSort />
                        </div>

                        {/* Products Grid */}
                        <Suspense fallback={<ProductGridSkeleton />}>
                            <ProductGrid
                                products={productsData.data}
                                pagination={productsData.meta}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
            ))}
        </div>
    );
}