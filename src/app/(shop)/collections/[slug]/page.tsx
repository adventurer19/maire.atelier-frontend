// src/app/(shop)/collections/[slug]/page.tsx

import CollectionDetailClient from './CollectionDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const res = await fetch(`${apiUrl}/collections/${slug}`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            return {
                title: 'Collection | MAIRE ATELIER',
            };
        }

        const data = await res.json();
        const collection = data.data;

        return {
            title: collection.meta_title || collection.name || 'Collection | MAIRE ATELIER',
            description: collection.meta_description || collection.description || undefined,
        };
    } catch {
        return {
            title: 'Collection | MAIRE ATELIER',
        };
    }
}

/**
 * Fetch collection by slug from API
 */
async function getCollection(slug: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const res = await fetch(`${apiUrl}/collections/${slug}`, {
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            if (res.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch collection: ${res.status}`);
        }

        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error('❌ Error fetching collection:', error);
        return null;
    }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const collection = await getCollection(slug);

    if (!collection) {
        notFound();
    }

    return <CollectionDetailClient collection={collection} />;
}

