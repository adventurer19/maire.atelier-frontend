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


            {/* Product Content */}
            <div className="container px-4 py-4 md:py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-12">
                    {/* Product Gallery */}
                    <ProductGallery
                        images={product.images || []}
                        productName={productName}
                    />

                    {/* Product Info */}
                    <ProductInfo product={product} />
                </div>

                {/* Product Details Tabs */}
                <div className="mt-8 md:mt-12 lg:mt-16">
                    <ProductTabs product={product} translations={t} />
                </div>

                {/* Related Products */}
                <div className="mt-8 md:mt-12 lg:mt-16">
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
 * Product details section with additional info
 */
function ProductTabs({ product, translations }: { product: any; translations: any }) {
    return (
        <div className="border-t border-gray-200">
            {/* Description */}
            {product.description && (
                <div className="py-6 md:py-8">
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-4 md:mb-6">
                        {translations('product.description_title')}
                    </h2>
                    <div className="prose prose-gray max-w-none prose-sm md:prose-base">
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            {product.description}
                        </p>
                    </div>
                </div>
            )}

            {/* Material */}
            {product.material && (
                <div className="py-6 md:py-8 border-t border-gray-200">
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-4 md:mb-6">
                        {translations('product.material')}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">{product.material}</p>
                </div>
            )}

            {/* Care Instructions */}
            {product.care_instructions && (
                <div className="py-6 md:py-8 border-t border-gray-200">
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-4 md:mb-6">
                        {translations('product.care')}
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">{product.care_instructions}</p>
                </div>
            )}

            {/* Shipping info */}
            <div className="py-6 md:py-8 border-t border-gray-200">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-4 md:mb-6">
                    {translations('product.shipping_info')}
                </h2>
                <ul className="space-y-2 text-gray-600 text-sm md:text-base">
                    <li>✓ {translations('product.shipping_free')}</li>
                    <li>✓ {translations('product.shipping_days')}</li>
                    <li>✓ {translations('product.shipping_return')}</li>
                    <li>✓ {translations('product.shipping_gift')}</li>
                </ul>
            </div>
        </div>
    );
}
