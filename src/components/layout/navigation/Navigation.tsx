// src/components/layout/navigation/Navigation.tsx
import Link from 'next/link';
import MobileMenu from './MobileMenu';
import NavDropdown from './NavDropdown';
import type { NavItem } from '@/types/navigation';

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
        ]
    },
    {
        name: 'Категории',
        href: '/categories',
        dropdown: [
            { name: 'Рокли', href: '/products?category=dresses' },
            { name: 'Блузи', href: '/products?category=tops' },
            { name: 'Панталони', href: '/products?category=pants' },
            { name: 'Пола', href: '/products?category=skirts' },
            { name: 'Якета', href: '/products?category=jackets' },
            { name: 'Аксесоари', href: '/products?category=accessories' },
        ]
    },
    { name: 'Колекции', href: '/collections' },
    { name: 'За нас', href: '/about' },
    { name: 'Контакти', href: '/contact' },
];

export default function Navigation() {
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