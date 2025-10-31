// src/lib/api/orders.ts

import { apiClient } from './client';
import type { Order } from '@/types/order';

interface ApiResponse<T> {
    data: T;
    message?: string;
}

/**
 * Orders API module
 * Handles order operations for authenticated users
 */
export const ordersApi = {
    /**
     * Get all orders for the current user
     * GET /api/orders
     */
    getOrders: async (): Promise<Order[]> => {
        const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
        return response.data.data || [];
    },

    /**
     * Get a single order by ID
     * GET /api/orders/{id}
     */
    getOrder: async (orderId: number | string): Promise<Order> => {
        const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
        return response.data.data;
    },

    /**
     * Create a new order from cart
     * POST /api/orders
     */
    createOrder: async (payload: {
        address_id: number;
        payment_method: string;
        notes?: string;
    }): Promise<Order> => {
        const response = await apiClient.post<ApiResponse<Order>>('/orders', payload);
        return response.data.data;
    },

    /**
     * Cancel an order
     * POST /api/orders/{id}/cancel
     */
    cancelOrder: async (orderId: number | string): Promise<Order> => {
        const response = await apiClient.post<ApiResponse<Order>>(`/orders/${orderId}/cancel`);
        return response.data.data;
    },
};

