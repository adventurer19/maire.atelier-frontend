// src/app/(shop)/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google';
import Header from '@/components/layout/header/Header';
import Navigation from '@/components/layout/navigation/Navigation';
import Footer from '@/components/layout/footer/Footer';
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import '../globals.css';

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
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className={`flex flex-col min-h-screen antialiased ${inter.variable} ${playfair.variable}`}
        >
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

            {/* Back to Top Button */}
            <ScrollToTopButton />
        </div>
    );
}
