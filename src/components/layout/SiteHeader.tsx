'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Star } from '@phosphor-icons/react';
import { profile } from '@/content/profile';
import { clickEvent } from '@/lib/analytics';
import { RiseIn, RollText } from '@/components/ui/Rise';
import { useSiteReady } from '@/components/ui/SiteReady';
import { AsciiOcean } from '@/vendor/ascii-sharks/react';
import type { RenderOptions } from '@/vendor/ascii-sharks/renderer';
import type { SharkSpec } from '@/vendor/ascii-sharks/world';

/**
 * Same places, same order, everywhere they appear: the stacked list in the bar
 * and the full-screen menu both read from this. Booking a call isn't here on
 * purpose: /book is a link handed out directly, not a page the site leads to.
 */
const PAGES = [
    { label: 'Work', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

/** The About card's pair: a shark and a hammerhead. */
const MENU_SHARKS: SharkSpec[] = [
    { kind: 'classic', size: 1 },
    { kind: 'hammerhead', size: 0.8 },
];

/**
 * The pixel ocean on white: sharks at a third of their strength, so the big
 * black links read first, and the fish fainter still.
 *
 * 6px cells rather than the card's 4px: drawing cost grows with the cell
 * count, and over a full screen 4px cells held the frame rate near 20fps
 * where 6px holds it near 60. The sharks here are over twice the card's
 * length, so they still span more cells than the card's do.
 */
const MENU_OCEAN: RenderOptions = { pixel: true, cell: 6, ripples: false, light: 0.32, fishOpacity: 0.35 };

/** Small caps-style chrome text. Positive tracking, since it's tiny and upper. */
const chrome = 'text-[11px] uppercase leading-[1.45] tracking-[0.06em]';

/**
 * The bar's own text: the same chrome, a size up on phones, where 11px is too
 * small to read or to tap. From md it matches the rest of the site's chrome.
 */
const barText = 'text-[13px] uppercase leading-[1.45] tracking-[0.05em] md:text-[11px] md:tracking-[0.06em]';

/** A case study is part of Work, so Work stays marked while reading one. */
function isCurrent(pathname: string, href: string) {
    return pathname === href || (href === '/' && pathname.startsWith('/work/'));
}

/**
 * The clock renders blank on the server and fills in on mount — a time baked
 * into the HTML would be wrong by the time anyone read it, and would mismatch
 * on hydration.
 */
function LocalTime() {
    const [time, setTime] = React.useState<string | null>(null);

    React.useEffect(() => {
        const format = new Intl.DateTimeFormat('en-GB', {
            timeZone: profile.timeZone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        const tick = () => setTime(format.format(new Date()));
        tick();
        const id = window.setInterval(tick, 15_000);
        return () => window.clearInterval(id);
    }, []);

    return (
        <p className={`${chrome} text-chalk`}>
            Local time
            <span className="tabular block text-ash">
                Casablanca {time ?? '--:--'}
            </span>
        </p>
    );
}

/**
 * The bar's page list, with one small square as its only marker. The square
 * sits beside the current page; while the pointer (or focus) is on another
 * item it slides over to that one, and when it leaves the list it slides back
 * home. With no current page — the legal pages — it simply fades out.
 *
 * It hangs in the gutter to the left of the column rather than pushing the
 * words over, so the list stays aligned with the grid and nothing reflows as
 * it moves.
 */
function PageNav({ pathname, play }: { pathname: string; play: boolean }) {
    const reduce = useReducedMotion();
    const list = React.useRef<HTMLUListElement>(null);
    const [centres, setCentres] = React.useState<number[]>([]);
    const [hovered, setHovered] = React.useState<number | null>(null);

    const current = PAGES.findIndex((page) => isCurrent(pathname, page.href));
    const target = hovered ?? (current >= 0 ? current : null);

    // Where each line's middle sits, so the square lands centred on it.
    React.useEffect(() => {
        const ul = list.current;
        if (!ul) return;
        const measure = () =>
            setCentres(
                [...ul.querySelectorAll<HTMLElement>(':scope > li')].map((li) => li.offsetTop + li.offsetHeight / 2)
            );
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(ul);
        return () => ro.disconnect();
    }, []);

    return (
        <nav aria-label="Primary">
            <ul
                ref={list}
                onPointerLeave={() => setHovered(null)}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(null);
                }}
                className={`relative ${barText}`}
            >
                {centres.length > 0 && (
                    <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-3 top-0 h-[5px] w-[5px] bg-chalk"
                        // On the entrance it waits for the list to finish
                        // rising, then appears beside the current page.
                        initial={play ? { opacity: 0 } : false}
                        animate={{
                            y: (target !== null ? centres[target] : centres[Math.max(current, 0)]) - 2.5,
                            opacity: target === null ? 0 : 1,
                        }}
                        transition={
                            reduce
                                ? { duration: 0 }
                                : {
                                    type: 'spring',
                                    stiffness: 520,
                                    damping: 38,
                                    mass: 0.6,
                                    opacity: { duration: 0.4, delay: play ? 0.75 : 0 },
                                }
                        }
                    />
                )}

                {PAGES.map((page, i) => (
                    <li key={page.href} onPointerEnter={() => setHovered(i)}>
                        <Link
                            href={page.href}
                            aria-current={i === current ? 'page' : undefined}
                            onFocus={() => setHovered(i)}
                            onClick={() =>
                                clickEvent({
                                    action: `open_${page.label.toLowerCase().replace(/\s+/g, '_')}`,
                                    category: 'engagement',
                                    label: 'Header',
                                })
                            }
                            // The invisible ::after widens the tap target past
                            // the small type; the rows still meet without
                            // overlapping, so each tap lands on one link.
                            className={`group relative ${barText} transition-colors after:absolute after:-inset-x-3 after:-inset-y-px after:content-[''] aria-[current=page]:text-chalk ${
                                hovered === i ? 'text-chalk' : 'text-ash'
                            }`}
                        >
                            <RiseIn play={play} delay={0.25 + i * 0.06}>
                                <RollText text={page.label} />
                            </RiseIn>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

/** Two rules that cross into an X. */
function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="press relative z-[60] -m-3 flex h-11 w-11 items-center justify-center"
        >
            <span className="relative block h-[7px] w-[18px]">
                <span
                    className={`absolute left-0 top-0 h-px w-full bg-chalk transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        open ? 'translate-y-[3px] rotate-45' : ''
                    }`}
                />
                <span
                    className={`absolute bottom-0 left-0 h-px w-full bg-chalk transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        open ? '-translate-y-[3px] -rotate-45' : ''
                    }`}
                />
            </span>
        </button>
    );
}

/**
 * The full-screen menu. The bar already lists the pages on wider screens, so
 * this is where everything else lives too: availability, the outbound links,
 * and the legal links that used to sit in a footer the home page no longer has.
 */
function MenuPanel({ onClose }: { onClose: () => void }) {
    const pathname = usePathname();
    const reduce = useReducedMotion();
    const firstLink = React.useRef<HTMLAnchorElement>(null);

    React.useEffect(() => {
        firstLink.current?.focus();
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = overflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [onClose]);

    const ease = [0.16, 1, 0.3, 1] as const;

    return (
        <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-void px-5 pb-8 pt-28 md:px-8 md:pt-36"
        >
            {/* The About card's ocean, on the menu's white: sharks as soft
                grey shapes behind the links, the fish as faint specks, no
                ripples. Fixed to the screen, so it holds still if the menu
                scrolls; pointer events pass through to the links, though the
                fish still scatter from the cursor. */}
            <div className="pointer-events-none fixed inset-0">
                <AsciiOcean className="block h-full w-full" sharks={MENU_SHARKS} options={MENU_OCEAN} />
            </div>

            <div className="relative grid flex-1 grid-cols-1 gap-12 md:grid-cols-4 md:gap-5">
                <nav aria-label="Pages" className="md:col-span-2">
                    <ul>
                        {PAGES.map((page, i) => (
                            <li key={page.href}>
                                <Link
                                    ref={i === 0 ? firstLink : undefined}
                                    href={page.href}
                                    onClick={() => {
                                        clickEvent({
                                            action: `open_${page.label.toLowerCase().replace(/\s+/g, '_')}`,
                                            category: 'engagement',
                                            label: 'Menu',
                                        });
                                        onClose();
                                    }}
                                    aria-current={isCurrent(pathname, page.href) ? 'page' : undefined}
                                    className="inline-block font-display text-[clamp(40px,6.4vw,92px)] font-normal leading-[1.02] tracking-[-0.045em] text-chalk transition-colors duration-300 hover:text-dust aria-[current=page]:text-dust"
                                >
                                    {/* Each line rises in as the menu opens,
                                        one after another. At this size the
                                        hover is a plain change of grey. */}
                                    <RiseIn delay={0.08 + i * 0.06}>{page.label}</RiseIn>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <motion.div
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease }}
                    className="flex flex-col gap-10 md:col-span-2 md:grid md:grid-cols-2 md:content-start md:gap-5"
                >
                    <div>
                        <p className={`${chrome} text-dust`}>Availability</p>
                        <p className="mt-3 text-[14px] leading-snug text-chalk">
                            {profile.availability.headline}
                            <span className="block text-ash">{profile.availability.detail}</span>
                        </p>
                    </div>

                    <div>
                        <p className={`${chrome} text-dust`}>Elsewhere</p>
                        <ul className="mt-3 space-y-1.5">
                            {profile.links.map((link) => {
                                const rating = 'rating' in link ? link.rating : null;
                                return (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            target={link.external ? '_blank' : undefined}
                                            rel={link.external ? 'noopener noreferrer' : undefined}
                                            onClick={() =>
                                                clickEvent({
                                                    action: `click_${link.label.toLowerCase()}`,
                                                    category: 'engagement',
                                                    label: 'Menu',
                                                })
                                            }
                                            className="group inline-flex items-baseline gap-2 text-[14px] text-ash transition-colors hover:text-chalk"
                                        >
                                            {link.label}
                                            {rating && (
                                                <span
                                                    aria-label={`Rated ${rating} out of 5 on ${link.label}`}
                                                    className="tabular inline-flex items-center gap-[3px] self-center rounded-full bg-shell px-[7px] py-[2px] text-[10px] leading-none text-chalk"
                                                >
                                                    <Star
                                                        size={9}
                                                        weight="fill"
                                                        aria-hidden="true"
                                                        className="text-[#e0a500]"
                                                    />
                                                    {rating}
                                                </span>
                                            )}
                                            <ArrowUpRight
                                                size={13}
                                                aria-hidden="true"
                                                className="self-center transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[3px]"
                                            />
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </motion.div>
            </div>

            <div className={`relative mt-16 flex flex-wrap items-end justify-between gap-4 ${chrome} text-dust`}>
                <p>
                    © {new Date().getFullYear()} {profile.name}
                </p>
                <div className="flex gap-6">
                    <Link href="/privacy" onClick={onClose} className="transition-colors hover:text-chalk">
                        Privacy
                    </Link>
                    <Link href="/cookies" onClick={onClose} className="transition-colors hover:text-chalk">
                        Cookies
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * The bar, laid on the same four columns as the rest of the page: who, what,
 * where to go, and when it is here. Every line is small and upper-case so the
 * work underneath is the loudest thing on screen.
 */
/**
 * The bar's height, fixed so a page can hold the same space open under it:
 * the three-line page list, which shows at every width (taller on phones,
 * where the bar's text is a size up).
 */
const BAR = 'h-[80px] md:h-[72px]';

/** The space the bar sits over at the top of every page. */
export function BarSpace() {
    return <div aria-hidden="true" className={BAR} />;
}

/**
 * The bar, mounted once in the root layout so it stays put while pages change
 * under it — the square marker simply glides to the new page.
 *
 * Its entrance plays once: when a visit starts on the home page, alongside the
 * home page's own. After that it never replays, home included — the bar is
 * the one constant while everything under it changes.
 *
 * The admin has its own chrome, so the bar stays out of it.
 */
export function SiteHeader() {
    const pathname = usePathname();
    // Read once, on mount: whether this visit began on the home page.
    const [intro] = React.useState(() => pathname === '/');
    if (pathname.startsWith('/admin')) return null;
    return <Bar intro={intro} />;
}

/** `intro` plays the entrance: every item rising out of its mask in reading order. */
function Bar({ intro }: { intro: boolean }) {
    const pathname = usePathname();
    const play = intro;
    const ready = useSiteReady();
    const reduce = useReducedMotion();
    const [open, setOpen] = React.useState(false);
    const toggle = React.useRef<HTMLDivElement>(null);

    const close = React.useCallback(() => {
        setOpen(false);
        toggle.current?.querySelector('button')?.focus();
    }, []);

    return (
        <header className={`absolute inset-x-0 top-0 z-40 px-5 pt-5 md:px-8 md:pt-6 ${BAR}`}>
            {/* Phones: name, pages, menu. From md: name, role, pages, time. */}
            <div className="grid grid-cols-[1fr_1fr_auto] items-start gap-5 md:grid-cols-4">
                {/* The name rolls on hover like the page links, the second
                    line a beat behind the first. */}
                <Link
                    href="/"
                    aria-label={`${profile.name} — home`}
                    className={`group ${barText} w-fit text-chalk`}
                >
                    {profile.name.split(' ').map((part, i) => (
                        <RiseIn key={part} block play={play} delay={0.1 + i * 0.06}>
                            <RollText text={part} delay={i * 70} />
                        </RiseIn>
                    ))}
                </Link>

                <div className={`${chrome} hidden max-w-[22ch] text-ash md:block`}>
                    <RiseIn block play={play} delay={0.18}>
                        {profile.role}
                    </RiseIn>
                </div>

                <PageNav pathname={pathname} play={play} />

                <div className="flex items-start justify-end gap-5 md:justify-between">
                    <div className="hidden md:block">
                        <RiseIn block play={play} delay={0.5}>
                            <LocalTime />
                        </RiseIn>
                    </div>
                    <motion.div
                        ref={toggle}
                        initial={play && !reduce ? { opacity: 0, scale: 0.6 } : false}
                        animate={play && !reduce && !ready ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <MenuToggle open={open} onClick={() => (open ? close() : setOpen(true))} />
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>{open && <MenuPanel onClose={close} />}</AnimatePresence>
        </header>
    );
}
