// src/app/(shop)/collections/[slug]/loading.tsx

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative h-[50vh] min-h-[400px] bg-gray-200 animate-pulse" />
            <div className="container py-12">
                <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

