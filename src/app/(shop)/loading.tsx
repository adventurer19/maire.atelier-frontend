// src/app/(shop)/loading.tsx
export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent mb-4" />
                <p className="text-gray-600">Зареждане...</p>
            </div>
        </div>
    );
}
