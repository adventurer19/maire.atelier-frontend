// src/lib/api/newsletter.ts
import { apiClient } from './client';

interface NewsletterResponse {
    message: string;
    subscriber?: {
        email: string;
        status: string;
        subscribed_at?: string;
    };
}

interface NewsletterError {
    error: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
}

export const newsletterApi = {
    /**
     * Subscribe email to newsletter
     */
    subscribe: async (email: string): Promise<NewsletterResponse> => {
        try {
            // Additional client-side validation
            if (!email || email.trim().length === 0) {
                throw new Error('Email address is required.');
            }

            if (email.length > 255) {
                throw new Error('Email address is too long.');
            }

            // Check for email injection attempts
            const dangerousChars = ["\r", "\n", "%0a", "%0d", "%00", "<", ">"];
            for (const char of dangerousChars) {
                if (email.includes(char)) {
                    throw new Error('Invalid email format.');
                }
            }

            const response = await apiClient.post<{ data: NewsletterResponse }>('/newsletter/subscribe', {
                email: email.trim().toLowerCase(),
                honeypot: '', // Honeypot field for bot detection
            });
            // Laravel returns { data: {...} }
            return response.data.data;
        } catch (error: any) {
            const errorData = error.response?.data as NewsletterError;
            
            // Handle rate limiting
            if (error.response?.status === 429) {
                throw new Error(
                    errorData?.error?.message || 
                    'Too many subscription attempts. Please try again later.'
                );
            }

            throw new Error(
                errorData?.error?.message || 
                error.message || 
                'Failed to subscribe to newsletter'
            );
        }
    },

    /**
     * Unsubscribe email from newsletter
     */
    unsubscribe: async (email: string): Promise<NewsletterResponse> => {
        try {
            const response = await apiClient.post<{ data: NewsletterResponse }>('/newsletter/unsubscribe', {
                email,
            });
            // Laravel returns { data: {...} }
            return response.data.data;
        } catch (error: any) {
            const errorData = error.response?.data as NewsletterError;
            throw new Error(
                errorData?.error?.message || 
                error.message || 
                'Failed to unsubscribe from newsletter'
            );
        }
    },
};

