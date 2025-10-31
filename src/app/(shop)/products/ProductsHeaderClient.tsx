'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function ProductsHeaderClient({ totalProducts }: { totalProducts: number }) {
    const { t } = useLanguage();
    const label = totalProducts === 1 ? t('productsPage.product_singular') : t('productsPage.product_plural');
    return (
        <div className="bg-white border-b">
            <div className="container px-4 md:px-6 py-6 md:py-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-2 leading-tight">
                    {t('productsPage.title')}
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                    {t('productsPage.subtitle_count', { count: String(totalProducts), label })}
                </p>
            </div>
        </div>
    );
}


