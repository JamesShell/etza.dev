import type { MouseEvent } from 'react';

type Router = { push: (href: string) => void };

/** The cover's flight into the hero: an ease-out, so it moves the instant it can. */
const FLIGHT = { duration: 800, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };

/** Give up on the hero after this long (ms) — a failed navigation must not strand the copy. */
const GIVE_UP = 10000;

/**
 * Resolves with the incoming hero cover once it's on the page. Matched by the
 * page it belongs to: moving between case studies, the outgoing hero is still
 * on the page — and React may reuse its element for the incoming one.
 */
function waitForHero(href: string, timeout: number): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
        let done = false;
        const finish = (hero: HTMLElement | null) => {
            if (done) return;
            done = true;
            observer.disconnect();
            window.clearTimeout(timer);
            resolve(hero);
        };
        const check = () => {
            const hero = document.querySelector<HTMLElement>(`[data-hero-cover="${CSS.escape(href)}"]:not([data-ghost])`);
            if (hero) finish(hero);
        };
        const observer = new MutationObserver(check);
        observer.observe(document.body, { childList: true, subtree: true });
        const timer = window.setTimeout(() => finish(null), timeout);
        check();
    });
}

/** Two frames: long enough for the new page's layout to settle before it's measured. */
const settle = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

const box = (r: DOMRect) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });

/**
 * Click handler for a link whose cover should become the next page's hero.
 *
 * Done by hand rather than with the View Transitions API on purpose. A view
 * transition freezes the screen on a still of the old page until the new one
 * is ready, so any wait — a cold page, a slow connection, the dev server —
 * reads as the site locking up, and capping that wait means dropping the
 * morph. Here nothing freezes: a copy of the cover lifts off at exactly its
 * place the moment it's clicked, the rest of the page fades away under it,
 * and the page stays live while the case study loads. When the hero arrives,
 * the copy grows into its exact box and hands over to it.
 *
 * The copy is the same cover component, so as its box grows the backdrop and
 * the framed screen inside it reflow the way the hero lays them out — it
 * grows into the picture it's about to become rather than stretching.
 *
 * Plain left clicks only — a modified click (new tab, new window) is left to
 * the browser, and so is reduced motion: the Link then navigates the ordinary
 * way, so nothing depends on this working. Returns whether it took over, so
 * the page being left can play its own exit alongside.
 */
export function navigateWithCover(
    e: MouseEvent<HTMLElement>,
    href: string,
    cover: HTMLElement | null,
    router: Router
): boolean {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (!cover || typeof Element.prototype.animate !== 'function') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

    e.preventDefault();

    const root = document.documentElement;
    const from = cover.getBoundingClientRect();

    // The copy: the cover as it looks right now, pinned over its own place.
    // Anything laid over it (the review) stays behind.
    const ghost = cover.cloneNode(true) as HTMLElement;
    ghost.setAttribute('data-ghost', '');
    ghost.removeAttribute('data-hero-cover');
    ghost.querySelectorAll('[data-review]').forEach((n) => n.remove());
    Object.assign(ghost.style, {
        position: 'fixed',
        ...box(from),
        margin: '0',
        zIndex: '60',
        pointerEvents: 'none',
        contain: 'layout paint',
        aspectRatio: 'auto',
    });
    // Cloned videos don't carry their playback over: pick up where it was.
    const sources = cover.querySelectorAll('video');
    ghost.querySelectorAll('video').forEach((v, i) => {
        v.muted = true;
        v.currentTime = sources[i]?.currentTime ?? 0;
        v.play().catch(() => {});
    });
    document.body.appendChild(ghost);

    // Everything marked to fade on the way out goes, so the cover is left
    // alone on the page while the next one loads.
    root.dataset.coverLeaving = '';

    const cleanUp = () => {
        ghost.remove();
        delete root.dataset.coverLeaving;
    };

    router.push(href);

    waitForHero(href, GIVE_UP).then(async (hero) => {
        if (!hero) return cleanUp();
        // The new page is in: let it fade up around the copy now, rather than
        // holding it blank until the copy lands. The real hero waits
        // underneath until the copy has landed on it.
        delete root.dataset.coverLeaving;
        hero.style.visibility = 'hidden';
        await settle();
        const to = hero.getBoundingClientRect();
        const at = ghost.getBoundingClientRect();

        // FLIP: give the copy the hero's box once — so its backdrop and
        // framed screen lay out at the size they're about to be, and stay
        // crisp — then start it scaled back down over where it is. From there
        // only `transform` animates, which the browser runs off the main
        // thread: the flight stays smooth while the new page starts up.
        Object.assign(ghost.style, { ...box(to), transformOrigin: '0 0', willChange: 'transform' });
        const sx = at.width / to.width;
        const sy = at.height / to.height;
        const start = `translate(${at.left - to.left}px, ${at.top - to.top}px) scale(${sx}, ${sy})`;
        const flight = ghost.animate([{ transform: start }, { transform: 'none' }], { ...FLIGHT, fill: 'forwards' });
        await flight.finished.catch(() => {});
        hero.style.visibility = '';
        // One frame for the hero to paint, then the copy goes.
        requestAnimationFrame(cleanUp);
    });

    return true;
}
