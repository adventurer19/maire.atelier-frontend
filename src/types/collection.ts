// src/types/collection.ts

import type { Product } from './index';

export interface Collection {
    id: number;
    slug: string;
    type: 'manual' | 'auto';
    name: string | { bg: string; en: string };
    description?: string | { bg: string; en: string } | null;
    meta_title?: string | { bg: string; en: string } | null;
    meta_description?: string | { bg: string; en: string } | null;
    image?: string | null;
    is_active: boolean;
    is_featured: boolean;
    position: number;
    conditions?: any | null;
    products?: Product[];
    created_at?: string;
    updated_at?: string;
}

