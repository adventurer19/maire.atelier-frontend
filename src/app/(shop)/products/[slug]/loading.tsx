// src/app/(shop)/products/[slug]/loading.tsx
export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Gallery Skeleton */}
                    <div className="animate-pulse space-y-4">
                        <div className="aspect-[4/5] bg-gray-200 rounded-lg" />
                        <div className="grid grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                            ))}
                        </div>
                    </div>

                    {/* Info Skeleton */}
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 bg-gray-200 rounded w-3/4" />
                        <div className="h-8 bg-gray-200 rounded w-1/2" />
                        <div className="h-24 bg-gray-200 rounded" />
                        <div className="h-12 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}