'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import type { Category } from '@/types';

interface CategoryCardProps {
    category: Category;
    featured?: boolean;
}

export function CategoryCard({ category, featured = false }: CategoryCardProps) {
    const { t, lang } = useLanguage();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    
    const categoryName =
        typeof category.name === 'string'
            ? category.name
            : category.name?.[lang] || category.name?.bg || category.name?.en || 'Category';

    const categoryDescription =
        typeof category.description === 'string'
            ? category.description
            : category.description?.[lang] || category.description?.bg || category.description?.en || null;

    // Get image URL with proper fallback
    const getImageUrl = (): string | null => {
        if (imageError) return null;
        
        // Try category.image first
        if (category.image && !category.image.includes('placeholder')) {
            return category.image;
        }
        
        // Try default category image path
        const defaultImage = `/categories/${category.slug}.jpg`;
        return defaultImage;
    };

    const imageUrl = getImageUrl();
    const hasValidImage = imageUrl && !imageError;

    return (
        <Link
            href={`/products?category=${category.slug}`}
            className="group relative flex flex-col h-full"
        >
            <article className="relative flex flex-col h-full">
                {/* Category Image Container - Same style as ProductCard */}
                <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-4 md:mb-5">
                    {hasValidImage ? (
                        <>
                            {/* Loading Skeleton */}
                            {imageLoading && (
                                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                            )}
                            
                            {/* Category Image */}
                            {imageUrl?.startsWith('http://') || imageUrl?.startsWith('https://') ? (
                                // Use regular img tag for external URLs
                                <img
                                    src={imageUrl}
                                    alt={categoryName}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                                        imageLoading ? 'opacity-0' : 'opacity-100'
                                    } group-hover:scale-[1.02]`}
                                    onLoad={() => setImageLoading(false)}
                                    onError={() => {
                                        setImageError(true);
                                        setImageLoading(false);
                                    }}
                                    loading="lazy"
                                />
                            ) : (
                                // Use Next.js Image for local images
                <Image
                                    src={imageUrl}
                    alt={categoryName}
                    fill
                                    sizes={featured ? '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw' : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'}
                                    className={`object-cover transition-all duration-700 ease-out ${
                                        imageLoading ? 'opacity-0' : 'opacity-100'
                                    } group-hover:scale-[1.02]`}
                                    onLoad={() => setImageLoading(false)}
                                    onError={() => {
                                        setImageError(true);
                                        setImageLoading(false);
                    }}
                                    priority={false}
                                    loading="lazy"
                                />
                            )}

                            {/* Featured Badge - Same style as ProductCard discount badge */}
                            {featured && (
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 text-[11px] md:text-xs font-normal px-3 md:px-3.5 py-1.5 tracking-wider uppercase border border-gray-300">
                                    {t('categories.recommended')}
                    </div>
                )}

                            {/* Hover Overlay - Very Subtle */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/3 transition-colors duration-500 pointer-events-none" />
                        </>
                    ) : (
                        /* Placeholder - Same style as ProductCard */
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <svg
                                className="w-10 h-10 md:w-12 md:h-12 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                        </div>
                    )}
                </div>

                {/* Category Info - Same style as ProductCard */}
                <div className="flex flex-col flex-grow">
                    {/* Category Name - Clean & Minimal */}
                    <h3 className="font-light text-sm md:text-base text-gray-900 mb-3 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2 leading-relaxed tracking-normal">
                        {categoryName}
                    </h3>

                    {/* Category Description - Optional, only if featured */}
                    {featured && categoryDescription && (
                        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 font-light leading-relaxed">
                            {categoryDescription}
                        </p>
                    )}
                </div>
            </article>
        </Link>
    );
}
