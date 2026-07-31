import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { CaseStudyHero } from '@/components/sections/CaseStudyHero';
import { JsonLd } from '@/components/seo/JsonLd';
import { notFound } from 'next/navigation';
import { getCaseStudies, getCaseStudy } from '@/lib/queries';
import { Metadata } from 'next';
import { RichContentBlock } from '@/types/database';
import { isVideoUrl } from '@/lib/utils';
import { breadcrumbSchema, caseStudySchema, graph, pageMetadata } from '@/lib/seo';
import Image from 'next/image';
import Link from 'next/link';
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

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const study = await getCaseStudy(slug);

    if (!study) {
        notFound();
    }

    const metrics: { label: string; value: React.ReactNode }[] = [
        { label: 'Discipline', value: study.category },
    ];
    if (study.year) metrics.push({ label: 'Year', value: study.year });
    if (study.timeline) metrics.push({ label: 'Timeline', value: study.timeline });
    if (study.scope_of_work && study.scope_of_work.length > 0) {
        metrics.push({
            label: 'Scope',
            value: (
                <span className="flex flex-wrap gap-x-2 gap-y-1">
                    {study.scope_of_work.map((item, i) => (
                        <span key={i} className="flex items-center gap-2">
                            {item}
                            {i < study.scope_of_work.length - 1 && (
                                <span className="text-hairline">·</span>
                            )}
                        </span>
                    ))}
                </span>
            ),
        });
    }

    const contentBlocks = (study.content as unknown as RichContentBlock[]) || [];

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
        <main className="min-h-screen">
            <JsonLd id="schema-case-study" data={jsonLd} />
            <SiteNav />

            <CaseStudyHero
                title={study.title}
                type={study.category}
                description={study.description}
                metrics={metrics}
                heroImage={study.image_url}
            />

            <article className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
                {/* The hero runs the full 1240; the body sits in the middle of
                    it at the same 840 as /about, so figures get real width
                    while the prose inside them stays at a readable measure. */}
                <div className="mx-auto max-w-[840px]">
                    {contentBlocks.map((block, index) => {
                        const prev = index > 0 ? contentBlocks[index - 1] : null;
                        const spacing = index === 0 ? '' : prev?.type === 'heading' ? 'mt-5' : 'mt-12';

                        return (
                            <div key={index} className={spacing}>
                                {block.type === 'heading' &&
                                    (() => {
                                        const level = block.level || 2;
                                        const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
                                        const size =
                                            level === 2
                                                ? 'text-[26px] md:text-[30px]'
                                                : level === 3
                                                    ? 'text-[21px] md:text-[23px]'
                                                    : 'text-[18px]';
                                        return (
                                            <Tag
                                                className={`font-display font-medium tracking-[-0.03em] text-chalk ${size}`}
                                            >
                                                {block.value}
                                            </Tag>
                                        );
                                    })()}

                                {block.type === 'text' && (
                                    <div className="prose prose-invert max-w-[72ch] font-sans text-[17px] leading-relaxed text-ash prose-headings:font-display prose-headings:font-medium prose-headings:tracking-[-0.03em] prose-headings:text-chalk prose-p:text-ash prose-a:text-chalk prose-a:underline-offset-4 prose-strong:text-chalk prose-code:text-chalk prose-li:text-ash">
                                        {/* The page's h1 is the title in the
                                            hero. A `#` typed into the admin
                                            editor would otherwise emit a second
                                            one inside the article — keep the
                                            text, drop the tag. */}
                                        <Markdown disallowedElements={['h1']} unwrapDisallowed>
                                            {block.value}
                                        </Markdown>
                                    </div>
                                )}

                                {(block.type === 'image' || block.type === 'video') && (
                                    <figure className="overflow-hidden rounded-2xl bg-shell">
                                        {isVideoUrl(block.value) || block.type === 'video' ? (
                                            <video
                                                src={block.value}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                                aria-label={`${study.title} — ${study.category}, figure ${index + 1}`}
                                                className="block w-full"
                                            />
                                        ) : (
                                            /* Intrinsic size is unknown — the URL
                                               comes from the database — so the
                                               figure is sized by width and lets
                                               the image keep its own ratio. That
                                               still buys AVIF/WebP and lazy
                                               loading over a raw <img>. */
                                            <Image
                                                src={block.value}
                                                alt={`${study.title} — ${study.category}, figure ${index + 1}`}
                                                width={1240}
                                                height={0}
                                                sizes="(min-width: 840px) 840px, 100vw"
                                                className="block h-auto w-full"
                                            />
                                        )}
                                    </figure>
                                )}
                            </div>
                        );
                    })}

                    {study.testimonial_text && (
                        <figure className="mt-16 pt-10">
                            <blockquote className="max-w-[52ch] font-display text-[21px] font-medium leading-snug tracking-[-0.02em] text-chalk md:text-[24px]">
                                &ldquo;{study.testimonial_text}&rdquo;
                            </blockquote>
                            <figcaption className="mt-5 text-[12px] text-dust">
                                {study.testimonial_author}
                            </figcaption>
                        </figure>
                    )}

                    {/* Inside the column, so the way out lines up with the last
                        line of the read rather than with the page edge. */}
                    <div className="mt-20 pt-8">
                        <Link
                            href="/#work"
                            className="group inline-flex items-baseline gap-2 text-[12px] text-ash transition-colors hover:text-chalk"
                        >
                            <ArrowLeft
                                size={14}
                                aria-hidden="true"
                                className="self-center transition-transform duration-300 group-hover:-translate-x-1"
                            />
                            All work
                        </Link>
                    </div>
                </div>
            </article>

            <div className="mx-auto max-w-[1240px] px-5 md:px-8">
                <SiteFooter />
            </div>
        </main>
    );
}
