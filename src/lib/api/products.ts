// src/lib/api/products.ts

import { apiClient } from './client';

interface ProductsParams {
    page?: number;
    per_page?: number;
    sort?: string;
    category_id?: number;
    search?: string;
}

export const productsApi = {
    getProducts: async (params?: ProductsParams) => {
        const response = await apiClient.get('/products', { params });
        return response.data; // Return full response with data & meta
    },

    getProduct: async (slug: string) => {
        const response = await apiClient.get(`/products/${slug}`);
        return response.data.data;
    },

    getFeatured: async () => {
        const response = await apiClient.get('/products/featured');
        return response.data.data;
    },

    search: async (query: string) => {
        const response = await apiClient.get('/search', { params: { q: query } });
        return response.data.data;
    },
};