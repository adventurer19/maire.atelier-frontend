// src/app/(shop)/collections/[slug]/CollectionDetailClient.tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import type { Collection } from '@/types';
import ProductCard from '@/components/products/ProductCard';

export default function CollectionDetailClient({ collection }: { collection: Collection }) {
    const { t } = useLanguage();
    const [imageError, setImageError] = useState(false);
    
    const collectionName = typeof collection.name === 'string'
        ? collection.name
        : collection.name?.bg || collection.name?.en || 'Collection';
    
    const description = typeof collection.description === 'string'
        ? collection.description
        : collection.description?.bg || collection.description?.en || null;

    // Get image URL with proper fallback
    const getImageUrl = () => {
        if (collection.image && !collection.image.includes('placeholder')) {
            return collection.image;
        }
        return null;
    };

    const imageUrl = getImageUrl();
    const hasValidImage = imageUrl && !imageError;
    const products = collection.products || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
                {hasValidImage ? (
                    <div className="absolute inset-0">
                        <Image
                            src={imageUrl}
                            alt={collectionName}
                            fill
                            className="object-cover opacity-30"
                            onError={() => {
                                setImageError(true);
                            }}
                            unoptimized
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                )}
                <div className="relative container h-full flex flex-col justify-center">
                    <div className="max-w-3xl">
                        {collection.is_featured && (
                            <span className="inline-block mb-4 bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                                {t('collections.featured')}
                            </span>
                        )}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4">
                            {collectionName}
                        </h1>
                        {description && (
                            <p className="text-lg sm:text-xl text-gray-200 mb-6 max-w-2xl">
                                {description}
                            </p>
                        )}
                        {products.length > 0 && (
                            <p className="text-gray-300">
                                {products.length}{' '}
                                {products.length === 1 
                                    ? t('collections.product_singular') 
                                    : t('collections.product_plural')}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container py-12">
                {products.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                                {t('collections.products_title')}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <svg
                                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                {t('collections.no_products_title')}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {t('collections.no_products_desc')}
                            </p>
                            <Link
                                href="/products"
                                className="inline-block px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                {t('collections.browse_products')}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

