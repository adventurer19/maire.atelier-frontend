// src/hooks/useOrders.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api/orders';
import type { Order } from '@/types/order';

/**
 * Orders Query Keys
 */
export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    list: () => [...orderKeys.lists(), 'all'] as const,
    details: () => [...orderKeys.all, 'detail'] as const,
    detail: (id: number | string) => [...orderKeys.details(), id] as const,
};

/**
 * useOrders Hook
 * Fetch all orders for the current user
 */
export function useOrders() {
    const {
        data: orders = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: orderKeys.list(),
        queryFn: ordersApi.getOrders,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });

    return {
        orders,
        isLoading,
        isError,
        error,
        refetch,
    };
}

/**
 * useOrder Hook
 * Fetch a single order by ID
 */
export function useOrder(orderId: number | string | null) {
    const {
        data: order,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: orderKeys.detail(orderId!),
        queryFn: () => ordersApi.getOrder(orderId!),
        enabled: !!orderId,
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });

    return {
        order,
        isLoading,
        isError,
        error,
        refetch,
    };
}

/**
 * useCancelOrder Hook
 * Mutation for canceling an order
 */
export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId: number | string) => ordersApi.cancelOrder(orderId),
        onSuccess: (data) => {
            // Invalidate orders list and specific order
            queryClient.invalidateQueries({ queryKey: orderKeys.list() });
            queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
        },
        onError: (error) => {
            console.error('Failed to cancel order:', error);
        },
    });
}

