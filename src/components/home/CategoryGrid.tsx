// src/components/home/CategoryGrid.tsx
import Link from 'next/link';
import Image from 'next/image';

const categories = [
    {
        name: 'Рокли',
        href: '/products?category=dresses',
        image: '/categories/dresses.jpg',
    },
    {
        name: 'Блузи',
        href: '/products?category=tops',
        image: '/categories/tops.jpg',
    },
    {
        name: 'Панталони',
        href: '/products?category=pants',
        image: '/categories/pants.jpg',
    },
    {
        name: 'Аксесоари',
        href: '/products?category=accessories',
        image: '/categories/accessories.jpg',
    },
];

export default function CategoryGrid() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {categories.map((category) => (
                <Link
                    key={category.name}
                    href={category.href}
                    className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

                    {/* Background Image */}
                    <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Category Name - Responsive Typography */}
                    <div className="relative z-20 h-full flex items-end p-3 sm:p-4 md:p-6">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-white">
                            {category.name}
                        </h3>
                    </div>
                </Link>
            ))}
        </div>
    );
}