// src/types/order.ts

export interface OrderItem {
    id: number;
    product_id: number;
    variant_id?: number | null;
    product_name: string;
    variant_name?: string | null;
    sku: string;
    quantity: number;
    price: number;
    subtotal: number;
    product?: {
        id: number;
        slug: string;
        name: string;
        primary_image?: string;
    };
}

export interface OrderAddress {
    id?: number;
    type?: 'shipping' | 'billing';
    first_name?: string;
    last_name?: string;
    full_name?: string;
    company?: string;
    address_line1?: string;
    address_line_1?: string;
    address_line2?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
    full_address?: string;
}

export interface Order {
    id: number;
    order_number?: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    payment?: string;
    payment_method?: string;
    notes?: string;
    created_at: string;
    customer: {
        id?: number;
        name: string;
        email: string;
        phone?: string;
    };
    address?: OrderAddress;
    items: OrderItem[];
}

