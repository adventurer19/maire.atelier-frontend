// src/types/cart.ts

export interface CartProduct {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: number;
    image: string;
    is_active: boolean;
    stock: number;
}

export interface CartVariant {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, string>;
}

export interface CartItem {
    id: number;
    product: CartProduct;
    variant?: CartVariant;
    quantity: number;
    price: number;
    subtotal: number;
    has_enough_stock: boolean;
    created_at: string;
}

export interface CartSummary {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    total_items: number;
}

export interface Cart {
    items: CartItem[];
    summary: CartSummary;
}

export interface AddToCartPayload {
    product_id: number;
    quantity: number;
    variant_id?: number;
}

export interface UpdateCartItemPayload {
    quantity: number;
}