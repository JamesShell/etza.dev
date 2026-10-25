'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { RiseText } from '@/components/ui/Rise';
import { clickEvent } from '@/lib/analytics';
import type { Review } from '@/lib/reviews';

/** Small upper-case chrome, the same voice as the bar. */
const chrome = 'text-[11px] uppercase leading-[1.45] tracking-[0.06em]';

const initials = (name: string) =>
    name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]!.toUpperCase())
        .join('');

/**
 * One review: who said it — initials in a circle, their name, who they are
 * to the work — then the words, set large, and the way to the work itself.
 */
function ReviewCard({ review }: { review: Review }) {
    return (
        <figure className="flex w-[85vw] shrink-0 snap-start flex-col rounded-[10px] bg-void p-7 sm:w-[60vw] md:p-10 lg:w-[calc((100vw-64px-24px)/2)] lg:p-14">
            <figcaption className="flex items-center gap-5">
                <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-shell font-display text-[18px] font-medium tracking-[-0.02em] text-chalk md:h-16 md:w-16 md:text-[20px]"
                >
                    {initials(review.author)}
                </span>
                <span className="min-w-0 text-[17px] leading-[1.35] md:text-[19px]">
                    <span className="block truncate text-chalk">{review.author}</span>
                    {(review.detail || review.project) && (
                        <span className="block truncate text-dust">{review.detail ?? review.project}</span>
                    )}
                </span>
            </figcaption>

            <blockquote className="mt-12 max-w-[30ch] font-display text-[clamp(22px,2vw,30px)] font-normal leading-[1.3] tracking-[-0.02em] text-chalk md:mt-16">
                &ldquo;{review.quote}&rdquo;
            </blockquote>

            <div className={`mt-auto flex items-baseline justify-between gap-4 pt-12 ${chrome} text-dust`}>
                {review.href ? (
                    <Link
                        href={review.href}
                        onClick={() =>
                            clickEvent({ action: 'view_case_study', category: 'engagement', label: `Review: ${review.project}` })
                        }
                        className="group inline-flex items-center gap-2 text-chalk transition-colors hover:text-dust"
                    >
                        {review.project} case study
                        <ArrowRight
                            size={12}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                ) : (
                    <span>{review.project}</span>
                )}
                {review.rating && (
                    <span className="tabular" aria-label={`Rated ${review.rating} out of 5`}>
                        {review.rating}.0 ★
                    </span>
                )}
            </div>
        </figure>
    );
}

/**
 * The reviews, laid out after the reference: the title large and upper-case
 * across the left, a line of context and a running count on the right, then
 * the reviews as white cards on the page's grey in a row that scrolls
 * sideways — by swipe, trackpad, keyboard, or the two buttons by the count,
 * for a mouse with no sideways wheel.
 */
export function ReviewsBoard({ reviews }: { reviews: Review[] }) {
    const row = React.useRef<HTMLDivElement>(null);
    const [at, setAt] = React.useState(1);
    const [end, setEnd] = React.useState(false);

    // The count follows the card at the left edge; once the row can't scroll
    // any further, every card is in view, so it reads as the last.
    const onScroll = () => {
        const el = row.current;
        if (!el) return;
        const card = el.querySelector('figure');
        const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || '0') : 1;
        const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
        setEnd(atEnd);
        setAt(atEnd ? reviews.length : Math.min(reviews.length, Math.round(el.scrollLeft / step) + 1));
    };

    const go = (dir: 1 | -1) => {
        const el = row.current;
        const card = el?.querySelector('figure');
        if (!el || !card) return;
        const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || '0');
        el.scrollBy({ left: dir * step, behavior: 'smooth' });
    };

    return (
        <>
            <section className="grid grid-cols-1 gap-x-5 gap-y-8 px-5 pb-12 pt-16 md:grid-cols-4 md:px-8 md:pb-20 md:pt-24">
                <RiseText
                    as="h1"
                    text="Praise from clients"
                    className="max-w-[11ch] font-display text-[clamp(48px,7.4vw,144px)] font-normal uppercase leading-[0.9] tracking-[-0.045em] text-chalk md:col-span-2"
                />
                <p className="self-end text-[17px] leading-[1.4] text-chalk md:text-[19px]">
                    What clients say about working with me
                </p>
                <div className="flex items-end justify-between gap-6 self-end md:justify-end">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            disabled={at <= 1}
                            aria-label="Previous review"
                            className="press flex h-10 w-10 items-center justify-center rounded-full border border-edge text-chalk hover:border-chalk disabled:opacity-30"
                        >
                            <ArrowLeft size={14} aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            disabled={end || at >= reviews.length}
                            aria-label="Next review"
                            className="press flex h-10 w-10 items-center justify-center rounded-full border border-edge text-chalk hover:border-chalk disabled:opacity-30"
                        >
                            <ArrowRight size={14} aria-hidden="true" />
                        </button>
                    </div>
                    <p className="tabular text-[17px] text-chalk md:text-[19px]" aria-live="polite">
                        {at} — {reviews.length}
                    </p>
                </div>
            </section>

            <div
                ref={row}
                onScroll={onScroll}
                role="region"
                aria-label="Client reviews"
                tabIndex={0}
                className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-20 md:scroll-px-8 md:px-8 md:pb-28"
            >
                {reviews.map((review) => (
                    <ReviewCard key={review.quote.slice(0, 40)} review={review} />
                ))}
            </div>
        </>
    );
}
