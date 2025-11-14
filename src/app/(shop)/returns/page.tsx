'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function ReturnsPage() {
    const { t } = useLanguage();

    const returnSteps = [
        t('returns.process_step1'),
        t('returns.process_step2'),
        t('returns.process_step3'),
        t('returns.process_step4'),
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gray-900 text-white py-16">
                <div className="container text-center">
                    <h1 className="text-5xl font-light tracking-tight mb-4">
                        {t('returns.hero_title')}
                    </h1>
                    <p className="text-xl font-light text-gray-300">
                        {t('returns.hero_subtitle')}
                    </p>
                </div>
            </section>

            <div className="container py-16">
                {/* Policy */}
                <section className="mb-16">
                    <div className="bg-white border border-gray-200 shadow-sm p-8">
                        <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-4">
                            {t('returns.policy_title')}
                        </h2>
                        <p className="text-gray-600 font-light text-lg">
                            {t('returns.policy_description')}
                        </p>
                    </div>
                </section>

                {/* Conditions */}
                <section className="mb-16">
                    <div className="bg-white border border-gray-200 shadow-sm p-8">
                        <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-4">
                            {t('returns.conditions_title')}
                        </h2>
                        <p className="text-gray-600 font-light">
                            {t('returns.conditions_description')}
                        </p>
                    </div>
                </section>

                {/* Process */}
                <section className="mb-16">
                    <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-6">
                        {t('returns.process_title')}
                    </h2>
                    <div className="space-y-4">
                        {returnSteps.map((step, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 shadow-sm p-6 flex gap-4"
                            >
                                <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white flex items-center justify-center font-light">
                                    {index + 1}
                                </div>
                                <p className="text-gray-600 font-light flex-1">
                                    {step}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Refund & Exchange */}
                <section className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white border border-gray-200 shadow-sm p-8">
                        <h3 className="text-xl font-light text-gray-900 mb-3 tracking-tight">
                            {t('returns.refund_title')}
                        </h3>
                        <p className="text-gray-600 font-light">
                            {t('returns.refund_description')}
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 shadow-sm p-8">
                        <h3 className="text-xl font-light text-gray-900 mb-3 tracking-tight">
                            {t('returns.exchange_title')}
                        </h3>
                        <p className="text-gray-600 font-light">
                            {t('returns.exchange_description')}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

