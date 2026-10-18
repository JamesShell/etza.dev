'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, CalendarBlank, CheckCircle } from '@phosphor-icons/react';
import { budgets, profile } from '@/content/profile';
import { attribution, clickEvent } from '@/lib/analytics';

type Errors = Record<string, string>;

const KINDS = [
    { value: 'project', label: 'A project' },
    { value: 'role', label: 'A role' },
    { value: 'other', label: 'Something else' },
];

/**
 * Ruled underneath rather than boxed. The rule is the affordance — it says
 * "type here" without putting a filled panel inside a card that is already a
 * filled panel.
 */
const field =
    'w-full border-0 border-b border-edge bg-transparent px-0 py-2 font-sans text-[15px] text-chalk transition-colors placeholder:text-dust focus:border-chalk focus:outline-none focus:ring-0';

/**
 * The form as the pricing estimate hands it over: `/contact?quote=…&budget=…`
 * arrives with the message and budget already filled in. The contact page
 * renders the plain form as this one's Suspense fallback, so the static HTML
 * is still a working form before the query string is read.
 */
export function QuotedContactForm() {
    const params = useSearchParams();
    const budget = params.get('budget') ?? '';

    return (
        <ContactForm
            initialMessage={params.get('quote')?.slice(0, 2000) ?? ''}
            initialBudget={budgets.includes(budget) ? budget : ''}
        />
    );
}

