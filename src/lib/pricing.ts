import { pricing, type ProjectKind } from '@/content/profile';

/**
 * Prices as sentences. The estimator is interactive, which is right for a
 * person and useless for anything that reads the page as text: a crawler sees
 * only the default selection, and never sees the web app prices at all. These
 * answers state the same numbers in plain words, so the pricing page, llms.txt
 * and the structured data can all quote them — and since they're built from
 * `pricing` in profile.ts, changing a price there changes it everywhere.
 */

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const money = (n: number) => usd.format(n);

export const PROJECT_KINDS: ProjectKind[] = ['website', 'webapp'];

function feature(kind: ProjectKind, id: string) {
    const found = pricing.types[kind].groups.flatMap((group) => group.features).find((f) => f.id === id);
    if (!found) throw new Error(`No ${kind} feature with id "${id}" in pricing`);
    return found;
}

const price = (kind: ProjectKind, id: string) => money(feature(kind, id).price);

export function pricingQuestions(): { question: string; answer: string }[] {
    const site = pricing.types.website;
    const app = pricing.types.webapp;
    const { monthly, capacity } = pricing.plan;

    return [
        {
            question: 'How much does a website cost?',
            answer: `A website starts at ${money(site.base.price)} for up to five pages you can edit yourself, designed for phones and set up for search. Online booking adds ${price('website', 'booking')}, card payments ${price('website', 'payments')} and an online shop ${price('website', 'shop')}. The estimate above prices your exact mix; the final price is fixed in writing after a 30-minute call, usually within 10% of it.`,
        },
        {
            question: 'How much does a web app cost?',
            answer: `A web app starts at ${money(app.base.price)}, with sign-in, an admin dashboard, a database and a layout that works on phones. Access levels for staff and clients add ${price('webapp', 'roles')}, payments and subscriptions ${price('webapp', 'payments')}, and reports ${price('webapp', 'reports')}. Connecting a tool you already use is ${price('webapp', 'integr')} per tool.`,
        },
        {
            question: 'How long does it take?',
            answer: `A website takes about ${site.base.weeks}–${site.base.weeks + 2} weeks and a web app about ${app.base.weeks}–${app.base.weeks + 2}. Each feature adds a little, and the estimate shows the timeline as you pick.`,
        },
        {
            question: 'How do I pay?',
            answer: `Either once — 40% to start, 40% when you approve the design and 20% at launch — or on the monthly plan: ${money(monthly)} a month buys up to ${money(capacity)} of work at one-off prices, so it costs about half. The monthly plan suits businesses and agencies with steady work, and you can pause or cancel it anytime.`,
        },
        {
            question: 'What if I’m not sure what I need?',
            answer: `Book a paid planning session for ${money(pricing.planningSession)}. We work out together what to build, and the ${money(pricing.planningSession)} counts toward the build if you go ahead.`,
        },
    ];
}
