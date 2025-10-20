// src/components/home/Newsletter.tsx
'use client';

import { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // TODO: Implement newsletter API call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1000);
    };

    return (
        <section className="py-16 bg-gray-900 text-white">
            <div className="container">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-serif font-bold mb-4">
                        Абонирайте се за нашия бюлетин
                    </h2>
                    <p className="text-gray-300 mb-8">
                        Получавайте новини за нови продукти, ексклузивни оферти и модни съвети
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Вашият email адрес"
                            required
                            className="flex-1 px-6 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="px-8 py-4 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {status === 'loading' ? 'Изпращане...' : 'Абонирай се'}
                        </button>
                    </form>

                    {status === 'success' && (
                        <p className="mt-4 text-green-400">
                            ✓ Успешно се абонирахте!
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}