// src/app/(shop)/cart/page.tsx
'use client';

import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/hooks/useCart';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { cart, isLoading, isError, error } = useCart();
    const updateCartItem = useUpdateCartItem();
    const removeCartItem = useRemoveCartItem();
    const clearCart = useClearCart();

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="text-red-600 mb-4">
                        <p className="text-xl font-bold">Error loading cart</p>
                        <p className="text-sm mt-2">{error?.message || 'Something went wrong'}</p>
                    </div>
                    <Link
                        href="/products"
                        className="inline-block px-8 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // Empty cart
    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="mb-6">
                        <ShoppingBagIcon className="w-24 h-24 mx-auto text-gray-300" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                    <p className="text-gray-600 mb-8">
                        Start shopping to add items to your cart
                    </p>
                    <Link
                        href="/products"
                        className="inline-block px-8 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // Handle quantity update
    const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        updateCartItem.mutate({ itemId, payload: { quantity: newQuantity } });
    };

    // Handle remove item
    const handleRemoveItem = (itemId: number) => {
        removeCartItem.mutate(itemId);
    };

    // Handle clear cart
    const handleClearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            clearCart.mutate();
        }
    };

    return (
        <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
            <div className="mb-4 md:mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
                <button
                    onClick={handleClearCart}
                    disabled={clearCart.isPending}
                    className="text-xs md:text-sm text-red-600 hover:text-red-700 active:text-red-800 font-medium disabled:opacity-50 touch-manipulation py-2 px-3"
                >
                    {clearCart.isPending ? 'Clearing...' : 'Clear Cart'}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-3 md:space-y-4">
                    {cart.items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 lg:p-6 flex gap-3 md:gap-4"
                        >
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                                <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-md overflow-hidden">
                                    {item.product.image ? (
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No image
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="font-semibold text-sm md:text-base hover:text-gray-600 transition-colors line-clamp-2"
                                >
                                    {item.product.name}
                                </Link>

                                {item.variant?.attributes && typeof item.variant.attributes === 'object' && (
                                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                                        {Object.entries(item.variant.attributes as Record<string, any>).map(([key, value]) => (
                                            <span key={key as string} className="mr-2">
                                                {key}: {String(value)}
                                            </span>
                                        ))}
                                    </p>
                                )}

                                <p className="text-xs md:text-sm text-gray-500 mt-1 hidden md:block">
                                    SKU: {item.variant?.sku || item.product.sku}
                                </p>

                                {!item.has_enough_stock && (
                                    <p className="text-xs md:text-sm text-red-600 mt-2 font-medium">
                                        ⚠️ Only {item.variant?.stock || item.product.stock} left in stock
                                    </p>
                                )}
                            </div>

                            {/* Quantity & Price */}
                            <div className="flex flex-col items-end justify-between gap-2 min-w-[80px] md:min-w-[100px]">
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={removeCartItem.isPending}
                                    className="text-gray-400 hover:text-red-600 active:text-red-700 transition-colors disabled:opacity-50 touch-manipulation p-1"
                                    aria-label="Remove item"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        disabled={updateCartItem.isPending || item.quantity <= 1}
                                        className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border-2 border-gray-300 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                                        aria-label="Decrease quantity"
                                    >
                                        <span className="text-lg">−</span>
                                    </button>
                                    <span className="w-10 md:w-12 text-center font-medium text-sm md:text-base">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        disabled={updateCartItem.isPending}
                                        className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border-2 border-gray-300 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                                        aria-label="Increase quantity"
                                    >
                                        <span className="text-lg">+</span>
                                    </button>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs md:text-sm text-gray-600 hidden md:block">€{item.price.toFixed(2)} each</p>
                                    <p className="text-base md:text-lg font-bold">€{item.subtotal.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6 lg:sticky lg:top-20">
                        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Order Summary</h2>

                        <div className="space-y-2 md:space-y-3 mb-4">
                            <div className="flex justify-between text-gray-600 text-sm md:text-base">
                                <span>Subtotal ({cart.summary.total_items} items)</span>
                                <span>€{cart.summary.subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-gray-600 text-sm md:text-base">
                                <span>Shipping</span>
                                <span>
                  {cart.summary.shipping === 0 ? 'FREE' : `€${cart.summary.shipping.toFixed(2)}`}
                </span>
                            </div>

                            {cart.summary.tax > 0 && (
                                <div className="flex justify-between text-gray-600 text-sm md:text-base">
                                    <span>Tax</span>
                                    <span>€{cart.summary.tax.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="border-t pt-2 md:pt-3 flex justify-between font-bold text-base md:text-lg">
                                <span>Total</span>
                                <span>€{cart.summary.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full py-3 md:py-3.5 bg-gray-900 text-white text-center font-medium rounded-md hover:bg-gray-800 active:bg-gray-700 transition-colors text-sm md:text-base min-h-[48px] flex items-center justify-center touch-manipulation"
                        >
                            Proceed to Checkout
                        </Link>

                        <Link
                            href="/products"
                            className="block w-full mt-3 py-3 md:py-3.5 border-2 border-gray-300 text-gray-700 text-center font-medium rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm md:text-base min-h-[48px] flex items-center justify-center touch-manipulation"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icons
function ShoppingBagIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function LoadingSpinner() {
    return (
        <svg className="animate-spin h-8 w-8 mx-auto text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );
}