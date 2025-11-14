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
    const { t, lang } = useLanguage();
    const collectionSlug = latestCollection?.slug;
    const products = latestCollection?.products || [];

    // Resolve collection name and descriptions with proper fallback
    const name =
        latestCollection && typeof latestCollection.name !== 'string'
            ? latestCollection.name?.[lang] || latestCollection.name?.bg || latestCollection.name?.en || t('home.hero_title')
            : latestCollection?.name || t('home.hero_title');
    
    const description =
        latestCollection && typeof latestCollection.description !== 'string'
            ? latestCollection.description?.[lang] || latestCollection.description?.bg || latestCollection.description?.en || t('home.hero_description')
            : latestCollection?.description || t('home.hero_description');

    return (
        <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[70vh] overflow-hidden bg-gradient-to-br from-white via-[#FCFCFB] to-white">
            <div className="container px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full py-8 md:py-12 lg:py-16">
                    {/* Left Column - Text Content (Loro Piana inspired) */}
                    <div className="flex flex-col justify-center max-w-2xl">
                        {/* Season/Subtitle */}
                        <div className="text-gray-600 text-sm md:text-base font-light tracking-wider uppercase mb-2 md:mb-3">
                            {t('home.hero_subtitle')}
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-tight mb-4 md:mb-6 tracking-tight">
                            {name}
                        </h1>

                        {/* Description */}
                        <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 md:mb-10 leading-relaxed font-light max-w-xl">
                            {description}
                        </p>

                        {/* CTA Button */}
                        <div>
                            {collectionSlug ? (
                                <Link
                                    href={`/collections/${collectionSlug}`}
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-medium border border-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 text-sm md:text-base min-h-[52px] group"
                                >
                                    {t('home.cta_primary')}
                                    <svg 
                                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ) : (
                                <Link
                                    href="/products"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-medium border border-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-all duration-300 text-sm md:text-base min-h-[52px] group"
                                >
                                    {t('home.cta_primary')}
                                    <svg 
                                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Product Images Carousel */}
                    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-full flex items-center justify-center">
                        {products.length > 0 ? (
                            <div className="w-full max-w-lg lg:max-w-full h-full">
                                <ProductCarousel products={products} collectionSlug={collectionSlug} />
                            </div>
                        ) : (
                            <div className="w-full max-w-lg lg:max-w-full h-full bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                                <p className="text-gray-500 text-center px-4">
                                    {t('home.no_collection_products')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}