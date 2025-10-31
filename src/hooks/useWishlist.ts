// src/hooks/useWishlist.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/lib/api/wishlist';
import type { Product } from '@/types';

/**
 * Wishlist Query Keys
 */
export const wishlistKeys = {
    all: ['wishlist'] as const,
    detail: () => [...wishlistKeys.all, 'detail'] as const,
};

/**
 * useWishlist Hook
 * Main hook for wishlist data and operations
 */
export function useWishlist() {
    const {
        data: products = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: wishlistKeys.detail(),
        queryFn: wishlistApi.getWishlist,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });

    return {
        products,
        isLoading,
        isError,
        error,
        refetch,
    };
}

/**
 * useAddToWishlist Hook
 * Mutation for adding products to wishlist
 */
export function useAddToWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: number) => wishlistApi.addToWishlist(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
        },
        onError: (error) => {
            console.error('Failed to add to wishlist:', error);
        },
    });
}

/**
 * useRemoveFromWishlist Hook
 * Mutation for removing products from wishlist
 */
export function useRemoveFromWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: number) => wishlistApi.removeFromWishlist(productId),
        onMutate: async (productId) => {
            await queryClient.cancelQueries({ queryKey: wishlistKeys.detail() });

            const previousProducts = queryClient.getQueryData<Product[]>(wishlistKeys.detail());

            // Optimistically remove product from UI
            queryClient.setQueryData<Product[]>(wishlistKeys.detail(), (old = []) =>
                old.filter((p) => p.id !== productId)
            );

            return { previousProducts };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
        },
        onError: (error, variables, context) => {
            if (context?.previousProducts) {
                queryClient.setQueryData(wishlistKeys.detail(), context.previousProducts);
            }
            console.error('Failed to remove from wishlist:', error);
        },
    });
}

/**
 * useToggleWishlist Hook
 * Mutation for toggling products in wishlist
 */
export function useToggleWishlist() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: number) => wishlistApi.toggleWishlist(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
        },
        onError: (error) => {
            console.error('Failed to toggle wishlist:', error);
        },
    });
}

