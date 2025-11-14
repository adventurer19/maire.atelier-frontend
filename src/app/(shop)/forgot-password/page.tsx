"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordPage() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || t('auth.forgot_password_error'));
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            setIsLoading(false);
        } catch (err) {
            setError(t('auth.forgot_password_error'));
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header - Elegant Typography */}
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
                        {t('auth.forgot_password_title')}
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
                        {t('auth.forgot_password_subtitle')}
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-white border-2 border-gray-300 px-6 py-4 text-gray-900 font-light">
                        <p className="mb-2">{t('auth.forgot_password_success')}</p>
                        <p className="text-sm text-gray-600">{t('auth.forgot_password_check_email')}</p>
                    </div>
                )}

                {/* Form - Sharp Design */}
                {!success && (
                    <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                        {/* Error Message - Sharp Design */}
                        {error && (
                            <div className="bg-white border-2 border-gray-300 px-4 py-3 text-gray-900 text-sm font-light">
                                {error}
                            </div>
                        )}

                        {/* Email Input - Sharp Design */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-light text-gray-900 mb-2">
                                {t('auth.email')}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-3 border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-300 font-light"
                                placeholder={t('auth.email_placeholder')}
                            />
                        </div>

                        {/* Submit Button - Sharp Design */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-4 px-6 border-2 border-gray-900 bg-gray-900 text-white font-light hover:bg-gray-800 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-h-[52px]"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('auth.forgot_password_loading')}
                                    </span>
                                ) : (
                                    t('auth.forgot_password_button')
                                )}
                            </button>
                        </div>

                        {/* Back to Login Link */}
                        <div className="text-center">
                            <Link
                                href="/login"
                                className="text-sm text-gray-600 hover:text-gray-900 font-light underline underline-offset-4 transition-colors"
                            >
                                {t('auth.back_to_login')}
                            </Link>
                        </div>
                    </form>
                )}

                {/* Back to Login Link (shown after success) */}
                {success && (
                    <div className="text-center">
                        <Link
                            href="/login"
                            className="inline-block px-6 py-3 border-2 border-gray-900 text-gray-900 font-light hover:bg-gray-50 active:bg-gray-100 transition-all duration-300"
                        >
                            {t('auth.back_to_login')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

