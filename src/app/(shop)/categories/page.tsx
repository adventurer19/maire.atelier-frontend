import type { Category } from '@/types';
import { CategoryCard } from '@/components/shop/CategoryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import CategoriesClient from './CategoriesClient';

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
        return <CategoriesEmptyClient />;
    }

    return (
        <CategoriesClient
            rootCategories={rootCategories}
            featuredCategories={featuredCategories}
            regularCategories={regularCategories}
        />
    );
}

// Empty state component - will be handled by CategoriesClient
function CategoriesEmptyClient() {
    return (
        <CategoriesClient
            rootCategories={[]}
            featuredCategories={[]}
            regularCategories={[]}
        />
    );
}
