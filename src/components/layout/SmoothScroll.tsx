'use client';

import React from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * The page glides to rest under the wheel instead of stepping with each
 * notch — the same long settle as the home row's spring and the text rising
 * in, so scrolling an inner page moves the way everything else on the site
 * does. The scroll itself stays native (Lenis only eases where it's set), so
 * framer's useScroll, the CSS view() reveals and Next's scroll restoration
 * all keep reading the real position.
 *
 * Wheel only: touch keeps the platform's own momentum, which no easing beats.
 * Off for anyone who has asked for less motion, and on /admin, where tables
 * and editors want a scroll that does exactly what it's told.
 *
 * Anything that scrolls on its own inside the page opts out with a
 * data-lenis-prevent attribute: the menu (data-lenis-prevent), and the
 * sideways rows (data-lenis-prevent-horizontal), so a trackpad swipe across
 * them still moves them rather than the page.
 */
export function SmoothScroll() {
    const reduce = useReducedMotion();
    const pathname = usePathname();
    const admin = pathname.startsWith('/admin');
    const lenis = React.useRef<Lenis | null>(null);

    React.useEffect(() => {
        if (reduce || admin) return;

        const instance = new Lenis({
            // A touch softer than the default, toward the site's
            // cubic-bezier(0.16, 1, 0.3, 1): quick to answer, slow to land.
            lerp: 0.09,
            autoRaf: true,
            // A glide still running when a link is clicked would carry on
            // into the next page and drag it off the top.
            stopInertiaOnNavigate: true,
        });
        lenis.current = instance;

        // The menu and the first-visit loader hold the page still by hiding
        // the body's overflow. Lenis is paused alongside, or it would keep
        // counting wheel input it can't apply and jump by all of it after.
        const body = document.body;
        const sync = () => (body.style.overflow === 'hidden' ? instance.stop() : instance.start());
        sync();
        const observer = new MutationObserver(sync);
        observer.observe(body, { attributes: true, attributeFilter: ['style'] });

        return () => {
            observer.disconnect();
            instance.destroy();
            lenis.current = null;
        };
    }, [reduce, admin]);

    // Next puts the new page at the top (or back where it was) itself; this
    // drops any glide left over from the old one, for navigation that didn't
    // start from a link — the back button, a router.push.
    React.useEffect(() => {
        const l = lenis.current;
        // Stopping clears the glide; a paused instance has none to clear.
        if (l && !l.isStopped) {
            l.stop();
            l.start();
        }
    }, [pathname]);

    return null;
}
