// src/components/home/HeroSection.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
    const { t } = useLanguage();
    return (
        <section className="relative h-[500px] sm:h-[600px] md:h-[700px] bg-gray-900 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-10" />
                <Image
                    src="/hero-placeholder.jpg"
                    alt="Hero"
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
                <div className="container px-4 sm:px-6">
                    <div className="max-w-2xl">
                        {/* Heading - Responsive Typography */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
                            {t('home.hero_title') || 'Нова Колекция'}
                            <br />
                            <span className="text-gray-200">{t('home.hero_subtitle') || 'Есен/Зима 2025'}</span>
                        </h1>

                        {/* Description - Responsive Size */}
                        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed max-w-xl">
                            {t('home.hero_description') || 'Открийте елегантността в детайлите с нашата най-нова колекция от модни дрехи'}
                        </p>

                        {/* CTA Buttons - Responsive Layout */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Link
                                href="/products"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 font-medium text-center rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                {t('home.cta_primary') || 'Разгледай Колекцията'}
                            </Link>
                            <Link
                                href="/collections"
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white font-medium text-center rounded-lg border-2 border-white hover:bg-white hover:text-gray-900 transition-colors"
                            >
                                {t('home.cta_secondary') || 'Виж Всички'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator - Hidden on very small screens */}
            <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}