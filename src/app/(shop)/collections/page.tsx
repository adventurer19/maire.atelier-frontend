// src/app/(shop)/collections/page.tsx

import CollectionsClient from './CollectionsClient';

export const metadata = {
    title: 'Collections | MAIRE ATELIER',
    description: 'Browse our fashion collections',
};

/**
 * Fetch all collections from API
 */
async function getCollections() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const res = await fetch(`${apiUrl}/collections?per_page=50`, {
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch collections: ${res.status}`);
        }

        const data = await res.json();
        
        // Handle paginated or direct array response
        if (data.data && Array.isArray(data.data)) {
            return {
                collections: data.data,
                meta: data.meta,
            };
        }

        return {
            collections: [],
            meta: undefined,
        };
    } catch (error) {
        console.error('❌ Error fetching collections:', error);
        return {
            collections: [],
            meta: undefined,
        };
    }
}

export default async function CollectionsPage() {
    const { collections } = await getCollections();

    return <CollectionsClient collections={collections} />;
}

