import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api/config';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const guestToken = req.headers.get('x-cart-token') || '';

    const res = await fetch(`${getApiBaseUrl()}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Cart-Token': guestToken,
            // forward locale if provided by client
            'Accept-Language': req.headers.get('accept-language') || 'bg',
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    const token = data.token as string;

    const response = NextResponse.json({ user: data.user, token }, { status: 200 });
    response.cookies.set('auth_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
}

