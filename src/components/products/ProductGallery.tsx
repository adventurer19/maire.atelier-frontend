// src/components/products/ProductGallery.tsx
'use client';

import { useState } from 'react';

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/5] bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Няма налични изображения</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
                <img
                    src={images[selectedImage]}
                    alt={`${productName} - ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                                selectedImage === index
                                    ? 'border-gray-900'
                                    : 'border-gray-200 hover:border-gray-400'
                            }`}
                        >
                            <img
                                src={image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}