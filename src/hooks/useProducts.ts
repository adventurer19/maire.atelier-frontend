// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";

/**
 * Query keys for caching products in React Query
 * Helps prevent duplicate queries and provides cache invalidation
 */
export const productKeys = {
    all: ["products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    list: (params: any) => [...productKeys.lists(), params] as const,
    details: () => [...productKeys.all, "detail"] as const,
    detail: (slug: string) => [...productKeys.details(), slug] as const,
    featured: () => [...productKeys.all, "featured"] as const,
};

/**
 * Hook for fetching all products
 */
export function useProducts(params?: any) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => productsApi.getProducts(params),
    });
}

/**
 * Hook for fetching a single product by slug
 */
export function useProduct(slug: string) {
    return useQuery({
        queryKey: productKeys.detail(slug),
        queryFn: () => productsApi.getProduct(slug),
        enabled: !!slug, // Only run the query if a slug is provided
    });
}

/**
 * Hook for fetching featured products
 */
export function useFeaturedProducts() {
    return useQuery({
        queryKey: productKeys.featured(),
        queryFn: () => productsApi.getFeatured(),
    });
}
