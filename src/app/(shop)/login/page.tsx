"use client";

import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.message || "Invalid credentials");
            return;
        }

        // след успешен login — redirect
        window.location.href = "/";
    };

    return (
        <div className="max-w-md mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
