'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { CategoryCard } from './CategoryCard';
import { useLanguage } from '@/context/LanguageContext';
import type { Category } from '@/types';

interface CategoryCarouselProps {
    categories: Category[];
    featured?: boolean;
    title?: string;
}

export default function CategoryCarousel({
    categories,
    featured = false,
    title,
}: CategoryCarouselProps) {
    const { t } = useLanguage();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    // Check if we can scroll
    const checkScrollability = useCallback(() => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const threshold = 5; // Small threshold for floating point issues

        const canScroll = scrollWidth > clientWidth + threshold;
        setHasOverflow(canScroll);
        
        if (canScroll) {
            setCanScrollLeft(scrollLeft > threshold);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - threshold);
        } else {
            setCanScrollLeft(false);
            setCanScrollRight(false);
        }
    }, []);

    // Check scrollability on mount, resize, and when categories change
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) {
            // Try again after a short delay if container is not ready
            const timeout = setTimeout(() => {
                checkScrollability();
            }, 100);
            return () => clearTimeout(timeout);
        }

        // Initial check after DOM is ready
        const initialCheckTimeout = setTimeout(() => {
            checkScrollability();
        }, 100);

        const handleScroll = () => {
            checkScrollability();
        };

        let resizeTimeout: NodeJS.Timeout;
        const handleResize = () => {
            // Debounce resize events
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                checkScrollability();
            }, 150);
        };

        // Use ResizeObserver for more accurate overflow detection
        const resizeObserver = new ResizeObserver(() => {
            // Debounce ResizeObserver callbacks
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                checkScrollability();
            }, 150);
        });

        resizeObserver.observe(container);
        container.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            clearTimeout(initialCheckTimeout);
            clearTimeout(resizeTimeout);
            resizeObserver.disconnect();
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [categories.length, checkScrollability]); // Only depend on categories.length, not the whole array

    // Scroll functions
    const scrollLeft = useCallback(() => {
        if (!scrollContainerRef.current || isScrolling) return;

        setIsScrolling(true);
        const container = scrollContainerRef.current;
        
        // Calculate scroll amount based on visible cards
        const containerWidth = container.clientWidth;
        // Scroll by approximately 1 card width (or visible cards)
        const scrollAmount = containerWidth * 0.8; // Scroll 80% of container width

        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth',
        });

        // Check scrollability after scroll animation
        setTimeout(() => {
            setIsScrolling(false);
            checkScrollability();
        }, 600);
    }, [isScrolling, checkScrollability]);

    const scrollRight = useCallback(() => {
        if (!scrollContainerRef.current || isScrolling) return;

        setIsScrolling(true);
        const container = scrollContainerRef.current;
        
        // Calculate scroll amount based on visible cards
        const containerWidth = container.clientWidth;
        // Scroll by approximately 1 card width (or visible cards)
        const scrollAmount = containerWidth * 0.8; // Scroll 80% of container width

        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
        });

        // Check scrollability after scroll animation
        setTimeout(() => {
            setIsScrolling(false);
            checkScrollability();
        }, 600);
    }, [isScrolling, checkScrollability]);

    if (!categories || categories.length === 0) {
        return null;
    }

    // Calculate card width based on featured flag and screen size
    // Featured: Mobile (100%), Tablet (50%), Desktop (33%)
    // Regular: Mobile (50%), Tablet (50%), Desktop (33%), Large (25%)
    // Using calc() to account for gaps between cards
    const getCardWidth = () => {
        if (featured) {
            // Featured: w-full on mobile, ~50% on tablet, ~33% on desktop
            // Accounting for gaps: gap-3 (0.75rem) on mobile, gap-4 (1rem) on tablet, gap-6 (1.5rem) on desktop
            return 'w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-1rem)]';
        }
        // Regular: w-1/2 on mobile/tablet, w-1/3 on md, w-1/4 on lg
        // Accounting for gaps: gap-3 (0.75rem) on mobile, gap-4 (1rem) on tablet, gap-6 (1.5rem) on desktop
        return 'w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)]';
    };

    // Determine if we should show arrows based on:
    // 1. Actual overflow detection (hasOverflow)
    // 2. Number of categories vs typically visible ones
    // For featured: typically 3 visible on desktop (lg:w-1/3), so show arrows if more than 3
    // For regular: typically 4 visible on desktop (lg:w-1/4), so show arrows if more than 4
    // On smaller screens: show arrows if we detect overflow
    const minVisibleForArrows = featured ? 3 : 4;
    const shouldShowArrows = hasOverflow || categories.length > minVisibleForArrows;

    return (
        <div className="relative">
            {/* Navigation Arrows - Sharp, Clean Design (same as ProductCarousel) */}
            {/* Show arrows on desktop if we have overflow or more categories than typically visible */}
            {shouldShowArrows && (
                <>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scrollLeft();
                        }}
                        disabled={!canScrollLeft || isScrolling}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm text-gray-900 w-10 h-10 items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed z-20 border border-gray-300 -ml-2"
                        aria-label={t('common.previous')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            scrollRight();
                        }}
                        disabled={!canScrollRight || isScrolling}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white backdrop-blur-sm text-gray-900 w-10 h-10 items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed z-20 border border-gray-300 -mr-2"
                        aria-label={t('common.next')}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Categories Carousel Container */}
            <div
                ref={scrollContainerRef}
                className={`flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto scroll-smooth pb-2 ${
                    shouldShowArrows ? 'md:overflow-x-hidden' : ''
                } scrollbar-hide`}
                onScroll={checkScrollability}
            >
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`flex-shrink-0 ${getCardWidth()}`}
                    >
                        <CategoryCard category={category} featured={featured} />
                    </div>
                ))}
            </div>
        </div>
    );
}

