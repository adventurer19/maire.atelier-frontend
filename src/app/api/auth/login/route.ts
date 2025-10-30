import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    const token = data.token as string;

    const response = NextResponse.json({ user: data.user }, { status: 200 });
    response.cookies.set('auth_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 дни
    });

    return response;
}
