// src/app/(shop)/collections/CollectionsClient.tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
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
                    <h2 className="text-3xl font-bold mb-4">{t('collections.empty_title')}</h2>
                    <p className="text-gray-500 mt-4">
                        {t('collections.empty_desc')}
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

            {/* Collections Grid */}
            <div className="container px-4 md:px-6 py-8 md:py-10 lg:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                    {collections.map((collection) => (
                        <CollectionCard key={collection.id} collection={collection} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function CollectionCard({ collection }: { collection: Collection }) {
    const { t } = useLanguage();
    const [imageError, setImageError] = useState(false);
    
    const collectionName = typeof collection.name === 'string' 
        ? collection.name 
        : collection.name?.bg || collection.name?.en || 'Collection';
    
    const description = typeof collection.description === 'string'
        ? collection.description
        : collection.description?.bg || collection.description?.en || '';

    // Get image URL with proper fallback
    const getImageUrl = () => {
        if (collection.image && !collection.image.includes('placeholder')) {
            return collection.image;
        }
        // Return null if no valid image - will show gradient background
        return null;
    };

    const imageUrl = getImageUrl();
    const hasValidImage = imageUrl && !imageError;

    return (
        <Link
            href={`/collections/${collection.slug}`}
            className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-[4/3]"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20">
                {hasValidImage ? (
                    <Image
                        src={imageUrl}
                        alt={collectionName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => {
                            setImageError(true);
                        }}
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-white/50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                    </div>
                )}
            </div>

            <div className="relative h-full flex flex-col justify-end p-4 md:p-5 lg:p-6">
                <h3 className="font-serif font-bold text-white mb-2 text-xl md:text-2xl lg:text-3xl leading-tight">
                    {collectionName}
                </h3>

                {description && (
                    <p className="text-gray-200 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">
                        {description}
                    </p>
                )}

                {collection.products && collection.products.length > 0 && (
                    <div className="text-xs md:text-sm text-gray-300 mb-2 md:mb-3">
                        {collection.products.length}{' '}
                        {collection.products.length === 1 
                            ? t('collections.product_singular') 
                            : t('collections.product_plural')}
                    </div>
                )}

                <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                    <span className="text-xs md:text-sm font-medium">{t('collections.explore')}</span>
                    <svg
                        className="w-3.5 h-3.5 md:w-4 md:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>

            {collection.is_featured && (
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white text-gray-900 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold">
                    {t('collections.featured')}
                </div>
            )}
        </Link>
    );
}

