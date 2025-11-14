'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import MobileMenu from './MobileMenu';
import NavDropdown from './NavDropdown';
import type { NavItem } from '@/types/navigation';
import { categoriesApi } from '@/lib/api/categories';
import { useLanguage } from '@/context/LanguageContext';
import type { Category } from '@/types';

export default function Navigation() {
    const { t, lang } = useLanguage();
    const [rawCategories, setRawCategories] = useState<Category[]>([]);

    // 🧠 Зареждаме категориите от бекенда само веднъж при mount
    useEffect(() => {
        let isMounted = true;
        
        async function loadCategories() {
            try {
                const cats = await categoriesApi.getMenuCategories();
                if (!isMounted) return;
                
                // Store raw categories with multilingual names
                setRawCategories(cats);
            } catch (error) {
                if (isMounted) {
                console.error('❌ Error loading menu categories:', error);
                }
            }
        }

        loadCategories();
        
        return () => {
            isMounted = false;
        };
    }, []); // Load only once on mount - no dependencies
    
    // Format categories with current lang (without API calls)
    // This updates display names when lang changes, but doesn't re-fetch from API
    const categories = useMemo(() => {
        if (rawCategories.length === 0) return [];
        
        return rawCategories.map((cat) => ({
            name:
                typeof cat.name === 'string'
                    ? cat.name
                    : cat.name?.[lang] || cat.name?.bg || cat.name?.en || 'Category',
            href: `/products?category=${cat.slug}`,
        }));
    }, [rawCategories, lang]); // Only recalculate when rawCategories or lang changes

    // 🧩 Навигационни елементи с преводи
    const navItems: NavItem[] = [
        { name: t('navigation.home'), href: '/' },
        {
            name: t('navigation.products'),
            href: '/products',
            dropdown: [
                { name: t('navigation.all_products'), href: '/products' },
                { name: t('navigation.new_arrivals'), href: '/products?sort=new' },
                { name: t('navigation.on_sale'), href: '/products?sale=true' },
                { name: t('navigation.featured'), href: '/products?featured=true' },
            ],
        },
        {
            name: t('navigation.categories'),
            href: '/categories',
            dropdown: categories.length > 0 ? categories : undefined,
        },
        { name: t('navigation.collections'), href: '/collections' },
        { name: t('navigation.about'), href: '/about' },
        { name: t('navigation.contact'), href: '/contact' },
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