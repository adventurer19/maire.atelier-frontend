'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function SizeGuidePage() {
    const { t } = useLanguage();

    const measureSteps = [
        t('sizeGuide.measure_step1'),
        t('sizeGuide.measure_step2'),
        t('sizeGuide.measure_step3'),
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gray-900 text-white py-16">
                <div className="container text-center">
                    <h1 className="text-5xl font-light tracking-tight mb-4">
                        {t('sizeGuide.hero_title')}
                    </h1>
                    <p className="text-xl font-light text-gray-300">
                        {t('sizeGuide.hero_subtitle')}
                    </p>
                </div>
            </section>

            <div className="container py-16 max-w-4xl">
                {/* How to Measure */}
                <section className="mb-16">
                    <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-4">
                        {t('sizeGuide.how_to_title')}
                    </h2>
                    <p className="text-gray-600 mb-6 font-light">
                        {t('sizeGuide.how_to_description')}
                    </p>

                    <div className="space-y-4">
                        {measureSteps.map((step, index) => (
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

                {/* Size Chart */}
                <section className="mb-16">
                    <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-6">
                        {t('sizeGuide.table_title')}
                    </h2>
                    <div className="bg-white border border-gray-200 shadow-sm p-8">
                        <p className="text-gray-600 font-light text-center">
                            {t('sizeGuide.note_contact')}
                        </p>
                    </div>
                </section>

                {/* Important Notes */}
                <section>
                    <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-6">
                        {t('sizeGuide.note_title')}
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 shadow-sm p-6">
                            <p className="text-gray-600 font-light">
                                {t('sizeGuide.note_fit')}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 shadow-sm p-6">
                            <p className="text-gray-600 font-light">
                                {t('sizeGuide.note_materials')}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

