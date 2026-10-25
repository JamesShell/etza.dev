'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { markSiteReady } from '@/components/ui/SiteReady';
import { LOADED_KEY } from '@/lib/loader';

/** Shown for at least this long, so a fast load reads as a beat, not a flicker. */
const MIN_MS = 600;
/**
 * And never longer than this, whatever is still on its way. Kept short on
 * purpose: every second a visitor watches a loader is a second they can leave.
 */
const MAX_MS = 2500;
/** How often (ms) the loader looks again at what's on screen. */
const POLL_MS = 150;

/** Whether an image or video can be painted (or has failed, which counts as settled). */
function painted(el: HTMLImageElement | HTMLVideoElement) {
    if (el instanceof HTMLImageElement) return el.complete;
    return el.readyState >= 2 || el.error !== null;
}

function inView(el: Element) {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth;
}

/**
 * A lazy image the browser hasn't started on is waiting to be revealed — by
 * an entrance this loader is holding back — so it isn't waited for: that
 * would be a wait on itself.
 */
function waiting(el: HTMLImageElement | HTMLVideoElement) {
    return el instanceof HTMLImageElement && el.loading === 'lazy' && !el.complete && !el.currentSrc;
}

/**
 * The home page's first-visit loader: a white screen with the percentage and
 * a thin bar running along the bottom edge, nothing else. It waits for what
 * the first screen shows — the pictures and videos in view, and the fonts —
 * then fades away, and the page's entrance plays as it goes.
 *
 * Shown as little as possible, because a loader costs visitors: only on the
 * home page (a visitor landing on a case study or the contact page goes
 * straight in), only once per session (the root layout's inline script marks
 * <html> before first paint on later loads, and its inline style hides this),
 * and for 0.6–2.5 seconds at most.
 */
export function SiteLoader() {
    const pathname = usePathname();
    const reduce = useReducedMotion();
    // Read once: only a visit that starts on the home page gets the loader.
    const [onHome] = React.useState(() => pathname === '/');
    const [phase, setPhase] = React.useState<'loading' | 'leaving' | 'gone'>(onHome ? 'loading' : 'gone');
    const count = React.useRef<HTMLSpanElement>(null);
    const bar = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const root = document.documentElement;
        if (!onHome || 'loaded' in root.dataset) {
            markSiteReady();
            if (onHome) {
                const id = requestAnimationFrame(() => setPhase('gone'));
                return () => cancelAnimationFrame(id);
            }
            return;
        }

        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';

        const start = performance.now();
        let target = 0;
        let shown = 0;
        let finished = false;
        let raf = 0;

        // What's on screen is looked at again every few frames rather than
        // once: the page is still settling after it mounts (the home row
        // moves to its starting copy), and a single early look would wait on
        // media that is about to leave the screen.
        let fontsIn = false;
        let settledLooks = 0;
        (document.fonts?.ready ?? Promise.resolve()).then(() => {
            fontsIn = true;
        });
        const look = () => {
            const media = [
                ...Array.from(document.images),
                ...Array.from(document.querySelectorAll('video')),
            ].filter((el) => inView(el) && !waiting(el));
            const done = media.filter(painted).length + (fontsIn ? 1 : 0);
            target = done / (media.length + 1);
            // Two looks in a row with everything in, so a picture swapped in
            // between looks can't slip past.
            settledLooks = target >= 1 ? settledLooks + 1 : 0;
            if (settledLooks >= 2 || performance.now() - start > MAX_MS) {
                finished = true;
                target = 1;
                window.clearInterval(poll);
            }
        };
        const poll = window.setInterval(look, POLL_MS);

        // The counter and bar ease toward real progress, never faster than
        // the minimum time allows, and reach 100 only once everything's in.
        const tick = (now: number) => {
            const floor = Math.min(1, (now - start) / MIN_MS);
            shown += (Math.min(target, floor) * 100 - shown) * 0.18;
            if (count.current) count.current.textContent = String(Math.round(shown));
            if (bar.current) bar.current.style.transform = `scaleX(${shown / 100})`;
            if (finished && floor >= 1 && shown > 99.5) {
                if (count.current) count.current.textContent = '100';
                if (bar.current) bar.current.style.transform = 'scaleX(1)';
                try {
                    sessionStorage.setItem(LOADED_KEY, '1');
                } catch {}
                document.body.style.overflow = overflow;
                // The page's entrance starts as the loader starts to go.
                markSiteReady();
                setPhase('leaving');
                return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            window.clearInterval(poll);
            cancelAnimationFrame(raf);
            document.body.style.overflow = overflow;
        };
    }, [onHome]);

    if (phase === 'gone') return null;

    const leaving = phase === 'leaving';

    return (
        <motion.div
            data-site-loader
            role="status"
            aria-live="polite"
            aria-label={leaving ? 'Loaded' : 'Loading'}
            initial={false}
            animate={leaving ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: reduce ? 0.2 : 0.6, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={() => {
                if (leaving) setPhase('gone');
            }}
            className="fixed inset-0 z-[70] bg-void"
        >
            <span
                ref={count}
                className="tabular absolute bottom-6 left-5 font-display text-[clamp(56px,9vw,160px)] font-normal leading-[0.85] tracking-[-0.06em] text-chalk md:bottom-8 md:left-8"
            >
                0
            </span>
            {/* The bar runs the full width along the bottom edge. Scaled
                rather than resized, so it costs a composite, not a layout. */}
            <div
                ref={bar}
                className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-chalk"
                style={{ transform: 'scaleX(0)' }}
            />
        </motion.div>
    );
}
