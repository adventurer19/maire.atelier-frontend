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
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <button
                    onClick={handleClearCart}
                    disabled={clearCart.isPending}
                    className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                >
                    {clearCart.isPending ? 'Clearing...' : 'Clear Cart'}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 flex gap-4"
                        >
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                                <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
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
                            <div className="flex-1">
                                <Link
                                    href={`/products/${item.product.slug}`}
                                    className="font-semibold hover:text-gray-600 transition-colors"
                                >
                                    {item.product.name}
                                </Link>

                                {item.variant && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {Object.entries(item.variant.attributes).map(([key, value]) => (
                                            <span key={key} className="mr-2">
                        {key}: {value}
                      </span>
                                        ))}
                                    </p>
                                )}

                                <p className="text-sm text-gray-500 mt-1">
                                    SKU: {item.variant?.sku || item.product.sku}
                                </p>

                                {!item.has_enough_stock && (
                                    <p className="text-sm text-red-600 mt-2 font-medium">
                                        ⚠️ Only {item.variant?.stock || item.product.stock} left in stock
                                    </p>
                                )}
                            </div>

                            {/* Quantity & Price */}
                            <div className="flex flex-col items-end justify-between">
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={removeCartItem.isPending}
                                    className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                    aria-label="Remove item"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-2 mb-2">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        disabled={updateCartItem.isPending || item.quantity <= 1}
                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        disabled={updateCartItem.isPending}
                                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-600">€{item.price.toFixed(2)} each</p>
                                    <p className="text-lg font-bold">€{item.subtotal.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cart.summary.total_items} items)</span>
                                <span>€{cart.summary.subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>
                  {cart.summary.shipping === 0 ? 'FREE' : `€${cart.summary.shipping.toFixed(2)}`}
                </span>
                            </div>

                            {cart.summary.tax > 0 && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span>€{cart.summary.tax.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>€{cart.summary.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full py-3 bg-gray-900 text-white text-center font-medium rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Proceed to Checkout
                        </Link>

                        <Link
                            href="/products"
                            className="block w-full mt-3 py-3 border border-gray-300 text-gray-700 text-center font-medium rounded-md hover:bg-gray-50 transition-colors"
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