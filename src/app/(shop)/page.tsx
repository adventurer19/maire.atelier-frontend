import HomeClient from './HomeClient';

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

/**
 * Fetch latest collection with products
 */
async function getLatestCollection() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/latest`, {
            next: { revalidate: 60 },
            cache: 'force-cache',
        });

        if (!res.ok) {
            console.error('Failed to fetch latest collection');
            return null;
        }

        const data = await res.json();
        return data.data ?? null;
    } catch (err) {
        console.error("❌ Error fetching latest collection:", err);
        return null;
    }
}

export default async function HomePage() {
    // Fetch data in parallel
    const [featuredProducts, featuredCategories, latestCollection] = await Promise.all([
        getFeaturedProducts(),
        getFeaturedCategories(),
        getLatestCollection(),
    ]);

    return (
        <HomeClient
            featuredProducts={featuredProducts}
            featuredCategories={featuredCategories}
            latestCollection={latestCollection}
        />
    );
}