// src/lib/api/config.ts

/**
 * Get the API base URL
 * Falls back to default if NEXT_PUBLIC_API_URL is not set
 */
export function getApiBaseUrl(): string {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
}

