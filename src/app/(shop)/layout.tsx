// src/app/(shop)/layout.tsx
import Header from '@/components/layout/header/Header';
import Navigation from '@/components/layout/navigation/Navigation';
import Footer from '@/components/layout/footer/Footer';

export default function ShopLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}