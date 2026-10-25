import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { BarSpace } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { chrome } from '@/components/layout/Page';
import { ReviewsBoard } from '@/components/sections/ReviewsBoard';
import { RiseText } from '@/components/ui/Rise';
import { JsonLd } from '@/components/seo/JsonLd';
import { profile } from '@/content/profile';
import { getReviews } from '@/lib/reviews';
import { PERSON_ID, SERVICE_ID, SITE_URL, breadcrumbSchema, graph, pageMetadata, reviewsSchema } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
    title: 'Client reviews',
    description:
        'What clients say about working with Abdelkader Ettouzany, web engineer and interface designer in Casablanca — reviews from founders and teams he has designed and built websites and apps for.',
    path: '/reviews',
});

/**
 * The reviews, on a page of their own so they can be found, linked and quoted
 * on their own: every review is plain text on the page and a Review node in
 * the structured data, tied to the service and to the project it's about.
 *
 * Grey, unlike the rest of the site, after the reference: white cards read as
 * cards on it, and the page reads as a wall of what other people said.
 */
export default async function ReviewsPage() {
    const reviews = await getReviews();

    const jsonLd = graph(
        {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/reviews#webpage`,
            url: `${SITE_URL}/reviews`,
            name: `Client reviews — ${profile.name}`,
            about: { '@id': SERVICE_ID },
            author: { '@id': PERSON_ID },
            mainEntity: { '@id': `${SITE_URL}/reviews#reviews` },
        },
        reviewsSchema(reviews),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Reviews', path: '/reviews' },
        ])
    );

    return (
        <main className="min-h-svh bg-shell">
            <JsonLd id="schema-reviews" data={jsonLd} />
            <BarSpace />

            <ReviewsBoard reviews={reviews} />

            <div className="px-5 md:px-8">
                {/* The way on, set like the About page's: large, and the
                    whole line is the link. */}
                <section className="grid grid-cols-1 gap-x-5 gap-y-6 border-t border-raise pb-8 pt-16 md:grid-cols-4 md:pt-24">
                    <p className={`${chrome} text-dust`}>{profile.availability.headline}</p>
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
