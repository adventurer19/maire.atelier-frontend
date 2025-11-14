// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import CookieBanner from "@/components/ui/CookieBanner";
import LanguageCacheInvalidator from "@/components/LanguageCacheInvalidator";

export const metadata: Metadata = {
    title: {
        default: "MAIRE ATELIER – Modern Fashion",
        template: "%s | MAIRE ATELIER",
    },
    description: "Модерен бранд за мода и стил – MAIRE Atelier.",
    keywords: ["мода", "дрехи", "рокли", "аксесоари", "fashion", "онлайн магазин"],
    metadataBase: new URL("https://maire.atelier"),
    icons: {
        icon: '/icon.svg',
        shortcut: '/icon.svg',
        apple: '/icon.svg',
    },
    openGraph: {
        title: "MAIRE ATELIER",
        description: "Онлайн магазин за модерна мода",
        url: "https://maire.atelier",
        siteName: "MAIRE ATELIER",
        locale: "bg_BG",
        type: "website",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="bg" className="scroll-smooth">
        <body className="bg-white text-gray-900 antialiased">
        <LanguageProvider>
            <QueryProvider>
                <LanguageCacheInvalidator />
                {children}
                <CookieBanner />
            </QueryProvider>
        </LanguageProvider>
        </body>
        </html>
    );
}
