import { SiteFooter } from '@/components/layout/SiteFooter';
import { CaseStudyHero } from '@/components/sections/CaseStudyHero';
import { NextProject } from '@/components/work/NextProject';
import { Reveal, RiseIn, RiseText } from '@/components/ui/Rise';
import { Parallax } from '@/components/ui/Parallax';
import { JsonLd } from '@/components/seo/JsonLd';
import { notFound } from 'next/navigation';
import { getCaseStudies, getCaseStudy } from '@/lib/queries';
import { getWork } from '@/lib/work';
import { Metadata } from 'next';
import { RichContentBlock } from '@/types/database';
import { isVideoUrl } from '@/lib/utils';
import { breadcrumbSchema, caseStudySchema, graph, pageMetadata } from '@/lib/seo';
import Image from 'next/image';
import Markdown from 'react-markdown';

export const revalidate = 60;

/** Prerender every case study at build time instead of rendering each one on
 *  first request. `revalidate` above still picks up edits made in /admin. */
export async function generateStaticParams() {
    const studies = await getCaseStudies();
    return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const study = await getCaseStudy(slug);

    if (!study) {
        return { title: 'Case study not found', robots: { index: false, follow: true } };
    }

    // Truncate on a word boundary — a description cut mid-word reads as broken
    // in a search result, and the ellipsis was being appended unconditionally.
    const description =
        study.description.length > 155
            ? `${study.description.slice(0, 155).replace(/\s+\S*$/, '')}…`
            : study.description;

    const title = `${study.title} — ${study.category}`;

    // Some heroes are .webm loops. A video URL in og:image renders as a broken
    // attachment on every platform, so those studies fall back to the generated
    // card for the section instead.
    const ogImage =
        study.image_url && !isVideoUrl(study.image_url)
            ? {
                url: study.image_url,
                width: 1200,
                height: 630,
                alt: title,
            }
            : { url: '/opengraph-image', width: 1200, height: 630, alt: title };

    return {
        ...pageMetadata({
            title,
            description,
            path: `/work/${slug}`,
            ogType: 'article',
        }),
        openGraph: {
            title,
            description,
            url: `https://etza.dev/work/${slug}`,
            type: 'article',
            ...(study.created_at && { publishedTime: study.created_at }),
            images: [ogImage],
        },
        twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
    };
}

/** Small upper-case chrome, the same voice as the bar. */
const chrome = 'text-[11px] uppercase leading-[1.45] tracking-[0.06em]';

/**
 * The content blocks, with runs of consecutive paragraphs merged into one, so
 * a section's text reads as one column instead of a stack of separate cells.
 */
