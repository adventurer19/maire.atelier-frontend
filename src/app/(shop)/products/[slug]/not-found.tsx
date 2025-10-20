// src/app/(shop)/products/[slug]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-serif font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-medium text-gray-900 mb-4">
                    Продуктът не е намерен
                </h2>
                <p className="text-gray-600 mb-8">
                    Търсеният от вас продукт не съществува или е бил премахнат.
                </p>
                <Link
                    href="/products"
                    className="inline-block px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Към всички продукти
                </Link>
            </div>
        </div>
    );
}