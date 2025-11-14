'use client';

import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function AboutClient() {
    const { t } = useLanguage();

    const sections = [
        {
            title: t('about.mission_title'),
            text: t('about.mission_text'),
        },
        {
            title: t('about.values_title'),
            text: t('about.values_text'),
        },
        {
            title: t('about.team_title'),
            text: t('about.team_text'),
        },
    ];

    const stats = [
        { value: '500+', label: t('about.stats_satisfied') },
        { value: '1000+', label: t('about.stats_products') },
        { value: '100%', label: t('about.stats_handmade') },
        { value: '4+', label: t('about.stats_experience') },
    ];

    return (
        <div className="min-h-screen">
            <section className="relative h-[400px] bg-gray-900 text-white">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
                <div className="relative container h-full flex flex-col justify-center items-center text-center">
                    <h1 className="text-5xl font-serif font-bold mb-4">{t('about.hero_title')}</h1>
                    <p className="text-xl mb-2">{t('about.hero_subtitle')}</p>
                    <p className="text-lg text-gray-300 max-w-2xl">{t('about.hero_description')}</p>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container max-w-4xl">
                    <h2 className="text-4xl font-serif font-bold text-center mb-8">{t('about.story_title')}</h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">{t('about.story_content')}</p>

                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        {sections.map((section, index) => (
                            <div key={index} className="text-center">
                                <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{section.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container max-w-3xl text-center">
                    <h2 className="text-3xl font-serif font-bold mb-6">{t('about.cta_title')}</h2>
                    <p className="text-gray-600 mb-8 text-lg">{t('about.cta_desc')}</p>
                    <Link href="/products" className="inline-block px-8 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors">
                        {t('about.cta_button')}
                    </Link>
                </div>
            </section>
        </div>
    );
}


