// src/lib/api/client.ts

import axios, { AxiosError } from 'axios';

/**
 * Base API client configuration
 * Configured to work with Laravel Sanctum authentication
 */
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://maire.atelier.test/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Required for Laravel
    },
    withCredentials: true, // Important for Sanctum CSRF cookie
});

/**
 * Initialize CSRF token
 * Call this before first authenticated request
 */
export const initCsrf = async () => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://maire.atelier.test';
        await axios.get(`${baseUrl}/sanctum/csrf-cookie`, {
            withCredentials: true,
        });
    } catch (error) {
        console.error('Failed to initialize CSRF token:', error);
    }
};

/**
 * Request interceptor
 * Adds authentication token if available
 */
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage (set after login)
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add locale header for translations
        const locale = typeof window !== 'undefined' ? localStorage.getItem('locale') || 'en' : 'en';
        config.headers['Accept-Language'] = locale;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 * Handle common errors globally
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError<any>) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Clear auth token
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');

                // Redirect to login if not already there
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error('Access denied:', error.response.data.message);
        }

        // Handle 404 Not Found
        if (error.response?.status === 404) {
            console.error('Resource not found:', error.response.data.message);
        }

        // Handle 422 Validation Error
        if (error.response?.status === 422) {
            const validationErrors = error.response.data.errors;
            console.error('Validation errors:', validationErrors);
        }

        // Handle 500 Server Error
        if (error.response?.status === 500) {
            console.error('Server error:', error.response.data.message);
        }

        return Promise.reject(error);
    }
);