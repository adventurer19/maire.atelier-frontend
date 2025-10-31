// src/lib/api/products.ts
import { apiClient } from "./client";
import type { Product, PaginationMeta } from "@/types";

interface ProductsParams {
    page?: number;
    per_page?: number;
    sort?: string;
    category_id?: number;
    category?: string; // slug
    search?: string;
    price_min?: number;
    price_max?: number;
    in_stock?: boolean;
    on_sale?: boolean;
}

interface ProductsResponse {
    data: Product[];
    meta?: PaginationMeta;
}

const productsCache = new Map<string, any>();

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
    getProducts: async (params?: ProductsParams): Promise<ProductsResponse> => {
        const cacheKey = JSON.stringify(params || {});
        if (productsCache.has(cacheKey)) {
            return productsCache.get(cacheKey);
        }
        try {
            // Build query params
            const queryParams: Record<string, any> = {};

            if (params?.page) queryParams.page = params.page;
            if (params?.per_page) queryParams.per_page = params.per_page;
            if (params?.sort) queryParams.sort = params.sort;
            if (params?.category_id) queryParams.category_id = params.category_id;
            if (params?.search) queryParams.search = params.search;
            if (params?.price_min) queryParams.price_min = params.price_min;
            if (params?.price_max) queryParams.price_max = params.price_max;
            if (params?.in_stock) queryParams.in_stock = 1;
            if (params?.on_sale) queryParams.on_sale = 1;

            const res = await apiClient.get("/products", { params: queryParams });

            // Laravel returns { data: [...], meta: {...} }
            const data = res.data?.data ?? [];
            const meta = res.data?.meta ?? {
                current_page: 1,
                last_page: 1,
                per_page: params?.per_page || 12,
                total: data.length,
            };

            const result = { data, meta };
            productsCache.set(cacheKey, result);
            return result;
        } catch (error: any) {
            if (error.response?.status === 429) {
                console.error("⚠️ Too many requests - throttled by Laravel (429)");
            } else {
                console.error("❌ Error fetching products:", error);
            }
            return {
                data: [],
                meta: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 12,
                    total: 0,
                },
            };
        }
    },

    /**
     * Fetch products by category slug
     * This is a helper method that fetches category first, then products
     */
    getProductsByCategory: async (
        categorySlug: string,
        params?: Omit<ProductsParams, 'category_id'>
    ): Promise<ProductsResponse> => {
        try {
            // First, get the category to find its ID
            const categoryRes = await apiClient.get(`/categories/${categorySlug}`);
            const categoryId = categoryRes.data?.data?.category?.id;

            if (!categoryId) {
                return {
                    data: [],
                    meta: {
                        current_page: 1,
                        last_page: 1,
                        per_page: 12,
                        total: 0,
                    },
                };
            }

            // Now fetch products with category_id
            return await productsApi.getProducts({
                ...params,
                category_id: categoryId,
            });
        } catch (error) {
            console.error("❌ Error fetching products by category:", error);
            return {
                data: [],
                meta: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 12,
                    total: 0,
                },
            };
        }
    },

    /**
     * Fetch a single product by slug
     */
    getProduct: async (slug: string): Promise<Product | null> => {
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
    getFeatured: async (limit: number = 8): Promise<Product[]> => {
        try {
            const res = await apiClient.get("/products/featured", {
                params: { limit },
            });
            const data = res.data?.data ?? [];
            return data;
        } catch (error) {
            console.error("❌ Error fetching featured products:", error);
            return [];
        }
    },

    /**
     * Search products by query string
     */
    search: async (
        query: string,
        params?: Omit<ProductsParams, 'search'>
    ): Promise<ProductsResponse> => {
        try {
            const res = await apiClient.get("/search", {
                params: {
                    q: query,
                    ...params,
                },
            });

            const data = res.data?.data ?? [];
            const meta = res.data?.meta ?? {
                current_page: 1,
                last_page: 1,
                per_page: 12,
                total: data.length,
            };

            return { data, meta };
        } catch (error) {
            console.error("❌ Error searching products:", error);
            return {
                data: [],
                meta: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 12,
                    total: 0,
                },
            };
        }
    },
};