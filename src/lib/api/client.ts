// src/lib/api/client.ts
import axios from "axios";

/**
 * Axios client configuration for Laravel API
 * - Base URL comes from NEXT_PUBLIC_API_URL
 * - Handles authorization headers
 * - Provides centralized error handling
 */
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: false, // Disable Sanctum cookies unless you need them
});

/**
 * Request interceptor:
 * - Adds Bearer token from localStorage
 * - Adds Accept-Language header
 */
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("auth_token");
            if (token) config.headers.Authorization = `Bearer ${token}`;

            const locale = localStorage.getItem("locale") || "bg";
            config.headers["Accept-Language"] = locale;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor:
 * - Handles 401 (unauthorized) by redirecting to /login
 * - Logs 403, 404, 422, and 500 errors for debugging
 */
apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error.response?.status;

        if (status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }

        if (status === 403) console.error("🚫 Forbidden");
        if (status === 404) console.error("❌ Resource not found");
        if (status === 422) console.error("⚠️ Validation error", error.response.data.errors);
        if (status === 500) console.error("💥 Server error:", error.response.data.message);

        return Promise.reject(error);
    }
);
