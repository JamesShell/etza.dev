import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { MessageInsert } from '@/types/database';

/**
 * Stores an enquiry. Requires a `messages` table in Supabase with an
 * insert-only policy for the anon role — see supabase/messages.sql.
 *
 * Validation is repeated here rather than trusted from the client: the browser
 * check is a courtesy to the person typing, this one is the actual rule.
 */

const KINDS = ['project', 'role', 'other'];
const LIMITS = { name: 120, email: 200, company: 160, location: 120, budget: 60, message: 4000 };

function clean(value: unknown, max: number) {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
    let payload: Record<string, unknown>;

    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: 'Send valid JSON.' }, { status: 400 });
    }

    // A hidden field no person can see. Anything filled in here is a bot, and
    // it's told the message went through so it doesn't retry. Named `website`
    // rather than `company` — `company` is a real field on this form now.
    if (clean(payload.website, 200)) {
        return NextResponse.json({ ok: true });
    }

    const email = clean(payload.email, LIMITS.email);
    // The pricing estimate asks for an email and nothing else — the name
    // arrives with the booking. Until then the address stands in for it.
    const name =
        clean(payload.name, LIMITS.name) ||
        (clean(payload.source, 20) === 'estimate' ? email.split('@')[0] : '');
    const message = clean(payload.message, LIMITS.message);
    const company = clean(payload.company, LIMITS.company);
    const location = clean(payload.location, LIMITS.location);
    const budget = clean(payload.budget, LIMITS.budget);
    const kind = KINDS.includes(clean(payload.kind, 20)) ? clean(payload.kind, 20) : 'other';

    const errors: Record<string, string> = {};
    if (!name) errors.name = 'Add your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Add an email I can reply to.';
    if (message.length < 10) errors.message = 'Tell me a little more — a sentence or two is plenty.';

    if (Object.keys(errors).length > 0) {
        return NextResponse.json({ errors }, { status: 422 });
    }

    const record: MessageInsert = {
        name,
        email,
        kind,
        message,
        company: company || null,
        location: location || null,
        budget: budget || null,
    };

    const { error } = await supabase.from('messages').insert(record);

    if (error) {
        console.error('contact insert failed', error);
        return NextResponse.json(
            { error: 'That didn’t send. Email me directly and it’ll reach me.' },
            { status: 500 }
        );
    }

    return NextResponse.json({ ok: true });
}
