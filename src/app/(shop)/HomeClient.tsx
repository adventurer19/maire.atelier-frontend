// src/app/(shop)/HomeClient.tsx
'use client';

import { useLanguage } from '@/context/LanguageContext';
import VideoSection from '@/components/home/VideoSection';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryGrid from '@/components/home/CategoryGrid';
import type { Collection } from '@/types/collection';

export default function HomeClient({ 
    featuredProducts, 
    featuredCategories,
    latestCollection 
}: { 
    featuredProducts: any[];
    featuredCategories: any[];
    latestCollection: Collection | null;
}) {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen">
            {/* Video Section */}
            <VideoSection />

            {/* Hero Section */}
            <HeroSection latestCollection={latestCollection} />

            {/* Featured Products */}
            <section className="py-8 md:py-12 lg:py-16 bg-white">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-6 md:mb-8 lg:mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-2 md:mb-4">
                            {t('home.featured_products_title')}
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4 md:px-0">
                            {t('home.featured_products_subtitle')}
                        </p>
                    </div>

                    {featuredProducts.length > 0 ? (
                        <FeaturedProducts products={featuredProducts} />
                    ) : (
                        <FeaturedProductsSkeleton />
                    )}
                </div>
            </section>

            {/* Categories - Показвай само ако има featured */}
            {featuredCategories.length > 0 && (
                <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
                    <div className="container px-4 md:px-6">
                        <div className="text-center mb-6 md:mb-8 lg:mb-12">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-2 md:mb-4">
                                {t('home.categories_title')}
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 px-4 md:px-0">
                                {t('home.categories_subtitle')}
                            </p>
                        </div>

                        <CategoryGrid categories={featuredCategories} />
                    </div>
                </section>
            )}

            {/* Newsletter section removed - using footer newsletter instead */}
        </div>
    );
}

/**
 * Loading skeleton for featured products
 */
function FeaturedProductsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
            ))}
        </div>
    );
}

