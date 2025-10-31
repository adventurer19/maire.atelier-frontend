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

// Simple in-memory cache with TTL and request coalescing
const CACHE_TTL_MS = 60_000; // 1 min
const productsCache = new Map<string, { expiresAt: number; value: any }>();
const pendingRequests = new Map<string, Promise<any>>();

function getCached(key: string) {
    const item = productsCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
        productsCache.delete(key);
        return null;
    }
    return item.value;
}

function setCached(key: string, value: any, ttlMs: number = CACHE_TTL_MS) {
    productsCache.set(key, { expiresAt: Date.now() + ttlMs, value });
}

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Persistent cache via localStorage (best-effort)
function getPersistent(key: string) {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(`catalog:${key}`);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() > parsed.expiresAt) {
            localStorage.removeItem(`catalog:${key}`);
            return null;
        }
        return parsed.value;
    } catch {
        return null;
    }
}

function setPersistent(key: string, value: any, ttlMs: number = CACHE_TTL_MS) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(
            `catalog:${key}`,
            JSON.stringify({ expiresAt: Date.now() + ttlMs, value })
        );
    } catch {}
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
    getProducts: async (params?: ProductsParams): Promise<ProductsResponse> => {
        const cacheKey = JSON.stringify(params || {});
        const cached = getCached(cacheKey) ?? getPersistent(cacheKey);
        if (cached) return cached;

        if (pendingRequests.has(cacheKey)) {
            return pendingRequests.get(cacheKey)!;
        }

        const requestPromise = (async () => {
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

            // Retry with backoff on 429
            let attempt = 0;
            let res;
            while (true) {
                try {
                    res = await apiClient.get("/products", { params: queryParams });
                    break;
                } catch (err: any) {
                    if (err.response?.status === 429 && attempt < 2) {
                        const delay = 300 * Math.pow(2, attempt) + Math.floor(Math.random() * 100);
                        await sleep(delay);
                        attempt++;
                        continue;
                    }
                    throw err;
                }
            }

            // Laravel returns { data: [...], meta: {...} }
            const data = res.data?.data ?? [];
            const meta = res.data?.meta ?? {
                current_page: 1,
                last_page: 1,
                per_page: params?.per_page || 12,
                total: data.length,
            };

            const result = { data, meta };
            setCached(cacheKey, result);
            setPersistent(cacheKey, result);
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
        } finally {
            pendingRequests.delete(cacheKey);
        }
        })();

        pendingRequests.set(cacheKey, requestPromise);
        return requestPromise;
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
        const cacheKey = `product:${slug}`;
        const cached = getCached(cacheKey) ?? getPersistent(cacheKey);
        if (cached) return cached;
        try {
            let attempt = 0;
            let res;
            while (true) {
                try {
                    res = await apiClient.get(`/products/${slug}`);
                    break;
                } catch (err: any) {
                    if (err.response?.status === 429 && attempt < 2) {
                        await sleep(300 * Math.pow(2, attempt));
                        attempt++;
                        continue;
                    }
                    throw err;
                }
            }
            const data = res.data?.data ?? null;
            setCached(cacheKey, data);
            setPersistent(cacheKey, data);
            return data;
        } catch (error) {
            console.error("❌ Error fetching product:", error);
            return null;
        }
    },

    /**
     * Fetch featured products
     */
    getFeatured: async (limit: number = 8): Promise<Product[]> => {
        const cacheKey = `featured:${limit}`;
        const cached = getCached(cacheKey) ?? getPersistent(cacheKey);
        if (cached) return cached;
        try {
            let attempt = 0;
            let res;
            while (true) {
                try {
                    res = await apiClient.get("/products/featured", { params: { limit } });
                    break;
                } catch (err: any) {
                    if (err.response?.status === 429 && attempt < 2) {
                        await sleep(300 * Math.pow(2, attempt));
                        attempt++;
                        continue;
                    }
                    throw err;
                }
            }
            const data = res.data?.data ?? [];
            setCached(cacheKey, data);
            setPersistent(cacheKey, data);
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
        const cacheKey = `search:${query}:${JSON.stringify(params || {})}`;
        const cached = getCached(cacheKey) ?? getPersistent(cacheKey);
        if (cached) return cached;
        try {
            let attempt = 0;
            let res;
            while (true) {
                try {
                    res = await apiClient.get("/search", { params: { q: query, ...params } });
                    break;
                } catch (err: any) {
                    if (err.response?.status === 429 && attempt < 2) {
                        await sleep(300 * Math.pow(2, attempt));
                        attempt++;
                        continue;
                    }
                    throw err;
                }
            }

            const data = res.data?.data ?? [];
            const meta = res.data?.meta ?? {
                current_page: 1,
                last_page: 1,
                per_page: 12,
                total: data.length,
            };

            const result = { data, meta };
            setCached(cacheKey, result);
            setPersistent(cacheKey, result);
            return result;
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