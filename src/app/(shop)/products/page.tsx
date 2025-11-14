// src/app/(shop)/products/page.tsx
import { Suspense } from 'react';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import ProductSort from '@/components/products/ProductSort';
import MobileFiltersButton from '@/components/products/MobileFiltersButton';
import ActiveFilters from '@/components/products/ActiveFilters';
import { productsApi } from '@/lib/api/products';
import { categoriesApi } from '@/lib/api/categories';
import ProductsHeaderClient from './ProductsHeaderClient';
import PaginationClient from './PaginationClient';
import EmptyStateClient from './EmptyStateClient';

export const metadata = {
    title: 'Products | MAIRE ATELIER',
    description: 'Browse our full fashion collection',
};

interface ProductsPageProps {
    searchParams: Promise<{
        page?: string;
        category?: string;
        sort?: string;
        price_min?: string;
        price_max?: string;
        in_stock?: string;
        sale?: string;
        search?: string;
    }>;
}

async function getProducts(searchParams: Awaited<ProductsPageProps['searchParams']>) {
    const page = Number(searchParams.page) || 1;
    const category = searchParams.category;
    const sort = searchParams.sort || 'newest';
    const priceMin = searchParams.price_min ? Number(searchParams.price_min) : undefined;
    const priceMax = searchParams.price_max ? Number(searchParams.price_max) : undefined;
    const inStock = searchParams.in_stock === '1';
    const onSale = searchParams.sale === 'true';
    const search = searchParams.search?.trim();

    try {
        const params: any = {
            page,
            per_page: 12,
            sort,
        };

        // Add search filter if provided
        if (search) {
            params.search = search;
        }

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

        // Add on sale filter if provided
        if (onSale) {
            params.on_sale = true;
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
            <ProductsHeaderClient totalProducts={totalProducts} />

            <div className="container px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-20">
                            <ProductFilters
                                categories={categories}
                                currentCategory={currentCategory}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 bg-white border border-gray-200 shadow-sm p-3 md:p-4 gap-3 md:gap-4">
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
                                    {/* client-only text replaced in toolbar count if needed later */}
                                    
                                </div>

                                {/* Sort Dropdown */}
                                <ProductSort />
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
                                            <PaginationClient current_page={meta.current_page} last_page={meta.last_page} />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <EmptyStateClient />
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