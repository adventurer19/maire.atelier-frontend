// src/lib/api/wishlist.ts

import { apiClient } from './client';
import type { Product } from '@/types';

interface ApiResponse<T> {
    data: T;
    message?: string;
}

/**
 * Wishlist API module
 * Handles wishlist operations for authenticated users
 */
export const wishlistApi = {
    /**
     * Get all wishlist items
     * GET /api/wishlist
     */
    getWishlist: async (): Promise<Product[]> => {
        const response = await apiClient.get<ApiResponse<Product[]>>('/wishlist');
        return response.data.data || [];
    },

    /**
     * Add product to wishlist
     * POST /api/wishlist
     */
    addToWishlist: async (productId: number): Promise<Product> => {
        const response = await apiClient.post<ApiResponse<Product>>('/wishlist', {
            product_id: productId,
        });
        return response.data.data;
    },

    /**
     * Remove product from wishlist
     * DELETE /api/wishlist/{productId}
     */
    removeFromWishlist: async (productId: number): Promise<void> => {
        await apiClient.delete(`/wishlist/${productId}`);
    },

    /**
     * Toggle product in wishlist (add if not present, remove if present)
     * POST /api/wishlist/toggle/{productId}
     * Note: This endpoint may not be implemented in the backend yet
     */
    toggleWishlist: async (productId: number): Promise<{ isInWishlist: boolean; product?: Product }> => {
        // First check if product is in wishlist
        const wishlist = await wishlistApi.getWishlist();
        const isInWishlist = wishlist.some((p) => p.id === productId);

        if (isInWishlist) {
            // Remove from wishlist
            await wishlistApi.removeFromWishlist(productId);
            return { isInWishlist: false };
        } else {
            // Add to wishlist
            const product = await wishlistApi.addToWishlist(productId);
            return { isInWishlist: true, product };
        }
    },
};

