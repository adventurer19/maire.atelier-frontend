"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AccountSettingsPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    useEffect(() => {
        fetch('/api/auth/me', { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                    const userName = typeof data.user.name === 'string' ? data.user.name : data.user.name?.bg || data.user.name?.en || '';
                    setName(userName);
                    setEmail(data.user.email);
                    setIsLoadingUser(false);
                } else {
                    router.push('/login');
                }
            })
            .catch(() => {
                router.push('/login');
            });
    }, [router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(null);
        setPasswordError(null);
        setPasswordSuccess(null);
        setIsLoadingProfile(true);

        try {
            const res = await fetch("/api/auth/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ name, email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setProfileError(data.message || data.error || t('account.update_error'));
                setIsLoadingProfile(false);
                return;
            }

            setProfileSuccess(t('account.profile_updated'));
            setIsLoadingProfile(false);
            // Refresh user data
            const userRes = await fetch('/api/auth/me', { credentials: 'include' });
            const userData = await userRes.json();
            if (userData.user) {
                setUser(userData.user);
                window.dispatchEvent(new Event('auth-state-change'));
            }
        } catch (err) {
            setProfileError(t('account.update_error'));
            setIsLoadingProfile(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError(null);
        setProfileSuccess(null);
        setPasswordError(null);
        setPasswordSuccess(null);

        if (newPassword !== confirmPassword) {
            setPasswordError(t('auth.password_mismatch'));
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError(t('auth.password_min'));
            return;
        }

        setIsLoadingPassword(true);

        try {
            const res = await fetch("/api/auth/update-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    current_password: currentPassword,
                    password: newPassword,
                    password_confirmation: confirmPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setPasswordError(data.message || data.error || t('account.password_update_error'));
                setIsLoadingPassword(false);
                return;
            }

            setPasswordSuccess(t('account.password_updated'));
            setIsLoadingPassword(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordError(t('account.password_update_error'));
            setIsLoadingPassword(false);
        }
    };

    if (isLoadingUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-[#FCFCFB] to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600 font-light">{t('account.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#FCFCFB] to-gray-50">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl py-8 md:py-12 lg:py-16">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <Link
                        href="/account"
                        className="inline-flex items-center gap-2 text-sm md:text-base text-gray-600 hover:text-gray-900 font-light mb-6 underline underline-offset-4 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        {t('account.back_to_account')}
                    </Link>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
                        {t('account.edit_settings')}
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 font-light">
                        {t('account.edit_settings_subtitle')}
                    </p>
                </div>

                {/* Profile Information Form */}
                <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8 lg:p-10 mb-8 md:mb-12">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                        {t('account.profile_information')}
                    </h2>

                    {/* Profile Error Message */}
                    {profileError && (
                        <div className="mb-6 bg-white border border-red-200 bg-red-50 px-4 py-3 text-red-900 text-sm font-light">
                            {profileError}
                        </div>
                    )}

                    {/* Profile Success Message */}
                    {profileSuccess && (
                        <div className="mb-6 bg-white border border-green-200 bg-green-50 px-4 py-3 text-green-900 text-sm font-light">
                            {profileSuccess}
                        </div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-light text-gray-900 mb-2">
                                {t('auth.name')}
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 font-light"
                                placeholder={t('auth.name_placeholder')}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-light text-gray-900 mb-2">
                                {t('auth.email')}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 font-light"
                                placeholder={t('auth.email_placeholder')}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoadingProfile}
                                className="w-full md:w-auto px-6 py-4 border-2 border-gray-900 bg-gray-900 text-white font-light hover:bg-gray-800 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-h-[52px]"
                            >
                                {isLoadingProfile ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <LoadingSpinner className="h-5 w-5" />
                                        {t('account.updating')}
                                    </span>
                                ) : (
                                    t('account.update_profile')
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password Form */}
                <div className="bg-white border border-gray-200 shadow-sm p-6 md:p-8 lg:p-10">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
                        {t('account.change_password')}
                    </h2>

                    {/* Password Error Message */}
                    {passwordError && (
                        <div className="mb-6 bg-white border border-red-200 bg-red-50 px-4 py-3 text-red-900 text-sm font-light">
                            {passwordError}
                        </div>
                    )}

                    {/* Password Success Message */}
                    {passwordSuccess && (
                        <div className="mb-6 bg-white border border-green-200 bg-green-50 px-4 py-3 text-green-900 text-sm font-light">
                            {passwordSuccess}
                        </div>
                    )}

                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-light text-gray-900 mb-2">
                                {t('account.current_password')}
                            </label>
                            <input
                                id="current_password"
                                name="current_password"
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 font-light"
                                placeholder={t('account.current_password_placeholder')}
                            />
                        </div>

                        <div>
                            <label htmlFor="new_password" className="block text-sm font-light text-gray-900 mb-2">
                                {t('account.new_password')}
                            </label>
                            <input
                                id="new_password"
                                name="new_password"
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                minLength={8}
                                className="block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 font-light"
                                placeholder={t('auth.password_min_placeholder')}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirm_password" className="block text-sm font-light text-gray-900 mb-2">
                                {t('auth.password_confirm')}
                            </label>
                            <input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={8}
                                className="block w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 font-light"
                                placeholder={t('auth.password_confirm_placeholder')}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoadingPassword}
                                className="w-full md:w-auto px-6 py-4 border-2 border-gray-900 bg-gray-900 text-white font-light hover:bg-gray-800 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 min-h-[52px]"
                            >
                                {isLoadingPassword ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <LoadingSpinner className="h-5 w-5" />
                                        {t('account.updating')}
                                    </span>
                                ) : (
                                    t('account.update_password')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function LoadingSpinner({ className }: { className?: string }) {
    return (
        <svg
            className={`animate-spin ${className || 'h-8 w-8'} mx-auto text-gray-900`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

