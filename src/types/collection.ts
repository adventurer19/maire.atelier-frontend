// src/types/collection.ts

import type { Product } from './index';

export interface Collection {
    id: number;
    slug: string;
    type: 'manual' | 'auto';
    name: string;
    description?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    image?: string | null;
    is_active: boolean;
    is_featured: boolean;
    position: number;
    conditions?: any | null;
    products?: Product[];
    created_at?: string;
    updated_at?: string;
}

