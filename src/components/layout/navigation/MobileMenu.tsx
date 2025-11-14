// src/components/layout/navigation/MobileMenu.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NavItem } from '@/types/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface MobileMenuProps {
    items: NavItem[];
}

export default function MobileMenu({ items }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const { t } = useLanguage();

    return (
        <>
            {/* Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-700 hover:text-gray-900"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <nav className="fixed top-[80px] left-0 right-0 bg-white border-b shadow-lg z-50 max-h-[calc(100vh-80px)] overflow-y-auto">
                        <ul className="container py-4">
                            {items.map((item) => (
                                <li key={item.href} className="mb-1">
                                    {item.dropdown ? (
                                        <>
                                            {/* Item with Dropdown */}
                                            <button
                                                onClick={() => setExpandedItem(expandedItem === item.name ? null : item.name)}
                                                className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                            >
                                                {item.name}
                                                <svg
                                                    className={`w-5 h-5 transition-transform ${expandedItem === item.name ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Dropdown Items */}
                                            {expandedItem === item.name && (
                                                <ul className="mt-1 ml-4 space-y-1">
                                                    {item.dropdown.map((subItem) => (
                                                        <li key={subItem.href}>
                                                            <Link
                                                                href={subItem.href}
                                                                onClick={() => setIsOpen(false)}
                                                                className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                            
                            {/* Wishlist Link - Mobile Only */}
                            <li className="mb-1 border-t border-gray-200 mt-2 pt-2">
                                <Link
                                    href="/wishlist"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span>{t('wishlist.title') || 'Wishlist'}</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </>
    );
}