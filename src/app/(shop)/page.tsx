// src/app/(shop)/page.tsx
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryGrid from '@/components/home/CategoryGrid';
import Newsletter from '@/components/home/Newsletter';

export const metadata = {
    title: 'MAIRE ATELIER - Modern Fashion',
    description: 'Открийте нашата колекция от уникални модни дрехи',
};

async function getFeaturedProducts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/products/featured`, {
            next: { revalidate: 60 }, // кешира 60 сек
        });

        if (!res.ok) throw new Error("Failed to fetch featured products");
        const data = await res.json();
        return data.products ?? data.data ?? [];
    } catch (err) {
        console.error("❌ Error fetching featured products:", err);
        return [];
    }
}

export default async function HomePage() {
    const featuredProducts = await getFeaturedProducts();

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
                            Открийте нашата селекция от уникални модни парчета
                        </p>
                    </div>

                    {featuredProducts.length > 0 ? (
                        <FeaturedProducts products={featuredProducts} />
                    ) : (
                        <FeaturedProductsSkeleton />
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-gray-50">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                            Категории
                        </h2>
                        <p className="text-gray-600">Разгледайте нашите колекции</p>
                    </div>

                    <CategoryGrid />
                </div>
            </section>

            {/* Newsletter */}
            <Newsletter />
        </div>
    );
}

// ✅ Loading skeleton
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
