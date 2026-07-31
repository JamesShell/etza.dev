'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Quotes } from '@phosphor-icons/react';
import { CaseStudy, SelectedWork } from '@/types/database';
import { isVideoUrl } from '@/lib/utils';
import { clickEvent } from '@/lib/analytics';
import { results, testimonials } from '@/content/profile';

type Work = SelectedWork & { case_study?: CaseStudy | null };
type Testimonial = (typeof testimonials)[number];

/** A metric only appears next to the project it came from. */
function resultFor(title: string) {
    return results.find(
        (r) => r.project && r.slug && r.project.toLowerCase() === title.toLowerCase()
    );
}

/**
 * Loose match, so 'Sybelle' still pins to 'Sybelle Platform'.
 *
 * `category` carries the project name ('Lumen', 'Sybelle', 'Put.ma') while
 * `title` carries the view ('Hero Section', 'Mobile View'), so it has to be in
 * the haystack — a work with no linked case study has nothing else to match on.
 */
function reviewFor(work: Work, pool: Testimonial[]) {
    const haystack = `${work.category} ${work.title} ${work.case_study?.title ?? ''}`.toLowerCase();
    return pool.find((t) => t.project && haystack.includes(t.project.toLowerCase()));
}

/**
 * The shot.
 *
 * `showDetails` uncovers the project name behind the image on hover. It is on
 * only when the companion cell is a review, which never names the project it
 * praises — so the card has to. When the companion is a Record the name is
 * already on screen, and repeating it beside itself is noise. So identity
 * appears exactly once per row.
 *
 * Below `md` a revealing card is permanently open: a touch screen has no hover,
 * and details that only exist on hover don't exist at all.
 */
