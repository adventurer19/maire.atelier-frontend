// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: {
        default: 'MAIRE ATELIER - Modern Fashion',
        template: '%s | MAIRE ATELIER',
    },
    description: 'Открийте нашата колекция от уникални модни дрехи',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="bg">
        <body className="font-sans antialiased">
        {children}
        </body>
        </html>
    );
}