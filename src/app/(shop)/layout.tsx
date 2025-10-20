// src/app/(shop)/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google';
import Header from '@/components/layout/header/Header';
import Navigation from '@/components/layout/navigation/Navigation';
import Footer from '@/components/layout/footer/Footer';
import '../globals.css';

// Font configurations
const inter = Inter({
    subsets: ['latin', 'cyrillic'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin', 'cyrillic'],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata = {
    title: {
        default: 'MAIRE ATELIER - Modern Fashion',
        template: '%s | MAIRE ATELIER',
    },
    description: 'Модерна мода с фокус върху качеството и елегантността',
    keywords: ['мода', 'дрехи', 'рокли', 'аксесоари', 'fashion', 'онлайн магазин'],
    authors: [{ name: 'MAIRE ATELIER' }],
    creator: 'MAIRE ATELIER',

    // Mobile optimizations
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 5,
        userScalable: true,
    },

    // Theme color for mobile browsers
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#111827' },
    ],

    // Mobile web app capable
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'MAIRE ATELIER',
    },

    // Format detection
    formatDetection: {
        telephone: true,
        date: true,
        address: true,
        email: true,
    },

    // Open Graph for social sharing
    openGraph: {
        type: 'website',
        locale: 'bg_BG',
        url: 'https://maire-atelier.com',
        siteName: 'MAIRE ATELIER',
        title: 'MAIRE ATELIER - Modern Fashion',
        description: 'Модерна мода с фокус върху качеството и елегантността',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'MAIRE ATELIER',
            },
        ],
    },

    // Twitter card
    twitter: {
        card: 'summary_large_image',
        title: 'MAIRE ATELIER - Modern Fashion',
        description: 'Модерна мода с фокус върху качеството и елегантността',
        images: ['/og-image.jpg'],
    },

    // Manifest for PWA
    manifest: '/manifest.json',

    // Icons
    icons: {
        icon: [
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
};

export default function ShopLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="bg" className={`${inter.variable} ${playfair.variable}`}>
        <head>
            {/* Additional mobile meta tags */}
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        </head>
        <body className="flex flex-col min-h-screen antialiased">
        {/* Skip to main content for accessibility */}
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gray-900 focus:text-white focus:rounded-md"
        >
            Skip to main content
        </a>

        {/* Header */}
        <Header />

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main id="main-content" className="flex-1">
            {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Back to Top Button - Mobile */}
        <BackToTopButton />
        </body>
        </html>
    );
}

// Back to Top Button Component
function BackToTopButton() {
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"
            aria-label="Back to top"
            id="back-to-top"
        >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    );
}