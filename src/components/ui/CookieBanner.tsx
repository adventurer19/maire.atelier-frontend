// src/components/ui/CookieBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { X, Settings } from 'lucide-react';

export default function CookieBanner() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [cookiePreferences, setCookiePreferences] = useState({
        necessary: true, // Always true, cannot be disabled
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        // Check if user has already accepted cookies
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            // Show banner after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        const preferences = {
            necessary: true,
            analytics: true,
            marketing: true,
        };
        localStorage.setItem('cookie_consent', JSON.stringify(preferences));
        localStorage.setItem('cookie_consent_date', new Date().toISOString());
        setIsVisible(false);
    };

    const handleAcceptSelected = () => {
        localStorage.setItem('cookie_consent', JSON.stringify(cookiePreferences));
        localStorage.setItem('cookie_consent_date', new Date().toISOString());
        setIsVisible(false);
        setShowSettings(false);
    };

    const handleRejectAll = () => {
        const preferences = {
            necessary: true,
            analytics: false,
            marketing: false,
        };
        localStorage.setItem('cookie_consent', JSON.stringify(preferences));
        localStorage.setItem('cookie_consent_date', new Date().toISOString());
        setIsVisible(false);
    };

    const handlePreferenceChange = (key: 'analytics' | 'marketing') => {
        setCookiePreferences((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] transition-opacity"
                onClick={() => setIsVisible(false)}
                aria-hidden="true"
            />

            {/* Cookie Banner */}
            <div className="fixed bottom-0 left-0 right-0 md:left-1/2 md:right-auto md:-translate-x-1/2 md:max-w-[700px] md:bottom-6 md:mx-4 z-[101] animate-in slide-in-from-bottom-4">
                <div className="bg-white rounded-t-lg md:rounded-xl shadow-2xl border-t border-l border-r border-gray-200 md:border p-4 md:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 md:mb-5">
                        <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-serif font-bold text-gray-900 mb-1 md:mb-2">
                                {t('cookies.title')}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                                {t('cookies.description')}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-3 flex-shrink-0 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                            aria-label={t('cookies.close')}
                        >
                            <X className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Cookie Settings (when expanded) */}
                    {showSettings && (
                        <div className="mb-4 md:mb-5 space-y-3 md:space-y-4 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in slide-in-from-top-2">
                            {/* Necessary Cookies - Always enabled */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1 mr-3">
                                    <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                                        {t('cookies.necessary_title')}
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        {t('cookies.necessary_desc')}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-6 bg-gray-300 rounded-full cursor-not-allowed opacity-50">
                                        <div className="w-5 h-5 bg-gray-400 rounded-full mt-0.5 ml-0.5" />
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1 mr-3">
                                    <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                                        {t('cookies.analytics_title')}
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        {t('cookies.analytics_desc')}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => handlePreferenceChange('analytics')}
                                        className={`relative w-10 h-6 rounded-full transition-colors touch-manipulation ${
                                            cookiePreferences.analytics
                                                ? 'bg-gray-900'
                                                : 'bg-gray-300'
                                        }`}
                                        aria-label={t('cookies.toggle_analytics')}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                                                cookiePreferences.analytics
                                                    ? 'translate-x-4'
                                                    : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1 mr-3">
                                    <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                                        {t('cookies.marketing_title')}
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-600">
                                        {t('cookies.marketing_desc')}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => handlePreferenceChange('marketing')}
                                        className={`relative w-10 h-6 rounded-full transition-colors touch-manipulation ${
                                            cookiePreferences.marketing
                                                ? 'bg-gray-900'
                                                : 'bg-gray-300'
                                        }`}
                                        aria-label={t('cookies.toggle_marketing')}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                                                cookiePreferences.marketing
                                                    ? 'translate-x-4'
                                                    : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                        {!showSettings ? (
                            <>
                                {/* Reject All */}
                                <button
                                    onClick={handleRejectAll}
                                    className="flex-1 px-4 py-2.5 md:py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px] md:min-h-[auto] touch-manipulation"
                                >
                                    {t('cookies.reject_all')}
                                </button>

                                {/* Settings */}
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="flex-1 px-4 py-2.5 md:py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px] md:min-h-[auto] touch-manipulation flex items-center justify-center gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    {t('cookies.settings')}
                                </button>

                                {/* Accept All */}
                                <button
                                    onClick={handleAcceptAll}
                                    className="flex-1 px-4 py-2.5 md:py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors min-h-[44px] md:min-h-[auto] touch-manipulation"
                                >
                                    {t('cookies.accept_all')}
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Save Preferences */}
                                <button
                                    onClick={handleAcceptSelected}
                                    className="flex-1 px-4 py-2.5 md:py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 active:bg-gray-700 transition-colors min-h-[44px] md:min-h-[auto] touch-manipulation"
                                >
                                    {t('cookies.save_preferences')}
                                </button>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="flex-1 px-4 py-2.5 md:py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px] md:min-h-[auto] touch-manipulation"
                                >
                                    {t('cookies.cancel')}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Privacy Policy Link */}
                    <div className="mt-3 md:mt-4 text-center">
                        <Link
                            href="/cookies"
                            className="text-xs md:text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
                        >
                            {t('cookies.learn_more')}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
