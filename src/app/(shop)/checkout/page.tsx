'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { ordersApi } from '@/lib/api/orders';
import { useLanguage } from '@/context/LanguageContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';

export default function CheckoutPage() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const { cart, isLoading: cartLoading } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check if user is authenticated
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                }
            })
            .catch(() => {
                // Guest checkout is allowed
            });
    }, []);

    // Redirect if cart is empty
    useEffect(() => {
        if (!cartLoading && (!cart || cart.items.length === 0)) {
            router.push('/cart');
        }
    }, [cart, cartLoading, router]);

    const handleSubmit = async (formData: any) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Get cart token - always include it (for guest users or if logged in user has items from before login)
            const { getOrCreateCartToken } = await import('@/lib/cartToken');
            const cartToken = getOrCreateCartToken();

            const orderData = {
                ...formData,
                // Always include cart_token - backend will use it if user_id doesn't have items
                cart_token: cartToken,
            };

            const order = await ordersApi.createOrder(orderData);

            // Redirect to success page
            router.push(`/checkout/success?order=${order.order_number || order.id}`);
        } catch (err: any) {
            // Extract error message from various possible formats
            let errorMessage = 'An error occurred while creating the order';
            
            if (err.response?.data) {
                const data = err.response.data;
                // Try different error message formats
                if (data.message) {
                    errorMessage = data.message;
                } else if (data.error) {
                    // Handle both string and object error formats
                    if (typeof data.error === 'string') {
                        errorMessage = data.error;
                    } else if (data.error.message) {
                        errorMessage = data.error.message;
                    }
                } else if (data.errors) {
                    // Format validation errors - show first error or combine them
                    const errorKeys = Object.keys(data.errors);
                    if (errorKeys.length > 0) {
                        const firstError = data.errors[errorKeys[0]];
                        errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
                        
                        // If multiple errors, add count
                        if (errorKeys.length > 1) {
                            errorMessage += ` (and ${errorKeys.length - 1} more errors)`;
                        }
                    }
                } else if (err.validationErrors) {
                    // Handle validationErrors from enhanced error
                    const errorKeys = Object.keys(err.validationErrors);
                    if (errorKeys.length > 0) {
                        const firstError = err.validationErrors[errorKeys[0]];
                        errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
                    }
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            setIsSubmitting(false);
        }
    };

    if (cartLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <CheckoutForm
                            user={user}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary cart={cart} />
                    </div>
                </div>
            </div>
        </div>
    );
}

