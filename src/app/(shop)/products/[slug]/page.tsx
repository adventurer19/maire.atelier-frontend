// src/app/(shop)/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import AddToCartButton from '@/components/products/AddToCartButton';
import ProductGallery from '@/components/products/ProductGallery';
import ProductInfo from '@/components/products/ProductInfo';
import RelatedProducts from '@/components/products/RelatedProducts';

interface ProductPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: ProductPageProps) {
    try {
        const { data: product } = await api.getProduct(params.slug);
        const productName = typeof product.name === 'string'
            ? product.name
            : product.name.bg || product.name.en;

        return {
            title: `${productName} | MAIRE ATELIER`,
            description: typeof product.description === 'string'
                ? product.description
                : product.description.bg || product.description.en,
        };
    } catch {
        return {
            title: 'Продукт | MAIRE ATELIER',
        };
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    let product;

    try {
        const response = await api.getProduct(params.slug);
        product = response.data;
    } catch (error) {
        notFound();
    }

    const productName = typeof product.name === 'string'
        ? product.name
        : product.name.bg || product.name.en;

    const productDescription = typeof product.description === 'string'
        ? product.description
        : product.description.bg || product.description.en;

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumbs */}
            <div className="border-b">
                <div className="container py-4">
                    <nav className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-gray-900">Начало</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-gray-900">Продукти</Link>
                        <span>/</span>
                        <span className="text-gray-900">{productName}</span>
                    </nav>
                </div>
            </div>

            {/* Product Content */}
            <div className="container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Gallery */}
                    <ProductGallery images={product.images} productName={productName} />

                    {/* Product Info */}
                    <ProductInfo product={product} />
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16">
                    <ProductTabs product={product} />
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <RelatedProducts categoryId={product.categories[0]?.id} currentProductId={product.id} />
                </div>
            </div>
        </div>
    );
}

function ProductTabs({ product }: { product: any }) {
    const description = typeof product.description === 'string'
        ? product.description
        : product.description.bg || product.description.en;

    const material = typeof product.material === 'string'
        ? product.material
        : product.material?.bg || product.material?.en;

    const careInstructions = typeof product.care_instructions === 'string'
        ? product.care_instructions
        : product.care_instructions?.bg || product.care_instructions?.en;

    return (
        <div className="border-t border-gray-200">
            <div className="py-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                    Описание на продукта
                </h2>
                <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
            </div>

            {material && (
                <div className="py-8 border-t border-gray-200">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                        Материал
                    </h2>
                    <p className="text-gray-600">{material}</p>
                </div>
            )}

            {careInstructions && (
                <div className="py-8 border-t border-gray-200">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                        Грижа за продукта
                    </h2>
                    <p className="text-gray-600">{careInstructions}</p>
                </div>
            )}

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