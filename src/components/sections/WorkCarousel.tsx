'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    useVelocity,
    type MotionValue,
} from 'framer-motion';
import { clickEvent } from '@/lib/analytics';
import { navigateWithCover } from '@/lib/cover-transition';
import { WorkCover } from '@/components/work/WorkCover';
import { RiseIn } from '@/components/ui/Rise';
import { useSiteReady } from '@/components/ui/SiteReady';

export type CarouselItem = {
    id: string;
    href: string | null;
    image: string;
    /** A photo for the cover to sit on. Null falls back to the grey backdrop. */
    backdrop: string | null;
    /** The media fills the card, with no frame and no backdrop. */
    full: boolean;
    name: string;
    discipline: string | null;
    year: string | null;
    wide: boolean;
    /** The client's words about this project, shown on the card at rest. */
    review: { quote: string; author: string; detail: string | null } | null;
};

/**
 * The image's edge length on desktop, derived from the viewport height so the
 * bar and a full row of cards fit on one screen with open space between them.
 * The 380px is the bar, that gap, the caption and the bottom margin.
 */
const MEDIA = 'clamp(240px, calc(100svh - 380px), 660px)';

/**
 * How far (px) new input has to send the row before a review gets out of the
 * way. Under it, a nudge leaves it in place — a review that blinks out at the
 * slightest touch of a trackpad reads as a glitch, not a response.
 */
const HIDE_DISTANCE = 120;
const HIDE_DISTANCE_TOUCH = 40;

/** How long (ms) input has to pause before it counts as finished. */
const INPUT_IDLE = 150;

/** How hard the cards pull in at full speed, and the speed (px/s) that counts as full. */
const SHRINK = 0.075;
const TOP_SPEED = 2600;

/** Keeps a position inside one copy of the row: [0, w). */
const wrap = (v: number, w: number) => ((v % w) + w) % w;

function useDesktop() {
    const [desktop, setDesktop] = React.useState(false);
    React.useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const update = () => setDesktop(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);
    return desktop;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The client's words, laid over the cover of whichever card the row comes to
 * rest on. Nearly white, with just enough frost that the work still reads
 * through the edges of it.
 *
 * It arrives in three beats: the panel lifts in on a spring while coming into
 * focus, the quote follows word by word, and the name settles last. It leaves
 * in one quick beat — the moment the row moves, it's out of the way.
 */
function ReviewPanel({ review }: { review: NonNullable<CarouselItem['review']> }) {
    const reduce = useReducedMotion();

    const panel = reduce
        ? { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }
        : {
            hidden: { opacity: 0, y: 28, scale: 0.96, filter: 'blur(10px)' },
            show: {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                transition: {
                    type: 'spring' as const,
                    stiffness: 340,
                    damping: 30,
                    mass: 0.8,
                    staggerChildren: 0.009,
                    delayChildren: 0.05,
                },
            },
            exit: { opacity: 0, y: 14, scale: 0.98, filter: 'blur(6px)', transition: { duration: 0.2, ease: 'easeIn' as const } },
        };

    const word = reduce
        ? { hidden: {}, show: {} }
        : {
            hidden: { opacity: 0, y: 6, filter: 'blur(4px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.32, ease: EASE } },
        };

    const words = `“${review.quote}”`.split(' ');

    return (
        <motion.div
            aria-hidden="true"
            data-review
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute inset-x-3 bottom-3 z-10 bg-void/[0.92] backdrop-blur-xl backdrop-saturate-150 rounded-[clamp(8px,0.9vw,14px)] p-4 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)] lg:inset-x-5 lg:bottom-5 lg:p-5"
        >
            <p className="text-[13px] leading-[1.5] tracking-[-0.005em] text-chalk lg:text-[clamp(13px,0.95vw,15px)]">
                {words.map((w, i) => (
                    <React.Fragment key={i}>
                        <motion.span variants={word} className="inline-block">
                            {w}
                        </motion.span>{' '}
                    </React.Fragment>
                ))}
            </p>
            <motion.p
                variants={word}
                className="mt-3 flex items-baseline justify-between gap-3 text-[11px] uppercase leading-[1.4] tracking-[0.06em]"
            >
                <span className="truncate text-chalk">{review.author}</span>
                {review.detail && <span className="shrink-0 text-dust">{review.detail}</span>}
            </motion.p>
        </motion.div>
    );
}

