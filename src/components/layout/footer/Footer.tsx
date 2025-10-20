// src/components/layout/footer/Footer.tsx
'use client';

import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { useState } from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-12 sm:pt-16 pb-8">
            <div className="container px-4 sm:px-6">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-12">
                    {/* Brand Column */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="mb-4">
                            <Logo variant="light" />
                        </div>
                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                            Модерна мода с фокус върху качеството и елегантността. Открийте вашия перфектен стил.
                        </p>
                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                                aria-label="Facebook"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                                aria-label="Instagram"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links - Collapsible on mobile */}
                    <FooterColumn title="Навигация">
                        <FooterLink href="/products">Продукти</FooterLink>
                        <FooterLink href="/collections">Колекции</FooterLink>
                        <FooterLink href="/about">За нас</FooterLink>
                        <FooterLink href="/contact">Контакти</FooterLink>
                        <FooterLink href="/blog">Блог</FooterLink>
                    </FooterColumn>

                    {/* Customer Service */}
                    <FooterColumn title="Помощ">
                        <FooterLink href="/shipping">Доставка</FooterLink>
                        <FooterLink href="/returns">Връщане</FooterLink>
                        <FooterLink href="/size-guide">Размери</FooterLink>
                        <FooterLink href="/faq">Въпроси</FooterLink>
                        <FooterLink href="/terms">Условия</FooterLink>
                    </FooterColumn>

                    {/* Contact Info */}
                    <FooterColumn title="Контакти">
                        <div className="space-y-3 text-sm">
                            <a href="mailto:info@maire-atelier.com" className="flex items-start gap-2 hover:text-white transition-colors">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@maire-atelier.com</span>
                            </a>
                            <a href="tel:+359888123456" className="flex items-start gap-2 hover:text-white transition-colors">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+359 888 123 456</span>
                            </a>
                            <div className="flex items-start gap-2">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>София, България</span>
                            </div>
                        </div>
                    </FooterColumn>
                </div>

                {/* Payment Methods - Mobile Optimized */}
                <div className="border-t border-gray-800 pt-6 sm:pt-8 mb-6 sm:mb-8">
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 text-center sm:text-left">
                        Приемаме следните методи за плащане:
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
                        <div className="h-8 sm:h-10 px-3 sm:px-4 bg-white rounded flex items-center">
                            <span className="text-xs sm:text-sm font-semibold text-gray-900">VISA</span>
                        </div>
                        <div className="h-8 sm:h-10 px-3 sm:px-4 bg-white rounded flex items-center">
                            <span className="text-xs sm:text-sm font-semibold text-gray-900">Mastercard</span>
                        </div>
                        <div className="h-8 sm:h-10 px-3 sm:px-4 bg-white rounded flex items-center">
                            <span className="text-xs sm:text-sm font-semibold text-gray-900">PayPal</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-6 sm:pt-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500">
                        <p className="text-center sm:text-left">
                            © {new Date().getFullYear()} MAIRE ATELIER. Всички права запазени.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                Поверителност
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                Условия
                            </Link>
                            <Link href="/cookies" className="hover:text-white transition-colors">
                                Бисквитки
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Footer Column Component with Mobile Collapse
function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="sm:block">
            {/* Mobile: Collapsible Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="sm:hidden flex items-center justify-between w-full py-2 mb-2"
            >
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Desktop: Always Visible Header */}
            <h3 className="hidden sm:block text-base font-semibold text-white mb-4">
                {title}
            </h3>

            {/* Content - Collapsible on mobile */}
            <nav className={`space-y-2 ${isOpen ? 'block' : 'hidden'} sm:block`}>
                {children}
            </nav>
        </div>
    );
}

// Footer Link Component
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="block text-sm text-gray-400 hover:text-white transition-colors py-1"
        >
            {children}
        </Link>
    );
}