// src/lib/api/products.ts
import { apiClient } from "./client";

interface ProductsParams {
    page?: number;
    per_page?: number;
    sort?: string;
    category_id?: number;
    search?: string;
}

/**
 * Products API module for Laravel
 * Normalizes all responses to always return:
 * {
 *   data: Product[],
 *   meta: PaginationMeta
 * }
 */
export const productsApi = {
    /**
     * Fetch all products with pagination & filters
     */
    getProducts: async (params?: ProductsParams) => {
        const res = await apiClient.get("/products", { params });

        // Laravel returns { data: [...], meta: {...} }
        // We normalize it so the frontend always gets { data, meta }
        const data = res.data?.data ?? [];
        const meta = res.data?.meta ?? {};

        return { data, meta };
    },

    /**
     * Fetch a single product by slug
     */
    getProduct: async (slug: string) => {
        try {
            const res = await apiClient.get(`/products/${slug}`);
            // Laravel returns { data: {...} }, so extract inner data
            return res.data?.data ?? null;
        } catch (error) {
            console.error("❌ Error fetching product:", error);
            return null;
        }
    },

    /**
     * Fetch featured products
     */
    getFeatured: async () => {
        const res = await apiClient.get("/products/featured");
        const data = res.data?.data ?? [];
        return { data };
    },

    /**
     * Search products by query string
     */
    search: async (query: string) => {
        const res = await apiClient.get("/search", { params: { q: query } });
        const data = res.data?.data ?? [];
        const meta = res.data?.meta ?? {};
        return { data, meta };
    },
};
