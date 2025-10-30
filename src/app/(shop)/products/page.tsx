// src/app/(shop)/products/page.tsx
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import MobileFiltersButton from '@/components/products/MobileFiltersButton';
import { productsApi } from '@/lib/api/products';

export const metadata = {
    title: 'Продукти | MAIRE ATELIER',
    description: 'Разгледайте нашата пълна колекция от модни дрехи',
};

interface ProductsPageProps {
    searchParams: {
        page?: string;
        category?: string;
        sort?: string;
    };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const page = Number(searchParams.page) || 1;
    const categoryId = searchParams.category ? Number(searchParams.category) : undefined;

    let productsData;
    try {
        productsData = await productsApi.getProducts({
            page,
            per_page: 12,
            category_id: categoryId,
        });
    } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        productsData = { data: [], meta: { total: 0 } };
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
                        Продукти
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Открийте нашата колекция от {productsData.meta?.total || 0} продукта
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <ProductFilters />
                        </div>
                    </aside>

                    {/* Main */}
                    <div className="flex-1 min-w-0">
                        {/* Mobile filters & sort */}
                        <div className="lg:hidden mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                            <MobileFiltersButton />
                            <div className="flex-1">
                                <ProductSort />
                            </div>
                        </div>

                        {/* Sort + count */}
                        <div className="hidden lg:flex items-center justify-between mb-6">
                            <p className="text-sm text-gray-600">
                                Показани {productsData.data.length} от {productsData.meta?.total || 0}
                            </p>
                            <ProductSort />
                        </div>

                        {/* Grid */}
                        {productsData.data.length > 0 ? (
                            <ProductGrid products={productsData.data} pagination={productsData.meta} />
                        ) : (
                            <ProductGridSkeleton />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 sm:mb-4" />
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2" />
                </div>
            ))}
        </div>
    );
}
