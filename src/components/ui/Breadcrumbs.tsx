'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    if (!items || items.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
            <ol className="flex flex-wrap items-center gap-2 text-gray-600">
                <li>
                    <Link
                        href="/"
                        className="hover:text-gray-900 font-medium transition-colors"
                    >
                        Начало
                    </Link>
                </li>

                {items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        <ChevronRight size={14} className="text-gray-400" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-gray-900 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-900 font-medium">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}