function WorkCard({
    work,
    wide,
    showDetails,
}: {
    work: Work;
    wide: boolean;
    showDetails: boolean;
}) {
    const cs = work.case_study;
    const result = cs ? resultFor(cs.title) : undefined;
    const ratio = wide ? 'md:aspect-[16/9]' : 'md:aspect-[4/3]';
    const reveal = result ? '140px' : '112px';

    // Beside a review, the row has to say which project is being praised — so
    // the card names the project, not the view it happens to be showing.
    // `title` is the shot ('Hero Section'), `category` the project ('Lumen'),
    // and the case study title is the most authoritative of the three.
    const name = cs?.title ?? work.category ?? work.title;

    // The view sits under the name — which shot of the project you're looking
    // at. Dropped when it repeats the name, as it does on single-shot projects
    // where the work and the project are the same thing.
    const view = work.title === name ? null : work.title;
    const meta = [view, cs?.year, ...(cs?.scope_of_work ?? []).slice(0, 2)].filter(
        Boolean
    ) as string[];

    const media = (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-void md:h-full md:aspect-auto">
            {isVideoUrl(work.image_url) ? (
                <video
                    src={work.image_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                />
            ) : (
                <Image
                    src={work.image_url}
                    alt={`${work.title} — ${work.category}`}
                    fill
                    sizes={wide ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 40vw'}
                    className="object-cover"
                />
            )}
        </div>
    );

    const body = showDetails ? (
        <>
            <div className="px-7 pb-5 pt-7 md:absolute md:inset-x-0 md:top-0 md:pb-0">
                <h3 className="font-display text-[21px] font-medium leading-tight tracking-[-0.02em] text-chalk md:text-[24px]">
                    {name}
                </h3>
                {meta.length > 0 && (
                    <p className="mt-1 text-[14px] text-ash">{meta.join(' · ')}</p>
                )}
                {result && (
                    <p className="tabular mt-2 text-[14px] text-chalk">
                        {result.metric} <span className="text-ash">{result.label}</span>
                    </p>
                )}
            </div>

            <div
                className="px-4 pb-4 md:absolute md:inset-0 md:p-0 md:transition-[padding] md:duration-[600ms] md:ease-out md:group-hover:px-4 md:group-hover:pb-4 md:group-hover:pt-[var(--reveal)] md:group-focus-visible:px-4 md:group-focus-visible:pb-4 md:group-focus-visible:pt-[var(--reveal)]"
                style={{ '--reveal': reveal } as React.CSSProperties}
            >
                {media}
            </div>
        </>
    ) : (
        <div className="h-full w-full p-4 md:p-0">{media}</div>
    );

    const shell = `work-card group relative flex flex-col overflow-hidden rounded-3xl bg-shell ${ratio}`;

    if (!cs) return <div className={shell}>{body}</div>;

    return (
        <Link
            href={`/work/${cs.slug}`}
            onClick={() =>
                clickEvent({
                    action: 'view_case_study',
                    category: 'engagement',
                    label: `Work card: ${cs.title}`,
                })
            }
            className={shell}
        >
            {body}
        </Link>
    );
}

/** The companion cell when the project has no review pinned to it. */
function Record({ work, wide }: { work: Work; wide: boolean }) {
    const cs = work.case_study;
    const result = cs ? resultFor(cs.title) : undefined;

    const meta = [cs?.year, cs?.timeline, ...(cs?.scope_of_work ?? [])].filter(Boolean) as string[];

    return (
        <div
            className={`flex h-full flex-col rounded-3xl bg-shell p-7 md:p-9 ${
                wide ? 'md:flex-row md:items-start md:gap-12' : ''
            }`}
        >
            <div className={wide ? 'md:w-1/2' : ''}>
                <h3 className="font-display text-[21px] font-medium leading-tight tracking-[-0.02em] text-chalk md:text-[24px]">
                    {work.title}
                </h3>
                <p className="mt-1 text-[13px] text-dust">{work.category}</p>

                {cs?.description && (
                    <p className="mt-4 max-w-[46ch] font-sans text-[15px] leading-relaxed text-ash">
                        {cs.description.split('\n\n')[0]}
                    </p>
                )}
            </div>

            <div className={`mt-auto pt-6 ${wide ? 'md:w-1/2 md:pt-0' : ''}`}>
                {meta.length > 0 && (
                    <ul className="mb-5 flex flex-wrap gap-x-2 gap-y-1 text-[13px] text-dust">
                        {meta.map((item, i) => (
                            <li key={`${item}-${i}`} className="flex items-center gap-2">
                                {item}
                                {i < meta.length - 1 && <span className="text-edge">·</span>}
                            </li>
                        ))}
                    </ul>
                )}

                {result && (
                    <p className="tabular mb-5 text-[14px] text-chalk">
                        {result.metric} <span className="text-ash">{result.label}</span>
                    </p>
                )}

                {cs && (
                    <Link
                        href={`/work/${cs.slug}`}
                        onClick={() =>
                            clickEvent({
                                action: 'view_case_study',
                                category: 'engagement',
                                label: `Work record: ${cs.title}`,
                            })
                        }
                        className="group inline-flex items-baseline gap-2 text-[14px] text-ash transition-colors hover:text-chalk"
                    >
                        Read the case study
                        <ArrowRight
                            size={14}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                )}
            </div>
        </div>
    );
}

/** A review, sized to sit in the grid as a peer of the project cards. */
function TestimonialCard({ item }: { item: Testimonial }) {
    return (
        <figure className="flex h-full flex-col rounded-3xl bg-shell p-7 md:p-9">
            {/* Opens the card the way the quote opens: decorative, so it's kept
                out of the accessibility tree and the words carry the meaning. */}
            <Quotes
                size={38}
                weight="fill"
                aria-hidden="true"
                className="-ml-[2px] shrink-0 text-chalk"
            />

            <blockquote className="mt-4 font-display text-[19px] font-medium leading-[1.35] tracking-[-0.015em] text-chalk md:text-[22px]">
                {item.quote}
            </blockquote>

            <figcaption className="mt-auto pt-8">
                <span className="block text-[14px] text-ash">
                    {item.author}
                    {item.role && <span className="text-dust"> · {item.role}</span>}
                    {!item.role && item.source && <span className="text-dust"> · {item.source}</span>}
                </span>
            </figcaption>
        </figure>
    );
}

export function WorkGrid({ works }: { works: Work[] }) {
    if (!works || works.length === 0) return null;

    // Each project owns a row: the shot on one side, its companion on the
    // other, alternating sides so the grid reads as a weave. Column placement
    // does the swapping — not DOM order — so the shot always precedes its
    // caption on mobile and for screen readers.
    const used = new Set<Testimonial>();
    const cells: React.ReactNode[] = [];
    let row = 0;

    works.forEach((work) => {
        const wide = work.display_width === 'wide';
        const review = reviewFor(work, testimonials.filter((t) => !used.has(t)));
        if (review) used.add(review);

        const swap = !wide && row % 2 === 1;
        if (!wide) row += 1;

        cells.push(
            <div
                key={`${work.id}-card`}
                className={wide ? 'md:col-span-2' : swap ? 'md:col-start-2' : ''}
            >
                <WorkCard work={work} wide={wide} showDetails={Boolean(review)} />
            </div>,
            <div
                key={`${work.id}-companion`}
                className={wide ? 'md:col-span-2' : swap ? 'md:col-start-1' : ''}
            >
                {review ? <TestimonialCard item={review} /> : <Record work={work} wide={wide} />}
            </div>
        );
    });

    // Reviews with no project pinned fill the cells left at the end.
    testimonials
        .filter((t) => !used.has(t))
        .forEach((item, i) => {
            cells.push(
                <div key={`review-${i}`}>
                    <TestimonialCard item={item} />
                </div>
            );
        });

    return (
        <div className="grid grid-flow-row-dense grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {cells}
        </div>
    );
}
