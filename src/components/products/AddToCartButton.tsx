// src/components/products/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { useAddToCart } from '@/hooks/useCart';
import { useLanguage } from '@/context/LanguageContext';
import type { AddToCartPayload } from '@/types/cart';

interface AddToCartButtonProps {
    productId: number;
    variantId?: number;
    quantity?: number;
    className?: string;
    showQuantitySelector?: boolean;
    disabled?: boolean;
}

export default function AddToCartButton({
                                            productId,
                                            variantId,
                                            quantity: initialQuantity = 1,
                                            className = '',
                                            showQuantitySelector = false,
                                            disabled = false,
                                        }: AddToCartButtonProps) {
    const { t } = useLanguage();
    const [quantity, setQuantity] = useState(initialQuantity);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const addToCart = useAddToCart();

    const handleAddToCart = async () => {
        if (disabled) return;
        if (!variantId && typeof variantId !== 'number') {
            setNotification({ type: 'error', message: t('product.choose_variant_first') || t('product.choose_variant') });
            setTimeout(() => setNotification(null), 2500);
            return;
        }
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
                message: t('cart.added_to_cart') || t('product.add_to_cart'),
            });
            setTimeout(() => setNotification(null), 2000);
        } catch (error: any) {
            // Show error notification
            setNotification({
                type: 'error',
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    t('cart.add_to_cart_error') || t('product.add_to_cart'),
            });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const isLoading = addToCart.isPending;

    return (
        <div className="relative">
            <div className="flex items-center gap-3">
                {showQuantitySelector && (
                    <div className="flex items-center border-2 border-gray-300">
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-r-2 border-gray-300"
                            disabled={isLoading || quantity <= 1}
                            aria-label={t('product.decrease_quantity') || 'Decrease quantity'}
                        >
                            <span className="font-light">−</span>
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center font-light border-r-2 border-gray-300">
              {quantity}
            </span>
                        <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                            aria-label={t('product.increase_quantity') || 'Increase quantity'}
                        >
                            <span className="font-light">+</span>
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isLoading || disabled}
                    className={`
                        w-full px-6 py-4 md:py-4
                        bg-gray-900 text-white font-light
                        hover:bg-gray-800 active:bg-gray-700
            disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300
            flex items-center justify-center gap-2
                        min-h-[48px]
            ${className}
          `}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span>{t('cart.adding') || t('product.add_to_cart')}</span>
                        </>
                    ) : (
                        t('product.add_to_cart')
                    )}
                </button>
            </div>

            {/* Success/Error Notification - Sharp Design */}
            {notification && (
                <div
                    className={`
            absolute -bottom-12 left-0 right-0 
                        px-4 py-3 text-sm font-light text-center
            animate-in fade-in slide-in-from-top-2 duration-200
                        border border-gray-300
            ${notification.type === 'error'
                            ? 'bg-white text-gray-900'
                            : 'bg-white text-gray-900'
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