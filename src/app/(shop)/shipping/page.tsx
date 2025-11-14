'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function ShippingPage() {
    const { t } = useLanguage();

    const shippingMethods = [
        {
            title: t('shipping.standard_title'),
            description: t('shipping.standard_description'),
            price: t('shipping.standard_price'),
        },
        {
            title: t('shipping.express_title'),
            description: t('shipping.express_description'),
            price: t('shipping.express_price'),
        },
        {
            title: t('shipping.free_title'),
            description: t('shipping.free_description'),
            price: t('shipping.free_price'),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gray-900 text-white py-16">
                <div className="container text-center">
                    <h1 className="text-5xl font-light tracking-tight mb-4">
                        {t('shipping.hero_title')}
                    </h1>
                    <p className="text-xl font-light text-gray-300">
                        {t('shipping.hero_subtitle')}
                    </p>
                </div>
            </section>

            <div className="container py-16">
                {/* Shipping Methods */}
                <section className="mb-16">
                    <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-4">
                        {t('shipping.methods_title')}
                    </h2>
                    <p className="text-gray-600 mb-8 font-light">
                        {t('shipping.methods_description')}
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {shippingMethods.map((method, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 shadow-sm p-6"
                            >
                                <h3 className="text-xl font-light text-gray-900 mb-3 tracking-tight">
                                    {method.title}
                                </h3>
                                <p className="text-gray-600 mb-4 font-light">
                                    {method.description}
                                </p>
                                <p className="text-gray-900 font-light">
                                    {method.price}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Additional Information */}
                <section className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white border border-gray-200 shadow-sm p-6">
                        <h3 className="text-xl font-light text-gray-900 mb-3 tracking-tight">
                            {t('shipping.timing_title')}
                        </h3>
                        <p className="text-gray-600 font-light">
                            {t('shipping.timing_description')}
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm p-6">
                        <h3 className="text-xl font-light text-gray-900 mb-3 tracking-tight">
                            {t('shipping.tracking_title')}
                        </h3>
                        <p className="text-gray-600 font-light">
                            {t('shipping.tracking_description')}
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm p-6">
                        <h3 className="text-xl font-light text-gray-900 mb-3 tracking-tight">
                            {t('shipping.international_title')}
                        </h3>
                        <p className="text-gray-600 font-light">
                            {t('shipping.international_description')}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