/** The exit's ease: firm at both ends, like a shutter. */
const SHUTTER = 'cubic-bezier(0.65, 0, 0.35, 1)';

/**
 * The row's exit, as a card's cover flies off into its case study: every
 * other cover on screen closes back into its middle — the entrance run
 * backwards — and every caption fades, the opened card's too, since its name
 * and details belong to this page rather than the one it's going to.
 *
 * Driven on the DOM with the browser's own animations rather than through
 * React state: a click then re-renders nothing, and only the three or four
 * cards actually on screen animate, not the copies the loop keeps off it.
 */
function closeRow(opened: HTMLElement) {
    const width = window.innerWidth;
    document.querySelectorAll<HTMLElement>('#work li').forEach((li) => {
        const r = li.getBoundingClientRect();
        if (r.right < 0 || r.left > width) return;
        li.querySelectorAll<HTMLElement>('[data-card-caption]').forEach((c) =>
            c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' })
        );
        if (li.contains(opened)) return;
        const timing = { duration: 700, easing: SHUTTER, fill: 'forwards' as const };
        li.querySelector('[data-card-clip]')?.animate(
            [{ clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(50% 0% 50% 0%)' }],
            timing
        );
        li.querySelector('[data-card-zoom]')?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }], timing);
    });
}

/**
 * One project: the cover edge to edge, then the name with the year in brackets
 * opposite, and what was done on the line under it — both lines the same size
 * and weight, so the caption reads as one statement. No tile around it: the
 * cover's own edge is the only frame.
 *
 * `ghost` marks the copies the loop adds either side of the real row. They
 * still click through, but stay out of the tab order and the accessibility
 * tree, so the list is announced once.
 */
