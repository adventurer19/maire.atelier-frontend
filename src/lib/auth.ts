import { cookies } from "next/headers";

export async function getCurrentUser() {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) return null;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? data.data ?? null;
}
