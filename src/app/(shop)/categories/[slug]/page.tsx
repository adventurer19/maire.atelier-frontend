import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/types';

async function getCategory(slug: string): Promise<Category | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) throw new Error('Failed to fetch category');
        const data = await res.json();

        // API може да връща { data: {...} } или просто {...}
        return data.data ?? data ?? null;
    } catch (err) {
        console.error('❌ Error fetching category:', err);
        return null;
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    // ✅ Новият начин: await params преди достъп
    const { slug } = await params;

    const category = await getCategory(slug);
    if (!category) return notFound();

    const image = category.image || `/categories/${category.slug}.jpg`;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero section */}
            <div className="relative w-full h-80 bg-gray-200 overflow-hidden">
                <Image
                    src={image}
                    alt={category.name?.bg || category.name || 'Category'}
                    fill
                    className="object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/1200x600/e5e5e5/666666?text=Category';
                    }}
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
                    <h1 className="text-4xl font-serif font-bold">{category.name?.bg || category.name}</h1>
                    {category.description && (
                        <p className="text-lg text-gray-200 max-w-2xl text-center mt-4">
                            {typeof category.description === 'string'
                                ? category.description
                                : category.description.bg || category.description.en}
                        </p>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="container py-12">
                <Link
                    href="/categories"
                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    ← Обратно към категориите
                </Link>

                <div className="mt-10">
                    <h2 className="text-2xl font-serif font-bold mb-4">Продукти в тази категория</h2>
                    {/* TODO: тук можеш да заредиш продукти по категория */}
                </div>
            </div>
        </div>
    );
}
