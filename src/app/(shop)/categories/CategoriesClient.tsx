// src/app/(shop)/categories/CategoriesClient.tsx
'use client';

import { useLanguage } from '@/context/LanguageContext';
import { CategoryCard } from '@/components/shop/CategoryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Category } from '@/types';

export default function CategoriesClient({
    rootCategories,
    featuredCategories,
    regularCategories,
}: {
    rootCategories: Category[];
    featuredCategories: Category[];
    regularCategories: Category[];
}) {
    const { t } = useLanguage();

    // Empty state
    if (rootCategories.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                    <div className="container py-16 sm:py-20">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4">
                                {t('categories.page_title')}
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-300">
                                {t('categories.page_subtitle')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-center py-20">
                    <h2 className="text-3xl font-bold mb-4">{t('categories.no_categories_title')}</h2>
                    <p className="text-gray-500 mt-4">
                        {t('categories.no_categories_desc')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                <div className="container px-4 md:px-6 py-12 md:py-16 lg:py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 md:mb-4 leading-tight">
                            {t('categories.page_title')}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-300">
                            {t('categories.page_subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 py-8 md:py-10 lg:py-12">
                {/* All Categories Grid */}
                <section>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 lg:mb-8 gap-2 md:gap-4">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-gray-900">
                            {t('categories.all_title')}
                        </h2>
                        <span className="text-xs md:text-sm text-gray-600">
                            {rootCategories.length}{' '}
                            {rootCategories.length === 1 
                                ? t('categories.category_singular') 
                                : t('categories.category_plural')}
                        </span>
                    </div>

                    {rootCategories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                            {rootCategories.map((category) => (
                                <CategoryCard key={category.id} category={category} featured />
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </section>
            </div>
        </div>
    );
}

