// src/components/home/CategoryGrid.tsx
import Link from 'next/link';

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
                <Link
                    key={category.name}
                    href={category.href}
                    className="group relative aspect-square rounded-lg overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div
                        className="absolute inset-0 bg-gray-200 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundImage: `url(${category.image})` }}
                    />
                    <div className="relative z-20 h-full flex items-end p-6">
                        <h3 className="text-2xl font-serif font-bold text-white">
                            {category.name}
                        </h3>
                    </div>
                </Link>
            ))}
        </div>
    );
}