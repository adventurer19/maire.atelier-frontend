// src/app/(shop)/contact/page.tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Send to API
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gray-900 text-white py-16">
                <div className="container text-center">
                    <h1 className="text-5xl font-serif font-bold mb-4">
                        {t('contact.hero_title')}
                    </h1>
                    <p className="text-xl mb-2">{t('contact.hero_subtitle')}</p>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        {t('contact.hero_description')}
                    </p>
                </div>
            </section>

            <div className="container py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">{t('contact.send_message')}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">{t('contact.name')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">{t('contact.email')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">{t('contact.subject')}</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">{t('contact.message')}</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                            >
                                {t('contact.submit')}
                            </button>

                            {submitted && (
                                <div className="p-4 bg-green-100 text-green-800 rounded-md text-center">
                                    {t('contact.success')}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        {/* Contact Details */}
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <h3 className="text-xl font-bold mb-6">{t('contact.info_title')}</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <EmailIcon className="w-5 h-5 text-gray-600 mt-1" />
                                    <div>
                                        <div className="font-medium">Email</div>
                                        <a href="mailto:info@maire-atelier.com" className="text-gray-600 hover:text-gray-900">
                                            info@maire-atelier.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <PhoneIcon className="w-5 h-5 text-gray-600 mt-1" />
                                    <div>
                                        <div className="font-medium">{t('contact.phone')}</div>
                                        <a href="tel:+359888123456" className="text-gray-600 hover:text-gray-900">
                                            +359 888 123 456
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <LocationIcon className="w-5 h-5 text-gray-600 mt-1" />
                                    <div>
                                        <div className="font-medium">{t('contact.address')}</div>
                                        <div className="text-gray-600">
                                            ул. Витоша 15<br />
                                            София, 1000<br />
                                            България
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <h3 className="text-xl font-bold mb-6">{t('contact.working_hours')}</h3>
                            <div className="space-y-2 text-gray-600">
                                <div>{t('contact.working_hours_weekdays')}</div>
                                <div>{t('contact.working_hours_saturday')}</div>
                                <div>{t('contact.working_hours_sunday')}</div>
                            </div>
                        </div>

                        {/* Social */}
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <h3 className="text-xl font-bold mb-6">{t('contact.follow_us')}</h3>
                            <div className="flex gap-4">
                                <a
                                    href="https://instagram.com/maire.atelier"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                    aria-label="Instagram"
                                >
                                    I
                                </a>
                                <a
                                    href="https://facebook.com/maire.atelier"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                    aria-label="Facebook"
                                >
                                    F
                                </a>
                                <a
                                    href="https://pinterest.com/maire.atelier"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                    aria-label="Pinterest"
                                >
                                    P
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-8 text-center">{t('contact.faq_title')}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold mb-2">{t('contact.faq_order_question')}</h3>
                            <p className="text-gray-600">{t('contact.faq_order_answer')}</p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">{t('contact.faq_delivery_question')}</h3>
                            <p className="text-gray-600">{t('contact.faq_delivery_answer')}</p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">{t('contact.faq_return_question')}</h3>
                            <p className="text-gray-600">{t('contact.faq_return_answer')}</p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">{t('contact.faq_personalization_question')}</h3>
                            <p className="text-gray-600">{t('contact.faq_personalization_answer')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Icons
function EmailIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}

function PhoneIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    );
}

function LocationIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}