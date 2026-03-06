import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.CAL_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: 'Cal.com API key not configured' },
            { status: 500 }
        );
    }

    try {
        const res = await fetch('https://api.cal.com/v1/bookings?apiKey=' + apiKey, {
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch bookings from Cal.com' },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { error: 'Failed to connect to Cal.com' },
            { status: 500 }
        );
    }
}
