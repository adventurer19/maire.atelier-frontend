// src/app/(shop)/collections/CollectionsClient.tsx
'use client';

import { useLanguage } from '@/context/LanguageContext';
import { CollectionCard } from '@/components/shop/CollectionCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Collection } from '@/types';

export default function CollectionsClient({ collections }: { collections: Collection[] }) {
    const { t } = useLanguage();

    if (collections.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                    <div className="container py-16 sm:py-20">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4">
                                {t('collections.page_title')}
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-300">
                                {t('collections.page_subtitle')}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-center py-20">
                    <h2 className="text-3xl font-bold mb-4">{t('collections.empty_title') || t('collections.no_collections_title')}</h2>
                    <p className="text-gray-500 mt-4">
                        {t('collections.empty_desc') || t('collections.no_collections_desc')}
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
                            {t('collections.page_title')}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-300">
                            {t('collections.page_subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container px-4 md:px-6 py-8 md:py-10 lg:py-12">
                {/* All Collections Grid */}
                <section>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 lg:mb-8 gap-2 md:gap-4">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-gray-900">
                            {t('collections.all_title') || t('collections.page_title')}
                        </h2>
                        <span className="text-xs md:text-sm text-gray-600">
                            {collections.length}{' '}
                            {collections.length === 1 
                                ? t('collections.collection_singular') || 'Collection'
                                : t('collections.collection_plural') || 'Collections'}
                        </span>
                    </div>

                    {collections.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                            {collections.map((collection) => (
                                <CollectionCard key={collection.id} collection={collection} featured={collection.is_featured} />
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

