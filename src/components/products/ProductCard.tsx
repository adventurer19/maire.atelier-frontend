'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
    const { t, lang } = useLanguage();
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [loadedImages, setLoadedImages] = useState<string[]>([]);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    
    // Get product name with language support
    const productName =
        typeof product.name === 'string'
            ? product.name
            : product.name?.[lang] || product.name?.bg || product.name?.en || 'Product';

    // Get all valid image URLs
    // IMPORTANT: Use images array as the single source of truth
    // primary_image is just a reference to one of the images in the array, not a separate image
    const allImages = useMemo(() => {
        // Helper to normalize URL for comparison
        const normalizeUrl = (url: string): string => {
            return url.trim().replace(/\/$/, '').split('?')[0].toLowerCase();
        };
        
        // Helper to check if image is valid
        const isValidImage = (img: string | null | undefined): boolean => {
            return !!img && 
                img.trim() !== '' && 
                !img.includes('placeholder') &&
                img !== 'null';
        };

        // Step 1: Collect all unique images from images array (this is the source of truth)
        const imagesMap = new Map<string, string>(); // normalized URL -> original URL
        const imagesList: string[] = [];
        
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            product.images.forEach((img) => {
                if (isValidImage(img) && typeof img === 'string') {
                    const normalized = normalizeUrl(img);
                    if (!imagesMap.has(normalized)) {
                        imagesMap.set(normalized, img);
                        imagesList.push(img);
                    }
                }
            });
        }
        
        // Step 2: If we have images array, use it as the source
        if (imagesList.length > 0) {
            // Find which image in the array matches primary_image (if any)
            let primaryImageIndex = -1;
            if (product.primary_image && isValidImage(product.primary_image)) {
                const normalizedPrimary = normalizeUrl(product.primary_image);
                primaryImageIndex = imagesList.findIndex(img => normalizeUrl(img) === normalizedPrimary);
            }
            
            // Reorder: put primary_image first if it exists in the array
            if (primaryImageIndex >= 0) {
                const reordered = [imagesList[primaryImageIndex], ...imagesList.filter((_, i) => i !== primaryImageIndex)];
                return reordered;
            }
            
            // primary_image not in array, return images as-is
            return imagesList;
        }
        
        // Step 3: No images array - use primary_image or thumbnail as fallback
        const fallbackImages: string[] = [];
        if (isValidImage(product.primary_image)) {
            fallbackImages.push(product.primary_image);
        }
        if (fallbackImages.length === 0 && isValidImage(product.thumbnail)) {
            fallbackImages.push(product.thumbnail);
        }
        
        return fallbackImages;
    }, [product.primary_image, product.images, product.thumbnail]);

    const hasMultipleImages = allImages.length > 1;
    
    // Ensure currentImageIndex is always 0 if there's only one image
    useEffect(() => {
        if (!hasMultipleImages && currentImageIndex !== 0) {
            setCurrentImageIndex(0);
        }
    }, [hasMultipleImages, currentImageIndex]);
    
    // Ensure currentImageIndex doesn't exceed array bounds
    useEffect(() => {
        if (allImages.length > 0 && currentImageIndex >= allImages.length) {
            setCurrentImageIndex(0);
        }
        // Also ensure index is never negative
        if (currentImageIndex < 0) {
            setCurrentImageIndex(0);
        }
    }, [currentImageIndex, allImages.length]);
    
    const currentImageUrl = allImages[currentImageIndex] || allImages[0] || null;
    const hasValidImage = currentImageUrl && !imageError;
    
    // Check if current image is already loaded (if loaded, show immediately; otherwise check loading state)
    const isCurrentImageLoaded = currentImageUrl ? loadedImages.includes(currentImageUrl) : false;
    const isLoading = currentImageUrl 
        ? !isCurrentImageLoaded && imageLoading[currentImageUrl] !== false
        : false;

    // Auto-rotate images every 2 seconds ONLY when hovered (desktop only)
    useEffect(() => {
        if (!hasMultipleImages || !isHovered) return;
        // Only auto-rotate on desktop (not on touch devices)
        if (window.matchMedia('(pointer: fine)').matches) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [hasMultipleImages, isHovered, allImages.length]);

    // Touch handlers for mobile swipe
    const minSwipeDistance = 50;

    const handleTouchStart = (e: React.TouchEvent) => {
        // Only allow swipe if there are multiple images
        if (!hasMultipleImages || allImages.length <= 1) {
            setIsSwiping(false);
            return;
        }
        setIsSwiping(true);
        setTouchEnd(0);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        // Only track movement if we're actually swiping and there are multiple images
        if (!isSwiping || !hasMultipleImages || allImages.length <= 1) return;
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        // Prevent link navigation if we just swiped
        if (isSwiping) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Only process swipe if there are multiple images
        if (!hasMultipleImages || allImages.length <= 1 || !isSwiping) {
            setTouchStart(0);
            setTouchEnd(0);
            setIsSwiping(false);
            return;
        }
        
        if (!touchStart || !touchEnd) {
            setTouchStart(0);
            setTouchEnd(0);
            setIsSwiping(false);
            return;
        }
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && allImages.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        } else if (isRightSwipe && allImages.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        }
        
        // Reset touch state
        setTouchStart(0);
        setTouchEnd(0);
        setIsSwiping(false);
    };

    // Preload next image for smoother transitions
    useEffect(() => {
        if (!hasMultipleImages || !currentImageUrl) return;

        // Preload next image
        const nextIndex = (currentImageIndex + 1) % allImages.length;
        const nextImageUrl = allImages[nextIndex];
        
        if (nextImageUrl && !loadedImages.includes(nextImageUrl)) {
            const img = new window.Image();
            img.src = nextImageUrl;
            img.onload = () => {
                setLoadedImages((prev) => {
                    if (!prev.includes(nextImageUrl)) {
                        return [...prev, nextImageUrl];
            }
                    return prev;
                });
            };
        }
    }, [currentImageIndex, hasMultipleImages, allImages, loadedImages, currentImageUrl]);

    // Navigation functions
    const goToPrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const goToNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const goToImage = (index: number) => {
        if (index !== currentImageIndex) {
            setCurrentImageIndex(index);
        }
    };

    // Price calculation
    const price = Number(product.final_price ?? product.price) || 0;
    const comparePrice = Number(product.compare_at_price ?? product.sale_price) || null;
    const hasDiscount = comparePrice && comparePrice > price;
    const discountPercent = product.discount_percentage || (hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0);

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group relative flex flex-col h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentImageIndex(0); // Reset to first image when leaving
            }}
        >
            <article className="relative flex flex-col h-full">
                {/* Product Image Container - Sharp, Clean Design */}
                <div 
                    className={`relative aspect-[3/4] bg-gray-50 overflow-hidden mb-4 md:mb-5 ${hasMultipleImages ? 'touch-pan-y' : ''}`}
                    onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
                    onTouchMove={hasMultipleImages ? handleTouchMove : undefined}
                    onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
                >
                    {hasValidImage ? (
                        <>
                            {/* Loading Skeleton */}
                            {isLoading && (
                                <div className="absolute inset-0 bg-gray-100 animate-pulse z-0" />
                            )}
                            
                            {/* Product Image */}
                            {currentImageUrl?.startsWith('http://') || currentImageUrl?.startsWith('https://') ? (
                                // Use regular img tag for external URLs to avoid Next.js Image optimization issues
                                <img
                                    key={`${product.id}-${currentImageIndex}`}
                                    src={currentImageUrl}
                                    alt={`${productName} - Image ${currentImageIndex + 1}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out ${
                                        isLoading ? 'opacity-0' : 'opacity-100'
                                    } group-hover:scale-[1.02]`}
                                    onLoad={() => {
                                        if (!loadedImages.includes(currentImageUrl)) {
                                            setLoadedImages((prev) => [...prev, currentImageUrl]);
                                        }
                                        setImageLoading((prev) => ({ ...prev, [currentImageUrl]: false }));
                                    }}
                                    onError={() => {
                                        setImageError(true);
                                        setImageLoading((prev) => ({ ...prev, [currentImageUrl]: false }));
                                    }}
                                    loading="lazy"
                                />
                            ) : (
                                // Use Next.js Image for local images
                                <Image
                                    key={`${product.id}-${currentImageIndex}`}
                                    src={currentImageUrl}
                                    alt={`${productName} - Image ${currentImageIndex + 1}`}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                                    className={`object-cover transition-all duration-500 ease-in-out ${
                                        isLoading ? 'opacity-0' : 'opacity-100'
                                    } group-hover:scale-[1.02]`}
                                    onLoad={() => {
                                        if (!loadedImages.includes(currentImageUrl)) {
                                            setLoadedImages((prev) => [...prev, currentImageUrl]);
                                        }
                                        setImageLoading((prev) => ({ ...prev, [currentImageUrl]: false }));
                                    }}
                                    onError={() => {
                                        setImageError(true);
                                        setImageLoading((prev) => ({ ...prev, [currentImageUrl]: false }));
                                    }}
                                    priority={false}
                                    loading="lazy"
                                />
                            )}

                            {/* Navigation Arrows - Desktop only */}
                            {hasMultipleImages && (
                                <>
                                    <button
                                        onClick={goToPrevious}
                                        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm text-gray-900 w-10 h-10 items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md opacity-0 group-hover:opacity-100 z-20 border border-gray-300"
                                        aria-label={t('common.previous')}
                                        onMouseEnter={(e) => e.stopPropagation()}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm text-gray-900 w-10 h-10 items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md opacity-0 group-hover:opacity-100 z-20 border border-gray-300"
                                        aria-label={t('common.next')}
                                        onMouseEnter={(e) => e.stopPropagation()}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Image Indicators - Always visible on mobile, hover on desktop */}
                            {hasMultipleImages && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                    {allImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                goToImage(index);
                                            }}
                                            className={`transition-all duration-300 touch-manipulation ${
                                                index === currentImageIndex
                                                    ? 'w-8 h-1 bg-gray-900 rounded-full'
                                                    : 'w-1.5 h-1.5 bg-gray-900/40 hover:bg-gray-900/60 rounded-full'
                                            }`}
                                            aria-label={`Go to image ${index + 1}`}
                                            onMouseEnter={(e) => e.stopPropagation()}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Elegant Discount Badge - Sharp Design */}
                            {discountPercent > 0 && (
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 text-[11px] md:text-xs font-normal px-3 md:px-3.5 py-1.5 tracking-wider uppercase border border-gray-300 z-10">
                                    -{discountPercent}%
                                </div>
                            )}

                            {/* Low Stock Badge - Sharp */}
                            {product.is_low_stock && product.is_in_stock && (
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-amber-900 text-[11px] md:text-xs font-normal px-3 md:px-3.5 py-1.5 border border-amber-200 z-10">
                                    {t('product.low_stock', { count: String(product.stock_quantity ?? '') })}
                                </div>
                            )}

                            {/* Out of Stock Overlay - Elegant */}
                            {!product.is_in_stock && (
                                <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] flex items-center justify-center z-10">
                                    <div className="text-center px-4">
                                        <div className="w-12 h-12 border-2 border-gray-300 flex items-center justify-center mx-auto mb-2">
                                            <svg
                                                className="w-6 h-6 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-gray-600 text-xs md:text-sm font-medium uppercase tracking-wide">
                                            {t('product.out_of_stock')}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Hover Overlay - Very Subtle */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/3 transition-colors duration-500 pointer-events-none" />
                        </>
                    ) : (
                        /* Placeholder - Minimal */
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <svg
                                className="w-10 h-10 md:w-12 md:h-12 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Product Info - Elegant Typography */}
                <div className="flex flex-col flex-grow">
                    {/* Product Name - Clean & Minimal */}
                    <h3 className="font-light text-sm md:text-base text-gray-900 mb-3 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2 leading-relaxed tracking-normal">
                        {productName}
                    </h3>

                    {/* Price Section - Elegant & Minimal */}
                    <div className="mt-auto flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-3">
                            {hasDiscount ? (
                            <>
                                    <span className="text-base md:text-lg font-light text-gray-900 tracking-normal">
                                        {price.toFixed(2)} {t('product.currency')}
                                </span>
                                    <span className="text-xs md:text-sm text-gray-400 line-through font-extralight">
                                        {comparePrice?.toFixed(2)} {t('product.currency')}
                                </span>
                            </>
                        ) : (
                                <span className="text-base md:text-lg font-light text-gray-900 tracking-normal">
                                    {price.toFixed(2)} {t('product.currency')}
                                </span>
                            )}
                        </div>
                        
                        {/* Save Amount - Very Subtle */}
                        {hasDiscount && (
                            <span className="text-[11px] text-gray-400 font-extralight tracking-wide">
                                {t('product.save_amount', { amount: ((comparePrice || 0) - price).toFixed(2) })}
                            </span>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}
