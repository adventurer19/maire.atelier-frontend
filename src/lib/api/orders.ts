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
        payment_method: string;
        payment_data?: Record<string, any>;
        shipping_provider: string;
        shipping_method: string;
        shipping_office_id?: string;
        shipping_office_name?: string;
        shipping_office_address?: string;
        shipping_address?: {
            first_name: string;
            last_name: string;
            company?: string;
            address_line1: string;
            address_line2?: string;
            city: string;
            state?: string;
            postal_code?: string;
            country?: string;
            phone: string;
            email?: string;
        };
        guest_name?: string;
        guest_email?: string;
        guest_phone?: string;
        cart_token?: string;
        requires_invoice?: boolean;
        invoice_company_name?: string;
        invoice_tax_number?: string;
        invoice_address?: string;
        notes?: string;
        discount_total?: number;
    }): Promise<Order> => {
        const response = await apiClient.post<ApiResponse<Order>>('/orders', payload);
        return response.data.data;
    },

    /**
     * Get shipping offices for a provider
     * GET /api/shipping/offices
     */
    getShippingOffices: async (provider: string, city?: string): Promise<any[]> => {
        const params = new URLSearchParams({ provider });
        if (city) params.append('city', city);
        const response = await apiClient.get<ApiResponse<any[]>>(`/shipping/offices?${params.toString()}`);
        return response.data.data || [];
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

