import type { Category } from '@/types';
import { CategoryCard } from '@/components/shop/CategoryCard';
import { EmptyState } from '@/components/ui/EmptyState';

export const metadata = {
    title: 'Категории | MAIRE ATELIER',
    description: 'Разгледайте всички категории продукти в нашия магазин',
};

/**
 * Fetch all categories from API
 */
async function getCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch categories: ${res.status}`);
        }

        const data = await res.json();
        console.log('✅ Categories fetched:', data);

        // API може да връща или масив, или { data: [...] }
        return Array.isArray(data) ? data : data.data ?? [];
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        return [];
    }
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    // Filter categories
    const rootCategories = categories.filter((cat) => !cat.parent_id && cat.is_active);
    const featuredCategories = rootCategories.filter((cat) => cat.is_featured);
    const regularCategories = rootCategories.filter((cat) => !cat.is_featured);

    if (categories.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold">Няма намерени категории</h1>
                <p className="text-gray-500 mt-4">
                    Проверете API-то или добавете категории в администрацията.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                <div className="container py-16 sm:py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4">
                            Категории
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-300">
                            Открийте нашата колекция организирана по стил и предназначение
                        </p>
                    </div>
                </div>
            </div>

            <div className="container py-12">
                {/* Featured Categories */}
                {featuredCategories.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                                Препоръчани категории
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredCategories.map((category) => (
                                <CategoryCard key={category.id} category={category} featured />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Categories */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                            Всички категории
                        </h2>
                        <span className="text-sm text-gray-600">
                            {rootCategories.length}{' '}
                            {rootCategories.length === 1 ? 'категория' : 'категории'}
                        </span>
                    </div>

                    {regularCategories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {regularCategories.map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </section>
            </div>
        </div>
    );
}
