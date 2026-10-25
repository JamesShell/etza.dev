import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { BarSpace } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PageSection, PageTitle, chrome, prose } from '@/components/layout/Page';
import { RiseText } from '@/components/ui/Rise';
import { AsciiOcean } from '@/vendor/ascii-sharks/react';
import type { SharkSpec } from '@/vendor/ascii-sharks/world';
import type { RenderOptions } from '@/vendor/ascii-sharks/renderer';
import { JsonLd } from '@/components/seo/JsonLd';
import { about, awards, education, experience, profile, volunteering } from '@/content/profile';
import { PERSON_ID, breadcrumbSchema, graph, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    // The layout template appends the name, so it isn't repeated here.
    title: 'About',
    description:
        'Web engineer and designer in Casablanca, with four years designing and building websites, booking systems and web apps end to end.',
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
 * One dated list, used for every record on this page: the period in the bar's
 * small capitals, the entry at the home cards' caption size, the detail under
 * it in the reading grey — rows on rules, like the contact form.
 */
function Record({ entries }: { entries: Entry[] }) {
    return (
        <ol>
            {entries.map((entry) => (
                <li
                    key={`${entry.period}-${entry.title}`}
                    className="border-t border-raise py-5 first:border-t-0 first:pt-0 last:pb-0"
                >
                    <p className={`${chrome} tabular text-dust`}>{entry.period}</p>
                    <h3 className="mt-2 font-display text-[19px] font-medium leading-[1.3] tracking-[-0.02em] text-chalk lg:text-[clamp(17px,1.3vw,22px)]">
                        {entry.title}
                    </h3>
                    {entry.detail && <p className={`mt-2 ${prose}`}>{entry.detail}</p>}
                </li>
            ))}
        </ol>
    );
}

/**
 * One full-size shark and a hammerhead further off — two shapes you can tell
 * apart at a glance, and enough water left for the fish to school in.
 */
const SHARKS: SharkSpec[] = [
    { kind: 'classic', size: 1 },
    { kind: 'hammerhead', size: 0.75 },
];

/**
 * Solid colour in small square cells: the detail of a picture, none of the
 * type. No ripples — just the animals moving through still water — and the
 * fish at a quarter strength, so the schools are a faint texture and the
 * sharks lead.
 */
const OCEAN: RenderOptions = {
    pixel: true,
    cell: 4,
    ripples: false,
    light: 0.4,
    background: [244, 244, 245], // --color-shell, so the card still reads as a card
    fishOpacity: 0.3,
};

/**
 * The card beside the opening sentence: a work card's shape, with a live ASCII
 * ocean behind the checkable figures instead of a picture — years of client work
 * and the public ratings — with his name captioned under it the way a project
 * is captioned on the home page.
 */
function FactsCard() {
    const facts = [
        { value: String(profile.yearsOfClientWork), label: 'Years of client work' },
        ...profile.links.flatMap((link) =>
            'rating' in link && link.rating ? [{ value: `${link.rating}★`, label: `Rated on ${link.label}` }] : []
        ),
    ];

    return (
        <figure>
            <div className="cover-backdrop relative flex aspect-[4/5] w-full flex-col justify-between overflow-hidden p-5 lg:p-7">
                {/* A live ocean: fish schools, and a shark and a hammerhead
                    hunting them, drawn in the library's pixel mode — fine 4px
                    cells of solid colour, no characters, no grid and no
                    ripples. Two sharks rather than the library's four: it's
                    tuned for a full-screen hero, and four crowd a card this
                    size. A shade at the bottom keeps the figures clear when a
                    shark passes under them. Pauses off-screen; a still frame
                    for anyone who has asked for less motion. */}
                <div className="absolute inset-0">
                    <AsciiOcean className="block h-full w-full" sharks={SHARKS} options={OCEAN} />
                </div>


                <p className={`${chrome} relative text-dust`}>In numbers</p>
                <dl className="relative">
                    {facts.map((fact, i) => (
                        <div
                            key={fact.label}
                            className="flex items-baseline justify-between gap-4 border-t border-chalk/10 py-3 first:border-t-0"
                        >
                            <dt className={`${chrome} order-2 text-right text-ash`}>{fact.label}</dt>
                            <dd className="order-1">
                                <RiseText
                                    as="span"
                                    inView
                                    delay={0.4 + i * 0.1}
                                    text={fact.value}
                                    className="tabular font-display text-[clamp(40px,4vw,72px)] font-normal leading-none tracking-[-0.05em] text-chalk"
                                />
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
            <figcaption className="pt-4 font-display text-[19px] font-medium leading-[1.3] tracking-[-0.02em] text-chalk lg:pt-5 lg:text-[clamp(17px,1.3vw,22px)]">
                <span className="flex items-baseline justify-between gap-4">
                    <span className="truncate">{profile.name}</span>
                    <span className="shrink-0">(GMT+1)</span>
                </span>
                <span className="block">{profile.role}</span>
            </figcaption>
        </figure>
    );
}

/**
 * Who he is, on the same four columns as everything else: the opening
 * sentence set large with his picture beside it as a work card, the rest of
 * the story in labelled sections, and the way on to a project at the end.
 *
 * Every record renders only if it has entries, so the page reads as finished
 * whether there are three records on it or thirty.
 */
export default function AboutPage() {
    const links = profile.links.filter((link) => link.label !== 'Email');

    return (
        <main>
            <JsonLd id="schema-about" data={jsonLd} />
            <BarSpace />

            <div className="px-5 md:px-8">
                <PageTitle
                    size="sentence"
                    title={about.lead}
                    aside={<FactsCard />}
                />

                <PageSection label="About">
                    <div className="space-y-6">
                        {about.paragraphs.map((paragraph) => (
                            <p key={paragraph.slice(0, 40)} className={prose}>
                                {paragraph.split(/\*(.+?)\*/).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}
                            </p>
                        ))}
                        <p className={prose}>
                            {about.signoff}{' '}
                            {/* The sign-off carries the routes out, so the
                                friendly ending is also the useful one. */}
                            <a
                                href={`mailto:${profile.email}`}
                                className="text-chalk underline decoration-edge underline-offset-4 transition-colors hover:decoration-chalk"
                            >
                                Email
                            </a>
                            {links.map((link) => (
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
                </PageSection>

                {experience.length > 0 && (
                    <PageSection label="Experience">
                        <Record
                            entries={experience.map((item) => ({
                                period: item.period,
                                title: `${item.role} · ${item.org}`,
                                detail: item.detail,
                            }))}
                        />
                    </PageSection>
                )}

                {education.length > 0 && (
                    <PageSection label="Education">
                        <Record
                            entries={education.map((item) => ({
                                period: item.period,
                                title: `${item.title} · ${item.org}`,
                                detail: item.detail,
                            }))}
                        />
                    </PageSection>
                )}

                {volunteering.length > 0 && (
                    <PageSection label="Volunteering">
                        <Record
                            entries={volunteering.map((item) => ({
                                period: item.period,
                                title: `${item.role} · ${item.org}`,
                                detail: item.detail,
                            }))}
                        />
                    </PageSection>
                )}

                {awards.length > 0 && (
                    <PageSection label="Awards">
                        <Record
                            entries={awards.map((item) => ({
                                period: item.year,
                                title: item.org ? `${item.title} · ${item.org}` : item.title,
                            }))}
                        />
                    </PageSection>
                )}

                {/* The way on, set like a case study's next project: large,
                    and the whole line is the link. */}
                <section className="grid grid-cols-1 gap-x-5 gap-y-6 border-t border-raise pb-8 pt-16 md:grid-cols-4 md:pt-24">
                    <p className={`${chrome} text-dust`}>
                        {profile.availability.headline}
                    </p>
                    <Link href="/contact" className="group md:col-span-3">
                        <span className="flex items-end gap-4 md:gap-6">
                            <RiseText
                                as="span"
                                inView
                                delay={0}
                                text="Start a project"
                                className="font-display text-[clamp(44px,5.6vw,104px)] font-normal leading-[0.94] tracking-[-0.05em] text-chalk transition-colors duration-500 group-hover:text-dust"
                            />
                            <ArrowRight
                                aria-hidden="true"
                                className="mb-[0.6vw] h-[clamp(28px,3.4vw,60px)] w-[clamp(28px,3.4vw,60px)] shrink-0 text-chalk transition-transform duration-500 group-hover:translate-x-2"
                            />
                        </span>
                    </Link>
                </section>

                <div className="pt-16">
                    <SiteFooter />
                </div>
            </div>
        </main>
    );
}
