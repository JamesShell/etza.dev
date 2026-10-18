'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowRight, Check, Minus, Plus } from '@phosphor-icons/react';
import { pricing, type PricingFeature, type ProjectKind } from '@/content/profile';
import { attribution, clickEvent } from '@/lib/analytics';
import { PROJECT_KINDS as KINDS, money } from '@/lib/pricing';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Maps an estimate onto the contact form's budget options. Below the lowest
 *  range it picks nothing rather than a range the number doesn't fall in. */
function budgetFor(total: number) {
    if (total >= 10000) return '$10k+';
    if (total >= 5000) return '$5–10k';
    if (total >= 2500) return '$2.5–5k';
    return '';
}

/**
 * Pick what you need, see a number. Everything it prices comes from `pricing`
 * in profile.ts. The estimate is the start of a conversation rather than a
 * checkout, so it ends in a booking: one field for an email, then the
 * calendar, with the whole selection already in the booking notes.
 */
export function PricingBuilder() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [sending, setSending] = useState(false);
    const [kind, setKind] = useState<ProjectKind>('website');
    // Kept per type, so switching to look at the other one and back doesn't
    // throw away what was picked.
    const [picked, setPicked] = useState<Record<ProjectKind, Record<string, number>>>({
        website: {},
        webapp: {},
    });
    const [monthly, setMonthly] = useState(false);

    const type = pricing.types[kind];
    const selection = picked[kind];
    const features = type.groups.flatMap((group) => group.features);
    const qty = (id: string) => selection[id] ?? 0;

    const set = (id: string, value: number) =>
        setPicked((prev) => ({ ...prev, [kind]: { ...prev[kind], [id]: value } }));

    const lines = [
        { name: type.base.name, amount: type.base.price },
        ...features
            .filter((f) => qty(f.id) > 0)
            .map((f) => ({
                name: f.max ? `${f.name} × ${qty(f.id)}` : f.name,
                amount: f.price * qty(f.id),
            })),
    ];
    const total = lines.reduce((sum, line) => sum + line.amount, 0);
    const weeks = Math.ceil(type.base.weeks + features.reduce((sum, f) => sum + f.weeks * qty(f.id), 0));

    // The plan is only offered when it actually costs less than paying once,
    // and it switches itself off when the selection shrinks below that.
    const months = Math.max(1, Math.ceil(total / pricing.plan.capacity));
    const planCost = months * pricing.plan.monthly;
    const planSaves = planCost < total;
    const onPlan = monthly && planSaves;

    const summary = [
        `Estimate from etza.dev — ${type.title}`,
        ...lines.map((line) => `- ${line.name}`),
        onPlan
            ? `Monthly plan: ${money(pricing.plan.monthly)}/mo for ${months} month${months > 1 ? 's' : ''}`
            : `Paying once: ${money(total)}`,
    ].join('\n');
    const budget = onPlan ? 'Monthly plan' : budgetFor(total);

    async function book(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const address = email.trim();

        // Checked here rather than left to the browser's bubble, so the
        // message sits under the field in the site's own words.
        if (!EMAIL.test(address)) {
            setEmailError('Add an email so I can reply with the estimate.');
            return;
        }

        setSending(true);
        clickEvent({
            action: 'estimate_to_booking',
            category: 'conversion',
            label: `${kind} · ${onPlan ? 'monthly plan' : money(total)}`,
        });

        // Saved first, so the estimate reaches me even if the booking is never
        // finished. A failure here doesn't stop anyone — the same summary goes
        // into the booking notes on the next page.
        try {
            await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kind: 'project',
                    source: 'estimate',
                    email: address,
                    message: summary,
                    budget,
                    projectKind: kind,
                    estimate: {
                        total: onPlan ? planCost : total,
                        summary: [
                            ...lines.slice(1).map((line) => line.name),
                            ...(onPlan ? [`monthly plan, ${months} mo`] : []),
                        ].join(', ') || type.base.name,
                    },
                    ...attribution(),
                    website: new FormData(event.currentTarget).get('website'),
                }),
            });
        } catch {
            // Offline or blocked — carry on to the booking regardless.
        }

        router.push(`/book?${new URLSearchParams({ email: address, notes: summary })}`);
    }

    return (
        <div>
            <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-12">
                <div>
                    <div role="group" aria-label="Project type" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {KINDS.map((option) => {
                            const selected = kind === option;
                            return (
                                <button
                                    key={option}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => setKind(option)}
                                    className={`press cursor-pointer rounded-2xl p-5 text-left ${
                                        selected ? 'bg-chalk text-void' : 'bg-shell text-chalk hover:bg-raise'
                                    }`}
                                >
                                    <span className="block font-display text-[19px] font-medium tracking-[-0.02em]">
                                        {pricing.types[option].title}
                                    </span>
                                    <span
                                        className={`mt-1 block text-[14px] leading-snug ${
                                            selected ? 'text-void/70' : 'text-ash'
                                        }`}
                                    >
                                        {pricing.types[option].pitch}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-10">
                        <h3 className="text-[12px] text-dust">Always included</h3>
                        <div className="mt-3 flex items-baseline justify-between gap-6">
                            <div>
                                <p className="font-sans text-[15px] font-medium text-chalk">{type.base.name}</p>
                                <p className="mt-1 max-w-[50ch] font-sans text-[14px] leading-relaxed text-ash">
                                    {type.base.detail} Two weeks of free fixes after launch.
                                </p>
                            </div>
                            <span className="tabular shrink-0 text-[15px] text-chalk">{money(type.base.price)}</span>
                        </div>
                    </div>

                    {type.groups.map((group) => (
                        <fieldset key={group.title} className="mt-10 border-0 p-0">
                            <legend className="text-[12px] text-dust">{group.title}</legend>
                            <ul className="-mx-4 mt-2 space-y-1">
                                {group.features.map((feature) => (
                                    <li key={feature.id}>
                                        {feature.max ? (
                                            <CountedFeature
                                                feature={feature}
                                                value={qty(feature.id)}
                                                onChange={(value) => set(feature.id, value)}
                                            />
                                        ) : (
                                            <ToggledFeature
                                                feature={feature}
                                                checked={qty(feature.id) > 0}
                                                onChange={(on) => set(feature.id, on ? 1 : 0)}
                                            />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </fieldset>
                    ))}

                    {/* Below xl the estimate sits under every feature, so the
                        number would change out of sight. This keeps it in view
                        while the features scroll past, and stops at the end of
                        this column — it never covers the estimate itself. */}
                    <a
                        href="#estimate"
                        className="glass-dark press sticky bottom-4 mt-8 flex items-center justify-between gap-4 rounded-full py-3 pl-5 pr-4 text-void xl:hidden"
                    >
                        <span className="text-[14px]">
                            {type.title} ·{' '}
                            <span className="tabular font-medium">
                                {onPlan ? `${money(pricing.plan.monthly)}/mo` : money(total)}
                            </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[13px] text-void/70">
                            See estimate
                            <ArrowDown size={13} aria-hidden="true" />
                        </span>
                    </a>
                </div>

                <aside
                    id="estimate"
                    aria-label="Your estimate"
                    className="scroll-mt-8 self-start rounded-3xl bg-shell p-7 md:p-8 xl:sticky xl:top-12"
                >
                    <p className="text-[12px] text-dust">Estimate</p>
                    <p className="mt-1 font-display text-[19px] font-medium tracking-[-0.02em] text-chalk">
                        {type.title}
                    </p>

                    <ul className="mt-5 space-y-2">
                        {lines.map((line) => (
                            <li key={line.name} className="flex items-baseline justify-between gap-4 text-[14px]">
                                <span className="text-ash">{line.name}</span>
                                <span className="tabular shrink-0 text-chalk">
                                    {onPlan ? (
                                        <>
                                            <s className="mr-2 text-dust">{money(line.amount)}</s>
                                            Included
                                        </>
                                    ) : (
                                        money(line.amount)
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div aria-live="polite" className="mt-7">
                        <div className="flex items-baseline justify-between gap-4">
                            <span className="text-[14px] text-ash">
                                {onPlan ? (months > 1 ? `${months} months at` : 'Monthly') : 'Total'}
                            </span>
                            <span className="tabular font-display text-[34px] font-medium leading-none tracking-[-0.03em] text-chalk">
                                {onPlan ? money(pricing.plan.monthly) : money(total)}
                                {onPlan && <span className="text-[15px] tracking-normal text-ash">/mo</span>}
                            </span>
                        </div>
                        <p className="mt-3 text-[13px] leading-relaxed text-dust">
                            {onPlan
                                ? `You save ${money(total - planCost)} compared with paying once. Hosting and edits are included while you’re on the plan.`
                                : '40% to start, 40% when you approve the design, 20% at launch.'}
                        </p>
                        <p className="mt-1 text-[13px] text-dust">
                            Ready in about {weeks}–{weeks + 2} weeks.
                        </p>
                    </div>

                    {planSaves && (
                        <div className="mt-6">
                            <Switch
                                checked={onPlan}
                                onChange={setMonthly}
                                title={`Monthly plan · ${money(pricing.plan.monthly)}/mo`}
                                detail={`Up to ${money(pricing.plan.capacity)} of work a month, so it costs about half.`}
                            />
                        </div>
                    )}

                    <form onSubmit={book} noValidate className="mt-7">
                        <label htmlFor="estimate-email" className="block text-[13px] text-ash">
                            Your email
                        </label>
                        <input
                            id="estimate-email"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            placeholder="you@business.com"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                if (emailError) setEmailError('');
                            }}
                            aria-invalid={emailError ? true : undefined}
                            aria-describedby={emailError ? 'estimate-email-error' : 'estimate-email-hint'}
                            className="mt-2 w-full rounded-full border-0 bg-void px-5 py-3 font-sans text-[15px] text-chalk placeholder:text-dust focus:ring-0"
                        />
                        {emailError ? (
                            <p id="estimate-email-error" role="alert" className="mt-2 px-1 text-[13px] text-alert">
                                {emailError}
                            </p>
                        ) : (
                            <p id="estimate-email-hint" className="mt-2 px-1 text-[13px] leading-snug text-dust">
                                Next you pick a time. The estimate goes with the booking.
                            </p>
                        )}

                        {/* Not visible, not focusable, not announced. Bots fill it; people can't. */}
                        <input
                            type="text"
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                            className="absolute left-[-9999px] h-px w-px opacity-0"
                        />

                        <button
                            type="submit"
                            disabled={sending}
                            className="press group mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-chalk px-5 py-3 text-[14px] font-medium text-void hover:opacity-90 disabled:opacity-60"
                        >
                            {sending ? 'Opening the calendar' : 'Book a call with this estimate'}
                            {!sending && (
                                <ArrowRight
                                    size={14}
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            )}
                        </button>
                    </form>
                    <Link
                        href="/book"
                        onClick={() =>
                            clickEvent({ action: 'click_book_call', category: 'conversion', label: 'Pricing' })
                        }
                        className="mt-3 block text-center text-[13px] text-ash transition-colors hover:text-chalk"
                    >
                        Or book without an estimate
                    </Link>
                </aside>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 xl:grid-cols-3 xl:gap-10">
                <div className="max-w-[48ch]">
                    <h3 className="font-sans text-[15px] font-medium text-chalk">Pay once</h3>
                    <p className="mt-2 font-sans text-[14px] leading-relaxed text-ash">
                        A fixed price in writing, paid 40% to start, 40% when you approve the design and 20% at
                        launch. You own the code and files from day one, with two weeks of free fixes after
                        launch.
                    </p>
                </div>
                <div className="max-w-[48ch]">
                    <h3 className="font-sans text-[15px] font-medium text-chalk">Monthly plan</h3>
                    <p className="mt-2 font-sans text-[14px] leading-relaxed text-ash">
                        {money(pricing.plan.monthly)} a month buys up to {money(pricing.plan.capacity)} of work
                        at one-off prices. Made for businesses and agencies with steady work — the estimate only
                        offers it when it costs less than paying once. Pause or cancel anytime.
                    </p>
                </div>
                <div className="max-w-[48ch]">
                    <h3 className="font-sans text-[15px] font-medium text-chalk">Not sure what you need?</h3>
                    <p className="mt-2 font-sans text-[14px] leading-relaxed text-ash">
                        A paid planning session is {money(pricing.planningSession)}. We work out together what
                        to build, and the {money(pricing.planningSession)} counts toward the build if you go
                        ahead.
                    </p>
                </div>
            </div>
        </div>
    );
}

/** One row per feature. The real checkbox is visually hidden but still the
 *  control — the circle beside it is only a picture of its state. */
function ToggledFeature({
    feature,
    checked,
    onChange,
}: {
    feature: PricingFeature;
    checked: boolean;
    onChange: (on: boolean) => void;
}) {
    return (
        <label
            className={`flex cursor-pointer items-start gap-4 rounded-xl px-4 py-3 transition-colors ${
                checked ? 'bg-shell' : 'hover:bg-shell'
            }`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="peer sr-only"
            />
            <span
                aria-hidden="true"
                className={`mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-chalk peer-focus-visible:ring-offset-2 ${
                    checked ? 'bg-chalk text-void' : 'bg-raise'
                }`}
            >
                {checked && <Check size={11} weight="bold" />}
            </span>
            <FeatureText feature={feature} />
            <span className="tabular shrink-0 pt-px text-[14px] text-ash">+{money(feature.price)}</span>
        </label>
    );
}

function CountedFeature({
    feature,
    value,
    onChange,
}: {
    feature: PricingFeature;
    value: number;
    onChange: (value: number) => void;
}) {
    const max = feature.max ?? 0;
    const name = feature.name.toLowerCase();
    const step = 'press flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-raise text-chalk disabled:cursor-default disabled:opacity-40';

    return (
        <div className={`flex items-start gap-4 rounded-xl px-4 py-3 transition-colors ${value ? 'bg-shell' : ''}`}>
            {/* Holds the column the checkbox circle takes on the other rows. */}
            <span aria-hidden="true" className="w-[18px] shrink-0" />
            <FeatureText feature={feature} suffix={`${money(feature.price)} each.`} />
            <div className="flex shrink-0 items-center gap-2">
                <button
                    type="button"
                    aria-label={`Fewer ${name}`}
                    disabled={value === 0}
                    onClick={() => onChange(Math.max(0, value - 1))}
                    className={step}
                >
                    <Minus size={12} weight="bold" aria-hidden="true" />
                </button>
                <output aria-label={`${feature.name}: ${value}`} className="tabular w-5 text-center text-[14px] text-chalk">
                    {value}
                </output>
                <button
                    type="button"
                    aria-label={`More ${name}`}
                    disabled={value >= max}
                    onClick={() => onChange(Math.min(max, value + 1))}
                    className={step}
                >
                    <Plus size={12} weight="bold" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

function FeatureText({ feature, suffix }: { feature: PricingFeature; suffix?: string }) {
    return (
        <span className="min-w-0 flex-1">
            <span className="block font-sans text-[15px] text-chalk">{feature.name}</span>
            <span className="mt-0.5 block font-sans text-[14px] leading-snug text-ash">
                {feature.detail}
                {suffix && ` ${suffix}`}
            </span>
        </span>
    );
}

function Switch({
    checked,
    onChange,
    title,
    detail,
}: {
    checked: boolean;
    onChange: (on: boolean) => void;
    title: string;
    detail: string;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="press flex w-full cursor-pointer items-start justify-between gap-4 rounded-2xl bg-void p-4 text-left"
        >
            <span>
                <span className="block text-[14px] font-medium text-chalk">{title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-ash">{detail}</span>
            </span>
            <span
                aria-hidden="true"
                className={`relative mt-0.5 h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${
                    checked ? 'bg-chalk' : 'bg-raise'
                }`}
            >
                <span
                    className={`absolute left-[3px] top-[3px] h-4 w-4 rounded-full bg-void transition-transform motion-reduce:transition-none ${
                        checked ? 'translate-x-4' : ''
                    }`}
                />
            </span>
        </button>
    );
}
