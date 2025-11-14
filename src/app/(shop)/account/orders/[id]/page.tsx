'use client';

import { useOrder, useCancelOrder } from '@/hooks/useOrders';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function OrderDetailPage() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id as string;
    const [user, setUser] = useState<any>(null);
    const { order, isLoading } = useOrder(orderId);
    const cancelOrder = useCancelOrder();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

    const handleCancel = async () => {
        if (!order) return;
        
        try {
            await cancelOrder.mutateAsync(order.id);
            setShowCancelConfirm(false);
            router.push('/account/orders');
        } catch (error) {
            console.error('Failed to cancel order:', error);
        }
    };

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-[#FCFCFB] to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600 font-light">{t('account.loading')}</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-[#FCFCFB] to-gray-50">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-8 md:py-12 lg:py-16">
                    <div className="bg-white border border-gray-200 shadow-sm p-12 text-center">
                        <h2 className="text-2xl font-light text-gray-900 mb-4">
                            {t('orders.not_found') || 'Поръчката не е намерена'}
                        </h2>
                        <Link
                            href="/account/orders"
                            className="text-gray-600 hover:text-gray-900 font-light underline underline-offset-4"
                        >
                            {t('orders.back_to_orders') || '← Назад към поръчките'}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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

    const paymentMethodLabels: Record<string, string> = {
        cash_on_delivery: t('orders.payment.cash_on_delivery') || 'Наложен платеж',
        bank_transfer: t('orders.payment.bank_transfer') || 'Банков превод',
        card_online: t('orders.payment.card_online') || 'Плащане с карта',
        paypal: 'PayPal',
        tbi_installment: 'TBI Bank изплащане',
        unicredit_installment: 'Unicredit изплащане',
    };

    const orderDate = new Date(order.created_at).toLocaleDateString(
        lang === 'bg' ? 'bg-BG' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    );

    const statusStyle = statusColors[order.status] || statusColors.pending;
    const canCancel = order.status === 'pending' || order.status === 'processing';

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#FCFCFB] to-gray-50">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl py-8 md:py-12 lg:py-16">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-2 tracking-tight">
                                {t('orders.order') || 'Поръчка'} #{order.order_number || order.id}
                            </h1>
                            <p className="text-base md:text-lg text-gray-600 font-light">
                                {orderDate}
                            </p>
                        </div>
                        <Link
                            href="/account/orders"
                            className="text-sm md:text-base text-gray-600 hover:text-gray-900 font-light underline underline-offset-4 transition-colors"
                        >
                            {t('orders.back_to_orders') || '← Назад към поръчките'}
                        </Link>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <span
                        className={`px-4 py-2 text-sm font-normal border ${statusStyle.border} ${statusStyle.bg} ${statusStyle.text}`}
                    >
                        {statusLabels[order.status] || order.status}
                    </span>
                    {order.payment_status && (
                        <span className="px-4 py-2 text-sm font-normal border border-gray-300 bg-gray-50 text-gray-900">
                            {paymentStatusLabels[order.payment_status] || order.payment_status}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8">
                            <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-6">
                                {t('orders.items') || 'Артикули'}
                            </h2>
                            <div className="space-y-4">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item: any) => (
                                        <OrderItemCard key={item.id} item={item} />
                                    ))
                                ) : (
                                    <p className="text-gray-600 font-light">
                                        {t('orders.no_items') || 'Няма артикули'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {order.address && (
                            <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8">
                                <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-6">
                                    {t('orders.shipping_address') || 'Адрес за доставка'}
                                </h2>
                                <div className="text-gray-600 font-light space-y-2">
                                    {order.address.first_name && order.address.last_name && (
                                        <p>
                                            {order.address.first_name} {order.address.last_name}
                                        </p>
                                    )}
                                    {order.address.company && (
                                        <p>{order.address.company}</p>
                                    )}
                                    {order.address.address_line1 && (
                                        <p>{order.address.address_line1}</p>
                                    )}
                                    {order.address.address_line2 && (
                                        <p>{order.address.address_line2}</p>
                                    )}
                                    {(order.address.city || order.address.postal_code) && (
                                        <p>
                                            {order.address.postal_code} {order.address.city}
                                        </p>
                                    )}
                                    {order.address.country && (
                                        <p>{order.address.country}</p>
                                    )}
                                    {order.address.phone && (
                                        <p className="mt-4">{order.address.phone}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8">
                            <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-6">
                                {t('orders.summary') || 'Резюме'}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600 font-light">
                                    <span>{t('orders.subtotal') || 'Междинна сума'}</span>
                                    <span>{Number(order.subtotal || 0).toFixed(2)} {t('product.currency') || 'лв.'}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-light">
                                    <span>{t('orders.shipping') || 'Доставка'}</span>
                                    <span>
                                        {Number(order.shipping || 0) === 0 
                                            ? (t('orders.free') || 'БЕЗПЛАТНО')
                                            : `${Number(order.shipping || 0).toFixed(2)} ${t('product.currency') || 'лв.'}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-light">
                                    <span>{t('orders.tax') || 'ДДС'}</span>
                                    <span>{Number(order.tax || 0).toFixed(2)} {t('product.currency') || 'лв.'}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-light text-gray-900">
                                    <span>{t('orders.total') || 'Общо'}</span>
                                    <span>{Number(order.total || 0).toFixed(2)} {t('product.currency') || 'лв.'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8">
                            <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-6">
                                {t('orders.payment_info') || 'Информация за плащане'}
                            </h2>
                            <div className="space-y-3 text-gray-600 font-light">
                                {order.payment_method && (
                                    <div>
                                        <span className="text-gray-500">
                                            {t('orders.payment_method') || 'Метод:'}
                                        </span>{' '}
                                        {paymentMethodLabels[order.payment_method] || order.payment_method}
                                    </div>
                                )}
                                {order.payment_status && (
                                    <div>
                                        <span className="text-gray-500">
                                            {t('orders.payment_status') || 'Статус:'}
                                        </span>{' '}
                                        {paymentStatusLabels[order.payment_status] || order.payment_status}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {canCancel && (
                            <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8">
                                <button
                                    onClick={() => setShowCancelConfirm(true)}
                                    className="w-full px-4 py-3 bg-red-50 text-red-900 border border-red-300 font-light hover:bg-red-100 transition-colors"
                                >
                                    {t('orders.cancel_order') || 'Отмени поръчката'}
                                </button>
                            </div>
                        )}

                        {/* Notes */}
                        {order.notes && (
                            <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8">
                                <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-4">
                                    {t('orders.notes') || 'Бележки'}
                                </h2>
                                <p className="text-gray-600 font-light">{order.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cancel Confirmation Modal */}
                {showCancelConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 md:p-8 max-w-md w-full">
                            <h3 className="text-xl font-light text-gray-900 mb-4">
                                {t('orders.confirm_cancel') || 'Потвърди отмяна'}
                            </h3>
                            <p className="text-gray-600 font-light mb-6">
                                {t('orders.confirm_cancel_text') || 'Сигурни ли сте, че искате да отмените тази поръчка?'}
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowCancelConfirm(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 font-light hover:bg-gray-200 transition-colors"
                                >
                                    {t('orders.cancel') || 'Отказ'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelOrder.isPending}
                                    className="flex-1 px-4 py-3 bg-red-50 text-red-900 border border-red-300 font-light hover:bg-red-100 transition-colors disabled:opacity-50"
                                >
                                    {cancelOrder.isPending 
                                        ? (t('orders.cancelling') || 'Отменяне...')
                                        : (t('orders.confirm') || 'Потвърди')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderItemCard({ item }: { item: any }) {
    const { t } = useLanguage();
    
    return (
        <div className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
            {item.product?.primary_image ? (
                <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                    <Image
                        src={item.product.primary_image}
                        alt={item.product_name || item.product?.name || ''}
                        width={80}
                        height={80}
                        className="object-cover border border-gray-200"
                    />
                </Link>
            ) : (
                <div className="w-20 h-20 bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                </div>
            )}
            <div className="flex-1 min-w-0">
                <Link 
                    href={item.product?.slug ? `/products/${item.product.slug}` : '#'}
                    className="block"
                >
                    <h3 className="text-base font-light text-gray-900 mb-1 hover:underline">
                        {item.product_name || item.product?.name || `Product #${item.product_id}`}
                    </h3>
                </Link>
                {item.variant_name && (
                    <p className="text-sm text-gray-600 font-light mb-2">
                        {item.variant_name}
                    </p>
                )}
                {item.sku && (
                    <p className="text-xs text-gray-500 font-light mb-2">
                        SKU: {item.sku}
                    </p>
                )}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 font-light">
                        {t('orders.quantity') || 'Количество'}: {item.quantity}
                    </span>
                    <span className="text-base font-light text-gray-900">
                        {Number(item.price || 0).toFixed(2)} {t('product.currency') || 'лв.'}
                    </span>
                </div>
                <div className="mt-2 text-right">
                    <span className="text-sm font-light text-gray-900">
                        {t('orders.subtotal') || 'Междинна сума'}: {Number(item.subtotal || item.price * item.quantity || 0).toFixed(2)} {t('product.currency') || 'лв.'}
                    </span>
                </div>
            </div>
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

