'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { budgets, capabilities } from '@/content/profile';
import { attribution, clickEvent } from '@/lib/analytics';

type Errors = Record<string, string>;

/** Small upper-case chrome, the same voice as the bar. */
const chrome = 'text-[11px] uppercase leading-[1.45] tracking-[0.06em]';

/** The home cards' caption size: what's typed reads like a card's title. */
const caption = 'font-display text-[19px] font-medium leading-[1.3] tracking-[-0.02em] lg:text-[clamp(17px,1.3vw,22px)]';

const input = `w-full min-w-0 border-0 bg-transparent p-0 ${caption} text-chalk placeholder:text-edge focus:outline-none focus:ring-0`;

const SERVICES = [...capabilities.map((c) => c.title), 'Something else'];

/**
 * One question on a rule, laid out as on the reference: the number in a
 * gutter of its own, the question, and the answer underneath at the same
 * size — set in the home cards' caption type, so the form reads like the row
 * of work it sits below.
 */
function Row({
    n,
    label,
    htmlFor,
    error,
    children,
}: {
    n: number;
    label: string;
    htmlFor?: string;
    error?: string;
    children: React.ReactNode;
}) {
    const Label = htmlFor ? 'label' : 'p';
    return (
        <div className="grid grid-cols-[40px_1fr] border-t border-raise py-8 md:grid-cols-[72px_1fr] md:py-11">
            <span className={`${chrome} tabular pt-[0.4em] text-dust`}>{String(n).padStart(2, '0')}</span>
            <div className="min-w-0">
                <Label {...(htmlFor ? { htmlFor } : {})} className={`block ${caption} text-chalk`}>
                    {label}
                </Label>
                <div className="mt-3">{children}</div>
                {error && (
                    <p role="alert" className={`${chrome} mt-3 text-alert`}>
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

/**
 * A choice, set the way the bar sets its pages: grey until it's yours, then
 * black with the same small square in front of it. Several can be picked, so
 * each keeps a square of its own rather than sharing one that slides.
 */
function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            aria-pressed={on}
            onClick={onClick}
            className={`group inline-flex items-center text-left ${caption} transition-colors ${
                on ? 'text-chalk' : 'text-dust hover:text-chalk'
            }`}
        >
            <span
                aria-hidden="true"
                className={`h-[6px] bg-current transition-[width,margin,opacity] duration-300 ease-out ${
                    on ? 'mr-2.5 w-[6px] opacity-100' : 'mr-0 w-0 opacity-0'
                }`}
            />
            {children}
        </button>
    );
}

/**
 * The send button, round and sitting on the closing rule as on the reference,
 * but drawn like the bar's own circle: an outline that fills on hover. It leans
 * a little toward the pointer while it's near, and stays put for anyone who
 * has asked for less motion.
 */
function SendButton({ sending }: { sending: boolean }) {
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
    const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

    return (
        <motion.button
            type="submit"
            disabled={sending}
            onPointerMove={(e) => {
                if (reduce || e.pointerType !== 'mouse') return;
                const r = e.currentTarget.getBoundingClientRect();
                x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
                y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
            }}
            onPointerLeave={() => {
                x.set(0);
                y.set(0);
            }}
            style={{ x: sx, y: sy }}
            className={`flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-chalk bg-void ${caption} text-chalk transition-colors duration-300 hover:bg-chalk hover:text-void disabled:border-edge disabled:text-dust md:h-40 md:w-40`}
        >
            {sending ? 'Sending…' : 'Send it'}
        </motion.button>
    );
}

/**
 * The project form. It asks for what the API and the CRM already take —
 * name, email, company, budget and a message — plus what's needed, which
 * travels at the top of the message so it reads in context, and as the CRM's
 * project kind when it's clear.
 */
export function ContactForm() {
    const [services, setServices] = useState<string[]>([]);
    const [budget, setBudget] = useState('');
    const [errors, setErrors] = useState<Errors>({});
    const [failure, setFailure] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState<string | null>(null);

    const toggle = (s: string) =>
        setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSending(true);
        setErrors({});
        setFailure('');

        const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
        const written = (data.message ?? '').trim();
        // Checked here as well as on the server: the server sees the message
        // with the services line in front, which would pass on its own.
        if (written.length < 10) {
            setErrors({ message: 'A sentence or two is plenty.' });
            setSending(false);
            return;
        }
        const message = services.length ? `Looking for: ${services.join(', ')}\n\n${written}` : written;

        // A web app is the larger job, so it wins when both are picked.
        const projectKind = services.includes('Web apps and internal tools')
            ? 'webapp'
            : services.some((s) => s !== 'Something else')
                ? 'website'
                : '';

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, message, budget, kind: 'project', projectKind, ...attribution() }),
            });
            const body = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (body.errors) setErrors(body.errors);
                else setFailure(body.error ?? 'That didn’t send. Try again in a moment.');
                return;
            }

            clickEvent({ action: 'contact_form_sent', category: 'conversion', label: services.join(', ') || 'project' });
            setSent((data.name ?? '').trim().split(/\s+/)[0] || 'there');
        } catch {
            setFailure('That didn’t send — you may be offline. Email me and it’ll reach me.');
        } finally {
            setSending(false);
        }
    }

    // The message is in; the reply carries the next step from here.
    if (sent) {
        return (
            <div className="border-t border-raise py-12 md:py-16">
                <p className={`${chrome} text-dust`}>Message received</p>
                <p className={`mt-3 ${caption} text-chalk`}>Thank you, {sent}. You&rsquo;ll hear back within a day.</p>
                <Link
                    href="/"
                    className={`group mt-1 inline-flex items-center gap-2 ${caption} text-dust transition-colors hover:text-chalk`}
                >
                    Back to the work
                    <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={submit} noValidate>
            <Row n={1} label="What’s your name?" htmlFor="c-name" error={errors.name}>
                <input id="c-name" name="name" required autoComplete="name" placeholder="Jane Doe *" className={input} />
            </Row>

            <Row n={2} label="What’s your email?" htmlFor="c-email" error={errors.email}>
                <input
                    id="c-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="jane@company.com *"
                    className={input}
                />
            </Row>

            <Row n={3} label="What’s the name of your company?" htmlFor="c-company">
                <input id="c-company" name="company" autoComplete="organization" placeholder="Company Ltd" className={input} />
            </Row>

            <Row n={4} label="What do you need?">
                <div role="group" aria-label="What do you need?" className="flex flex-wrap gap-x-6 gap-y-1">
                    {SERVICES.map((s) => (
                        <Choice key={s} on={services.includes(s)} onClick={() => toggle(s)}>
                            {s}
                        </Choice>
                    ))}
                </div>
            </Row>

            <Row n={5} label="What’s your budget?">
                <div role="group" aria-label="What’s your budget?" className="flex flex-wrap gap-x-6 gap-y-1">
                    {budgets.map((b) => (
                        <Choice key={b} on={budget === b} onClick={() => setBudget(budget === b ? '' : b)}>
                            {b}
                        </Choice>
                    ))}
                </div>
            </Row>

            <Row n={6} label="Your message" htmlFor="c-message" error={errors.message}>
                <textarea
                    id="c-message"
                    name="message"
                    required
                    rows={3}
                    placeholder="Hi Abdelkader, I need help with … *"
                    className={`${input} resize-none`}
                />
            </Row>

            {/* Hidden from people, irresistible to bots — see the API route. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                    Website
                    <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
            </div>

            {/* The closing rule, with the button sitting on it. */}
            <div className="border-t border-raise">
                <div className="flex items-center justify-between gap-6 pt-8 md:-mt-20 md:pt-0">
                    <p
                        role={failure ? 'alert' : undefined}
                        className={`${chrome} max-w-[40ch] md:pt-28 ${failure ? 'text-alert' : 'text-dust'}`}
                    >
                        {failure || 'Reply within a day'}
                    </p>
                    <div className="md:pr-[14%]">
                        <SendButton sending={sending} />
                    </div>
                </div>
            </div>
        </form>
    );
}
