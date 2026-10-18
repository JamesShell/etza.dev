import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { profile } from '@/content/profile';

/**
 * Sub-page navigation. The home page doesn't use this — there, the identity
 * rail is the navigation.
 *
 * Sticky and translucent rather than an opaque strip: the page scrolls under
 * it, so it stays in reach without taking a fixed band of the screen. No rule
 * underneath — the blur is the edge.
 */
export function SiteNav() {
    return (
        <header className="glass sticky top-0 z-40">
            <div className="flex h-14 items-center justify-between gap-6 px-5 md:px-8 lg:px-10">
                <Link
                    href="/"
                    className="group inline-flex items-baseline gap-2 text-[12px] text-ash transition-colors hover:text-chalk"
                >
                    <ArrowLeft
                        size={14}
                        aria-hidden="true"
                        className="self-center transition-transform duration-300 group-hover:-translate-x-1"
                    />
                    {profile.shortName}
                </Link>

                {/* Mirrors the rail on the home page: same places, same order.
                    The CV appears here only once there's a file to point at —
                    a nav entry that 404s is worse than one that isn't there. */}
                <nav className="flex items-center gap-6 text-[13px] text-ash">
                    <Link href="/#work" className="transition-colors hover:text-chalk">
                        Work
                    </Link>
                    <Link href="/pricing" className="hidden transition-colors hover:text-chalk sm:inline">
                        Pricing
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-chalk">
                        About
                    </Link>
                    <Link href="/book" className="transition-colors hover:text-chalk">
                        Book a call
                    </Link>
                    {profile.cv.href && (
                        <a
                            href={profile.cv.href}
                            data-umami-event="download_cv"
                            data-umami-event-label="Site nav"
                            className="transition-colors hover:text-chalk"
                        >
                            {profile.cv.label}
                        </a>
                    )}
                </nav>
            </div>
        </header>
    );
}
