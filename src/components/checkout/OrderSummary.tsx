'use client';

import Image from 'next/image';
import Link from 'next/link';

interface OrderSummaryProps {
    cart: any;
}

export default function OrderSummary({ cart }: OrderSummaryProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-xl font-bold mb-4">Резюме на поръчката</h2>

            {/* Items */}
            <div className="space-y-4 mb-6">
                {cart.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                                src={item.product?.primary_image || '/placeholder-category.svg'}
                                alt={item.product?.name || 'Product'}
                                fill
                                sizes="80px"
                                className="object-cover rounded"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium">{item.product?.name}</h3>
                            {item.variant_name && (
                                <p className="text-sm text-gray-600">{item.variant_name}</p>
                            )}
                            <p className="text-sm text-gray-600">
                                Количество: {item.quantity} × €{item.price.toFixed(2)}
                            </p>
                        </div>
                        <div className="font-medium">€{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Междинна сума ({cart.summary.total_items} артикула)</span>
                    <span>€{cart.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Доставка</span>
                    <span>
                        {cart.summary.shipping === 0 ? (
                            <span className="text-green-600 font-medium">БЕЗПЛАТНО</span>
                        ) : (
                            `€${cart.summary.shipping.toFixed(2)}`
                        )}
                    </span>
                </div>
                {cart.summary.tax > 0 && (
                    <div className="flex justify-between text-gray-600">
                        <span>ДДС</span>
                        <span>€{cart.summary.tax.toFixed(2)}</span>
                    </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Общо</span>
                    <span>€{cart.summary.total.toFixed(2)}</span>
                </div>
            </div>

            {/* Free shipping notice */}
            {cart.summary.subtotal < 150 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                    Поръчайте за още €{(150 - cart.summary.subtotal).toFixed(2)} за безплатна доставка!
                </div>
            )}

            <Link
                href="/cart"
                className="mt-4 block text-center text-gray-600 hover:text-gray-900 underline text-sm"
            >
                ← Обратно към количката
            </Link>
        </div>
    );
}

