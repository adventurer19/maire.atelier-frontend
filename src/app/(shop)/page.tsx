import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryGrid from '@/components/home/CategoryGrid';
import Newsletter from '@/components/home/Newsletter';

export const metadata = {
    title: 'MAIRE ATELIER - Modern Fashion',
    description: 'Открийте нашата колекция от уникални модни дрехи',
};

/**
 * Fetch featured products from API
 */
async function getFeaturedProducts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/featured`, {
            next: { revalidate: 60 },
            cache: 'force-cache',
        });

        if (!res.ok) {
            console.error('Failed to fetch featured products');
            return [];
        }

        const data = await res.json();
        return data.data ?? [];
    } catch (err) {
        console.error("❌ Error fetching featured products:", err);
        return [];
    }
}

/**
 * Fetch featured categories from API
 */
async function getFeaturedCategories() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            next: { revalidate: 300 },
            cache: 'force-cache', // ✅ Кеширай резултата
        });

        if (!res.ok) {
            console.error('Failed to fetch categories');
            return [];
        }

        const data = await res.json();
        const categories = data.data ?? [];

        // ✅ Филтрирай само featured
        return categories.filter((cat: any) => cat.is_featured === true);
    } catch (err) {
        console.error("❌ Error fetching categories:", err);
        return [];
    }
}

export default async function HomePage() {
    // Fetch data in parallel
    const [featuredProducts, featuredCategories] = await Promise.all([
        getFeaturedProducts(),
        getFeaturedCategories(),
    ]);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <HeroSection />

            {/* Featured Products */}
            <section className="py-16 bg-white">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                            Избрани Продукти
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Открийте най-новите и ексклузивни артикули от нашата колекция
                        </p>
                    </div>

                    {featuredProducts.length > 0 ? (
                        <FeaturedProducts products={featuredProducts} />
                    ) : (
                        <FeaturedProductsSkeleton />
                    )}
                </div>
            </section>

            {/* Categories - Показвай само ако има featured */}
            {featuredCategories.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                                Категории
                            </h2>
                            <p className="text-gray-600">
                                Разгледайте нашите колекции по категории
                            </p>
                        </div>

                        <CategoryGrid categories={featuredCategories} />
                    </div>
                </section>
            )}

            {/* Newsletter */}
            <Newsletter />
        </div>
    );
}

/**
 * Loading skeleton for featured products
 */
function FeaturedProductsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
            ))}
        </div>
    );
}