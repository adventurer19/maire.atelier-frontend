// src/lib/api/client.ts
import { Product, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://maire.atelier.test/api';

export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return response.json();
    }

    // Products
    async getProducts(params?: {
        page?: number;
        per_page?: number;
        category_id?: number;
    }) {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.per_page) searchParams.set('per_page', params.per_page.toString());
        if (params?.category_id) searchParams.set('category_id', params.category_id.toString());

        const query = searchParams.toString();
        return this.request<ApiResponse<Product[]>>(
            `/products${query ? `?${query}` : ''}`
        );
    }

    async getProduct(slug: string) {
        return this.request<ApiResponse<Product>>(`/products/${slug}`);
    }

    async getFeaturedProducts(limit: number = 8) {
        return this.request<ApiResponse<Product[]>>(
            `/products/featured?limit=${limit}`
        );
    }

    async searchProducts(query: string, page: number = 1) {
        return this.request<ApiResponse<Product[]>>(
            `/search?q=${encodeURIComponent(query)}&page=${page}`
        );
    }
}

export const api = new ApiClient();