'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function TermsPage() {
    const { t } = useLanguage();

    const sections = [
        {
            title: t('terms.acceptance_title'),
            content: t('terms.acceptance_description'),
        },
        {
            title: t('terms.use_title'),
            content: t('terms.use_description'),
        },
        {
            title: t('terms.orders_title'),
            content: t('terms.orders_description'),
        },
        {
            title: t('terms.privacy_title'),
            content: t('terms.privacy_description'),
        },
        {
            title: t('terms.changes_title'),
            content: t('terms.changes_description'),
        },
        {
            title: t('terms.contact_title'),
            content: t('terms.contact_description'),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gray-900 text-white py-16">
                <div className="container text-center">
                    <h1 className="text-5xl font-light tracking-tight mb-4">
                        {t('terms.hero_title')}
                    </h1>
                    <p className="text-xl font-light text-gray-300">
                        {t('terms.hero_subtitle')}
                    </p>
                </div>
            </section>

            <div className="container py-16 max-w-4xl">
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 shadow-sm p-8"
                        >
                            <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-4">
                                {section.title}
                            </h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

