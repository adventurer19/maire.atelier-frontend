"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOrCreateCartToken } from "@/lib/cartToken";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setValidationErrors({});
        setIsLoading(true);

        // Client-side validation
        if (password !== passwordConfirmation) {
            setError(t('auth.password_mismatch'));
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError(t('auth.password_min'));
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Cart-Token": getOrCreateCartToken(),
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password,
                    password_confirmation: passwordConfirmation 
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Handle validation errors from backend
                if (data.errors) {
                    setValidationErrors(data.errors);
                    setError(data.message || t('auth.check_data'));
                } else {
                    setError(data.message || t('auth.registration_error'));
                }
                setIsLoading(false);
                return;
            }

            // Store token for axios Authorization header
            if (data?.token) {
                localStorage.setItem('auth_token', data.token);
                // Dispatch event за да се обновят другите компоненти (header)
                window.dispatchEvent(new Event('auth-state-change'));
            }

            // Redirect after successful registration
            router.push("/");
            router.refresh(); // Refresh за да се обнови header-ът
        } catch (err) {
            setError(t('auth.registration_error'));
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-center text-gray-900">
                        {t('auth.register_title')}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        <span>{t('auth.register_subtitle').split(' ')[0]} </span>
                        <Link
                            href="/login"
                            className="font-medium text-gray-900 hover:text-gray-700"
                        >
                            {t('auth.register_subtitle').split(' ').slice(1).join(' ')}
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                {t('auth.name')}
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder={t('auth.name_placeholder')}
                            />
                            {validationErrors.name && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.name[0]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder={t('auth.email_placeholder')}
                            />
                            {validationErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.email[0]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                                minLength={8}
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                                    validationErrors.password ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder={t('auth.password_min_placeholder')}
                            />
                            {validationErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.password[0]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                {t('auth.password_confirm')}
                            </label>
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                                    validationErrors.password_confirmation ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder={t('auth.password_confirm_placeholder')}
                            />
                            {validationErrors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">{validationErrors.password_confirmation[0]}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? t('auth.register_loading') : t('auth.register_button')}
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        {lang === 'bg' ? (
                            <>
                                При регистрация приемате нашите{' '}
                                <Link href="/terms" className="text-gray-900 hover:underline">
                                    {t('auth.terms')}
                                </Link>
                                {' '}и{' '}
                                <Link href="/privacy" className="text-gray-900 hover:underline">
                                    {t('auth.privacy')}
                                </Link>
                            </>
                        ) : (
                            <>
                                By registering you accept our{' '}
                                <Link href="/terms" className="text-gray-900 hover:underline">
                                    {t('auth.terms')}
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-gray-900 hover:underline">
                                    {t('auth.privacy')}
                                </Link>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