function groupBlocks(blocks: RichContentBlock[]) {
    const out: RichContentBlock[] = [];
    for (const block of blocks) {
        const prev = out[out.length - 1];
        if (block.type === 'text' && prev?.type === 'text') {
            out[out.length - 1] = { ...prev, value: `${prev.value}\n\n${block.value}` };
        } else {
            out.push(block);
        }
    }
    return out;
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [study, work] = await Promise.all([getCaseStudy(slug), getWork()]);

    if (!study) {
        notFound();
    }

    // The home row's card for this project, so the hero is the same cover the
    // visitor clicked on; and the card after it, wrapping round at the end.
    const href = `/work/${study.slug}`;
    const index = work.findIndex((w) => w.href === href);
    const card = index >= 0 ? work[index] : null;
    const linked = work.filter((w) => w.href);
    const at = linked.findIndex((w) => w.href === href);
    const next = linked.length > 1 ? linked[(at + 1) % linked.length] : null;

    const facts = [study.category, [study.year, study.timeline].filter(Boolean).join(' · ')].filter(Boolean);
    const scope = study.scope_of_work ?? [];

    const blocks = groupBlocks((study.content as unknown as RichContentBlock[]) || []);
    const overview = study.description.split('\n\n').filter(Boolean);

    const jsonLd = graph(
        caseStudySchema(study),
        // Two levels, not three: the work index is a section of the home page
        // rather than a route of its own, and a breadcrumb has to point at
        // URLs that actually resolve.
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: study.title, path: `/work/${study.slug}` },
        ])
    );

    return (
        <main>
            <JsonLd id="schema-case-study" data={jsonLd} />

            <CaseStudyHero
                href={href}
                title={study.title}
                facts={facts}
                scope={scope}
                cover={{
                    image: card?.image ?? study.image_url,
                    backdrop: card?.backdrop ?? null,
                    full: card?.full ?? false,
                    alt: `${study.title} — ${study.category}`,
                }}
            />

            {/* Everything below the first screen sits on the same four
                columns: labels in the first, reading in the middle two,
                figures across all four. */}
            <div data-fade-on-leave className="px-5 md:px-8">
                {overview.length > 0 && (
                    <section className="grid grid-cols-1 gap-x-5 gap-y-6 py-24 md:grid-cols-4 md:py-40">
                        <h2 className={`${chrome} text-dust`}>
                            <RiseIn inView>Overview</RiseIn>
                        </h2>
                        <div className="space-y-6 md:col-span-3">
                            {overview.map((para, i) =>
                                // The lead paragraph is set large, so it
                                // arrives the way the page title did.
                                i === 0 ? (
                                    <RiseText
                                        key={i}
                                        inView
                                        delay={0}
                                        text={para}
                                        className="max-w-[30ch] font-display text-[clamp(26px,2.9vw,48px)] font-normal leading-[1.12] tracking-[-0.035em] text-chalk"
                                    />
                                ) : (
                                    <Reveal key={i} delay={0.1}>
                                        <p className="max-w-[58ch] text-[17px] leading-[1.6] text-ash">{para}</p>
                                    </Reveal>
                                )
                            )}
                        </div>
                    </section>
                )}

                {blocks.length > 0 && (
                    <article className="grid grid-cols-1 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-y-16">
                        {blocks.map((block, index) => {
                            if (block.type === 'heading') {
                                const level = block.level || 2;
                                // A section heading labels the first column,
                                // in the bar's voice; smaller headings stay in
                                // the reading column, above their text.
                                if (level === 2) {
                                    return (
                                        <h2 key={index} className={`${chrome} pt-2 text-dust md:col-start-1`}>
                                            <RiseIn inView block>
                                                {block.value}
                                            </RiseIn>
                                        </h2>
                                    );
                                }
                                const Tag = `h${level}` as 'h3' | 'h4';
                                return (
                                    <Reveal key={index} className="md:col-span-2 md:col-start-2">
                                        <Tag className="font-display text-[22px] font-medium tracking-[-0.025em] text-chalk">
                                            {block.value}
                                        </Tag>
                                    </Reveal>
                                );
                            }

                            if (block.type === 'text') {
                                return (
                                    <Reveal key={index} className="md:col-span-2 md:col-start-2">
                                        <div
                                            className="prose max-w-[62ch] text-[17px] leading-[1.6] text-ash prose-headings:font-display prose-headings:font-medium prose-headings:tracking-[-0.025em] prose-headings:text-chalk prose-p:text-ash prose-a:text-chalk prose-a:underline-offset-4 prose-strong:text-chalk prose-code:text-chalk prose-li:text-ash"
                                        >
                                            {/* The page's h1 is the title in the
                                                hero. A `#` typed into the admin
                                                editor would otherwise emit a second
                                                one inside the article — keep the
                                                text, drop the tag. */}
                                            <Markdown disallowedElements={['h1']} unwrapDisallowed>
                                                {block.value}
                                            </Markdown>
                                        </div>
                                    </Reveal>
                                );
                            }

                            const label = `${study.title} — ${study.category}, figure ${index + 1}`;
                            return (
                                <Reveal key={index} kind="media" className="md:col-span-4">
                                    {/* Drifts against the scroll inside its frame (see Parallax). */}
                                    <figure className="overflow-hidden bg-shell">
                                        <Parallax>
                                            {isVideoUrl(block.value) || block.type === 'video' ? (
                                                <video
                                                    src={block.value}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    preload="metadata"
                                                    aria-label={label}
                                                    className="block w-full"
                                                />
                                            ) : (
                                                /* Intrinsic size is unknown — the URL
                                                   comes from the database — so the
                                                   figure is sized by width and lets
                                                   the image keep its own ratio. */
                                                <Image
                                                    src={block.value}
                                                    alt={label}
                                                    width={1920}
                                                    height={0}
                                                    sizes="100vw"
                                                    className="block h-auto w-full"
                                                />
                                            )}
                                        </Parallax>
                                    </figure>
                                </Reveal>
                            );
                        })}
                    </article>
                )}

                {study.testimonial_text && (
                    <section className="grid grid-cols-1 gap-x-5 gap-y-6 py-24 md:grid-cols-4 md:py-40">
                        <h2 className={`${chrome} text-dust`}>
                            <RiseIn inView>Client</RiseIn>
                        </h2>
                        <figure className="md:col-span-3">
                            <RiseText
                                as="blockquote"
                                inView
                                delay={0}
                                text={`“${study.testimonial_text}”`}
                                className="max-w-[26ch] font-display text-[clamp(28px,3.2vw,56px)] font-normal leading-[1.08] tracking-[-0.04em] text-chalk"
                            />
                            <figcaption className={`mt-8 ${chrome} text-chalk`}>
                                <RiseIn inView delay={0.5}>
                                    {study.testimonial_author}
                                </RiseIn>
                            </figcaption>
                        </figure>
                    </section>
                )}

                {next && next.href !== href && (
                    <section className="pb-8 pt-24 md:pt-40">
                        <NextProject item={next} />
                    </section>
                )}

                <SiteFooter />
            </div>
        </main>
    );
}