export function ContactForm({
    initialMessage = '',
    initialBudget = '',
}: {
    initialMessage?: string;
    initialBudget?: string;
}) {
    const [kind, setKind] = useState('project');
    const [budget, setBudget] = useState(initialBudget);
    const [errors, setErrors] = useState<Errors>({});
    const [failure, setFailure] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSending(true);
        setErrors({});
        setFailure('');

        const data = Object.fromEntries(new FormData(event.currentTarget));

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, kind, ...attribution() }),
            });
            const body = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (body.errors) setErrors(body.errors);
                else setFailure(body.error ?? 'That didn’t send. Try again in a moment.');
                return;
            }

            clickEvent({ action: 'contact_form_sent', category: 'conversion', label: kind });
            setSent(true);
        } catch {
            setFailure('That didn’t send — you may be offline. Email me and it’ll reach me.');
        } finally {
            setSending(false);
        }
    }

    /**
     * The message is already in. A call is the natural next step, so it's
     * offered here rather than buried — but the work is done either way, which
     * is why this reads as an invitation and not an unfinished task.
     */
    if (sent) {
        return (
            <div className="rounded-2xl bg-shell p-8 md:p-10">
                <CheckCircle size={30} weight="fill" aria-hidden="true" className="text-chalk" />

                <h2 className="mt-4 font-display text-[24px] font-medium tracking-[-0.02em] text-chalk">
                    Message sent
                </h2>
                <p className="mt-3 max-w-[44ch] font-sans text-[15px] leading-relaxed text-ash">
                    It’s with me — you’ll get a reply within a day. If you’d rather talk it through,
                    grab a slot now and we’ll skip a round of email.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                    <Link
                        href="/book"
                        onClick={() =>
                            clickEvent({
                                action: 'click_book_call',
                                category: 'conversion',
                                label: 'Contact form success',
                            })
                        }
                        className="group inline-flex items-center gap-2 rounded-full bg-chalk px-5 py-2.5 text-[14px] font-medium text-void transition-opacity hover:opacity-90"
                    >
                        <CalendarBlank size={15} weight="fill" aria-hidden="true" />
                        Book a 30-minute call
                        <ArrowRight
                            size={14}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>

                    <Link href="/#work" className="text-[14px] text-ash transition-colors hover:text-chalk">
                        Back to the work
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={submit} noValidate>
            <fieldset className="border-0 p-0">
                <legend className="text-[12px] uppercase tracking-[0.08em] text-dust">
                    What’s this about?
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                    {KINDS.map((option) => {
                        const selected = kind === option.value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setKind(option.value)}
                                className={`cursor-pointer rounded-full px-4 py-2 text-[14px] transition-colors ${
                                    selected ? 'bg-chalk text-void' : 'bg-shell text-ash hover:text-chalk'
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
                <Field name="name" label="Name" required error={errors.name}>
                    <input
                        id="name"
                        name="name"
                        required
                        aria-required="true"
                        autoComplete="name"
                        // An invented name on purpose. This used to be a real
                        // client's, taken from the testimonials — a past client
                        // shouldn't turn up as ghost text in a stranger's form.
                        placeholder="Sara Bennani"
                        className={field}
                    />
                </Field>

                <Field name="email" label="Email" required error={errors.email}>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        aria-required="true"
                        autoComplete="email"
                        placeholder="you@company.com"
                        className={field}
                    />
                </Field>

                {/* Row three answers whatever the enquiry is about — what it
                    costs for a project, where it's based for a role — and
                    Company sits beside it. "Something else" gets neither: at
                    that point I don't know enough to ask a useful question. */}
                {kind === 'project' && (
                    <fieldset className="border-0 p-0">
                        <legend className="block text-[12px] uppercase tracking-[0.08em] text-dust">
                            Rough budget
                        </legend>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {budgets.map((option) => {
                                const selected = budget === option;
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        aria-pressed={selected}
                                        // A second click clears it — budget is optional.
                                        onClick={() => setBudget(selected ? '' : option)}
                                        className={`cursor-pointer rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                                            selected ? 'bg-chalk text-void' : 'bg-shell text-ash hover:text-chalk'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                        <input type="hidden" name="budget" value={budget} />
                        <p className="mt-2 text-[13px] text-dust">Helps me scope honestly.</p>
                    </fieldset>
                )}

                {kind === 'role' && (
                    <Field name="location" label="Location" hint="Remote, hybrid or on-site — and where.">
                        <input
                            id="location"
                            name="location"
                            autoComplete="off"
                            placeholder="e.g. Remote (EU hours)"
                            className={field}
                        />
                    </Field>
                )}

                {kind !== 'other' && (
                    <Field name="company" label="Company">
                        <input
                            id="company"
                            name="company"
                            autoComplete="organization"
                            placeholder="Optional"
                            className={field}
                        />
                    </Field>
                )}

                <div className="sm:col-span-2">
                    <Field
                        name="message"
                        label={kind === 'role' ? 'About the role' : 'What are you building?'}
                        required
                        hint={
                            kind === 'role'
                                ? 'Team, stack and where it’s based is plenty to start.'
                                : 'What it is, and what’s in the way. A couple of sentences is plenty.'
                        }
                        error={errors.message}
                    >
                        <textarea
                            id="message"
                            name="message"
                            rows={initialMessage ? initialMessage.split('\n').length + 2 : 5}
                            defaultValue={initialMessage}
                            required
                            aria-required="true"
                            className={`${field} resize-y`}
                        />
                    </Field>
                </div>
            </div>

            {/* Not visible, not focusable, not announced. Bots fill it; people can't. */}
            <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-px w-px opacity-0"
            />

            {failure && (
                <p role="alert" className="mt-8 font-sans text-[14px] leading-relaxed text-chalk">
                    {failure}{' '}
                    <a href={`mailto:${profile.email}`} className="underline underline-offset-4">
                        {profile.email}
                    </a>
                </p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
                <p className="text-[13px] text-dust">
                    Fields marked <span className="text-alert">*</span> are required. Replies within a day.
                </p>

                <button
                    type="submit"
                    disabled={sending}
                    className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-chalk px-5 py-2.5 text-[14px] font-medium text-void transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {sending ? 'Sending' : 'Send message'}
                    {!sending && (
                        <ArrowRight
                            size={14}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    )}
                </button>
            </div>
        </form>
    );
}

function Field({
    name,
    label,
    hint,
    error,
    required,
    children,
}: {
    name: string;
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-[12px] uppercase tracking-[0.08em] text-dust"
            >
                {label}
                {/* Hidden from screen readers — `required` on the control
                    already announces it, and "asterisk" read aloud is noise. */}
                {required && (
                    <span className="text-alert" aria-hidden="true">
                        {' '}
                        *
                    </span>
                )}
            </label>
            <div className="mt-2">{children}</div>
            {hint && !error && <p className="mt-2 text-[13px] text-dust">{hint}</p>}
            {error && (
                <p role="alert" className="mt-2 text-[13px] text-alert">
                    {error}
                </p>
            )}
        </div>
    );
}
