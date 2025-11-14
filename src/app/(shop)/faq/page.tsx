'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function FAQPage() {
    const { t } = useLanguage();

    const faqCategories = [
        {
            title: t('faq.general_title'),
            questions: [
                {
                    q: t('contact.faq_order_question'),
                    a: t('contact.faq_order_answer'),
                },
                {
                    q: t('contact.faq_personalization_question'),
                    a: t('contact.faq_personalization_answer'),
                },
            ],
        },
        {
            title: t('faq.shipping_title'),
            questions: [
                {
                    q: t('contact.faq_delivery_question'),
                    a: t('contact.faq_delivery_answer'),
                },
            ],
        },
        {
            title: t('faq.returns_title'),
            questions: [
                {
                    q: t('contact.faq_return_question'),
                    a: t('contact.faq_return_answer'),
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gray-900 text-white py-16">
                <div className="container text-center">
                    <h1 className="text-5xl font-light tracking-tight mb-4">
                        {t('faq.hero_title')}
                    </h1>
                    <p className="text-xl font-light text-gray-300">
                        {t('faq.hero_subtitle')}
                    </p>
                </div>
            </section>

            <div className="container py-16 max-w-4xl">
                {/* FAQ Categories */}
                {faqCategories.map((category, categoryIndex) => (
                    <section key={categoryIndex} className="mb-12">
                        <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-6">
                            {category.title}
                        </h2>
                        <div className="space-y-4">
                            {category.questions.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="bg-white border border-gray-200 shadow-sm p-6"
                                >
                                    <h3 className="text-lg font-light text-gray-900 mb-3 tracking-tight">
                                        {item.q}
                                    </h3>
                                    <p className="text-gray-600 font-light">
                                        {item.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Contact CTA */}
                <section className="bg-white border border-gray-200 shadow-sm p-8 text-center">
                    <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-3">
                        {t('faq.contact_title')}
                    </h2>
                    <p className="text-gray-600 mb-6 font-light">
                        {t('faq.contact_description')}
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-3 bg-gray-900 text-white font-light hover:bg-gray-800 active:bg-gray-700 transition-all duration-300 border-2 border-gray-900"
                    >
                        {t('faq.contact_button')}
                    </Link>
                </section>
            </div>
        </div>
    );
}

