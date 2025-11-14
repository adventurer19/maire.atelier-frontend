'use client';

import { useOrders } from '@/hooks/useOrders';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const { orders, isLoading } = useOrders();

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#FCFCFB] to-gray-50">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-8 md:py-12 lg:py-16">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-2 tracking-tight">
                                {t('orders.my_orders') || 'Моите поръчки'}
                            </h1>
                            <p className="text-base md:text-lg text-gray-600 font-light">
                                {t('orders.orders_desc') || 'Преглед на всички ваши поръчки'}
                            </p>
                        </div>
                        <Link
                            href="/account"
                            className="text-sm md:text-base text-gray-600 hover:text-gray-900 font-light underline underline-offset-4 transition-colors"
                        >
                            {t('account.back_to_account') || '← Назад към профила'}
                        </Link>
                    </div>
                </div>

                {/* Orders List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <LoadingSpinner />
                        <p className="mt-4 text-gray-600 font-light">{t('account.loading')}</p>
                    </div>
                ) : orders && orders.length > 0 ? (
                    <div className="space-y-4 md:space-y-6">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                ) : (
                    <EmptyOrders />
                )}
            </div>
        </div>
    );
}

function OrderCard({ order }: { order: any }) {
    const { t, lang } = useLanguage();
    
    const statusColors: Record<string, { bg: string; text: string; border: string }> = {
        pending: { bg: 'bg-yellow-50', text: 'text-yellow-900', border: 'border-yellow-300' },
        processing: { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-300' },
        shipped: { bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-300' },
        delivered: { bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-300' },
        cancelled: { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-300' },
        refunded: { bg: 'bg-gray-50', text: 'text-gray-900', border: 'border-gray-300' },
    };

    const statusLabels: Record<string, string> = {
        pending: t('orders.status.pending') || 'В очакване',
        processing: t('orders.status.processing') || 'В обработка',
        shipped: t('orders.status.shipped') || 'Изпратена',
        delivered: t('orders.status.delivered') || 'Доставена',
        cancelled: t('orders.status.cancelled') || 'Отменена',
        refunded: t('orders.status.refunded') || 'Възстановена',
    };

    const paymentStatusLabels: Record<string, string> = {
        pending: t('orders.payment.pending') || 'В очакване',
        paid: t('orders.payment.paid') || 'Платено',
        failed: t('orders.payment.failed') || 'Неуспешно',
        refunded: t('orders.payment.refunded') || 'Възстановено',
    };

    const orderDate = new Date(order.created_at).toLocaleDateString(
        lang === 'bg' ? 'bg-BG' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    const statusStyle = statusColors[order.status] || statusColors.pending;

    return (
        <Link
            href={`/account/orders/${order.id}`}
            className="block bg-white border border-gray-200 shadow-sm p-6 md:p-8 hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
        >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3">
                        <h3 className="text-base md:text-lg font-light text-gray-900">
                            {t('orders.order') || 'Поръчка'} #{order.order_number || order.id}
                        </h3>
                        <span
                            className={`px-3 py-1.5 text-xs md:text-sm font-normal whitespace-nowrap border ${statusStyle.border} ${statusStyle.bg} ${statusStyle.text}`}
                        >
                            {statusLabels[order.status] || order.status}
                        </span>
                        {order.payment_status && (
                            <span className="px-3 py-1.5 text-xs md:text-sm font-normal whitespace-nowrap border border-gray-300 bg-gray-50 text-gray-900">
                                {paymentStatusLabels[order.payment_status] || order.payment_status}
                            </span>
                        )}
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-3 font-light">{orderDate}</p>
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-base text-gray-600 font-light">
                        <span>
                            {order.items?.length || 0}{' '}
                            {order.items?.length === 1 
                                ? (t('orders.item') || 'артикул') 
                                : (t('orders.items') || 'артикула')}
                        </span>
                        <span className="font-light text-gray-900">
                            {Number(order.total || 0).toFixed(2)} {t('product.currency') || 'лв.'}
                        </span>
                        {order.payment_method && (
                            <span className="text-gray-500">
                                {order.payment_method === 'cash_on_delivery' 
                                    ? (t('orders.payment.cash_on_delivery') || 'Наложен платеж')
                                    : order.payment_method === 'bank_transfer'
                                    ? (t('orders.payment.bank_transfer') || 'Банков превод')
                                    : order.payment_method === 'card_online'
                                    ? (t('orders.payment.card_online') || 'Карта онлайн')
                                    : order.payment_method}
                            </span>
                        )}
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
                {t('account.no_orders') || 'Нямате поръчки'}
            </h3>
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-10 font-light">
                {t('account.no_orders_desc') || 'Все още нямате направени поръчки'}
            </p>
            <Link
                href="/products"
                className="inline-block px-6 py-4 bg-gray-900 text-white font-light hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 text-sm md:text-base min-h-[52px] flex items-center justify-center border-2 border-gray-900"
            >
                {t('account.start_shopping') || 'Започнете пазаруване'}
            </Link>
        </div>
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

function OrderIcon({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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

