// src/app/(shop)/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import { productsApi } from "@/lib/api/products";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import RelatedProducts from "@/components/products/RelatedProducts";
import { getTranslations } from "@/lib/getTranslations";
import ProductBreadcrumbs from "./ProductBreadcrumbs";
import ProductTabs from "./ProductTabs";

/**
 * Product page for single product view
 * Uses SSR (async) to fetch product by slug from Laravel API
 */
interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

/**
 * Generate SEO metadata for the product page
 */
export async function generateMetadata({ params }: ProductPageProps) {
    const { slug } = await params;
    try {
        const product = await productsApi.getProduct(slug);

        if (!product) {
            return { title: "Продукт | MAIRE ATELIER" };
        }

        // Get current language from cookies
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const langCookie = cookieStore.get('lang');
        const lang = (langCookie?.value === 'en' || langCookie?.value === 'bg') ? langCookie.value : 'bg';

        // Helper to get localized value
        const getLocalized = (val: any) => {
            if (typeof val === 'string') return val;
            return val?.[lang] || val?.bg || val?.en || '';
        };

        const productName = getLocalized(product.name);
        const metaDescription = getLocalized(product.meta_description) || getLocalized(product.description);

        return {
            title: `${productName} | MAIRE ATELIER`,
            description: metaDescription,
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return { title: "Продукт | MAIRE ATELIER" };
    }
}

/**
 * Product page component
 */
export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    let product = null;

    try {
        product = await productsApi.getProduct(slug);
    } catch (error) {
        console.error("❌ Error fetching product:", error);
    }

    // If no product found -> show 404
    if (!product) {
        notFound();
    }

    const productName = typeof product.name === 'string' 
        ? product.name 
        : product.name?.bg || product.name?.en || 'Product';

    const t = await getTranslations();

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumbs - Client component for dynamic language switching */}
            <ProductBreadcrumbs productName={productName} />

            {/* Product Content - Elegant Layout */}
            <div className="container px-4 md:px-6 lg:px-8 max-w-7xl mx-auto py-8 md:py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
                    {/* Product Gallery */}
                    <ProductGallery
                        images={product.images || []}
                        productName={productName}
                    />

                    {/* Product Info */}
                    <ProductInfo product={product} />
                </div>

                {/* Product Details Tabs - Elegant Design */}
                <div className="mt-12 md:mt-16 lg:mt-20">
                    <ProductTabs product={product} />
                </div>

                {/* Related Products */}
                <div className="mt-12 md:mt-16 lg:mt-20">
                    <RelatedProducts
                        categoryId={product.categories?.[0]?.id}
                        currentProductId={product.id}
                    />
                </div>
            </div>
        </div>
    );
}

