'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    ArrowDown,
    ArrowRight,
    ArrowSquareOut,
    CaretDown,
    DownloadSimple,
    EnvelopeSimple,
    Eye,
    HandPointing,
    User,
} from '@phosphor-icons/react';
import { BlinkingSmiley } from '@/components/ui/GlobalLoader';

/** What counts as clickable, and so earns the pill. */
const INTERACTIVE = 'a, button, summary, [role="button"], [role="link"]';

/**
 * Where the face steps aside and the real pointer comes back.
 *
 * An iframe is a separate document: once the pointer is inside it, this one
 * stops receiving mousemove, so the face would otherwise freeze at the edge and
 * hover there — on top of the embed, over content it can't describe. Anything
 * marked `data-cursor-native` opts out the same way.
 */
const NATIVE_ZONE = 'iframe, [data-cursor-native]';

function inNativeZone(target: EventTarget | null): boolean {
    const el = target as Element | null;
    return Boolean(el?.closest?.(NATIVE_ZONE));
}

/**
 * What the pill says and shows. Name the destination, not the gesture — "View
 * case study" tells you where you'll land, "Click" tells you what you already
 * know — and let the icon say the same thing a second way.
 */
const ACTIONS = {
    caseStudy: { label: 'View case study', Icon: Eye },
    email: { label: 'Write an email', Icon: EnvelopeSimple },
    about: { label: 'Read about me', Icon: User },
    section: { label: 'Jump to section', Icon: ArrowDown },
    external: { label: 'Open in a new tab', Icon: ArrowSquareOut },
    download: { label: 'Download', Icon: DownloadSimple },
    page: { label: 'Go to page', Icon: ArrowRight },
    disclose: { label: 'Read the answer', Icon: CaretDown },
    select: { label: 'Select', Icon: HandPointing },
} as const;

type ActionKey = keyof typeof ACTIONS;

/**
 * Works off the href, so nothing has to be annotated to get the right pill.
 * `data-cursor="…"` overrides the wording where a link deserves something more
 * specific than its shape implies; the icon still follows the destination.
 */
