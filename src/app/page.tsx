import type { Metadata } from 'next';
import { IdentityRail } from '@/components/layout/IdentityRail';
import { Section } from '@/components/layout/Section';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Statement } from '@/components/sections/Statement';
import { WorkGrid } from '@/components/sections/WorkGrid';
import { WorkIndex } from '@/components/sections/WorkIndex';
import { Process } from '@/components/sections/Process';
import { Working } from '@/components/sections/Working';
import { Contact } from '@/components/sections/Contact';
import { JsonLd } from '@/components/seo/JsonLd';
import { supabase } from '@/lib/supabase';
import { getCaseStudies } from '@/lib/queries';
import { SelectedWork } from '@/types/database';
import { profile } from '@/content/profile';
import {
    PERSON_ID,
    WEBSITE_ID,
    faqSchema,
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
 * The home page is work-first: it answers "can this person build the thing?"
 * The CV answer — history, education, recognition — lives on /about so neither
 * audience has to scroll past the other's evidence.
 */
export default async function Home() {
    const { data: selectedWorksData } = await supabase
        .from('selected_works')
        .select('*')
        .order('sort_order', { ascending: true });

    const selectedWorks = (selectedWorksData as SelectedWork[]) || [];

    const caseStudies = await getCaseStudies();

    const worksWithStudies = selectedWorks.map((work) => ({
        ...work,
        case_study: caseStudies.find((cs) => cs.id === work.case_study_id) || null,
    }));

    // Only list what the grid above hasn't already shown, so the index adds
    // rather than repeats.
    const featuredIds = new Set(
        worksWithStudies.map((w) => w.case_study?.id).filter(Boolean) as string[]
    );
    const remainingStudies = caseStudies.filter((cs) => !featuredIds.has(cs.id));

    /**
     * The Person and WebSite nodes are declared once in the root layout; this
     * page adds what is specific to it. The FAQ is the important one — seven
     * answers that were previously readable only by a human with the patience
     * to open seven disclosure widgets.
     */
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
        professionalServiceSchema(),
        faqSchema()
    );

    return (
        <main className="min-h-screen">
            <JsonLd id="schema-home" data={jsonLd} />

            {/* Edge to edge: the rail is pinned to the left edge of the viewport
                and the grid takes every pixel that's left. No centred column. */}
            <div className="flex flex-col lg:flex-row">
                <header className="px-5 py-10 md:px-8 lg:sticky lg:top-0 lg:h-screen lg:w-[276px] lg:shrink-0 lg:py-12">
                    <IdentityRail />
                </header>

                <div className="min-w-0 flex-1 px-5 md:px-8 lg:px-10 lg:py-12">
                    <Statement />

                    <Section
                        id="work"
                        label="Selected work"
                        count={worksWithStudies.length ? String(worksWithStudies.length).padStart(2, '0') : undefined}
                    >
                        <WorkGrid works={worksWithStudies} />

                        {remainingStudies.length > 0 && (
                            <div className="mt-12">
                                <h3 className="mb-5 text-[12px] text-dust">
                                    More case studies
                                </h3>
                                <WorkIndex studies={remainingStudies} />
                            </div>
                        )}
                    </Section>

                    <Section id="process" label="How it works">
                        <Process />
                    </Section>

                    <Section id="working" label="Questions">
                        <Working />
                    </Section>

                    <Section id="contact" label="Contact">
                        <Contact />
                    </Section>

                    <SiteFooter />
                </div>
            </div>
        </main>
    );
}
