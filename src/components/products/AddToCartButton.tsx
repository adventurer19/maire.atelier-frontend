// src/components/products/AddToCartButton.tsx
'use client';

import { useState } from 'react';

interface AddToCartButtonProps {
    productId: number;
    variantId?: number;
    quantity: number;
    disabled?: boolean;
}

export default function AddToCartButton({
                                            productId,
                                            variantId,
                                            quantity,
                                            disabled
                                        }: AddToCartButtonProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);

        // TODO: Implement add to cart API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Add to cart:', { productId, variantId, quantity });
        setIsAdding(false);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={disabled || isAdding}
            className="w-full px-6 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {isAdding ? 'Добавяне...' : disabled ? 'Няма в наличност' : 'Добави в количката'}
        </button>
    );
}