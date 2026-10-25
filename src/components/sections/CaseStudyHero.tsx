'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BarSpace } from '@/components/layout/SiteHeader';
import { WorkCover } from '@/components/work/WorkCover';
import { RiseText } from '@/components/ui/Rise';
import { useSiteReady } from '@/components/ui/SiteReady';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Small upper-case chrome, the same voice as the bar. */
const chrome = 'text-[11px] uppercase leading-[1.45] tracking-[0.06em]';

/**
 * The first screen of a case study, on the home page's four columns: the bar,
 * the project's name set as large as the left half allows and sat on the
 * bottom edge, the facts under it in the bar's small capitals, and the
 * project's cover filling the right half.
 *
 * The cover is the home card's, drawn by the same component and carrying the
 * view-transition name, so arriving from the home page it grows out of the
 * card that was clicked. The words come in behind it — timed to land as the
 * cover settles, not to compete with it on the way in.
 */
export function CaseStudyHero({
    href,
    title,
    facts,
    scope,
    cover,
}: {
    /** This page's address: the home card's cover finds its way here by it. */
    href: string;
    title: string;
    /** Left column of facts: who it was for, when. */
    facts: string[];
    /** Right column: what was done. */
    scope: string[];
    cover: { image: string; backdrop: string | null; full: boolean; alt: string };
}) {
    const reduce = useReducedMotion();
    // Waits for the page to be showing, like the title above it.
    const ready = useSiteReady();
    const fade = (delay: number) =>
        reduce
            ? { initial: { opacity: 0 }, animate: { opacity: ready ? 1 : 0 }, transition: { duration: 0.3 } }
            : {
                initial: { opacity: 0, y: 10 },
                animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
                transition: { duration: 0.8, delay, ease: EASE },
            };

    return (
        <section className="flex flex-col lg:h-svh">
            <BarSpace />

            {/* Fades on the way out; the bar above it stays where it is. */}
            <div
                data-fade-on-leave
                className="grid flex-1 grid-cols-1 gap-x-5 px-5 pb-5 pt-16 md:grid-cols-4 md:px-8 lg:min-h-0 lg:pb-8 lg:pt-6"
            >
                <div className="flex flex-col justify-end md:col-span-2">
                    <RiseText
                        as="h1"
                        text={title}
                        className="max-w-[12ch] font-display text-[clamp(52px,7.6vw,148px)] font-normal leading-[0.92] tracking-[-0.055em] text-chalk"
                    />

                    <motion.div {...fade(0.5)} className={`mt-10 grid grid-cols-2 gap-5 md:mt-14 ${chrome} text-chalk`}>
                        <p>
                            {facts.map((f) => (
                                <span key={f} className="block">
                                    {f}
                                </span>
                            ))}
                        </p>
                        <p>
                            {scope.map((s) => (
                                <span key={s} className="block">
                                    {s}
                                </span>
                            ))}
                        </p>
                    </motion.div>
                </div>

                <div className="mt-10 md:col-span-2 lg:mt-0 lg:min-h-0">
                    <WorkCover
                        data-hero-cover={href}
                        image={cover.image}
                        backdrop={cover.backdrop}
                        full={cover.full}
                        alt={cover.alt}
                        priority
                        className="aspect-square w-full lg:aspect-auto lg:h-full"
                    />
                </div>
            </div>
        </section>
    );
}
