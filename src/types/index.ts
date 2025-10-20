// src/types/index.ts

export interface Product {
    id: number;
    sku: string;
    slug: string;
    name: string | { bg: string; en: string };
    description: string | { bg: string; en: string };
    short_description: string | { bg: string; en: string };
    material: string | { bg: string; en: string };
    care_instructions: string | { bg: string; en: string };

    // Pricing
    price: number;
    sale_price: number | null;
    compare_at_price: number | null;
    final_price: number;
    discount_percentage: number | null;

    // Stock
    stock_quantity: number;
    is_in_stock: boolean;
    low_stock_threshold: number;
    is_low_stock: boolean;

    // Status
    is_active: boolean;
    is_featured: boolean;

    // Dimensions
    weight: string | null;
    dimensions: {
        width: string | null;
        height: string | null;
        depth: string | null;
    };

    // Relationships
    categories: Category[];
    variants: ProductVariant[];
    images: string[];
    primary_image: string;

    // Meta
    meta_title: string | { bg: string; en: string };
    meta_description: string | { bg: string; en: string };

    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    slug: string;
    name: string | { bg: string; en: string };
    description: string | { bg: string; en: string };
    parent_id: number | null;
    position: number;
}

export interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stock_quantity: number;
    is_active: boolean;
    is_in_stock: boolean;
    attributes: AttributeOption[];
    variant_name: string;
    images: string[];
}

export interface AttributeOption {
    name: string;
    value: string;
    hex_color: string | null;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface ApiResponse<T> {
    data: T;
    meta?: PaginationMeta;
}