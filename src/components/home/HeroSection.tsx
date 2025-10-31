// src/components/home/HeroSection.tsx
'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import ProductCarousel from './ProductCarousel';
import type { Collection } from '@/types/collection';

interface HeroSectionProps {
    latestCollection: Collection | null;
}

export default function HeroSection({ latestCollection }: HeroSectionProps) {
    const { t } = useLanguage();
    const collectionSlug = latestCollection?.slug;
    const products = latestCollection?.products || [];

    // Resolve collection name and descriptions
    const name =
        latestCollection && typeof latestCollection.name !== 'string'
            ? latestCollection.name?.bg || latestCollection.name?.en || t('home.hero_title') || 'Нова Колекция'
            : latestCollection?.name || t('home.hero_title') || 'Нова Колекция';
    
    const description =
        latestCollection && typeof latestCollection.description !== 'string'
            ? latestCollection.description?.bg || latestCollection.description?.en || t('home.hero_description') || 'Открийте елегантността в детайлите с нашата най-нова колекция от модни дрехи'
            : latestCollection?.description || t('home.hero_description') || 'Открийте елегантността в детайлите с нашата най-нова колекция от модни дрехи';

    return (
        <section className="relative min-h-[400px] md:min-h-[450px] lg:min-h-[45vh] overflow-hidden bg-[#F5F1EB]">
            <div className="container px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.2fr] gap-6 lg:gap-10 h-full py-5 md:py-8 lg:py-10">
                    {/* Left Column - Text Content (inspired by NISOLO) */}
                    <div className="flex flex-col justify-center max-w-xl">
                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-light text-gray-900 leading-tight mb-3 md:mb-4 tracking-tight">
                            {name}
                        </h1>

                        {/* Subheading */}
                        <p className="text-base md:text-lg lg:text-xl text-gray-700 mb-6 md:mb-8 leading-relaxed font-light max-w-xl">
                            {description}
                        </p>

                        {/* CTA Button - Single button (NISOLO style) */}
                        <div>
                            {collectionSlug ? (
                                <Link
                                    href={`/collections/${collectionSlug}`}
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-medium rounded-md border-2 border-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm md:text-base min-h-[52px] shadow-sm"
                                >
                                    {t('home.cta_primary') || 'Разгледай Колекцията'}
                                </Link>
                            ) : (
                                <Link
                                    href="/products"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-medium rounded-md border-2 border-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm md:text-base min-h-[52px] shadow-sm"
                                >
                                    {t('home.cta_primary') || 'Разгледай Колекцията'}
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Product Images Carousel */}
                    <div className="relative h-[320px] sm:h-[360px] md:h-[400px] lg:h-full flex items-center justify-center lg:justify-end">
                        {products.length > 0 ? (
                            <div className="w-full max-w-lg lg:max-w-4xl xl:max-w-5xl h-full">
                                <ProductCarousel products={products} collectionSlug={collectionSlug} />
                            </div>
                        ) : (
                            <div className="w-full max-w-lg lg:max-w-4xl xl:max-w-5xl h-full bg-white/50 rounded-2xl flex items-center justify-center border border-gray-200">
                                <p className="text-gray-600 text-center px-4">
                                    {t('home.no_collection_products') || 'Продуктите се зареждат...'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}