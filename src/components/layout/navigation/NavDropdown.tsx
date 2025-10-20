// src/components/layout/navigation/NavDropdown.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/types/navigation';

interface NavDropdownProps {
    item: NavItem;
}

export default function NavDropdown({ item }: NavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger */}
            <Link
                href={item.href}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
                {item.name}
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </Link>

            {/* Dropdown Menu */}
            {isOpen && item.dropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <ul className="py-2">
                        {item.dropdown.map((dropdownItem) => (
                            <li key={dropdownItem.href}>
                                <Link
                                    href={dropdownItem.href}
                                    className={`block px-4 py-2 text-sm transition-colors ${
                                        pathname === dropdownItem.href
                                            ? 'bg-gray-100 text-gray-900 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    {dropdownItem.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}