import type { Metadata } from 'next';
import { BarSpace } from '@/components/layout/SiteHeader';
import { WorkCarousel } from '@/components/sections/WorkCarousel';
import { JsonLd } from '@/components/seo/JsonLd';
import { getWork } from '@/lib/work';
import { profile } from '@/content/profile';
import {
    PERSON_ID,
    WEBSITE_ID,
    graph,
    pageMetadata,
    professionalServiceSchema,
} from '@/lib/seo';

export const revalidate = 60;

/**
 * The home page carried no metadata of its own, which meant no canonical and
 * no control over the one title that matters most. The root layout's default
 * title still applies — this sets everything around it.
 */
export const metadata: Metadata = pageMetadata({
    title: `${profile.name} — ${profile.role}`,
    description:
        'I design and build websites, booking and payment systems, and web apps. Instant estimate, fixed price in writing. Based in Casablanca, working worldwide.',
    path: '/',
    absoluteTitle: true,
});

/**
 * The home page is the work and nothing else: one screen on desktop, the bar
 * pinned above a row of projects that scrolling walks through.
 * The background lives on /about, and starting a project on /contact.
 */
export default async function Home() {
    const work = await getWork();

    const jsonLd = graph(
        {
            '@type': 'WebPage',
            '@id': 'https://etza.dev/#webpage',
            url: 'https://etza.dev',
            name: `${profile.name} — ${profile.role}`,
            isPartOf: { '@id': WEBSITE_ID },
            about: { '@id': PERSON_ID },
            primaryImageOfPage: 'https://etza.dev/opengraph-image',
        },
        professionalServiceSchema()
    );

    return (
        <main>
            <JsonLd id="schema-home" data={jsonLd} />

            <WorkCarousel items={work}>
                <BarSpace />
                {/* The references carry no headline — the bar and the work say
                    who this is. The claim stays in the document for search and
                    screen readers, which still need a page title. */}
                <h1 className="sr-only">
                    {profile.statement.greeting} {profile.statement.descriptor}
                </h1>
            </WorkCarousel>
        </main>
    );
}
