// src/components/layout/footer/Footer.tsx
import Link from 'next/link';
import React from 'react';

const footerLinks = {
    quickLinks: [
        { name: 'За нас', href: '/about' },
        { name: 'Продукти', href: '/products' },
        { name: 'Колекции', href: '/collections' },
        { name: 'Контакти', href: '/contact' },
    ],
    customerService: [
        { name: 'Доставка', href: '/shipping' },
        { name: 'Връщания', href: '/returns' },
        { name: 'Размери', href: '/size-guide' },
        { name: 'Въпроси', href: '/faq' },
    ],
} as const;

export default function Footer() {
    return (
        <footer className="border-t bg-gray-50">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">MAIRE ATELIER</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Модерна мода с внимание към детайла. Открийте нашата колекция от уникални дрехи.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Бързи Връзки</h3>
                        <ul className="space-y-2">
                            {footerLinks.quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Обслужване</h3>
                        <ul className="space-y-2">
                            {footerLinks.customerService.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social & Newsletter */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Последвайте ни</h3>
                        <div className="flex gap-4 mb-6">
                            <SocialLink href="#" label="Facebook" icon={<FacebookIcon />} />
                            <SocialLink href="#" label="Instagram" icon={<InstagramIcon />} />
                        </div>
                        <NewsletterForm />
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
                    © {new Date().getFullYear()} MAIRE ATELIER. Всички права запазени.
                </div>
            </div>
        </footer>
    );
}

function SocialLink({
                        href,
                        label,
                        icon,
                    }: {
    href: string;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <a
            href={href}
            aria-label={label}
            className="text-gray-600 hover:text-gray-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
        </a>
    );
}

function FacebookIcon() {
    return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92C2.17 15.465 2.158 15.086 2.158 11.88c0-3.204.013-3.583.07-4.849C2.377 2.804 3.892 1.26 7.147 1.112 8.413 1.054 8.792 1.042 12 1.042zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.667.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.667.014 15.259 0 12 0z" />
        </svg>
    );
}

function NewsletterForm() {
    return (
        <div>
            <p className="text-sm text-gray-600 mb-2">Абонирайте се за новини</p>
            <form className="flex gap-2">
                <input
                    type="email"
                    placeholder="Email адрес"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    →
                </button>
            </form>
        </div>
    );
}