function WorkCard({
    item,
    scale,
    ghost,
    priority,
    copy,
    active,
    itemKey,
    enter,
}: {
    item: CarouselItem;
    scale: MotionValue<number> | number;
    ghost: boolean;
    priority: boolean;
    /** Set on the first card of each copy, which is what the loop measures. */
    copy?: number;
    /** The row has come to rest with this card in the middle. */
    active: boolean;
    itemKey: string;
    /** When set, the card's entrance starts this many seconds in. */
    enter?: number;
}) {
    const width = item.wide ? `calc(${MEDIA} * 4 / 3)` : MEDIA;
    const alt = `${item.name}${item.discipline ? ` — ${item.discipline}` : ''}`;
    const router = useRouter();
    const reduce = useReducedMotion();

    const play = enter !== undefined;
    // The entrance waits for the page to be showing (see SiteReady).
    const ready = useSiteReady();
    const shut = { clipPath: 'inset(50% 0% 50% 0%)' };
    const open = { clipPath: 'inset(0% 0% 0% 0%)' };

    // The entrance: the cover opens from its middle outwards — a clip, so
    // nothing around it moves — while the picture inside eases back from a
    // slight zoom. Then the caption rises in, line by line.
    //
    // The exit is the same move run backwards (see `closeRow`), driven on the
    // DOM directly rather than through state, so a click re-renders nothing.
    const media = (
        <motion.div
            data-card-clip
            initial={play && !reduce ? shut : false}
            animate={play && !reduce && !ready ? shut : open}
            transition={{ duration: 1.4, delay: enter, ease: EASE }}
        >
            <motion.div
                data-card-zoom
                initial={play && !reduce ? { scale: 1.1 } : false}
                animate={{ scale: play && !reduce && !ready ? 1.1 : 1 }}
                transition={{ duration: 1.8, delay: enter, ease: EASE }}
            >
                <WorkCover
                    image={item.image}
                    backdrop={item.backdrop}
                    full={item.full}
                    alt={alt}
                    priority={priority}
                    className="aspect-square w-full lg:aspect-auto lg:h-[var(--media)]"
                >
                    <AnimatePresence>{active && item.review && <ReviewPanel review={item.review} />}</AnimatePresence>
                </WorkCover>
            </motion.div>
        </motion.div>
    );

    // The name sits above the cover, as on the reference; what was done and
    // when sit under it, just past the row's clipped bottom edge. On hover or
    // focus the whole card slides up by that line's height to show them.
    // Below lg there's no hover to wait for, so they're simply shown.
    const caption = 'font-display text-[17px] font-medium leading-[1.3] tracking-[-0.02em] text-chalk lg:text-[clamp(17px,1.3vw,22px)]';
    const details = [item.discipline, item.year ? `(${item.year})` : null].filter(Boolean);

    const body = (
        <>
            <div data-card-caption className={`pb-3 lg:pb-4 ${caption}`}>
                <RiseIn block play={play} delay={(enter ?? 0) + 0.3}>
                    <h3 className="truncate">{item.name}</h3>
                </RiseIn>
            </div>
            {media}
            {details.length > 0 && (
                <div data-card-caption className={`pt-3 lg:h-[var(--details-h)] lg:pt-4 ${caption}`}>
                    <RiseIn block play={play} delay={(enter ?? 0) + 0.5}>
                        <div className="flex items-baseline justify-between gap-4">
                            <p className="truncate">{item.discipline}</p>
                            {item.year && <span className="tabular shrink-0">({item.year})</span>}
                        </div>
                    </RiseIn>
                </div>
            )}
        </>
    );

    const shell =
        'group block w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[var(--card-w)] lg:translate-y-[var(--details-h)] lg:transition-transform lg:duration-[700ms] lg:ease-[cubic-bezier(0.16,1,0.3,1)] lg:hover:translate-y-0 lg:focus-visible:translate-y-0 motion-reduce:transition-none';
    const style = { '--card-w': width } as React.CSSProperties;

    return (
        // `relative` keeps the screen-reader copy of the review (absolutely
        // positioned, as sr-only is) inside the row's scroller. Without it, on
        // phones it escapes to the page and widens it to the whole row.
        <motion.li
            // Shrinks toward its bottom edge, not its centre: the details sit
            // just past the row's clipped bottom, and a card pulling in toward
            // its middle would lift them into view while it moves.
            style={{ scale, originY: 1 }}
            className="relative shrink-0"
            aria-hidden={ghost || undefined}
            data-copy={copy}
            data-key={itemKey}
        >
            {item.href ? (
                <Link
                    href={item.href}
                    // Load the case study the moment a click becomes likely, so
                    // the cover transition isn't left holding a frozen frame
                    // while the next page arrives.
                    onPointerEnter={() => router.prefetch(item.href!)}
                    onFocus={() => router.prefetch(item.href!)}
                    tabIndex={ghost ? -1 : undefined}
                    draggable={false}
                    onClick={(e) => {
                        clickEvent({
                            action: 'view_case_study',
                            category: 'engagement',
                            label: `Work card: ${item.name}`,
                        });
                        // The cover grows into the case study's hero, and the
                        // rest of the row closes up behind it.
                        const took = navigateWithCover(
                            e,
                            item.href!,
                            e.currentTarget.querySelector<HTMLElement>('[data-cover]'),
                            router
                        );
                        if (took) closeRow(e.currentTarget);
                    }}
                    className={shell}
                    style={style}
                >
                    {body}
                </Link>
            ) : (
                <div className={shell} style={style}>
                    {body}
                </div>
            )}

            {/* The panel is decoration that comes and goes with the motion;
                the words themselves are always here for a screen reader, once. */}
            {!ghost && item.review && (
                <figure className="sr-only">
                    <blockquote>{item.review.quote}</blockquote>
                    <figcaption>
                        {item.review.author}
                        {item.review.detail && `, ${item.review.detail}`}
                    </figcaption>
                </figure>
            )}
        </motion.li>
    );
}

