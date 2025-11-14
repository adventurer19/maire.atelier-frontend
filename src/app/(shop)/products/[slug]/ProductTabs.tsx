// src/app/(shop)/products/[slug]/ProductTabs.tsx
'use client';

import { useLanguage } from '@/context/LanguageContext';
import type { Product } from '@/types';

/**
 * Product details section with additional info - Elegant Design
 * Client component to support dynamic language switching
 */
export default function ProductTabs({ product }: { product: Product }) {
    const { lang, t } = useLanguage();

    // Helper to get localized value
    const getLocalized = (val: any) => {
        if (typeof val === 'string') return val;
        return val?.[lang] || val?.bg || val?.en || '';
    };

    const description = getLocalized(product.description);
    const material = getLocalized(product.material);
    const careInstructions = getLocalized(product.care_instructions);

    return (
        <div className="border-t border-gray-300">
            {/* Description */}
            {description && (
                <div className="py-8 md:py-10 lg:py-12">
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                        {t('product.description_title')}
                    </h2>
                    <div className="prose prose-gray max-w-none prose-sm md:prose-base">
                        <p className="text-gray-600 leading-relaxed text-base md:text-lg font-light">
                            {description}
                        </p>
                    </div>
                </div>
            )}

            {/* Material */}
            {material && (
                <div className="py-8 md:py-10 lg:py-12 border-t border-gray-300">
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                        {t('product.material')}
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed">{material}</p>
                </div>
            )}

            {/* Care Instructions */}
            {careInstructions && (
                <div className="py-8 md:py-10 lg:py-12 border-t border-gray-300">
                    <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                        {t('product.care')}
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed">{careInstructions}</p>
                </div>
            )}

            {/* Shipping info */}
            <div className="py-8 md:py-10 lg:py-12 border-t border-gray-300">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                    {t('product.shipping_info')}
                </h2>
                <ul className="space-y-3 text-gray-600 text-base md:text-lg font-light leading-relaxed">
                    <li className="flex items-start gap-3">
                        <span className="mt-1">•</span>
                        <span>{t('product.shipping_free')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-1">•</span>
                        <span>{t('product.shipping_days')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-1">•</span>
                        <span>{t('product.shipping_return')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-1">•</span>
                        <span>{t('product.shipping_gift')}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

