'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { profile } from '@/content/profile';

/**
 * The opening cell. No hero image, no badge, no gradient — the claim itself,
 * then straight into the work. The page's one orchestrated moment lives here.
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
        </div>
    );
}
