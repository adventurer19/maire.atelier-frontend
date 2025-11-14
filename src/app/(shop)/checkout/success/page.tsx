'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ordersApi } from '@/lib/api/orders';
import type { Order } from '@/types/order';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderNumber = searchParams.get('order');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderNumber) {
            // Try to fetch order details
            ordersApi
                .getOrder(orderNumber)
                .then(setOrder)
                .catch(() => {
                    // Order might not be found, that's okay
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [orderNumber]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Поръчката е успешна!</h1>
                    <p className="text-gray-600">
                        Благодарим ви за поръчката. Ще получите потвърждение на имейл.
                    </p>
                </div>

                {order && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                        <h2 className="font-bold mb-4">Детайли на поръчката</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Номер на поръчка:</span>
                                <span className="font-medium">{order.order_number || order.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Статус:</span>
                                <span className="font-medium">
                                    {order.status === 'pending' && 'В изчакване'}
                                    {order.status === 'processing' && 'Обработва се'}
                                    {order.status === 'shipped' && 'Изпратена'}
                                    {order.status === 'delivered' && 'Доставена'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Обща сума:</span>
                                <span className="font-medium">
                                    €{typeof order.total === 'number' 
                                        ? order.total.toFixed(2) 
                                        : parseFloat(order.total || '0').toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {orderNumber && !order && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <p className="text-sm text-gray-600">
                            Номер на поръчка: <span className="font-medium">{orderNumber}</span>
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/account"
                        className="px-6 py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
                    >
                        Вижте поръчките си
                    </Link>
                    <Link
                        href="/products"
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                    >
                        Продължете пазаруването
                    </Link>
                </div>
            </div>
        </div>
    );
}

