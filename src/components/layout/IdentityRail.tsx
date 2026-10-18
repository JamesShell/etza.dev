'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowDown, ArrowUpRight, Star } from '@phosphor-icons/react';
import { profile } from '@/content/profile';
import { clickEvent } from '@/lib/analytics';

export type RailLink = { label: string; href: string };

/**
 * The site's pages, in one place and in one order. This list is deliberately
 * identical on every page: navigation that reshuffles itself as you move
 * through a site forces you to re-read it each time, and hides the fact that
 * there are only three places to go. The current page stays in the list rather
 * than being dropped from it, so nothing shifts underneath the pointer.
 *
 * The hiring route left this list: it's the CV itself now, which is a file
 * rather than a page, so it belongs with the outbound links below.
 */
const PAGES: RailLink[] = [
    { label: 'Work', href: '/' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Book a call', href: '/book' },
];

/**
 * The rail is the whole navigation and the whole introduction, held in place
 * for the length of the scroll. It answers, permanently: who is this, are they
 * free, where can I go, and how do I reach them — and nothing else. It carried
 * a section index and a local clock once; both were dropped because the rail
 * earns its place by being the same on every page and never moving.
 */
export function IdentityRail() {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col justify-between gap-12 lg:gap-8">
            <div>
                <Link
                    href="/"
                    className="group flex items-center gap-3"
                    aria-label={`${profile.name} — home`}
                >
                    {/* Small, square, and the only photograph on the site — it
                        makes the wordmark read as a person rather than a logo,
                        which is the entire job of this rail. */}
                    <Image
                        src="/images/avatar.jpg"
                        alt=""
                        width={40}
                        height={40}
                        priority
                        className="h-10 w-10 shrink-0 rounded-md object-cover"
                    />

                    {/* A wordmark, not the page heading — every page has its own
                        h1 in the content column. */}
                    <p className="font-display text-[22px] font-medium leading-[1.1] tracking-[-0.03em] text-chalk lg:text-[23px]">
                        {profile.name}
                    </p>
                </Link>

                <p className="mt-4 max-w-[22ch] font-sans text-[15px] leading-snug text-ash">
                    {profile.role}
                </p>

                <nav aria-label="Pages" className="mt-9">
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:block lg:space-y-[7px]">
                        {PAGES.map((link) => {
                            const isCurrent = pathname === link.href;
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        aria-current={isCurrent ? 'page' : undefined}
                                        onClick={() =>
                                            clickEvent({
                                                action: `open_${link.label.toLowerCase().replace(/\s+/g, '_')}`,
                                                category: 'engagement',
                                                label: 'Identity rail',
                                            })
                                        }
                                        className={`text-[13px] transition-colors hover:text-chalk ${
                                            isCurrent ? 'text-chalk' : 'text-ash'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            <div>
                <div className="flex items-start gap-3">
                    <span className="relative mt-[7px] flex h-[5px] w-[5px] shrink-0" aria-hidden="true">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chalk opacity-40" />
                        <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-chalk" />
                    </span>
                    <p className="font-sans text-[14px] leading-snug text-chalk">
                        {profile.availability.headline}
                        <span className="block text-ash">{profile.availability.detail}</span>
                    </p>
                </div>

                <ul className="mt-7 space-y-2 pt-6">
                    {profile.links.map((link) => {
                        // Only some links carry a public score, so the pill has
                        // to be optional rather than a blank slot on the rest.
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
                                            label: 'Identity rail',
                                        })
                                    }
                                    className="group inline-flex items-baseline gap-2 text-[12px] text-ash transition-colors hover:text-chalk"
                                >
                                    {link.label}

                                    {rating && (
                                        <span
                                            aria-label={`Rated ${rating} out of 5 on ${link.label}`}
                                            className="tabular inline-flex items-center gap-[3px] self-center rounded-full bg-shell px-[7px] py-[2px] text-[10px] leading-none text-chalk"
                                        >
                                            {/* The one warm colour on an
                                                otherwise achromatic site — a
                                                star that isn't gold reads as a
                                                bullet, not a rating. */}
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
                                        className="self-center transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[2px]"
                                    />
                                </a>
                            </li>
                        );
                    })}
                    {profile.cv.href && (
                        <li>
                            <a
                                href={profile.cv.href}
                                onClick={() =>
                                    clickEvent({
                                        action: 'download_cv',
                                        category: 'conversion',
                                        label: 'Identity rail',
                                    })
                                }
                                className="group inline-flex items-baseline gap-2 text-[12px] text-ash transition-colors hover:text-chalk"
                            >
                                {profile.cv.label}
                                <ArrowDown
                                    size={13}
                                    aria-hidden="true"
                                    className="self-center transition-transform duration-300 group-hover:translate-y-[2px]"
                                />
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
