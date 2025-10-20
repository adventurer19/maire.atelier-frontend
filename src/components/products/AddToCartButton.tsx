// src/components/product/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { useAddToCart } from '@/hooks/useCart';
import type { AddToCartPayload } from '@/types/cart';

interface AddToCartButtonProps {
    productId: number;
    variantId?: number;
    quantity?: number;
    className?: string;
    showQuantitySelector?: boolean;
}

export default function AddToCartButton({
                                            productId,
                                            variantId,
                                            quantity: initialQuantity = 1,
                                            className = '',
                                            showQuantitySelector = false,
                                        }: AddToCartButtonProps) {
    const [quantity, setQuantity] = useState(initialQuantity);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const addToCart = useAddToCart();

    const handleAddToCart = async () => {
        try {
            const payload: AddToCartPayload = {
                product_id: productId,
                quantity,
                ...(variantId && { variant_id: variantId }),
            };

            await addToCart.mutateAsync(payload);

            // Show success notification
            setNotification({
                type: 'success',
                message: 'Added to cart!',
            });
            setTimeout(() => setNotification(null), 2000);
        } catch (error: any) {
            // Show error notification
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Failed to add to cart',
            });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const isLoading = addToCart.isPending;

    return (
        <div className="relative">
            <div className="flex items-center gap-3">
                {showQuantitySelector && (
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || quantity <= 1}
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
              {quantity}
            </span>
                        <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    className={`
            flex-1 px-6 py-3 
            bg-gray-900 text-white font-medium 
            rounded-md hover:bg-gray-800 
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            flex items-center justify-center gap-2
            ${className}
          `}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span>Adding...</span>
                        </>
                    ) : (
                        'Add to Cart'
                    )}
                </button>
            </div>

            {/* Success/Error Notification */}
            {notification && (
                <div
                    className={`
            absolute -bottom-12 left-0 right-0 
            px-4 py-2 rounded-md text-sm font-medium text-center
            animate-in fade-in slide-in-from-top-2 duration-200
            ${notification.type === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }
          `}
                >
                    {notification.message}
                </div>
            )}
        </div>
    );
}

// Loading spinner component
function LoadingSpinner() {
    return (
        <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}