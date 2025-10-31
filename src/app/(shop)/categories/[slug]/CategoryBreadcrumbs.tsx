// src/app/(shop)/categories/[slug]/CategoryBreadcrumbs.tsx
'use client';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useLanguage } from '@/context/LanguageContext';

interface CategoryBreadcrumbsProps {
    categoryName: string;
}

export default function CategoryBreadcrumbs({ categoryName }: CategoryBreadcrumbsProps) {
    const { t } = useLanguage();

    return (
        <Breadcrumbs
            items={[
                { label: t('navigation.categories'), href: '/categories' },
                { label: categoryName },
            ]}
        />
    );
}
