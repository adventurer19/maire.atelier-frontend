"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

function ResetPasswordForm() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        const emailParam = searchParams.get("email");
        
        if (tokenParam) {
            setToken(tokenParam);
        }
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (password !== passwordConfirm) {
            setError(t('auth.password_mismatch'));
            return;
        }

        if (password.length < 8) {
            setError(t('auth.password_min'));
            return;
        }

        if (!token) {
            setError(t('auth.reset_token_required'));
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirm,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || t('auth.reset_password_error'));
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            setIsLoading(false);
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err) {
            setError(t('auth.reset_password_error'));
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header - Elegant Typography */}
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
                        {t('auth.reset_password_title')}
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
                        {t('auth.reset_password_subtitle')}
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-white border-2 border-gray-300 px-6 py-4 text-gray-900 font-light">
                        <p className="mb-2">{t('auth.reset_password_success')}</p>
                        <p className="text-sm text-gray-600">{t('auth.reset_password_redirecting')}</p>
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

                        <div className="space-y-6">
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

                            {/* Password Input - Sharp Design */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-light text-gray-900 mb-2">
                                    {t('auth.password')}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-4 py-3 border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-300 font-light"
                                    placeholder={t('auth.password_placeholder')}
                                />
                            </div>

                            {/* Password Confirm Input - Sharp Design */}
                            <div>
                                <label htmlFor="password_confirm" className="block text-sm font-light text-gray-900 mb-2">
                                    {t('auth.password_confirm')}
                                </label>
                                <input
                                    id="password_confirm"
                                    name="password_confirm"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    className="block w-full px-4 py-3 border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-300 font-light"
                                    placeholder={t('auth.password_confirm_placeholder')}
                                />
                            </div>
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
                                        {t('auth.reset_password_loading')}
                                    </span>
                                ) : (
                                    t('auth.reset_password_button')
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
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-600 font-light">Loading...</div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}