function actionFor(el: Element): { kind: ActionKey; label: string } {
    const href = el.getAttribute('href') ?? '';

    let kind: ActionKey = 'select';
    if (href.startsWith('mailto:')) kind = 'email';
    else if (el.hasAttribute('download') || /\.pdf($|[?#])/i.test(href)) kind = 'download';
    else if (href.startsWith('/work/')) kind = 'caseStudy';
    else if (href === '/about') kind = 'about';
    else if (href.startsWith('#') || href.startsWith('/#')) kind = 'section';
    else if (/^https?:/i.test(href)) kind = 'external';
    else if (href) kind = 'page';
    else if (el.tagName === 'SUMMARY') kind = 'disclose';

    const custom = (el as HTMLElement).dataset?.cursor;
    return { kind, label: custom || ACTIONS[kind].label };
}

/** Shake: direction reversals counted inside a rolling window. */
const SHAKE_WINDOW_MS = 500;
const SHAKE_REVERSALS = 5;
const SHAKE_MIN_SPEED = 6; // px per event — ignores slow, deliberate weaving
const SULK_MS = 1400;

/**
 * The blinking face, repurposed as the pointer.
 *
 * Only mounts where a real cursor exists — `(pointer: fine)` — so touch devices
 * are untouched and nothing chases a finger. The native cursor is hidden by the
 * matching rule in globals.css, scoped to the same query: if this component
 * ever fails to mount, that rule must not leave a page with no pointer at all,
 * so the two are kept in step.
 *
 * Position is written straight to `style.transform` inside a rAF rather than
 * through state — a cursor that re-renders React on every mousemove lags behind
 * the thing it is meant to be. Only what changes appearance is state, and each
 * piece is written just when it flips.
 */
export function CursorFace() {
    const ref = useRef<HTMLDivElement>(null);
    const frame = useRef(0);
    const visible = useRef(false);
    const overLink = useRef(false);

    // Shake bookkeeping
    const lastX = useRef(0);
    const direction = useRef(0);
    const reversals = useRef<number[]>([]);
    const sulkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [active, setActive] = useState(false);
    const [pointing, setPointing] = useState(false);
    const [native, setNative] = useState(false);
    const overNative = useRef(false);
    // Held through the close animation so the pill doesn't blank out as it goes.
    const [label, setLabel] = useState<string>(ACTIONS.select.label);
    const [kind, setKind] = useState<ActionKey>('select');
    const [angry, setAngry] = useState(false);
    const [blink, setBlink] = useState(true);

    const pathname = usePathname();
    // The admin tool keeps its ordinary cursor — it's a form UI, not the folio.
    const isAdmin = pathname?.startsWith('/admin') ?? false;

    useEffect(() => {
        if (isAdmin) return;
        if (!window.matchMedia('(pointer: fine)').matches) return;

        // The native cursor is hidden by this class and nothing else, so it can
        // only ever be hidden on a page where the face is actually running:
        // /admin, touch devices and a failed mount all keep their own pointer
        // rather than being left with none. Removed on the way out, which is
        // what restores the cursor when you navigate into /admin.
        document.documentElement.classList.add('cursor-face-active');

        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setBlink(!still);

        /**
         * Hands the pointer back, or takes it again. Removing the class is the
         * half that matters: it's the only thing hiding the native cursor, so
         * dropping it is what makes a real arrow reappear over the embed.
         */
        const setNativeZone = (on: boolean) => {
            if (on === overNative.current) return;
            overNative.current = on;
            setNative(on);
            document.documentElement.classList.toggle('cursor-face-active', !on);
        };

        const move = (e: MouseEvent) => {
            const { clientX, clientY } = e;

            if (inNativeZone(e.target)) {
                setNativeZone(true);
                return;
            }
            setNativeZone(false);

            if (!visible.current) {
                visible.current = true;
                setActive(true);
            }

            const target = e.target as Element | null;
            const hit = target?.closest?.(INTERACTIVE) ?? null;
            const isLink = Boolean(hit);
            if (isLink !== overLink.current) {
                overLink.current = isLink;
                setPointing(isLink);
            }
            if (hit) {
                const next = actionFor(hit);
                setLabel((current) => (current === next.label ? current : next.label));
                setKind((current) => (current === next.kind ? current : next.kind));
            }

            // Count how often the horizontal direction flips. A shake is many
            // reversals in quick succession; a normal sweep is none.
            if (!still) {
                const dx = clientX - lastX.current;
                lastX.current = clientX;

                if (Math.abs(dx) >= SHAKE_MIN_SPEED) {
                    const heading = Math.sign(dx);
                    if (direction.current !== 0 && heading !== direction.current) {
                        const now = e.timeStamp;
                        reversals.current = reversals.current
                            .filter((t) => now - t < SHAKE_WINDOW_MS)
                            .concat(now);

                        if (reversals.current.length >= SHAKE_REVERSALS) {
                            reversals.current = [];
                            setAngry(true);
                            if (sulkTimer.current) clearTimeout(sulkTimer.current);
                            sulkTimer.current = setTimeout(() => setAngry(false), SULK_MS);
                        }
                    }
                    direction.current = heading;
                }
            }

            if (frame.current) return;
            frame.current = requestAnimationFrame(() => {
                frame.current = 0;
                if (ref.current) {
                    ref.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
                }
            });
        };

        const leave = () => {
            visible.current = false;
            setActive(false);
        };

        // mousemove stops the instant the pointer is inside the iframe, so the
        // last one may land a frame late. `mouseover` fires on the boundary
        // crossing itself, which is what actually catches the handover.
        const over = (e: MouseEvent) => {
            if (inNativeZone(e.target)) setNativeZone(true);
        };

        window.addEventListener('mousemove', move, { passive: true });
        document.addEventListener('mouseover', over, { passive: true });
        document.addEventListener('mouseleave', leave);

        return () => {
            document.documentElement.classList.remove('cursor-face-active');
            overNative.current = false;
            window.removeEventListener('mousemove', move);
            document.removeEventListener('mouseover', over);
            document.removeEventListener('mouseleave', leave);
            if (frame.current) cancelAnimationFrame(frame.current);
            if (sulkTimer.current) clearTimeout(sulkTimer.current);
        };
    }, [isAdmin]);

    if (isAdmin) return null;

    // Anger outranks delight: if you've just shaken him, hovering a link
    // shouldn't cheer him up mid-sulk.
    const mood = angry ? 'angry' : pointing ? 'happy' : 'default';
    const { Icon: ActionIcon } = ACTIONS[kind];

    // Just the drop. The white ring that used to sit here doubled up with the
    // face's own dark circle inside a white pill, reading as two outlines — and
    // a white pill needs no help separating from dark artwork anyway.
    const lift = 'shadow-[0_2px_6px_rgba(0,0,0,0.13)]';

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="cursor-face"
            style={{ opacity: active && !native ? 1 : 0 }}
        >
            {/* The head's own disc is the pill: over something clickable it
                stretches sideways and the face shrinks to sit in it as the icon,
                so there are never two objects on screen.

                Anchored by the face rather than by the pill — translating a
                fixed -18px keeps the head on the cursor while the pill grows
                off to the right, instead of the pointer drifting to the middle
                of a box whose width depends on the label. */}
            <div
                className={`flex items-center rounded-full bg-void text-chalk ${lift} transition-[padding,gap] duration-300 ease-out ${
                    pointing ? 'gap-2 py-1 pl-1 pr-3.5' : 'gap-0 p-0'
                }`}
                style={{ transform: 'translate(-18px, -50%)' }}
            >
                <div
                    className={`relative shrink-0 transition-[width,height] duration-300 ease-out ${
                        pointing ? 'h-[31px] w-[31px]' : 'h-9 w-9'
                    }`}
                >
                    {/* Drawn once at 36px and scaled, so the blink and the mood
                        shapes don't have to be recomputed at a second size. */}
                    <div
                        className={`absolute left-1/2 top-1/2 origin-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out ${
                            pointing ? 'scale-[0.861]' : 'scale-100'
                        }`}
                    >
                        {/* Shrinking to 31px takes the expression down with it,
                            so the eyes claim more of the face to compensate. */}
                        <BlinkingSmiley
                            size={36}
                            animate={blink}
                            track={false}
                            mood={mood}
                            eyeScale={pointing ? 1.2 : 1}
                        />
                    </div>
                </div>

                <span
                    className={`flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-[13px] font-medium transition-[max-width,opacity] duration-300 ease-out ${
                        pointing ? 'max-w-[260px] opacity-100' : 'max-w-0 opacity-0'
                    }`}
                >
                    {label}
                    {/* Says the same thing as the words, a second way. Muted so
                        it stays behind them rather than competing. */}
                    <ActionIcon size={14} weight="fill" className="shrink-0 text-ash" />
                </span>
            </div>
        </div>
    );
}