/**
 * The home page as one fixed screen with an endless row of work.
 *
 * The row is rendered as several identical copies laid end to end, and the
 * position is wrapped into one copy's width, so moving past the last project
 * lands back on the first without a seam — there is no end to scroll to.
 *
 * Desktop: the page itself never scrolls. The wheel (either axis), a drag, or
 * the arrow keys move a target position, and the row follows it through a
 * spring, so it glides and settles rather than tracking the wheel's steps.
 * While it's moving the cards pull in slightly and ease back out at rest.
 *
 * Below `lg`: a native horizontal swipe with snap points, quietly re-centred
 * onto the middle copy whenever it comes to rest, so it loops too.
 *
 * `children` is everything above the row, so it shares the fixed stage.
 */
export function WorkCarousel({
    items,
    children,
}: {
    items: CarouselItem[];
    children: React.ReactNode;
}) {
    const reduce = useReducedMotion();
    const desktop = useDesktop();

    // The home page's entrance plays every time it opens; the first review
    // waits until it has finished — counted from when the page is showing,
    // not from mount, so it doesn't arrive behind the first-visit loader.
    const firstReview = 1700;
    const ready = useSiteReady();


    const viewport = React.useRef<HTMLDivElement>(null);
    const track = React.useRef<HTMLUListElement>(null);
    const [copies, setCopies] = React.useState(3);
    const [period, setPeriod] = React.useState(0);
    const periodMV = useMotionValue(0);

    // One copy's width, measured between the first cards of two neighbouring
    // copies so the gap is counted. Enough copies to cover the screen with one
    // spare on each side, whatever the screen and however few the projects.
    React.useEffect(() => {
        const measure = () => {
            const a = track.current?.querySelector<HTMLElement>('[data-copy="0"]');
            const b = track.current?.querySelector<HTMLElement>('[data-copy="1"]');
            if (!a || !b) return;
            const w = b.offsetLeft - a.offsetLeft;
            if (w <= 0) return;
            setPeriod(w);
            periodMV.set(w);
            setCopies(Math.max(3, 2 + Math.ceil(window.innerWidth / w)));
        };
        measure();
        const ro = new ResizeObserver(measure);
        if (track.current) ro.observe(track.current);
        return () => ro.disconnect();
    }, [periodMV, items.length]);

    // --- Desktop: a virtual position, wrapped into one copy ---

    const target = useMotionValue(0);
    // Settles once within half a pixel: the spring is overdamped, and left to
    // its defaults it creeps the last fraction of a pixel for seconds — motion
    // nobody can see, but enough to keep the row from ever counting as still.
    const smooth = useSpring(target, { stiffness: 70, damping: 22, mass: 0.7, restDelta: 0.5, restSpeed: 2 });
    const travel = reduce ? target : smooth;

    // Shifted back one whole copy, so there's always a copy to the left too.
    const x = useTransform([travel, periodMV], ([t, w]: number[]) => (w ? -(w + wrap(t, w)) : 0));

    // Speed in px/s, read off the spring rather than the raw input so the
    // shrink follows the row's motion, not the wheel's.
    const velocity = useVelocity(travel);
    const pull = useTransform(velocity, (v) => 1 - Math.min(Math.abs(v) / TOP_SPEED, 1) * SHRINK);
    const scale = useSpring(pull, { stiffness: 260, damping: 34 });
    const cardScale = desktop && !reduce ? scale : 1;

    // The card nearest the middle of the screen once the row is still; null
    // while it's moving. Only that card shows its review.
    const [active, setActive] = React.useState<string | null>(null);

    // `ahead` is how much further the row will still travel: the card is
    // picked from where the row is heading, not where it happens to be.
    const pickMiddle = React.useCallback((ahead = 0) => {
        const cards = track.current?.querySelectorAll<HTMLElement>('li[data-key]');
        if (!cards) return;
        const centre = window.innerWidth / 2 + ahead;
        let best: string | null = null;
        let nearest = Infinity;
        cards.forEach((card) => {
            const r = card.getBoundingClientRect();
            const d = Math.abs(r.left + r.width / 2 - centre);
            if (d < nearest) {
                nearest = d;
                best = card.dataset.key ?? null;
            }
        });
        setActive(best);
    }, []);

    // Desktop: driven by the input, not by the row's motion. The spring's
    // glide runs on for most of a second after the last wheel tick, but where
    // it ends is already known — so once input pauses, the card at that
    // destination gets its review straight away and carries it in as it
    // glides into place. New input that sends the row more than a nudge away
    // takes it back out; the glide itself never does, so it can't flicker.
    // The first review shows a beat after load, once the page has had its
    // entrance.
    React.useEffect(() => {
        if (!desktop || !ready) return;
        let restAt = target.get();
        const settle = () => {
            restAt = target.get();
            pickMiddle(target.get() - travel.get());
        };
        let timer = window.setTimeout(settle, firstReview);
        const stop = target.on('change', (v) => {
            if (Math.abs(v - restAt) > HIDE_DISTANCE) setActive(null);
            window.clearTimeout(timer);
            timer = window.setTimeout(settle, INPUT_IDLE);
        });
        return () => {
            stop();
            window.clearTimeout(timer);
        };
    }, [desktop, ready, travel, target, pickMiddle, firstReview]);

    React.useEffect(() => {
        if (!desktop) return;

        // The menu is a full-screen overlay; input meant for it isn't ours.
        const menuOpen = () => Boolean(document.getElementById('site-menu'));

        const onWheel = (e: WheelEvent) => {
            if (menuOpen()) return;
            const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            target.set(target.get() + delta * unit);
        };

        const onKey = (e: KeyboardEvent) => {
            if (menuOpen() || e.altKey || e.metaKey || e.ctrlKey) return;
            const step = window.innerWidth * 0.4;
            const by: Record<string, number> = {
                ArrowRight: step,
                ArrowDown: step,
                PageDown: step * 2,
                ArrowLeft: -step,
                ArrowUp: -step,
                PageUp: -step * 2,
            };
            if (!(e.key in by)) return;
            e.preventDefault();
            target.set(target.get() + by[e.key]);
        };

        window.addEventListener('wheel', onWheel, { passive: true });
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('keydown', onKey);
        };
    }, [desktop, target]);

    // Drag to move, with a little throw on release. A drag that travelled
    // swallows the click at the end of it, so letting go never opens a project.
    const drag = React.useRef<{ x: number; from: number; moved: boolean; t: number; v: number } | null>(null);
    const dragged = React.useRef(false);

    const onPointerDown = (e: React.PointerEvent) => {
        if (!desktop || e.button !== 0) return;
        drag.current = { x: e.clientX, from: target.get(), moved: false, t: e.timeStamp, v: 0 };
        dragged.current = false;
    };

    const onPointerMove = (e: React.PointerEvent) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        if (!d.moved && Math.abs(dx) > 5) {
            d.moved = true;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }
        if (!d.moved) return;
        const next = d.from - dx;
        const dt = Math.max(e.timeStamp - d.t, 1);
        d.v = (next - target.get()) / dt;
        d.t = e.timeStamp;
        target.set(next);
    };

    const onPointerUp = () => {
        const d = drag.current;
        drag.current = null;
        if (!d?.moved) return;
        dragged.current = true;
        target.set(target.get() + d.v * 240);
    };

    const onClickCapture = (e: React.MouseEvent) => {
        if (!dragged.current) return;
        dragged.current = false;
        e.preventDefault();
        e.stopPropagation();
    };

    /**
     * A card reached by Tab may be off screen, where the browser can't scroll
     * to it — the row moves by transform, not by scrolling. So focus moves the
     * row the shortest way round to put that card at the left edge.
     */
    const onFocus = (e: React.FocusEvent<HTMLUListElement>) => {
        if (!desktop || !viewport.current || !track.current || !period) return;
        // Keyboard focus only. A click focuses its link too, and the row
        // lurching sideways under the pointer at the moment of a click would
        // pull the card out from under its own cover as it flies.
        if (!(e.target as HTMLElement).matches(':focus-visible')) return;
        viewport.current.scrollLeft = 0;
        const card = (e.target as HTMLElement).closest('li');
        if (!card) return;
        const gutter = parseFloat(getComputedStyle(track.current).paddingLeft) || 0;
        const want = wrap(card.offsetLeft - gutter - period, period);
        let delta = want - wrap(target.get(), period);
        if (delta > period / 2) delta -= period;
        if (delta < -period / 2) delta += period;
        target.set(target.get() + delta);
    };

    // --- Below lg: native swipe, re-centred onto the middle copy at rest ---

    React.useEffect(() => {
        const vp = viewport.current;
        if (desktop || !vp || !period) return;

        // A jump made here fires a scroll event of its own, which mustn't
        // read as the visitor moving the row again.
        let jumped = false;
        const jump = (to: number) => {
            jumped = true;
            vp.scrollLeft = to;
        };

        jump(period);
        let restAt = period;

        const settle = () => {
            const s = vp.scrollLeft;
            if (s < period * 0.5) jump(s + period);
            else if (s >= period * 1.5) jump(s - period);
            restAt = vp.scrollLeft;
            pickMiddle();
        };

        // `scrollend` where there is one; a short debounce where there isn't.
        const hasEnd = 'onscrollend' in window;
        let timer: number | undefined;
        const onScroll = () => {
            if (jumped) {
                jumped = false;
                return;
            }
            if (Math.abs(vp.scrollLeft - restAt) > HIDE_DISTANCE_TOUCH) setActive(null);
            if (!hasEnd) {
                window.clearTimeout(timer);
                timer = window.setTimeout(settle, 150);
            }
        };

        // Only once the page is showing; positioning the row above doesn't wait.
        const intro = ready ? window.setTimeout(() => pickMiddle(), firstReview) : undefined;
        vp.addEventListener('scroll', onScroll, { passive: true });
        if (hasEnd) vp.addEventListener('scrollend', settle);
        return () => {
            window.clearTimeout(timer);
            window.clearTimeout(intro);
            vp.removeEventListener('scroll', onScroll);
            if (hasEnd) vp.removeEventListener('scrollend', settle);
        };
    }, [desktop, ready, period, pickMiddle, firstReview]);

    return (
        <div
            className="flex min-h-svh flex-col lg:h-svh lg:overflow-hidden"
            // `--details-h` is the line of details under each card: how far a
            // card sits below its place at rest, and how far it rises on hover.
            style={{ '--media': MEDIA, '--details-h': '3rem' } as React.CSSProperties}
        >
            {children}

            {items.length > 0 && (
                <section id="work" className="mt-auto shrink-0 pb-6 pt-16 lg:pb-8">
                    <h2 className="sr-only">Selected work</h2>

                    <div
                        ref={viewport}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                        onClickCapture={onClickCapture}
                        data-lenis-prevent-horizontal
                        className="hide-scrollbar snap-x snap-mandatory overflow-x-auto scroll-px-5 md:scroll-px-8 lg:snap-none lg:touch-pan-y lg:overflow-hidden lg:select-none"
                    >
                        <motion.ul
                            ref={track}
                            onFocus={onFocus}
                            style={desktop ? { x } : undefined}
                            className="flex w-max items-start gap-4 px-5 md:px-8 lg:gap-8 lg:will-change-transform"
                        >
                            {Array.from({ length: copies }, (_, copy) =>
                                items.map((item, i) => (
                                    <WorkCard
                                        key={`${copy}-${item.id}`}
                                        item={item}
                                        scale={cardScale}
                                        ghost={copy !== 1}
                                        priority={copy === 1 && i < 3}
                                        copy={i === 0 ? copy : undefined}
                                        itemKey={`${copy}-${item.id}`}
                                        active={active === `${copy}-${item.id}`}
                                        // After the bar has risen, in reading
                                        // order: the first copy is the one on
                                        // screen at load, so it leads.
                                        enter={0.45 + Math.max(0, (copy - 1) * items.length + i) * 0.09}
                                    />
                                ))
                            )}
                        </motion.ul>
                    </div>
                </section>
            )}
        </div>
    );
}
