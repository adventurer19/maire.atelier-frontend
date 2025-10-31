// src/lib/api/collections.ts

import { apiClient } from './client';
import type { Collection } from '@/types/collection';
import type { PaginationMeta } from '@/types';

interface ApiResponse<T> {
    data: T;
    message?: string;
}

interface PaginatedResponse<T> extends ApiResponse<T> {
    meta?: PaginationMeta;
}

/**
 * Collections API module
 * Handles collection operations
 */
export const collectionsApi = {
    /**
     * Get all collections (paginated)
     * GET /api/collections
     */
    getCollections: async (params?: {
        per_page?: number;
        page?: number;
    }): Promise<{ collections: Collection[]; meta?: PaginationMeta }> => {
        const queryParams = new URLSearchParams();
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params?.page) queryParams.append('page', params.page.toString());

        const response = await apiClient.get<PaginatedResponse<Collection[]>>(
            `/collections${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        );

        return {
            collections: response.data.data || [],
            meta: response.data.meta,
        };
    },

    /**
     * Get a single collection by slug
     * GET /api/collections/{slug}
     */
    getCollection: async (slug: string): Promise<Collection> => {
        const response = await apiClient.get<ApiResponse<Collection>>(`/collections/${slug}`);
        return response.data.data;
    },

    /**
     * Get the latest/featured collection with products
     * GET /api/collections/latest
     */
    getLatestCollection: async (): Promise<Collection | null> => {
        try {
            const response = await apiClient.get<ApiResponse<Collection>>('/collections/latest');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching latest collection:', error);
            return null;
        }
    },
};

