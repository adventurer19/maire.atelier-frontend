import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api/config';

export async function POST() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (token) {
        await fetch(`${getApiBaseUrl()}/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set('auth_token', '', { httpOnly: true, maxAge: 0, path: '/' });

    return res;
}
