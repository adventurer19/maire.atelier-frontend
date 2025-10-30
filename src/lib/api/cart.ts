// src/lib/api/cart.ts

import { apiClient } from './client';
import type { Cart, AddToCartPayload, UpdateCartItemPayload } from '@/types/cart';

interface ApiResponse<T> {
    data: T;
    message?: string;
}

interface CartCountResponse {
    data: {
        count: number;
    };
}

interface CartValidationResponse {
    data: {
        valid: boolean;
        errors: string[];
    };
}

export const cartApi = {

    getCart: async (): Promise<Cart> => {
        const response = await apiClient.get<ApiResponse<Cart>>('/cart');
        return response.data.data;
    },

    /**
     * Взема само броя на артикулите в кошницата (по-лека заявка)
     * GET /api/cart/count
     * Използва се за badge в header-а
     */
    getCartCount: async (): Promise<number> => {
        const response = await apiClient.get<CartCountResponse>('/cart/count');
        return response.data.data.count;
    },

    /**
     * Добавя продукт в кошницата
     * POST /api/cart/items
     */
    addItem: async (payload: AddToCartPayload): Promise<Cart> => {
        const response = await apiClient.post<ApiResponse<any>>('/cart/items', payload);

        // След добавяне, взимаме актуалната кошница
        return cartApi.getCart();
    },

    /**
     * Обновява количеството на продукт в кошницата
     * PUT /api/cart/items/{itemId}
     */
    updateItem: async (itemId: number, payload: UpdateCartItemPayload): Promise<Cart> => {
        await apiClient.put(`/cart/items/${itemId}`, payload);

        // След обновяване, взимаме актуалната кошница
        return cartApi.getCart();
    },

    /**
     * Премахва продукт от кошницата
     * DELETE /api/cart/items/{itemId}
     */
    removeItem: async (itemId: number): Promise<Cart> => {
        await apiClient.delete(`/cart/items/${itemId}`);

        // След премахване, взимаме актуалната кошница
        return cartApi.getCart();
    },

    /**
     * Изтрива цялата кошница
     * DELETE /api/cart
     */
    clearCart: async (): Promise<void> => {
        await apiClient.delete('/cart');
    },

    /**
     * Валидира кошницата преди checkout
     * POST /api/cart/validate
     * Проверява наличност, активни продукти и т.н.
     */
    validateCart: async (): Promise<{ valid: boolean; errors: string[] }> => {
        const response = await apiClient.post<CartValidationResponse>('/cart/validate');
        return response.data.data;
    },
};