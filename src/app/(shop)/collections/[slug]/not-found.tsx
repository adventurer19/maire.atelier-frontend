// src/app/(shop)/collections/[slug]/not-found.tsx

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Collection Not Found</h1>
                <p className="text-gray-600 mb-8">
                    The collection you're looking for doesn't exist or has been removed.
                </p>
                <Link
                    href="/collections"
                    className="inline-block px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                    View All Collections
                </Link>
            </div>
        </div>
    );
}

