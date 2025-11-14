'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryGridProps {
    categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
    const { t, lang } = useLanguage();
    const getCategoryName = (category: Category): string => {
        if (typeof category.name === 'string') return category.name;
        return category.name?.[lang] || category.name.bg || category.name.en || 'Category';
    };

    const getCategoryDescription = (category: Category): string | null => {
        if (typeof category.description === 'string') return category.description;
        return category.description?.[lang] || category.description?.bg || category.description?.en || null;
    };

    const getCategoryImage = (category: Category): string => {
        return category.image || '/placeholder-category.svg';
    };

    if (!categories || categories.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">{t('categories.empty')}</p>
            </div>
        );
    }

    // Limit to 3 categories for Loro Piana style layout
    const displayCategories = categories.slice(0, 3);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {displayCategories.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    name={getCategoryName(category)}
                    description={getCategoryDescription(category)}
                    image={getCategoryImage(category)}
                />
            ))}
        </div>
    );
}

interface CategoryCardProps {
    category: Category;
    name: string;
    description: string | null;
    image: string;
}

function CategoryCard({ category, name, description, image }: CategoryCardProps) {
    const { t } = useLanguage();

    return (
        <Link
            href={`/products?category=${category.slug}`}
            className="group relative aspect-[3/4] overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300"
        >
            {/* Image */}
            <div className="relative w-full h-full">
            <Image
                src={image}
                alt={name}
                fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-category.svg';
                }}
            />
            </div>

            {/* Content Overlay - Loro Piana Style */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 bg-gradient-to-b from-black/0 via-black/0 to-black/20 group-hover:to-black/30 transition-all duration-300">
                {/* Top: Subtitle */}
                <div className="text-white/90 text-xs md:text-sm font-light tracking-wider uppercase">
                    {t('home.categories_season')}
                </div>

                {/* Bottom: Title and Link */}
                <div className="flex flex-col gap-4">
                    {/* Title */}
                    <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-light tracking-tight leading-tight">
                    {name}
                </h3>

                    {/* Description (optional) */}
                    {description && (
                        <p className="text-white/80 text-sm md:text-base font-light line-clamp-2 hidden md:block">
                            {description}
                        </p>
                    )}

                    {/* Link Text - Loro Piana Style */}
                    <div className="flex items-center gap-2 text-white text-sm md:text-base font-light group-hover:gap-3 transition-all duration-300">
                        <span className="border-b border-white/40 group-hover:border-white/80 transition-colors">
                            {t('categories.discover_more')}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}