'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import type { Collection } from '@/types';

interface CollectionCardProps {
    collection: Collection;
    featured?: boolean;
}

export function CollectionCard({ collection, featured = false }: CollectionCardProps) {
    const { t, lang } = useLanguage();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    
    const collectionName =
        typeof collection.name === 'string'
            ? collection.name
            : collection.name?.[lang] || collection.name?.bg || collection.name?.en || 'Collection';

    const collectionDescription =
        typeof collection.description === 'string'
            ? collection.description
            : collection.description?.[lang] || collection.description?.bg || collection.description?.en || null;

    // Get placeholder image from Unsplash
    const getPlaceholderImage = (): string => {
        const placeholderImages = [
            'photo-1441986300917-64674bd600d8', // Fashion collection
            'photo-1515886657613-9f3515b0c78f', // Fashion model
            'photo-1490481651871-ab68de25d43d', // Fashion style
            'photo-1515372039744-b8f02a3ae446', // Fashion clothing
            'photo-1483985988355-763728e1935b', // Fashion store
            'photo-1469334031218-e382a71b716b', // Fashion accessories
            'photo-1445205170230-053b83016050', // Fashion collection 2
            'photo-1515886657613-9f3515b0c78f', // Fashion model 2
        ];
        const imageIndex = collection.id % placeholderImages.length;
        return `https://images.unsplash.com/${placeholderImages[imageIndex]}?w=800&h=1000&fit=crop&q=80`;
    };

    // Get image URL with proper fallback
    const getImageUrl = (): string => {
        // If image failed to load, use placeholder
        if (imageError) {
            return getPlaceholderImage();
        }
        
        // Try collection.image first
        if (collection.image && !collection.image.includes('placeholder')) {
            return collection.image;
        }
        
        // Use placeholder directly (no local images to try)
        return getPlaceholderImage();
    };

    const imageUrl = getImageUrl();

    return (
        <Link
            href={`/collections/${collection.slug}`}
            className="group relative flex flex-col h-full"
        >
            <article className="relative flex flex-col h-full">
                {/* Collection Image Container - Same style as CategoryCard */}
                <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-4 md:mb-5">
                    {/* Loading Skeleton */}
                    {imageLoading && (
                        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                    )}
                    
                    {/* Collection Image */}
                    <img
                        src={imageUrl}
                        alt={collectionName}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                            imageLoading ? 'opacity-0' : 'opacity-100'
                        } group-hover:scale-[1.02]`}
                        onLoad={() => setImageLoading(false)}
                        onError={() => {
                            if (!imageError) {
                                setImageError(true);
                                setImageLoading(false);
                            }
                        }}
                        loading="lazy"
                    />

                    {/* Featured Badge - Same style as CategoryCard */}
                    {(featured || collection.is_featured) && (
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 text-[11px] md:text-xs font-normal px-3 md:px-3.5 py-1.5 tracking-wider uppercase border border-gray-300">
                            {t('collections.featured')}
                        </div>
                    )}

                    {/* Hover Overlay - Very Subtle */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/3 transition-colors duration-500 pointer-events-none" />
                </div>

                {/* Collection Info - Same style as CategoryCard */}
                <div className="flex flex-col flex-grow">
                    {/* Collection Name - Clean & Minimal */}
                    <h3 className="font-light text-sm md:text-base text-gray-900 mb-3 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2 leading-relaxed tracking-normal">
                        {collectionName}
                    </h3>

                    {/* Collection Description - Optional, only if featured */}
                    {featured && collectionDescription && (
                        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 font-light leading-relaxed">
                            {collectionDescription}
                        </p>
                    )}

                    {/* Product Count - Optional */}
                    {collection.products && collection.products.length > 0 && (
                        <p className="text-xs md:text-sm text-gray-500 font-light">
                            {collection.products.length}{' '}
                            {collection.products.length === 1 
                                ? t('collections.product_singular') 
                                : t('collections.product_plural')}
                        </p>
                    )}
                </div>
            </article>
        </Link>
    );
}

