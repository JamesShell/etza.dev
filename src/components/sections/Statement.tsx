'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { profile } from '@/content/profile';
import { clickEvent } from '@/lib/analytics';

/**
 * The opening cell. No hero image, no badge, no gradient — the claim itself,
 * then straight into the work. The page's one orchestrated moment lives here.
 *
 * Two ways forward and only two: one filled button for the main action, one
 * plain link for the lighter one. A second filled button would make them
 * compete for the same click.
 */
export function Statement() {
    const reduce = useReducedMotion();

    const rise = (delay: number) =>
        reduce
            ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
            : {
                initial: { opacity: 0, y: 14 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
            };

    return (
        <div className="pb-14 pt-2 md:pb-20 md:pt-6">
            <motion.h1
                {...rise(0.05)}
                className="max-w-[17ch] font-display text-[clamp(34px,5vw,58px)] font-medium leading-[1.08] tracking-[-0.04em] text-chalk"
            >
                {profile.statement.greeting}{' '}
                {/* The claim carries the weight, so the introduction steps back */}
                <span className="text-ash">{profile.statement.descriptor}</span>
            </motion.h1>

            <motion.p
                {...rise(0.18)}
                className="mt-7 max-w-[52ch] font-sans text-[16px] leading-relaxed text-ash md:text-[17px]"
            >
                {profile.statement.support}
            </motion.p>

            <motion.ul
                {...rise(0.28)}
                className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-sans text-[13px] text-dust md:text-[14px]"
            >
                {profile.proof.map((item, i) => (
                    <li key={item} className="flex items-baseline gap-3">
                        {i > 0 && <span aria-hidden="true">·</span>}
                        {item}
                    </li>
                ))}
            </motion.ul>

            <motion.div {...rise(0.36)} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Link
                    href="/pricing"
                    onClick={() => clickEvent({ action: 'open_pricing', category: 'engagement', label: 'Hero' })}
                    className="press rounded-full bg-chalk px-5 py-2.5 text-[14px] font-medium text-void hover:opacity-90"
                >
                    Get an estimate
                </Link>
                <Link
                    href="/book"
                    onClick={() => clickEvent({ action: 'click_book_call', category: 'conversion', label: 'Hero' })}
                    className="group inline-flex items-baseline gap-2 text-[14px] text-ash transition-colors hover:text-chalk"
                >
                    Book a 30-minute call
                    <ArrowRight
                        size={14}
                        aria-hidden="true"
                        className="self-center transition-transform duration-300 group-hover:translate-x-1"
                    />
                </Link>
            </motion.div>
        </div>
    );
}
