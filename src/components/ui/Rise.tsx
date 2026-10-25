'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSiteReady } from '@/components/ui/SiteReady';

/**
 * The site's one text motion, in three uses: words rising out of masks as a
 * title or paragraph arrives, a single line doing the same, and the hover roll
 * on links — the word lifting out of its mask while an identical one rises in
 * under it. Same mask, same ease, everywhere.
 *
 * Each mask carries a little bottom padding with a matching negative margin,
 * so descenders have room inside it without the line moving.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const MASK = 'inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]';

const TAGS = {
    h1: motion.h1,
    h2: motion.h2,
    p: motion.p,
    blockquote: motion.blockquote,
    span: motion.span,
} as const;

/**
 * Words rising one after another out of their own masks — on mount, or with
 * `inView` the first time they scroll into view. Long text staggers faster,
 * so a paragraph lands in about the time a title does instead of trickling.
 */
export function RiseText({
    text,
    as = 'p',
    className = '',
    delay = 0.2,
    inView = false,
}: {
    text: string;
    as?: keyof typeof TAGS;
    className?: string;
    delay?: number;
    inView?: boolean;
}) {
    const reduce = useReducedMotion();
    const ready = useSiteReady();
    const Tag = TAGS[as];
    const words = text.split(' ');
    const stagger = Math.min(0.06, 0.9 / words.length);

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } },
    };
    const word = reduce
        ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
        : { hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 1, ease: EASE } } };

    // On mount, it waits for the page to be showing (see SiteReady), so a
    // title doesn't rise unseen behind the first-visit loader.
    const trigger = inView
        ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } }
        : { animate: ready ? 'show' : 'hidden' };

    return (
        <Tag className={className} variants={container} initial="hidden" {...trigger}>
            {words.map((w, i) => (
                <React.Fragment key={i}>
                    <span className={MASK}>
                        <motion.span variants={word} className="inline-block">
                            {w}
                        </motion.span>
                    </span>
                    {i < words.length - 1 ? ' ' : null}
                </React.Fragment>
            ))}
        </Tag>
    );
}

/**
 * One line (or one short block) rising out of a single mask: for menu links,
 * labels and captions. On mount by default, or with `inView` the first time it
 * scrolls into view. With `play` off it renders still — for the second and
 * later visits to a page whose entrance has already been seen.
 */
export function RiseIn({
    children,
    delay = 0,
    inView = false,
    play = true,
    block = false,
}: {
    children: React.ReactNode;
    delay?: number;
    inView?: boolean;
    play?: boolean;
    /** Mask a whole block (a caption, a stacked name) rather than an inline line. */
    block?: boolean;
}) {
    const reduce = useReducedMotion();
    const ready = useSiteReady();
    // A block mask is a div, so it can hold paragraphs; an inline one is a span.
    const Mask = block ? 'div' : 'span';
    const Inner = block ? motion.div : motion.span;
    const mask = block ? 'overflow-hidden pb-[0.12em] -mb-[0.12em]' : MASK;
    const inner = block ? '' : 'inline-block';
    if (!play) {
        const Still = block ? 'div' : 'span';
        return (
            <Mask className={mask}>
                <Still className={inner}>{children}</Still>
            </Mask>
        );
    }

    const from = reduce ? { opacity: 0 } : { y: '105%' };
    const to = reduce ? { opacity: 1 } : { y: '0%' };
    return (
        <Mask className={mask}>
            <Inner
                className={inner}
                initial={from}
                {...(inView
                    ? { whileInView: to, viewport: { once: true, margin: '0px 0px -10% 0px' } }
                    : { animate: ready ? to : from })}
                transition={reduce ? { duration: 0.3 } : { duration: 0.9, delay, ease: EASE }}
            >
                {children}
            </Inner>
        </Mask>
    );
}

/**
 * Everything that isn't a line of large type, arriving as it scrolls in.
 *
 * `text`: settles up into place while coming into focus — quieter than the
 * word-by-word rise, which is kept for the large lines.
 * `media`: opens from its middle outwards, the way the home cards first
 * appear, with the picture easing back from a slight zoom inside the opening.
 */
export function Reveal({
    children,
    kind = 'text',
    delay = 0,
    className = '',
}: {
    children: React.ReactNode;
    kind?: 'text' | 'media';
    delay?: number;
    className?: string;
}) {
    const reduce = useReducedMotion();
    const viewport = { once: true, margin: '0px 0px -10% 0px' };

    if (reduce) {
        return (
            <motion.div
                className={className}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewport}
                transition={{ duration: 0.4 }}
            >
                {children}
            </motion.div>
        );
    }

    if (kind === 'media') {
        return (
            <motion.div
                className={`overflow-hidden ${className}`}
                initial={{ clipPath: 'inset(50% 0% 50% 0%)' }}
                whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                viewport={viewport}
                transition={{ duration: 1.3, delay, ease: EASE }}
            >
                <motion.div
                    initial={{ scale: 1.12 }}
                    whileInView={{ scale: 1 }}
                    viewport={viewport}
                    transition={{ duration: 1.6, delay, ease: EASE }}
                >
                    {children}
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={viewport}
            transition={{ duration: 1, delay, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}

/**
 * The hover roll. Put it inside an element with `group`: when the group is
 * hovered or focused, each word lifts out of its mask as its copy rises in
 * from below, a beat apart. Both copies share one grid cell, so the mask is
 * exactly one line tall and each moves by exactly its own height. Pure CSS;
 * the copy is hidden from assistive tech so the name is read once.
 */
export function RollText({ text, delay = 0 }: { text: string; /** ms before this text's roll starts. */ delay?: number }) {
    const words = text.split(' ');
    const move = 'transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none';

    return (
        <span className="inline-block">
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {words.map((w, i) => (
                    <React.Fragment key={i}>
                        <span className="inline-grid overflow-hidden align-bottom -mb-[0.12em]">
                            <span
                                className={`col-start-1 row-start-1 pb-[0.12em] ${move} group-hover:-translate-y-full group-focus-visible:-translate-y-full`}
                                style={{ transitionDelay: `${delay + i * 40}ms` }}
                            >
                                {w}
                            </span>
                            <span
                                className={`col-start-1 row-start-1 translate-y-full pb-[0.12em] ${move} group-hover:translate-y-0 group-focus-visible:translate-y-0`}
                                style={{ transitionDelay: `${delay + i * 40}ms` }}
                            >
                                {w}
                            </span>
                        </span>
                        {i < words.length - 1 ? ' ' : null}
                    </React.Fragment>
                ))}
            </span>
        </span>
    );
}
