import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getApiBaseUrl } from '@/lib/api/config';

export async function GET() {
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const res = await fetch(`${getApiBaseUrl()}/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return NextResponse.json({ user: data.user ?? data.data ?? null });
}
