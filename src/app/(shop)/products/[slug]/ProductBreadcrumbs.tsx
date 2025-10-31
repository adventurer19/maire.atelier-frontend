// src/app/(shop)/products/[slug]/ProductBreadcrumbs.tsx
'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface ProductBreadcrumbsProps {
    productName: string;
}

export default function ProductBreadcrumbs({ productName }: ProductBreadcrumbsProps) {
    const { t } = useLanguage();

    return (
        <div className="border-b bg-white sticky top-16 z-10 md:static">
            <div className="container px-4 py-2 md:py-4">
                <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-600 overflow-x-auto">
                    <Link href="/" className="hover:text-gray-900 whitespace-nowrap">
                        {t('navigation.home')}
                    </Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-gray-900 whitespace-nowrap">
                        {t('navigation.products')}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 truncate max-w-[150px] md:max-w-none">
                        {productName}
                    </span>
                </nav>
            </div>
        </div>
    );
}
