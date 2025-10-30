// src/app/(shop)/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { productsApi } from "@/lib/api/products";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import RelatedProducts from "@/components/products/RelatedProducts";

/**
 * Product page for single product view
 * Uses SSR (async) to fetch product by slug from Laravel API
 */
interface ProductPageProps {
    params: {
        slug: string;
    };
}

/**
 * Generate SEO metadata for the product page
 */
export async function generateMetadata({ params }: ProductPageProps) {
    try {
        const product = await productsApi.getProduct(params.slug);

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
    let product = null;

    try {
        product = await productsApi.getProduct(params.slug);
    } catch (error) {
        console.error("❌ Error fetching product:", error);
    }

    // If no product found -> show 404
    if (!product) {
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
                        <span className="text-gray-900">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Product Content */}
            <div className="container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Gallery */}
                    <ProductGallery
                        images={product.images || []}
                        productName={product.name}
                    />

                    {/* Product Info */}
                    <ProductInfo product={product} />
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16">
                    <ProductTabs product={product} />
                </div>

                {/* Related Products */}
                <div className="mt-16">
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
function ProductTabs({ product }: { product: any }) {
    return (
        <div className="border-t border-gray-200">
            {/* Description */}
            {product.description && (
                <div className="py-8">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                        Описание на продукта
                    </h2>
                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                </div>
            )}

            {/* Material */}
            {product.material && (
                <div className="py-8 border-t border-gray-200">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                        Материал
                    </h2>
                    <p className="text-gray-600">{product.material}</p>
                </div>
            )}

            {/* Care Instructions */}
            {product.care_instructions && (
                <div className="py-8 border-t border-gray-200">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                        Грижа за продукта
                    </h2>
                    <p className="text-gray-600">{product.care_instructions}</p>
                </div>
            )}

            {/* Shipping info */}
            <div className="py-8 border-t border-gray-200">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                    Информация за доставка
                </h2>
                <ul className="space-y-2 text-gray-600">
                    <li>✓ Безплатна доставка за поръчки над 100 лв</li>
                    <li>✓ Доставка до 3-5 работни дни</li>
                    <li>✓ Връщане до 14 дни</li>
                    <li>✓ Опаковка за подарък (безплатно)</li>
                </ul>
            </div>
        </div>
    );
}
