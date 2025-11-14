// src/components/products/RelatedProducts.tsx
import { productsApi } from "@/lib/api/products";
import ProductCard from "./ProductCard";
import { getTranslations } from "@/lib/getTranslations";

interface RelatedProductsProps {
    categoryId?: number;
    currentProductId: number;
}

/**
 * Server component that fetches related products by category.
 * Uses the productsApi to query Laravel backend.
 */
export default async function RelatedProducts({
                                                  categoryId,
                                                  currentProductId,
                                              }: RelatedProductsProps) {
    if (!categoryId) return null;

    const t = await getTranslations();

    try {
        // Fetch products from same category
        const { data: products } = await productsApi.getProducts({
            category_id: categoryId,
            per_page: 4,
        });

        // Filter out the current product
        const relatedProducts = products
            .filter((p: any) => p.id !== currentProductId)
            .slice(0, 4);

        // If no related products found, render nothing
        if (!relatedProducts.length) return null;

        return (
            <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 mb-8 md:mb-10 lg:mb-12 tracking-tight">
                    {t('product.related_products')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {relatedProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error("❌ Error loading related products:", error);
        return null;
    }
}
