'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types';

interface CategoryGridProps {
    categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
    const getCategoryName = (category: Category): string => {
        if (typeof category.name === 'string') return category.name;
        return category.name.bg || category.name.en || 'Category';
    };

    const getCategoryImage = (category: Category): string => {
        return category.image || `/categories/${category.slug}.jpg`;
    };

    if (!categories || categories.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Няма налични категории</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {categories.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    name={getCategoryName(category)}
                    image={getCategoryImage(category)}
                />
            ))}
        </div>
    );
}

interface CategoryCardProps {
    category: Category;
    name: string;
    image: string;
}

function CategoryCard({ category, name, image }: CategoryCardProps) {
    return (
        <Link
            href={`/products?category=${category.slug}`}
            className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

            {/* Image with fallback */}
            <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-category.jpg';
                }}
            />

            {/* Category Name */}
            <div className="relative z-20 h-full flex items-end p-3 sm:p-4 md:p-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-white">
                    {name}
                </h3>
            </div>
        </Link>
    );
}
