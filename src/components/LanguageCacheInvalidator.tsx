// src/components/LanguageCacheInvalidator.tsx
'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Component that invalidates React Query cache when language changes
 * Must be inside QueryProvider to work
 */
export default function LanguageCacheInvalidator() {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleLanguageChange = (event: CustomEvent) => {
            // Invalidate all product-related queries when language changes
            queryClient.invalidateQueries({ queryKey: ['products'] });
        };

        window.addEventListener('language-changed', handleLanguageChange as EventListener);

        return () => {
            window.removeEventListener('language-changed', handleLanguageChange as EventListener);
        };
    }, [queryClient]);

    return null; // This component doesn't render anything
}

