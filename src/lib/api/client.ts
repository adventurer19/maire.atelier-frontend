// src/lib/api/client.ts
import axios from "axios";
import { getOrCreateCartToken } from "@/lib/cartToken";

/**
 * Axios client configuration for Laravel API
 * - Base URL идва от NEXT_PUBLIC_API_URL
 * - Добавя Authorization header
 * - Добавя Accept-Language и X-Cart-Token
 * - Централизирано обработва грешки
 */
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: false, // ❌ не ползваме Sanctum session cookies
});

/**
 * ✅ Request interceptor:
 * Добавя токени и езикови настройки към всеки request
 */
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            // 🧩 Добавяме bearer token, ако потребителят е логнат
            const token = localStorage.getItem("auth_token");
            if (token) config.headers.Authorization = `Bearer ${token}`;

            // 🌍 Локализация (по подразбиране bg)
            const locale = localStorage.getItem("locale") || "bg";
            config.headers["Accept-Language"] = locale;

            // 🛒 Guest cart token (уникален UUID)
            const cartToken = getOrCreateCartToken();
            if (cartToken) config.headers["X-Cart-Token"] = cartToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * ⚠️ Response interceptor:
 * Обработва грешки от Laravel API
 */
apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error.response?.status;

        // 401 → изтриваме token и пренасочваме към login
        if (status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }

        // Различни видове грешки
        if (status === 403) console.error("🚫 Forbidden");
        if (status === 404) console.error("❌ Resource not found");
        if (status === 422) {
            const validation = error.response?.data;
            console.error(
                "⚠️ Validation error",
                validation?.errors || validation?.message || validation
            );
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
