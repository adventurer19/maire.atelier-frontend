'use client';

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
    
    const categoryName =
        typeof category.name === 'string'
            ? category.name
            : category.name?.bg || category.name?.en || 'Category';

    const categoryDescription =
        typeof category.description === 'string'
            ? category.description
            : category.description?.bg || category.description?.en || null;

    const categoryImage = category.image || `/categories/${category.slug}.jpg`;
    const childrenCount = category.children?.length || 0;

    return (
        <Link
            href={`/products?category=${category.slug}`}
            className={`group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
                featured ? 'aspect-[4/3]' : 'aspect-square'
            }`}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20">
                <Image
                    src={categoryImage}
                    alt={categoryName}
                    fill
                    sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                            'https://placehold.co/800x800/e5e5e5/666666?text=Category';
                    }}
                />
            </div>

            <div className="relative h-full flex flex-col justify-end p-6">
                <h3
                    className={`font-serif font-bold text-white mb-2 ${
                        featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                    }`}
                >
                    {categoryName}
                </h3>

                {featured && categoryDescription && (
                    <p className="text-gray-200 text-sm mb-3 line-clamp-2">
                        {categoryDescription}
                    </p>
                )}

                {childrenCount > 0 && (
                    <div className="text-sm text-gray-300 mb-3">
                        {childrenCount}{' '}
                        {childrenCount === 1 
                            ? t('categories.subcategory_singular') 
                            : t('categories.subcategory_plural')}
                    </div>
                )}

                <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                    <span className="text-sm font-medium">{t('categories.explore')}</span>
                    <svg
                        className="w-4 h-4"
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

            {featured && (
                <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                    {t('categories.recommended')}
                </div>
            )}
        </Link>
    );
}
