'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function ProductsHeaderClient({ totalProducts }: { totalProducts: number }) {
    const { t } = useLanguage();
    const label = totalProducts === 1 ? t('productsPage.product_singular') : t('productsPage.product_plural');
    return (
        <div className="bg-white border-b">
            <div className="container py-8">
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
                    {t('productsPage.title')}
                </h1>
                <p className="text-gray-600">
                    {t('productsPage.subtitle_count', { count: String(totalProducts), label })}
                </p>
            </div>
        </div>
    );
}


