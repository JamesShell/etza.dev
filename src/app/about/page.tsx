import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { IdentityRail } from '@/components/layout/IdentityRail';
import { Section } from '@/components/layout/Section';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { about, awards, education, experience, profile, volunteering } from '@/content/profile';
import { PERSON_ID, breadcrumbSchema, graph, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    // The layout template appends the name, so it isn't repeated here.
    title: 'About',
    description:
        'Web engineer and interface designer in Rabat, Morocco. Four years designing and building real-estate platforms, early-stage products and agency work end to end — scope, design, build, and a repo you own.',
    path: '/about',
    ogType: 'profile',
});

const jsonLd = graph(
    {
        '@type': 'AboutPage',
        name: 'About Abdelkader Ettouzany',
        url: 'https://etza.dev/about',
        description: about.lead,
        mainEntity: { '@id': PERSON_ID },
    },
    breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
    ])
);

type Entry = { period: string; title: string; detail?: string };

/**
 * One dated list, used for every record on this page. The period sits above
 * the line rather than beside it — a date gutter would push every entry off
 * the same left edge the introduction is set against, and that edge is the
 * only alignment holding this page together.
 */
function Record({ entries }: { entries: Entry[] }) {
    return (
        <ol>
            {entries.map((entry) => (
                <li key={`${entry.period}-${entry.title}`} className="py-5 first:pt-0 last:pb-0">
                    <p className="tabular text-[12px] text-dust">{entry.period}</p>
                    <h3 className="mt-2 font-sans text-[16px] font-medium leading-snug text-chalk">
                        {entry.title}
                    </h3>
                    {entry.detail && (
                        <p className="mt-2 font-sans text-[15px] leading-relaxed text-ash">
                            {entry.detail}
                        </p>
                    )}
                </li>
            ))}
        </ol>
    );
}

/**
 * The rail is the navigation here as it is everywhere else; what's different is
 * the column beside it, which is a single centred measure rather than a full
 * grid. This page is one long read, so it gets reading-column width and sits in
 * the middle of whatever space the rail leaves.
 *
 * Every list below the introduction renders only if it has entries, so the
 * page reads as finished whether there are three records on it or thirty.
 */
export default function AboutPage() {
    return (
        <main className="min-h-screen">
            <JsonLd id="schema-about" data={jsonLd} />

            <div className="flex flex-col lg:flex-row">
                <header className="px-5 py-10 md:px-8 lg:sticky lg:top-0 lg:h-screen lg:w-[276px] lg:shrink-0 lg:py-12">
                    <IdentityRail />
                </header>

                <div className="mx-auto w-full min-w-0 max-w-[840px] flex-1 px-5 pb-10 md:px-8 lg:px-10">
                    {/* The rail runs from the top of the viewport; the reading
                        column starts well below it, so the page opens on the
                        first sentence with air around it rather than on a full
                        screen of text. */}
                    <div id="intro" className="scroll-mt-8 pb-4 pt-14 md:pt-32 lg:pt-44">
                        <h1 className="max-w-[46ch] font-display text-[clamp(22px,2.9vw,28px)] font-medium leading-[1.4] tracking-[-0.025em] text-chalk">
                            {about.lead}
                        </h1>

                        {/* Wide gaps between short paragraphs — the pauses are
                            doing as much work here as the sentences. The measure
                            is capped inside the wider column: the page is set
                            broad, the sentences still break where they read. */}
                        <div className="mt-8 max-w-[72ch] space-y-6">
                            {about.paragraphs.map((paragraph) => (
                                <p
                                    key={paragraph.slice(0, 40)}
                                    className="font-sans text-[17px] leading-[1.65] text-ash"
                                >
                                    {paragraph}
                                </p>
                            ))}

                            {/* Indented, unbulleted and lower-case: it should
                                read as an aside in the same voice, not as a
                                spec list pretending to be one. */}
                            <div>
                                <p className="font-sans text-[17px] leading-[1.65] text-ash">
                                    {about.listLead}
                                </p>
                                <ul className="mt-3 space-y-2 pl-5">
                                    {about.list.map((item) => (
                                        <li
                                            key={item}
                                            className="font-sans text-[17px] leading-[1.65] text-ash"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <p className="font-sans text-[17px] leading-[1.65] text-ash">
                                {about.signoff}{' '}
                                {/* The sign-off carries the routes out, so the
                                    friendly ending is also the useful one. */}
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="text-chalk underline decoration-edge underline-offset-4 transition-colors hover:decoration-chalk"
                                >
                                    Email
                                </a>
                                {profile.links
                                    .filter((link) => link.label !== 'Email')
                                    .map((link) => (
                                        <React.Fragment key={link.href}>
                                            {', '}
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-chalk underline decoration-edge underline-offset-4 transition-colors hover:decoration-chalk"
                                            >
                                                {link.label}
                                            </a>
                                        </React.Fragment>
                                    ))}
                                .
                            </p>
                        </div>
                    </div>

                    {experience.length > 0 && (
                        <Section id="experience" label="Experience">
                            <Record
                                entries={experience.map((item) => ({
                                    period: item.period,
                                    title: `${item.role} · ${item.org}`,
                                    detail: item.detail,
                                }))}
                            />
                        </Section>
                    )}

                    {education.length > 0 && (
                        <Section id="education" label="Education">
                            <Record
                                entries={education.map((item) => ({
                                    period: item.period,
                                    title: `${item.title} · ${item.org}`,
                                    detail: item.detail,
                                }))}
                            />
                        </Section>
                    )}

                    {volunteering.length > 0 && (
                        <Section id="volunteering" label="Volunteering">
                            <Record
                                entries={volunteering.map((item) => ({
                                    period: item.period,
                                    title: `${item.role} · ${item.org}`,
                                    detail: item.detail,
                                }))}
                            />
                        </Section>
                    )}

                    {awards.length > 0 && (
                        <Section id="awards" label="Awards">
                            <Record
                                entries={awards.map((item) => ({
                                    period: item.year,
                                    title: item.org ? `${item.title} · ${item.org}` : item.title,
                                }))}
                            />
                        </Section>
                    )}

                    <Section id="next" label="Working together">
                        <p className="mb-6 max-w-[62ch] font-sans text-[17px] leading-[1.65] text-ash">
                            {profile.availability.headline} {profile.availability.detail}. If you
                            have something in mind, the contact form is the fastest route — or book a
                            call and we&rsquo;ll talk it through.
                        </p>

                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                            <Link
                                href="/contact"
                                className="rounded-full bg-chalk px-5 py-2.5 text-[14px] font-medium text-void transition-opacity hover:opacity-90"
                            >
                                Start a project
                            </Link>
                            <Link
                                href="/book"
                                className="text-[15px] text-ash transition-colors hover:text-chalk"
                            >
                                Book a 20-minute call
                            </Link>
                            {/* Only once there's a file to download — the CV
                                replaced the resume page, so this appears when
                                profile.cv.href is set and not before. */}
                            {profile.cv.href && (
                                <a
                                    href={profile.cv.href}
                                    data-umami-event="download_cv"
                                    data-umami-event-label="About — working together"
                                    className="text-[15px] text-ash transition-colors hover:text-chalk"
                                >
                                    Hiring? {profile.cv.label}
                                </a>
                            )}
                        </div>
                    </Section>

                    <SiteFooter />
                </div>
            </div>
        </main>
    );
}
