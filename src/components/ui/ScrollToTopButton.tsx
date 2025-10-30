// src/components/ui/ScrollToTopButton.tsx
"use client";

export default function ScrollToTopButton() {
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded"
        >
            ↑
        </button>
    );
}
