import React from 'react';
import { Reveal, RiseIn, RiseText } from '@/components/ui/Rise';

/** Small upper-case chrome, the same voice as the bar. */
export const chrome = 'text-[11px] uppercase leading-[1.45] tracking-[0.06em]';

/** Body copy on the inner pages: the reading measure, in the grey the site reads in. */
export const prose = 'max-w-[62ch] text-[17px] leading-[1.65] text-ash';

/**
 * The opening of an inner page, on the home page's four columns: the title
 * across the first three, rising in word by word, and anything given as
 * `aside` in the fourth — the column the bar keeps the local time in.
 */
export function PageTitle({
    title,
    eyebrow,
    aside,
    size = 'large',
}: {
    title: string;
    /** A line of chrome above the title: a status code, a date. */
    eyebrow?: string;
    aside?: React.ReactNode;
    /** `sentence` sets a full sentence a size down, so it reads as one. */
    size?: 'large' | 'sentence';
}) {
    const type =
        size === 'large'
            ? 'max-w-[13ch] text-[clamp(48px,6.6vw,128px)] leading-[0.94] tracking-[-0.055em]'
            : 'max-w-[26ch] text-[clamp(32px,3.6vw,64px)] leading-[1.06] tracking-[-0.045em]';

    return (
        <section className="grid grid-cols-1 gap-x-5 gap-y-10 pb-16 pt-20 md:grid-cols-4 md:pb-28 md:pt-36">
            <div className="md:col-span-3">
                {eyebrow && (
                    <p className={`${chrome} mb-6 text-dust`}>
                        <RiseIn>{eyebrow}</RiseIn>
                    </p>
                )}
                <RiseText as="h1" text={title} className={`font-display font-normal text-chalk ${type}`} />
            </div>
            {aside && <div className="flex flex-col justify-end">{aside}</div>}
        </section>
    );
}

/**
 * One section of an inner page, laid out like the case studies: a label in
 * the bar's small capitals in the first column, rising in as it arrives, and
 * the content across the middle two, settling in after it.
 */
export function PageSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <section className="grid grid-cols-1 gap-x-5 gap-y-5 border-t border-raise py-12 md:grid-cols-4 md:py-16">
            <h2 className={`${chrome} pt-[0.3em] text-dust`}>
                <RiseIn inView block>
                    {label}
                </RiseIn>
            </h2>
            <Reveal className="md:col-span-2">{children}</Reveal>
        </section>
    );
}
