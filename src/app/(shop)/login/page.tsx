"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getOrCreateCartToken } from "@/lib/cartToken";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Cart-Token": getOrCreateCartToken(),
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || t('auth.invalid_credentials'));
                setIsLoading(false);
                return;
            }

            // Store token for axios Authorization header
            if (data?.token) {
                localStorage.setItem('auth_token', data.token);
                // Dispatch event за да се обновят другите компоненти (header)
                window.dispatchEvent(new Event('auth-state-change'));
            }

            // Redirect after successful login
            router.push("/");
            router.refresh(); // Refresh за да се обнови header-ът
        } catch (err) {
            setError(t('auth.login_error'));
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-center text-gray-900">
                        {t('auth.login_title')}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        <span>{t('auth.login_subtitle').split(' ')[0]} </span>
                        <Link
                            href="/register"
                            className="font-medium text-gray-900 hover:text-gray-700"
                        >
                            {t('auth.login_subtitle').split(' ').slice(1).join(' ')}
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
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder={t('auth.email_placeholder')}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                {t('auth.password')}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder={t('auth.password_placeholder')}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? t('auth.login_loading') : t('auth.login_button')}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            {t('auth.forgot_password')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
