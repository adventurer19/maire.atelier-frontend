import { notFound } from 'next/navigation';
import { categoriesApi } from '@/lib/api/categories';
import ProductCard from '@/components/products/ProductCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params; // ✅ await params

    try {
        const res = await categoriesApi.getCategoryBySlug(slug);

        if (!res?.data?.category) return notFound();

        const category = res.data.category;
        const products = res.data.products || [];
        const breadcrumb = res.data.breadcrumb || [];

        // Fallbacks if name/description are localized objects
        const getLocalized = (val: any) => {
            if (typeof val === 'string') return val;
            return val?.bg || val?.en || '';
        };

        return (
            <div className="container py-10">
                <Breadcrumbs
                    items={[
                        { label: 'Категории', href: '/categories' },
                        { label: getLocalized(category.name) },
                    ]}
                />

                <h1 className="text-3xl font-serif font-bold mb-3">{getLocalized(category.name)}</h1>
                {category.description && (
                    <p className="text-gray-600 mb-8 max-w-2xl">{getLocalized(category.description)}</p>
                )}

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">{/* i18n placeholder */}Няма продукти в тази категория.</p>
                )}
            </div>
        );
    } catch (error) {
        console.error('❌ Error loading category:', error);
        return notFound();
    }
}