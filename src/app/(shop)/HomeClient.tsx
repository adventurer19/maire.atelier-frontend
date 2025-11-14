// src/app/(shop)/HomeClient.tsx
'use client';

import { useLanguage } from '@/context/LanguageContext';
import VideoSection from '@/components/home/VideoSection';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategoryCarousel from '@/components/shop/CategoryCarousel';
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

            {/* Gradient Transition - Video to Hero */}
            <div className="relative h-20 md:h-28 lg:h-36 bg-gradient-to-b from-black/30 via-gray-900/15 to-[#FCFCFB]" />

            {/* Hero Section */}
            <HeroSection latestCollection={latestCollection} />

            {/* Elegant Separator - Hero to Featured Products */}
            <div className="relative overflow-hidden">
                {/* Gradient Transition with Elegant Blend */}
                <div className="h-20 md:h-28 lg:h-36 bg-gradient-to-b from-[#FCFCFB] via-[#F8F7F4] to-[#F5F1EB]" />
                
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,1)_1px,_transparent_1px)] bg-[length:40px_40px]" />
                
                {/* Subtle Divider Line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent" />
            </div>

            {/* Featured Products - Elegant Section with Warm Background */}
            <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-b from-[#F5F1EB] via-[#FAF8F5] to-[#FEFDFB]">
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,1)_1px,_transparent_1px)] bg-[length:50px_50px] pointer-events-none" />
                
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/40 to-transparent" />
                
                <div className="relative z-10 container px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Header - Elegant Typography */}
                    <div className="text-center mb-10 md:mb-12 lg:mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-3 md:mb-4 tracking-tight">
                            {t('home.featured_products_title')}
                        </h2>
                        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                            {t('home.featured_products_subtitle')}
                        </p>
                    </div>

                    {/* Products Grid */}
                    {featuredProducts.length > 0 ? (
                        <FeaturedProducts products={featuredProducts} />
                    ) : (
                        <FeaturedProductsSkeleton />
                    )}
                </div>

                {/* Decorative Bottom Border */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/40 to-transparent" />
            </section>

            {/* Gradient Transition - Featured Products to Categories */}
            <div className="relative h-16 md:h-24 lg:h-28 bg-gradient-to-b from-[#FEFDFB] via-[#FAF9F7] to-gray-50 overflow-hidden">
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,1)_1px,_transparent_1px)] bg-[length:45px_45px]" />
                
                {/* Horizontal Gradient Accent */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/20 to-transparent" />
            </div>

            {/* Categories - Only show if there are featured categories */}
            {featuredCategories.length > 0 && (
                <section className="relative py-8 md:py-12 lg:py-16 bg-gradient-to-b from-gray-50 via-gray-50 to-gray-50/98">
                    {/* Subtle Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.008] bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,1)_1px,_transparent_1px)] bg-[length:55px_55px] pointer-events-none" />
                    
                    {/* Subtle Top Border */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent" />
                    
                    <div className="relative z-10 container px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
                        <div className="text-center mb-6 md:mb-8 lg:mb-12">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-2 md:mb-4">
                                {t('home.categories_title')}
                            </h2>
                            <p className="text-sm md:text-base text-gray-600 px-4 md:px-0">
                                {t('home.categories_subtitle')}
                            </p>
                        </div>

                        <CategoryCarousel categories={featuredCategories} featured />
                    </div>

                    {/* Subtle Bottom Border */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent" />
                </section>
            )}

            {/* Newsletter section removed - using footer newsletter instead */}
        </div>
    );
}

/**
 * Loading skeleton for featured products - Elegant Design
 */
function FeaturedProductsSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-100 mb-4 md:mb-5" />
                    <div className="h-4 bg-gray-100 w-3/4 mb-3" />
                    <div className="h-5 bg-gray-100 w-1/2" />
                </div>
            ))}
        </div>
    );
}

