'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from '@phosphor-icons/react';
import { profile } from '@/content/profile';
import { clickEvent } from '@/lib/analytics';

/**
 * Two audiences arrive at this section, so it offers exactly two paths and
 * says plainly which is which.
 */
export function Contact() {
    const [copied, setCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            clickEvent({ action: 'copy_email', category: 'engagement', label: 'Contact' });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.location.href = `mailto:${profile.email}`;
        }
    };

    return (
        <div>
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <a
                    href={`mailto:${profile.email}`}
                    onClick={() =>
                        clickEvent({ action: 'send_email', category: 'conversion', label: 'Contact' })
                    }
                    className="font-display text-[clamp(26px,5vw,52px)] font-medium leading-none tracking-[-0.04em] text-chalk underline decoration-edge decoration-1 underline-offset-[10px] transition-colors hover:decoration-chalk"
                >
                    {profile.email}
                </a>
                <button
                    type="button"
                    onClick={copyEmail}
                    className="cursor-pointer text-[12px] text-dust transition-colors hover:text-chalk"
                >
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>

            {/* Project work leads and gets the filled button; the role path is a
                real option, kept plain so it doesn't compete for the same click. */}
            <div className="mt-14 grid grid-cols-1 gap-10 pt-10 md:grid-cols-2 md:gap-16">
                <div>
                    <h3 className="mb-3 text-[12px] text-dust">Starting a project</h3>
                    <p className="mb-5 max-w-[42ch] font-sans text-[15px] leading-relaxed text-ash">
                        Tell me what you&rsquo;re building and what&rsquo;s in the way. You&rsquo;ll get a
                        reply within a day, with what I&rsquo;d do first.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link
                            href="/contact"
                            onClick={() =>
                                clickEvent({ action: 'open_contact_form', category: 'conversion', label: 'Project path' })
                            }
                            className="rounded-full bg-chalk px-5 py-2.5 text-[14px] font-medium text-void transition-opacity hover:opacity-90"
                        >
                            Start a project
                        </Link>
                        <Link
                            href="/book"
                            onClick={() =>
                                clickEvent({ action: 'click_book_call', category: 'conversion', label: 'Project path' })
                            }
                            className="group inline-flex items-baseline gap-2 text-[14px] text-ash transition-colors hover:text-chalk"
                        >
                            Book a call
                            <ArrowRight
                                size={14}
                                aria-hidden="true"
                                className="self-center transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 text-[12px] text-dust">Hiring for a role</h3>
                    <p className="mb-5 max-w-[42ch] font-sans text-[15px] leading-relaxed text-ash">
                        I&rsquo;m open to front-end and product engineering roles too, remote or based in
                        Morocco. Tell me what the team is building.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        {/* The resume page is gone; the CV is the record now,
                            and email is the route that works either way. */}
                        <a
                            href={`mailto:${profile.email}?subject=Role%20at%20your%20company`}
                            onClick={() =>
                                clickEvent({ action: 'send_email', category: 'engagement', label: 'Hiring path' })
                            }
                            className="group inline-flex items-baseline gap-2 text-[14px] text-ash transition-colors hover:text-chalk"
                        >
                            Email me about a role
                            <ArrowRight
                                size={14}
                                aria-hidden="true"
                                className="self-center transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </a>
                        {profile.cv.href && (
                            <a
                                href={profile.cv.href}
                                onClick={() =>
                                    clickEvent({ action: 'download_cv', category: 'conversion', label: 'Hiring path' })
                                }
                                className="group inline-flex items-baseline gap-2 text-[14px] text-ash transition-colors hover:text-chalk"
                            >
                                {profile.cv.label}
                                <ArrowDown
                                    size={14}
                                    aria-hidden="true"
                                    className="self-center transition-transform duration-300 group-hover:translate-y-[2px]"
                                />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
