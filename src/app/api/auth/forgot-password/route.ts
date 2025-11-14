import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api/config';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const res = await fetch(`${getApiBaseUrl()}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': req.headers.get('accept-language') || 'bg',
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    
    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
}

