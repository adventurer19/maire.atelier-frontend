// src/app/(shop)/account/page.tsx
'use client';

import { useWishlist } from '@/hooks/useWishlist';
import { useOrders } from '@/hooks/useOrders';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const { orders, isLoading: ordersLoading } = useOrders();
    const { products: wishlistItems, isLoading: wishlistLoading } = useWishlist();
    const { itemCount: cartCount, isLoading: cartLoading } = useCart();

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
            })
            .catch(() => router.push('/login'));
    }, [router]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-[#FCFCFB] to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600 font-light">{t('account.loading')}</p>
                </div>
            </div>
        );
    }

    const userName = typeof user.name === 'string' ? user.name : user.name?.bg || user.name?.en || '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#FCFCFB] to-gray-50">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-8 md:py-12 lg:py-16">
                {/* Header - Elegant Typography */}
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
                    {t('account.welcome', { name: userName })}
                </h1>
                    <p className="text-base md:text-lg text-gray-600 font-light">{t('account.subtitle')}</p>
            </div>

                {/* Stats Cards - Sharp Design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16">
                <StatCard
                    title={t('account.total_orders')}
                    value={orders?.length || 0}
                    icon={<OrderIcon />}
                    href="/account/orders"
                />
                <StatCard
                    title={t('account.wishlist_items')}
                    value={wishlistItems?.length || 0}
                    icon={<HeartIcon />}
                    href="/wishlist"
                />
                <StatCard
                    title={t('account.cart_items')}
                    value={cartCount || 0}
                    icon={<CartIcon />}
                    href="/cart"
                />
            </div>

                {/* Recent Orders - Sharp Design */}
                <div className="mb-12 md:mb-16">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">
                            {t('account.recent_orders')}
                        </h2>
                    {orders && orders.length > 0 && (
                        <Link
                            href="/account/orders"
                                className="text-sm md:text-base text-gray-600 hover:text-gray-900 font-light underline underline-offset-4 transition-colors"
                        >
                            {t('account.view_all')}
                        </Link>
                    )}
                </div>

                {ordersLoading ? (
                        <div className="text-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : orders && orders.length > 0 ? (
                        <div className="space-y-4 md:space-y-6">
                        {orders.slice(0, 5).map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                ) : (
                    <EmptyOrders />
                )}
            </div>

                {/* Account Info - Sharp Design */}
                <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8 lg:p-10">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                        {t('account.account_info')}
                    </h2>
                    <div className="space-y-4 md:space-y-5 mb-6 md:mb-8">
                    <InfoRow label={t('account.name')} value={userName} />
                    <InfoRow label={t('account.email')} value={user.email} />
                    <InfoRow
                        label={t('account.member_since')}
                            value={user.created_at ? new Date(user.created_at).toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : '-'}
                    />
                </div>
                    <div className="pt-6 md:pt-8 border-t border-gray-200">
                    <Link
                        href="/account/settings"
                            className="inline-flex items-center gap-2 text-sm md:text-base text-gray-900 hover:text-gray-700 font-light underline underline-offset-4 transition-colors"
                    >
                            {t('account.edit_settings')}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                    </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    href,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="bg-white border border-gray-200 shadow-sm p-6 md:p-8 hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-2 font-light">{title}</p>
                    <p className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900">{value}</p>
                </div>
                <div className="text-gray-400 group-hover:text-gray-900 transition-colors w-8 h-8 md:w-10 md:h-10">{icon}</div>
            </div>
        </Link>
    );
}

function OrderCard({ order }: { order: any }) {
    const { t, lang } = useLanguage();
    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        refunded: 'bg-gray-100 text-gray-800',
    };

    const statusLabels: Record<string, string> = {
        pending: t('orders.status.pending'),
        processing: t('orders.status.processing'),
        shipped: t('orders.status.shipped'),
        delivered: t('orders.status.delivered'),
        cancelled: t('orders.status.cancelled'),
        refunded: t('orders.status.refunded'),
    };

    const orderDate = new Date(order.created_at).toLocaleDateString(
        lang === 'bg' ? 'bg-BG' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    return (
        <Link
            href={`/account/orders/${order.id}`}
            className="block bg-white border border-gray-200 shadow-sm p-6 md:p-8 hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
        >
            <div className="flex items-start justify-between gap-4 md:gap-6">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3">
                        <h3 className="text-base md:text-lg font-light text-gray-900">
                            {t('orders.order')} #{order.id}
                        </h3>
                        <span
                            className={`px-3 py-1.5 text-xs md:text-sm font-normal whitespace-nowrap border ${
                                order.status === 'delivered' ? 'border-green-300 bg-green-50 text-green-900' :
                                order.status === 'shipped' ? 'border-blue-300 bg-blue-50 text-blue-900' :
                                order.status === 'processing' ? 'border-blue-300 bg-blue-50 text-blue-900' :
                                order.status === 'pending' ? 'border-yellow-300 bg-yellow-50 text-yellow-900' :
                                order.status === 'cancelled' ? 'border-red-300 bg-red-50 text-red-900' :
                                'border-gray-300 bg-gray-50 text-gray-900'
                            }`}
                        >
                            {statusLabels[order.status] || order.status}
                        </span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-3 font-light">{orderDate}</p>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base text-gray-600 font-light">
                        <span>
                            {order.items?.length || 0}{' '}
                            {order.items?.length === 1 ? t('orders.item') : t('orders.items')}
                        </span>
                        <span className="font-light text-gray-900">
                            {Number(order.total || 0).toFixed(2)} {t('product.currency')}
                        </span>
                    </div>
                </div>
                <div className="text-gray-400 group-hover:text-gray-900 transition-colors flex-shrink-0">
                    <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
            </div>
        </Link>
    );
}

function EmptyOrders() {
    const { t } = useLanguage();
    return (
        <div className="bg-white border border-gray-200 shadow-sm p-12 md:p-16 lg:p-20 text-center">
            <OrderIcon className="w-16 h-16 md:w-20 md:h-20 mx-auto text-gray-300 mb-6 md:mb-8" strokeWidth="1.5" />
            <h3 className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900 mb-3 md:mb-4 tracking-tight">
                {t('account.no_orders')}
            </h3>
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 font-light">{t('account.no_orders_desc')}</p>
            <Link
                href="/products"
                className="inline-block px-6 py-4 bg-gray-900 text-white font-light hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 text-sm md:text-base min-h-[52px] flex items-center justify-center border-2 border-gray-900"
            >
                {t('account.start_shopping')}
            </Link>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4 py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm md:text-base text-gray-600 font-light">{label}</span>
            <span className="text-sm md:text-base font-light text-gray-900 break-all sm:break-normal">{value}</span>
        </div>
    );
}

// Icons
function OrderIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
        </svg>
    );
}

function HeartIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
        </svg>
    );
}

function CartIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
        </svg>
    );
}

function ChevronRightIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    );
}

function LoadingSpinner() {
    return (
        <svg
            className="animate-spin h-8 w-8 mx-auto text-gray-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}
