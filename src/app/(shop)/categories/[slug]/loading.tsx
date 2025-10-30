// src/app/(shop)/categories/[slug]/loading.tsx
export default function Loading() {
    return (
        <div className="container py-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
