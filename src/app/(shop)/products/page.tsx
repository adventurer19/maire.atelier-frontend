// src/app/(shop)/products/page.tsx
import { Suspense } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import MobileFiltersButton from '@/components/products/MobileFiltersButton';
import ActiveFilters from '@/components/products/ActiveFilters';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';

export const metadata = {
    title: 'Продукти | MAIRE ATELIER',
    description: 'Разгледайте нашата пълна колекция от модни дрехи',
};

interface ProductsPageProps {
    searchParams: Promise<{
        page?: string;
        category?: string;
        sort?: string;
        price_min?: string;
        price_max?: string;
        in_stock?: string;
    }>;
}

async function getProducts(searchParams: Awaited<ProductsPageProps['searchParams']>) {
    const page = Number(searchParams.page) || 1;
    const category = searchParams.category;
    const sort = searchParams.sort || 'newest';
    const priceMin = searchParams.price_min ? Number(searchParams.price_min) : undefined;
    const priceMax = searchParams.price_max ? Number(searchParams.price_max) : undefined;
    const inStock = searchParams.in_stock === '1';

    try {
        const params: any = {
            page,
            per_page: 12,
            sort,
        };

        // Add category filter if provided
        if (category) {
            params.category = category;
        }

        // Add price filters if provided
        if (priceMin !== undefined) {
            params.price_min = priceMin;
        }
        if (priceMax !== undefined) {
            params.price_max = priceMax;
        }

        // Add stock filter if checked
        if (inStock) {
            params.in_stock = 1;
        }

        const { data, meta } = await productsApi.getProducts(params);

        return { products: data, meta };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [], meta: null };
    }
}

async function getCategories() {
    try {
        // ✅ избери според нуждите:
        // const categories = await categoriesApi.getAll();
        const categories = await categoriesApi.getMenuCategories();

        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    // Await searchParams before using it
    const params = await searchParams;

    const [{ products, meta }, categories] = await Promise.all([
        getProducts(params),
        getCategories(),
    ]);

    const currentCategory = params.category;
    const totalProducts = meta?.total || products.length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white border-b">
                <div className="container py-8">
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
                        Продукти
                    </h1>
                    <p className="text-gray-600">
                        Открийте нашата колекция от {totalProducts} {totalProducts === 1 ? 'продукт' : 'продукта'}
                    </p>
                </div>
            </div>

            <div className="container py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-4">
                            <ProductFilters
                                categories={categories}
                                currentCategory={currentCategory}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm gap-4">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {/* Mobile Filters Button */}
                                <MobileFiltersButton
                                    categories={categories}
                                    currentCategory={currentCategory}
                                />
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                                {/* Results Count */}
                                <div className="text-sm text-gray-600">
                                    Показани {products.length} от {totalProducts}
                                </div>

                                {/* Sort Dropdown */}
                                <ProductSort currentSort={params.sort} />
                            </div>
                        </div>

                        {/* Active Filters */}
                        <ActiveFilters categories={categories} />

                        {/* Products Grid */}
                        <Suspense fallback={<ProductsGridSkeleton />}>
                            {products.length > 0 ? (
                                <>
                                    <ProductGrid products={products} />

                                    {/* Pagination - if needed */}
                                    {meta && meta.last_page > 1 && (
                                        <div className="mt-8">
                                            <Pagination meta={meta} />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <EmptyState />
                            )}
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProductsGridSkeleton() {
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

function EmptyState() {
    return (
        <div className="text-center py-16">
            <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                Няма намерени продукти
            </h3>
            <p className="text-gray-500 mb-6">
                Опитайте да промените филтрите или да търсите нещо друго
            </p>
            <a
                href="/products"
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
                Изчисти филтри
            </a>
        </div>
    );
}

interface PaginationProps {
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

function Pagination({ meta }: PaginationProps) {
    const { current_page, last_page } = meta;

    // Simple pagination - you can enhance this
    return (
        <div className="flex items-center justify-center gap-2">
            {current_page > 1 && (
                <a
                    href={`?page=${current_page - 1}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Предишна
                </a>
            )}

            <span className="px-4 py-2 text-gray-700">
                Страница {current_page} от {last_page}
            </span>

            {current_page < last_page && (
                <a
                    href={`?page=${current_page + 1}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Следваща
                </a>
            )}
        </div>
    );
}