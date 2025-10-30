// src/app/(shop)/categories/[slug]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="container py-16 text-center">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Категорията не е намерена
            </h1>
            <p className="text-gray-600 mb-8">
                Може би е изтрита или все още няма продукти.
            </p>
            <Link
                href="/products"
                className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md text-sm hover:bg-gray-700 transition-colors"
            >
                Върни се към продуктите
            </Link>
        </div>
    );
}
