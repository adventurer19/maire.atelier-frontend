// src/app/(shop)/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import { productsApi } from "@/lib/api/products";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import RelatedProducts from "@/components/products/RelatedProducts";
import { getTranslations } from "@/lib/getTranslations";
import ProductBreadcrumbs from "./ProductBreadcrumbs";

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

        return {
            title: `${product.name} | MAIRE ATELIER`,
            description: product.meta_description || product.description || "",
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
                    <ProductTabs product={product} translations={t} />
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

/**
 * Product details section with additional info - Elegant Design
 */
function ProductTabs({ product, translations }: { product: any; translations: any }) {
    return (
        <div className="border-t border-gray-300">
            {/* Description */}
            {product.description && (
                <div className="py-8 md:py-10 lg:py-12">
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                        {translations('product.description_title')}
                    </h2>
                    <div className="prose prose-gray max-w-none prose-sm md:prose-base">
                        <p className="text-gray-600 leading-relaxed text-base md:text-lg font-light">
                            {product.description}
                        </p>
                    </div>
                </div>
            )}

            {/* Material */}
            {product.material && (
                <div className="py-8 md:py-10 lg:py-12 border-t border-gray-300">
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                        {translations('product.material')}
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed">{product.material}</p>
                </div>
            )}

            {/* Care Instructions */}
            {product.care_instructions && (
                <div className="py-8 md:py-10 lg:py-12 border-t border-gray-300">
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                        {translations('product.care')}
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed">{product.care_instructions}</p>
                </div>
            )}

            {/* Shipping info */}
            <div className="py-8 md:py-10 lg:py-12 border-t border-gray-300">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                    {translations('product.shipping_info')}
                </h2>
                <ul className="space-y-3 text-gray-600 text-base md:text-lg font-light leading-relaxed">
                    <li className="flex items-start gap-3">
                        <span className="mt-1">•</span>
                        <span>{translations('product.shipping_free')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-1">•</span>
                        <span>{translations('product.shipping_days')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-1">•</span>
                        <span>{translations('product.shipping_return')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-1">•</span>
                        <span>{translations('product.shipping_gift')}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
