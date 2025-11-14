import HomeClient from './HomeClient';

export const metadata = {
    title: 'MAIRE ATELIER - Modern Fashion',
    description: 'Открийте нашата колекция от уникални модни дрехи',
};

/**
 * Fetch featured products from API
 * Note: Using fetch for server-side rendering (SSR) as apiClient requires browser APIs
 */
async function getFeaturedProducts() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const url = `${apiUrl}/products/featured?limit=8`;
        
        // Use longer cache time for featured products (5 minutes) to reduce API calls
        const res = await fetch(url, {
            next: { revalidate: 300 }, // Cache for 5 minutes
            // Add headers to help with caching and identify SSR requests
            headers: {
                'Accept': 'application/json',
                'X-SSR-Request': 'true', // Identify this as SSR request for rate limiting
            },
        });

        // Handle rate limiting (429) with retry
        if (res.status === 429) {
            // Wait a bit and retry once
            await new Promise(resolve => setTimeout(resolve, 1000));
            const retryRes = await fetch(url, {
                next: { revalidate: 300 },
                headers: {
                    'Accept': 'application/json',
                    'X-SSR-Request': 'true',
                },
            });
            
            if (!retryRes.ok) {
                // If retry also fails, return empty array
                return [];
            }
            
            const retryData = await retryRes.json();
            return retryData?.data ?? [];
        }

        if (!res.ok) {
            // Only log non-429 errors in development
            if (process.env.NODE_ENV === 'development') {
                console.error(`Failed to fetch featured products: ${res.status}`);
            }
            return [];
        }

        const data = await res.json();
        // Backend returns: { data: [...], meta: {...} }
        const products = data?.data ?? [];
        
        if (!Array.isArray(products)) {
            return [];
        }
        
        return products;
    } catch (error: any) {
        // Only log errors in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching featured products:', error?.message);
        }
        return [];
    }
}

/**
 * Fetch featured categories from API
 * Note: Using fetch for server-side rendering (SSR) as apiClient requires browser APIs
 */
async function getFeaturedCategories() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const url = `${apiUrl}/categories`;
        
        // Use longer cache time for categories (10 minutes) as they change infrequently
        const res = await fetch(url, {
            next: { revalidate: 600 }, // Cache for 10 minutes
            headers: {
                'Accept': 'application/json',
                'X-SSR-Request': 'true', // Identify this as SSR request for rate limiting
            },
        });

        // Handle rate limiting (429) with retry
        if (res.status === 429) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const retryRes = await fetch(url, {
                next: { revalidate: 600 },
                headers: {
                    'Accept': 'application/json',
                    'X-SSR-Request': 'true',
                },
            });
            
            if (!retryRes.ok) {
                return [];
            }
            
            const retryData = await retryRes.json();
            const categories = Array.isArray(retryData) ? retryData : retryData.data ?? [];
            return categories.filter((cat: any) => cat.is_featured === true);
        }

        if (!res.ok) {
            if (process.env.NODE_ENV === 'development') {
                console.error(`Failed to fetch categories: ${res.status}`);
            }
            return [];
        }

        const data = await res.json();
        // API може да връща или масив, или { data: [...] }
        const categories = Array.isArray(data) ? data : data.data ?? [];

        // ✅ Филтрирай само featured
        return categories.filter((cat: any) => cat.is_featured === true);
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching categories:', error);
        }
        return [];
    }
}

/**
 * Fetch latest collection with products
 */
async function getLatestCollection() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const url = `${apiUrl}/collections/latest`;
        
        // Use longer cache time for collections (5 minutes)
        const res = await fetch(url, {
            next: { revalidate: 300 }, // Cache for 5 minutes
            headers: {
                'Accept': 'application/json',
                'X-SSR-Request': 'true', // Identify this as SSR request for rate limiting
            },
        });

        // Handle rate limiting (429) with retry
        if (res.status === 429) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const retryRes = await fetch(url, {
                next: { revalidate: 300 },
                headers: {
                    'Accept': 'application/json',
                    'X-SSR-Request': 'true',
                },
            });
            
            if (!retryRes.ok) {
                return null;
            }
            
            const retryData = await retryRes.json();
            return retryData.data ?? retryData ?? null;
        }

        if (!res.ok) {
            if (process.env.NODE_ENV === 'development') {
                console.error(`Failed to fetch latest collection: ${res.status}`);
            }
            return null;
        }

        const data = await res.json();
        // API може да връща или обект, или { data: {...} }
        return data.data ?? data ?? null;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching latest collection:', error);
        }
        return null;
    }
}

export default async function HomePage() {
    // Fetch data in parallel
    const [featuredProducts, featuredCategories, latestCollection] = await Promise.all([
        getFeaturedProducts(),
        getFeaturedCategories(),
        getLatestCollection(),
    ]);

    return (
        <HomeClient
            featuredProducts={featuredProducts}
            featuredCategories={featuredCategories}
            latestCollection={latestCollection}
        />
    );
}