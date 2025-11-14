import { notFound } from 'next/navigation';
import { categoriesApi } from '@/lib/api/categories';
import ProductCard from '@/components/products/ProductCard';
import CategoryBreadcrumbs from './CategoryBreadcrumbs';
import { getTranslations } from '@/lib/getTranslations';
import { cookies } from 'next/headers';

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const t = await getTranslations();

    try {
        const res = await categoriesApi.getCategoryBySlug(slug);

        if (!res?.data?.category) return notFound();

        const category = res.data.category;
        const products = res.data.products || [];
        const breadcrumb = res.data.breadcrumb || [];

        // Get language for localized content
        let lang: 'bg' | 'en' = 'bg';
        try {
            const cookieStore = await cookies();
            const langCookie = cookieStore.get('lang');
            if (langCookie?.value === 'en' || langCookie?.value === 'bg') {
                lang = langCookie.value as 'bg' | 'en';
            }
        } catch (e) {
            // Fallback to default
        }

        // Fallbacks if name/description are localized objects
        const getLocalized = (val: any) => {
            if (typeof val === 'string') return val;
            return val?.[lang] || val?.bg || val?.en || '';
        };

        const categoryName = getLocalized(category.name);
        const categoryDescription = getLocalized(category.description);

        return (
            <div className="min-h-screen bg-white">
                <div className="container px-4 md:px-6 lg:px-8 max-w-7xl mx-auto py-8 md:py-12 lg:py-16">
                    {/* Breadcrumbs */}
                <CategoryBreadcrumbs categoryName={categoryName} />

                    {/* Category Header - Elegant Typography */}
                    <div className="mb-10 md:mb-12 lg:mb-16">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 md:mb-6 tracking-tight">
                            {categoryName}
                        </h1>
                        {categoryDescription && (
                            <p className="text-gray-600 text-base md:text-lg max-w-3xl font-light leading-relaxed">
                                {categoryDescription}
                            </p>
                )}
                    </div>

                    {/* Products Grid */}
                {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                        <div className="text-center py-12 md:py-16">
                            <p className="text-gray-500 text-base md:text-lg font-light">
                                {t('categories.no_products_in_category') || t('productsPage.empty_title')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        console.error('❌ Error loading category:', error);
        return notFound();
    }
}