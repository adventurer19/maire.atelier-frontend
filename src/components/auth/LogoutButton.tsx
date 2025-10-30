"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/"); // или "/login"
        router.refresh(); // презарежда server components с изчистен cookie
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm px-3 py-2 rounded hover:bg-gray-100 transition"
        >
            Logout
        </button>
    );
}
