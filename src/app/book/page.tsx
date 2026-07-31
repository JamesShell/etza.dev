import type { Metadata } from 'next';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { profile } from '@/content/profile';
import { PERSON_ID, breadcrumbSchema, graph, pageMetadata } from '@/lib/seo';
import { BookEmbed } from './BookEmbed';

export const metadata: Metadata = pageMetadata({
    title: 'Book a call',
    description:
        'Book a short call with Abdelkader Ettouzany, web engineer and interface designer in Rabat. Bring the problem, not a brief — we’ll work out whether I’m the right person for it.',
    path: '/book',
});

export default function BookPage() {
    const jsonLd = graph(
        {
            '@type': 'ContactPage',
            name: 'Book a call',
            url: 'https://etza.dev/book',
            description: 'Schedule a short introductory call.',
            mainEntity: { '@id': PERSON_ID },
        },
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Book a call', path: '/book' },
        ])
    );

    return (
        <main className="min-h-screen">
            <JsonLd id="schema-book" data={jsonLd} />
            <SiteNav />

            <div className="mx-auto max-w-[1240px] px-5 md:px-8">
                <section className="py-14 md:py-20">
                    <h1 className="max-w-[14ch] font-display text-[clamp(30px,5vw,48px)] font-medium leading-[1.08] tracking-[-0.04em] text-chalk">
                        Book a 20-minute call
                    </h1>
                    <p className="mt-6 max-w-[52ch] font-sans text-[16px] leading-relaxed text-ash">
                        Bring the problem, not a brief. We&rsquo;ll work out whether I&rsquo;m the right
                        person for it, and what a sensible first step looks like.
                    </p>
                    <p className="mt-4 text-[12px] text-dust">
                        Or email{' '}
                        <a
                            href={`mailto:${profile.email}`}
                            data-umami-event="send_email"
                            data-umami-event-label="Booking page"
                            className="text-ash transition-colors hover:text-chalk"
                        >
                            {profile.email}
                        </a>
                    </p>

                    <BookEmbed />
                </section>

                <SiteFooter />
            </div>
        </main>
    );
}
