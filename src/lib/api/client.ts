// src/lib/api/client.ts
import axios from "axios";
import { getOrCreateCartToken } from "@/lib/cartToken";

/**
 * Axios client configuration for Laravel API
 * - Base URL comes from NEXT_PUBLIC_API_URL
 * - Adds Authorization header
 * - Adds Accept-Language and X-Cart-Token
 * - Centralized error handling
 */
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: false, // Not using Sanctum session cookies
});

/**
 * Request interceptor:
 * Adds tokens and language settings to each request
 */
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            // Add bearer token if user is logged in
            const token = localStorage.getItem("auth_token");
            if (token) config.headers.Authorization = `Bearer ${token}`;

            // Localization (default bg)
            const locale = localStorage.getItem("locale") || "bg";
            config.headers["Accept-Language"] = locale;

            // Guest cart token (unique UUID)
            const cartToken = getOrCreateCartToken();
            if (cartToken) config.headers["X-Cart-Token"] = cartToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor:
 * Handles errors from Laravel API
 */
apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';

        // 401 → remove token and redirect to login
        // BUT: Don't redirect for wishlist endpoints - they can fail silently for non-authenticated users
        if (status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            // Don't redirect for wishlist endpoints - allow components to handle it gracefully
            if (!url.includes('/wishlist') && !window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }

        // Different types of errors
        if (status === 403) console.error("🚫 Forbidden");
        if (status === 404) console.error("❌ Resource not found");
        if (status === 422) {
            const data = error.response?.data || {};
            
            // Laravel validation errors format: { message: "...", errors: { field: [...] } }
            // Or custom error format: { error: { code, message, details } }
            let errorMessage = 'Validation error';
            
            if (data.message) {
                errorMessage = data.message;
            } else if (data.error) {
                // Custom error format
                if (typeof data.error === 'string') {
                    errorMessage = data.error;
                } else if (data.error.message) {
                    errorMessage = data.error.message;
                }
            } else if (data.errors) {
                // Format validation errors into readable message
                const errorKeys = Object.keys(data.errors);
                if (errorKeys.length > 0) {
                    const firstError = data.errors[errorKeys[0]];
                    errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
                }
            }
            
            console.error(
                "⚠️ Validation error",
                errorMessage,
                data
            );
            
            // Re-throw with more user-friendly message
            const enhancedError = new Error(errorMessage);
            (enhancedError as any).response = error.response;
            (enhancedError as any).validationErrors = data.errors || {};
            throw enhancedError;
        }

        if (status === 500) {
            const backendMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Unknown server error";

            console.error("💥 Server error:", backendMessage);
        }

        return Promise.reject(error);
    }
);
