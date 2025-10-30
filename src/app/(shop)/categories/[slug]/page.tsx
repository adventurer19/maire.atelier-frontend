// src/app/(shop)/categories/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { productsApi } from "@/lib/api/products";
import ProductGrid from "@/components/products/ProductGrid";

interface CategoryPageProps {
    params: { slug: string };
    searchParams: { page?: string };
}

/**
 * Fetch products for the given category slug
 */
async function getCategoryProducts(slug: string, page = 1) {
    try {
        const res = await productsApi.getProducts({
            category_slug: slug,
            page,
            per_page: 12,
        });
        return res;
    } catch (error) {
        console.error("❌ Error loading category products:", error);
        return null;
    }
}

/**
 * Generate SEO metadata for the category page
 */
export async function generateMetadata({ params }: CategoryPageProps) {
    const categorySlug = params.slug.replace(/-/g, " ");
    return {
        title: `${categorySlug} | MAIRE ATELIER`,
        description: `Разгледайте продуктите от категория "${categorySlug}".`,
    };
}

/**
 * Category Page Component
 */
export default async function CategoryPage({
                                               params,
                                               searchParams,
                                           }: CategoryPageProps) {
    const page = Number(searchParams.page) || 1;
    const productsData = await getCategoryProducts(params.slug, page);

    if (!productsData || !productsData.data?.length) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumbs */}
            <div className="border-b">
                <div className="container py-4">
                    <nav className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-gray-900">
                            Начало
                        </Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-gray-900">
                            Продукти
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 capitalize">{params.slug}</span>
                    </nav>
                </div>
            </div>

            {/* Category Title */}
            <div className="container py-8 sm:py-12">
                <h1 className="text-3xl font-serif font-bold mb-6 capitalize">
                    {params.slug.replace(/-/g, " ")}
                </h1>

                {/* Product Grid */}
                <ProductGrid products={productsData.data} pagination={productsData.meta} />
            </div>
        </div>
    );
}
