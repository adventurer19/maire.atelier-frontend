'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobileMenu from './MobileMenu';
import NavDropdown from './NavDropdown';
import type { NavItem } from '@/types/navigation';
import { categoriesApi } from '@/lib/api/categories';

export default function Navigation() {
    const [categories, setCategories] = useState<NavItem['dropdown']>([]);

    // Зареждаме категориите от бекенда
    useEffect(() => {
        async function loadCategories() {
            try {
                const cats = await categoriesApi.getMenuCategories();
                const formatted = cats.map((cat) => ({
                    name:
                        typeof cat.name === 'string'
                            ? cat.name
                            : cat.name?.bg || cat.name?.en || 'Категория',
                    href: `/products?category=${cat.slug}`,
                }));
                setCategories(formatted);
            } catch (error) {
                console.error('❌ Error loading menu categories:', error);
            }
        }

        loadCategories();
    }, []);

    // Статични нав елементи
    const navItems: NavItem[] = [
        { name: 'Начало', href: '/' },
        {
            name: 'Продукти',
            href: '/products',
            dropdown: [
                { name: 'Всички продукти', href: '/products' },
                { name: 'Нови постъпления', href: '/products?sort=new' },
                { name: 'Намаления', href: '/products?sale=true' },
                { name: 'Бестселъри', href: '/products?featured=true' },
            ],
        },
        {
            name: 'Категории',
            href: '/categories',
            dropdown: categories.length > 0 ? categories : undefined, // динамични категории
        },
        { name: 'Колекции', href: '/collections' },
        { name: 'За нас', href: '/about' },
        { name: 'Контакти', href: '/contact' },
    ];

    return (
        <nav className="border-b bg-white">
            <div className="container">
                <div className="flex items-center justify-between h-14">
                    {/* Desktop Navigation */}
                    <ul className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                {item.dropdown ? (
                                    <NavDropdown item={item} />
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <MobileMenu items={navItems} />
                    </div>
                </div>
            </div>
        </nav>
    );
}
