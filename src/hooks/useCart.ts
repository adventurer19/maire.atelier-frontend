// src/hooks/useCart.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api/cart';
import type { AddToCartPayload, UpdateCartItemPayload } from '@/types/cart';

/**
 * Cart Query Keys
 * Centralized query keys for better cache management
 */
export const cartKeys = {
    all: ['cart'] as const,
    detail: () => [...cartKeys.all, 'detail'] as const,
    count: () => [...cartKeys.all, 'count'] as const,
};

/**
 * useCart Hook
 * Main hook for cart data and operations
 */
export function useCart() {
    const queryClient = useQueryClient();

    // Fetch cart with items and summary
    const {
        data: cart,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: cartKeys.detail(),
        queryFn: cartApi.getCart,
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 2,
    });

    // Get cart item count (lightweight)
    const { data: cartCount } = useQuery({
        queryKey: cartKeys.count(),
        queryFn: cartApi.getCartCount,
        staleTime: 1000 * 60, // 1 minute
        enabled: !cart, // Only fetch if full cart not loaded
    });

    // Derive item count from cart or use separate count
    const itemCount = cart?.summary.total_items ?? cartCount ?? 0;

    return {
        cart,
        itemCount,
        isLoading,
        isError,
        error,
        refetch,
    };
}

/**
 * useAddToCart Hook
 * Mutation for adding items to cart
 */
export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddToCartPayload) => cartApi.addItem(payload),
        onMutate: async (newItem) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: cartKeys.detail() });

            // Snapshot previous value for rollback
            const previousCart = queryClient.getQueryData(cartKeys.detail());

            // Optimistically update cart count
            queryClient.setQueryData(cartKeys.count(), (old: number = 0) => old + newItem.quantity);

            return { previousCart };
        },
        onSuccess: () => {
            // Invalidate and refetch cart
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
        },
        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousCart) {
                queryClient.setQueryData(cartKeys.detail(), context.previousCart);
            }
            console.error('Failed to add to cart:', error);
        },
    });
}

/**
 * useUpdateCartItem Hook
 * Mutation for updating item quantity
 */
export function useUpdateCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, payload }: { itemId: number; payload: UpdateCartItemPayload }) =>
            cartApi.updateItem(itemId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
        },
        onError: (error) => {
            console.error('Failed to update cart item:', error);
        },
    });
}

/**
 * useRemoveCartItem Hook
 * Mutation for removing items from cart
 */
export function useRemoveCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: number) => cartApi.removeItem(itemId),
        onMutate: async (itemId) => {
            await queryClient.cancelQueries({ queryKey: cartKeys.detail() });

            const previousCart = queryClient.getQueryData(cartKeys.detail());

            // Optimistically remove item from UI
            queryClient.setQueryData(cartKeys.detail(), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    items: old.items.filter((item: any) => item.id !== itemId),
                    summary: {
                        ...old.summary,
                        total_items: old.summary.total_items - 1,
                    },
                };
            });

            return { previousCart };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
        },
        onError: (error, variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(cartKeys.detail(), context.previousCart);
            }
            console.error('Failed to remove cart item:', error);
        },
    });
}

/**
 * useClearCart Hook
 * Mutation for clearing entire cart
 */
export function useClearCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.clearCart,
        onSuccess: () => {
            // Reset cart data
            queryClient.setQueryData(cartKeys.detail(), null);
            queryClient.setQueryData(cartKeys.count(), 0);
        },
        onError: (error) => {
            console.error('Failed to clear cart:', error);
        },
    });
}

/**
 * useValidateCart Hook
 * Mutation for validating cart before checkout
 */
export function useValidateCart() {
    return useMutation({
        mutationFn: cartApi.validateCart,
    });
}