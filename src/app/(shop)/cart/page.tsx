// src/app/(shop)/cart/page.tsx
'use client';

import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/hooks/useCart';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function CartPage() {
    const { t } = useLanguage();
    const { cart, isLoading, isError, error } = useCart();
    const updateCartItem = useUpdateCartItem();
    const removeCartItem = useRemoveCartItem();
    const clearCart = useClearCart();

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">{t('cart.loading')}</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
                <div className="max-w-md mx-auto text-center">
                    <div className="text-red-600 mb-4">
                        <p className="text-xl font-light text-gray-900">{t('cart.error_loading')}</p>
                        <p className="text-sm mt-2 font-light">{error?.message || t('cart.error_message')}</p>
                    </div>
                    <Link
                        href="/products"
                        className="inline-block px-8 py-3 bg-gray-900 text-white font-light hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 border-2 border-gray-900"
                    >
                        {t('cart.continue_shopping')}
                    </Link>
                </div>
            </div>
        );
    }

    // Empty cart
    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
                <div className="max-w-md mx-auto text-center">
                    <div className="mb-6">
                        <ShoppingBagIcon className="w-24 h-24 mx-auto text-gray-300" />
                    </div>
                    <h1 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">{t('cart.empty_title')}</h1>
                    <p className="text-gray-600 mb-8 font-light">
                        {t('cart.empty_desc')}
                    </p>
                    <Link
                        href="/products"
                        className="inline-block px-8 py-3 bg-gray-900 text-white font-light hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 border-2 border-gray-900"
                    >
                        {t('cart.continue_shopping')}
                    </Link>
                </div>
            </div>
        );
    }

    // Handle quantity update
    const handleUpdateQuantity = (itemId: number, newQuantity: number, maxStock: number) => {
        if (newQuantity < 1) return;
        
        // Validate stock on client side before sending request
        if (newQuantity > maxStock) {
            alert(t('cart.max_stock_reached', { max: maxStock }) || `Максимално налично количество: ${maxStock}`);
            return;
        }
        
        updateCartItem.mutate(
            { itemId, payload: { quantity: newQuantity } },
            {
                onError: (error: any) => {
                    // Show user-friendly error message
                    const errorMessage = error?.response?.data?.message || 
                                       error?.message || 
                                       t('cart.update_failed') || 
                                       'Неуспешно обновяване на количеството';
                    alert(errorMessage);
                }
            }
        );
    };

    // Handle remove item
    const handleRemoveItem = (itemId: number) => {
        removeCartItem.mutate(itemId);
    };

    // Handle clear cart
    const handleClearCart = () => {
        if (confirm(t('cart.confirm_clear'))) {
            clearCart.mutate();
        }
    };

    return (
        <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
            <div className="mb-4 md:mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
                <h1 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight">{t('cart.shopping_cart')}</h1>
                <button
                    onClick={handleClearCart}
                    disabled={clearCart.isPending}
                    className="text-xs md:text-sm text-red-600 hover:text-red-700 active:text-red-800 font-light disabled:opacity-50 touch-manipulation py-2 px-3 underline underline-offset-4 transition-colors"
                >
                    {clearCart.isPending ? t('cart.clearing') : t('cart.clear_cart')}
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-3 md:space-y-4">
                    {cart.items.map((item) => {
                        // Calculate max stock (variant stock or product stock)
                        const maxStock = item.variant?.stock ?? item.product.stock;
                        return (
                            <CartItemCard 
                                key={item.id} 
                                item={item}
                                maxStock={maxStock}
                                t={t}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveItem={handleRemoveItem}
                                updateCartItem={updateCartItem}
                                removeCartItem={removeCartItem}
                            />
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 shadow-sm p-4 md:p-6 lg:sticky lg:top-20">
                        <h2 className="text-lg md:text-xl font-light text-gray-900 mb-3 md:mb-4 tracking-tight">{t('cart.order_summary')}</h2>

                        <div className="space-y-2 md:space-y-3 mb-4">
                            <div className="flex justify-between text-gray-600 text-sm md:text-base font-light">
                                <span>
                                    {t('cart.subtotal')} ({cart.summary.total_items} {cart.summary.total_items === 1 ? t('cart.item') : t('cart.items')})
                                </span>
                                <span>
                                    {t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? '' : '€'}{cart.summary.subtotal.toFixed(2)} {t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? t('product.currency') : ''}
                                </span>
                            </div>

                            <div className="flex justify-between text-gray-600 text-sm md:text-base font-light">
                                <span>{t('cart.shipping')}</span>
                                <span>
                                    {cart.summary.shipping === 0 
                                        ? t('cart.free') 
                                        : `${t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? '' : '€'}${cart.summary.shipping.toFixed(2)} ${t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? t('product.currency') : ''}`}
                                </span>
                            </div>

                            {cart.summary.tax > 0 && (
                                <div className="flex justify-between text-gray-600 text-sm md:text-base font-light">
                                    <span>{t('cart.tax')}</span>
                                    <span>
                                        {t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? '' : '€'}{cart.summary.tax.toFixed(2)} {t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? t('product.currency') : ''}
                                    </span>
                                </div>
                            )}

                            <div className="border-t pt-2 md:pt-3 flex justify-between font-light text-base md:text-lg text-gray-900">
                                <span>{t('cart.total')}</span>
                                <span>
                                    {t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? '' : '€'}{cart.summary.total.toFixed(2)} {t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? t('product.currency') : ''}
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            className="block w-full py-3 md:py-3.5 bg-gray-900 text-white text-center font-light hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 text-sm md:text-base min-h-[48px] flex items-center justify-center touch-manipulation border-2 border-gray-900"
                        >
                            {t('cart.proceed_to_checkout')}
                        </Link>

                        <Link
                            href="/products"
                            className="block w-full mt-3 py-3 md:py-3.5 border-2 border-gray-300 text-gray-700 text-center font-light hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 text-sm md:text-base min-h-[48px] flex items-center justify-center touch-manipulation"
                        >
                            {t('cart.continue_shopping')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Cart Item Card Component
function CartItemCard({ 
    item,
    maxStock,
    t, 
    onUpdateQuantity, 
    onRemoveItem,
    updateCartItem,
    removeCartItem
}: { 
    item: any;
    maxStock: number;
    t: (path: string) => string;
    onUpdateQuantity: (itemId: number, newQuantity: number, maxStock: number) => void;
    onRemoveItem: (itemId: number) => void;
    updateCartItem: any;
    removeCartItem: any;
}) {
    const [imageError, setImageError] = useState(false);
    const imageUrl = item.product.image;
    const hasValidImage = imageUrl && 
                         imageUrl.trim() !== '' && 
                         !imageUrl.includes('placeholder') &&
                         (imageUrl.startsWith('http') || imageUrl.startsWith('/'));

    return (
        <div className="bg-white border border-gray-200 shadow-sm p-3 md:p-4 lg:p-6 flex gap-3 md:gap-4 hover:border-gray-300 hover:shadow-md transition-all duration-300">
            {/* Product Image */}
            <div className="flex-shrink-0">
                <Link
                    href={`/products/${item.product.slug}`}
                    className="block relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 overflow-hidden"
                >
                    {hasValidImage && !imageError ? (
                        <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            sizes="(max-width: 768px) 80px, 96px"
                            className="object-cover"
                            unoptimized={imageUrl.includes('laravel.test') || imageUrl.includes('localhost')}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            {t('cart.no_image')}
                        </div>
                    )}
                </Link>
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <Link
                    href={`/products/${item.product.slug}`}
                    className="font-light text-sm md:text-base text-gray-900 hover:text-gray-600 transition-colors line-clamp-2"
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
                    {t('cart.sku')}: {item.variant?.sku || item.product.sku}
                </p>

                {/* Stock warning */}
                {item.quantity >= maxStock && (
                    <p className="text-xs md:text-sm text-orange-600 mt-2 font-medium">
                        ⚠️ {t('cart.max_stock_reached', { max: maxStock }) || `Достигнато максимално количество: ${maxStock}`}
                    </p>
                )}
                {!item.has_enough_stock && item.quantity < maxStock && (
                    <p className="text-xs md:text-sm text-red-600 mt-2 font-medium">
                        ⚠️ {t('cart.only_left', { count: maxStock }) || `Остават само ${maxStock} броя`}
                    </p>
                )}
                {item.quantity < maxStock && item.has_enough_stock && maxStock <= 5 && (
                    <p className="text-xs md:text-sm text-amber-600 mt-2">
                        ℹ️ {t('cart.stock_info', { count: maxStock }) || `Наличност: ${maxStock} броя`}
                    </p>
                )}
            </div>

            {/* Quantity & Price */}
            <div className="flex flex-col items-end justify-between gap-2 min-w-[80px] md:min-w-[100px]">
                <button
                    onClick={() => onRemoveItem(item.id)}
                    disabled={removeCartItem.isPending}
                    className="text-gray-400 hover:text-red-600 active:text-red-700 transition-colors disabled:opacity-50 touch-manipulation p-1"
                    aria-label={t('cart.remove_item')}
                >
                    <XIcon className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5 md:gap-2">
                    <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1, maxStock)}
                        disabled={updateCartItem.isPending || item.quantity <= 1}
                        className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border-2 border-gray-300 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation transition-all duration-300"
                        aria-label={t('cart.decrease_quantity')}
                    >
                        <span className="text-lg">−</span>
                    </button>
                    <span className="w-10 md:w-12 text-center font-light text-sm md:text-base">{item.quantity}</span>
                    <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1, maxStock)}
                        disabled={updateCartItem.isPending || item.quantity >= maxStock}
                        className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border-2 border-gray-300 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation transition-all duration-300"
                        aria-label={t('cart.increase_quantity')}
                        title={item.quantity >= maxStock ? (t('cart.max_stock_reached', { max: maxStock }) || `Максимално количество: ${maxStock}`) : ''}
                    >
                        <span className="text-lg">+</span>
                    </button>
                </div>

                <div className="text-right">
                    <p className="text-xs md:text-sm text-gray-600 hidden md:block font-light">
                        {t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? '' : '€'}{item.price.toFixed(2)} {t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? t('product.currency') : t('cart.each')}
                    </p>
                    <p className="text-base md:text-lg font-light text-gray-900">
                        {t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? '' : '€'}{item.subtotal.toFixed(2)} {t('product.currency') === 'лв' || t('product.currency') === 'BGN' ? t('product.currency') : ''}
                    </p>
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