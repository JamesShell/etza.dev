import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BarSpace } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PageTitle, chrome, prose } from '@/components/layout/Page';
import { profile } from '@/content/profile';
import { pageMetadata } from '@/lib/seo';
import { BookEmbedShell, PrefilledBookEmbed } from './BookEmbed';

/**
 * Booking is by invitation: this page is a link handed out directly, so the
 * site never leads here and search engines are asked not to list it. It still
 * works for anyone who has the link.
 */
export const metadata: Metadata = {
    ...pageMetadata({
        title: 'Book a call',
        description:
            'Book a 30-minute call with Abdelkader Ettouzany. Bring the problem, not a brief — leave with a rough scope, a price range and a clear next step.',
        path: '/book',
    }),
    robots: { index: false, follow: false },
};

export default function BookPage() {
    return (
        <main>
            <BarSpace />

            <div className="px-5 md:px-8">
                <PageTitle
                    title="Book a 30-minute call"
                    aside={
                        <div className="space-y-4">
                            <p className={prose}>
                                Bring the problem, not a brief. We&rsquo;ll work out whether I&rsquo;m the right person
                                for it, and what a sensible first step looks like.
                            </p>
                            <p className={`${chrome} text-dust`}>
                                Or email{' '}
                                <a
                                    href={`mailto:${profile.email}`}
                                    data-umami-event="send_email"
                                    data-umami-event-label="Booking page"
                                    className="text-chalk transition-colors hover:text-dust"
                                >
                                    {profile.email}
                                </a>
                            </p>
                        </div>
                    }
                />

                <Suspense fallback={<BookEmbedShell />}>
                    <PrefilledBookEmbed />
                </Suspense>

                <div className="pt-16">
                    <SiteFooter />
                </div>
            </div>
        </main>
    );
}
