// src/components/layout/footer/Footer.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { useLanguage } from '@/context/LanguageContext';
import { newsletterApi } from '@/lib/api/newsletter';

export default function Footer() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    return (
        <footer className="bg-[#0E0E11] text-[#EAEAEA] pt-12 pb-10 border-t border-b border-white border-opacity-10">
            <div className="container px-6 max-w-7xl mx-auto">
                {/* Newsletter Section */}
                <div className="max-w-4xl mx-auto mb-8 md:mb-10 lg:mb-12 text-center px-4 pt-8 md:pt-10 lg:pt-12 pb-8 md:pb-10 lg:pb-12 border-t border-b border-white border-opacity-10">
                    <h2 className="text-xl md:text-2xl font-light mb-3 md:mb-4 tracking-tight">{t('footer.newsletter_title', { default: '' }) || 'Join our newsletter'}</h2>
                    <p className="text-sm md:text-base text-[#999] mb-4 md:mb-6 max-w-lg mx-auto font-light">{t('footer.newsletter_subtitle', { default: '' }) || 'Subscribe to receive the latest updates, offers, and style inspiration.'}</p>
                    <form 
                        className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 max-w-md mx-auto" 
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!email.trim() || isSubmitting) return;

                            // Client-side validation
                            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                            if (!emailRegex.test(email.trim())) {
                                setMessage({ 
                                    type: 'error', 
                                    text: t('newsletter.invalid_email') || 'Please enter a valid email address.' 
                                });
                                return;
                            }

                            if (email.trim().length > 255) {
                                setMessage({ 
                                    type: 'error', 
                                    text: 'Email address is too long.' 
                                });
                                return;
                            }

                            setIsSubmitting(true);
                            setMessage(null);

                            try {
                                const response = await newsletterApi.subscribe(email.trim());
                                setMessage({ type: 'success', text: response.message });
                                setEmail(''); // Clear input on success
                            } catch (error: any) {
                                setMessage({ 
                                    type: 'error', 
                                    text: error.message || t('newsletter.subscription_failed') || 'Failed to subscribe. Please try again.' 
                                });
                            } finally {
                                setIsSubmitting(false);
                            }
                        }}
                    >
                        {/* Honeypot field - hidden from users, visible to bots */}
                        <input
                            type="text"
                            name="honeypot"
                            tabIndex={-1}
                            autoComplete="off"
                            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                            aria-hidden="true"
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                // Sanitize input - remove dangerous characters
                                const sanitized = e.target.value.replace(/[\r\n%0a%0d%00<>]/g, '');
                                if (sanitized.length <= 255) {
                                    setEmail(sanitized);
                                }
                            }}
                            placeholder={t('footer.email_placeholder', { default: '' }) || 'Enter your email'}
                            aria-label="Email address"
                            required
                            disabled={isSubmitting}
                            maxLength={255}
                            autoComplete="email"
                            className="w-full px-4 py-3 md:py-3 bg-[#1A1A1A] text-[#EAEAEA] placeholder-[#999] border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#EAEAEA] text-sm md:text-base min-h-[48px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !email.trim()}
                            className="px-6 py-3 md:py-3 bg-[#EAEAEA] text-[#0E0E11] font-light hover:bg-[#d4d4d4] active:bg-[#c4c4c4] transition-all duration-300 text-sm md:text-base min-h-[48px] whitespace-nowrap touch-manipulation border-2 border-[#EAEAEA] disabled:pointer-events-none disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (t('newsletter.subscribing') || 'Subscribing...') : (t('footer.subscribe') || 'Subscribe')}
                        </button>
                    </form>
                    {message && (
                        <div className={`mt-4 text-sm font-light text-center ${
                            message.type === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}>
                            {message.text}
                        </div>
                    )}
                </div>

                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 md:gap-y-10 gap-x-6 md:gap-x-8 lg:gap-x-12 px-4 sm:px-6">
                    {/* Brand & Social */}
                    <div>
                        <Logo variant="light" className="mb-6" />
                        <p className="text-[#999] leading-relaxed mb-6 text-sm">
                            {t('footer.brand_text')}
                        </p>
                        <div className="flex space-x-5">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="text-[#999] hover:underline hover:text-[#EAEAEA] transition"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="text-[#999] hover:underline hover:text-[#EAEAEA] transition"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-base md:text-lg font-light mb-4 md:mb-6 tracking-tight">{t('footer.navigation') || 'Navigation'}</h3>
                        <nav className="flex flex-col space-y-2 md:space-y-3 text-sm text-[#999]">
                            <FooterLink href="/products">{t('navigation.products')}</FooterLink>
                            <FooterLink href="/collections">{t('navigation.collections')}</FooterLink>
                            <FooterLink href="/about">{t('navigation.about')}</FooterLink>
                            <FooterLink href="/contact">{t('navigation.contact')}</FooterLink>
                            <FooterLink href="/blog">{t('footer.blog') || 'Blog'}</FooterLink>
                        </nav>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-base md:text-lg font-light mb-4 md:mb-6 tracking-tight">{t('footer.help') || 'Help'}</h3>
                        <nav className="flex flex-col space-y-2 md:space-y-3 text-sm text-[#999]">
                            <FooterLink href="/shipping">{t('footer.shipping') || 'Shipping'}</FooterLink>
                            <FooterLink href="/returns">{t('footer.returns') || 'Returns'}</FooterLink>
                            <FooterLink href="/size-guide">{t('footer.size_guide') || 'Size Guide'}</FooterLink>
                            <FooterLink href="/faq">{t('footer.faq') || 'FAQ'}</FooterLink>
                            <FooterLink href="/terms">{t('footer.terms') || 'Terms'}</FooterLink>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-base md:text-lg font-light mb-4 md:mb-6 tracking-tight">{t('navigation.contact')}</h3>
                        <address className="not-italic space-y-3 md:space-y-4 text-sm text-[#999]">
                            <a href="mailto:info@maire-atelier.com" className="flex items-center gap-3 hover:underline hover:text-[#EAEAEA] transition">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@maire-atelier.com</span>
                            </a>
                            <a href="tel:+359888123456" className="flex items-center gap-3 hover:underline hover:text-[#EAEAEA] transition">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+359 888 123 456</span>
                            </a>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{t('footer.address') || 'Sofia, Bulgaria'}</span>
                            </div>
                        </address>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 md:mt-10 lg:mt-12 border-t border-white border-opacity-10 pt-4 md:pt-6">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 text-xs text-[#999] tracking-wide px-4">
                        <p>© {new Date().getFullYear()} MAIRE ATELIER. {t('footer.rights') || 'All rights reserved.'}</p>
                        <nav className="flex space-x-6">
                            <Link href="/privacy" className="hover:underline hover:text-[#EAEAEA] transition">
                                {t('footer.privacy') || 'Privacy'}
                            </Link>
                            <Link href="/terms" className="hover:underline hover:text-[#EAEAEA] transition">
                                {t('footer.terms') || 'Terms'}
                            </Link>
                            <Link href="/cookies" className="hover:underline hover:text-[#EAEAEA] transition">
                                {t('footer.cookies') || 'Cookies'}
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="hover:underline py-1 transition-colors"
        >
            {children}
        </Link>
    );
}