// src/lib/api/categories.ts
import { apiClient } from "./client";

export interface Category {
    id: number;
    slug: string;
    name: string;
    description?: string;
    image?: string;
    parent_id?: number | null;
    is_active: boolean;
    is_featured: boolean;
    show_in_menu: boolean;
    position: number;
    children?: Category[];
}

interface CategoriesResponse {
    data: Category[];
}

interface CategoryDetailResponse {
    data: {
        category: Category;
        breadcrumb: Array<{ id: number; slug: string; name: string }>;
        products: any[];
        meta: {
            pagination: {
                total: number;
                current_page: number;
                last_page: number;
            };
        };
    };
}

/**
 * Categories API module
 */
export const categoriesApi = {
    /**
     * Get all categories (with hierarchy)
     */
    getAll: async (): Promise<Category[]> => {
        const res = await apiClient.get<CategoriesResponse>("/categories");
        return res.data?.data ?? [];
    },

    /**
     * Get single category by slug with products
     */
    getBySlug: async (slug: string) => {
        const res = await apiClient.get<CategoryDetailResponse>(`/categories/${slug}`);
        return res.data?.data ?? null;
    },

    /**
     * Get only featured categories (for homepage)
     */
    getFeatured: async (): Promise<Category[]> => {
        const categories = await categoriesApi.getAll();
        return categories.filter(cat => cat.is_featured && cat.is_active);
    },

    /**
     * Get categories for menu/navigation
     */
    getMenuCategories: async (): Promise<Category[]> => {
        const categories = await categoriesApi.getAll();
        return categories.filter(cat => cat.show_in_menu && cat.is_active);
    },
};