import type { Metadata } from 'next';
import { IdentityRail } from '@/components/layout/IdentityRail';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ContactForm } from '@/components/sections/ContactForm';
import { JsonLd } from '@/components/seo/JsonLd';
import { profile } from '@/content/profile';
import { PERSON_ID, SERVICE_ID, breadcrumbSchema, graph, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    title: 'Contact — start a project',
    description:
        'Start a project with Abdelkader Ettouzany, web engineer and interface designer in Rabat. Tell me what it is, what’s in the way and when you need it — you’ll get a reply within a day, with what I’d do first.',
    path: '/contact',
});

const jsonLd = graph(
    {
        '@type': 'ContactPage',
        name: 'Contact Abdelkader Ettouzany',
        url: 'https://etza.dev/contact',
        description: 'Start a project, or open a conversation about a role.',
        mainEntity: { '@id': PERSON_ID },
        about: { '@id': SERVICE_ID },
    },
    breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
    ])
);

export default function ContactPage() {
    return (
        <main className="min-h-screen">
            <JsonLd id="schema-contact" data={jsonLd} />

            <div className="flex flex-col lg:flex-row">
                <header className="px-5 py-10 md:px-8 lg:sticky lg:top-0 lg:h-screen lg:w-[276px] lg:shrink-0 lg:py-12">
                    <IdentityRail />
                </header>

                <div className="min-w-0 flex-1 px-5 md:px-8 lg:px-10">
                    {/* Holds the viewport and sits in the middle of it. `min-h`
                        rather than `h` so a long form on a short screen grows
                        and scrolls instead of being clipped. */}
                    <div className="flex min-h-screen items-center py-14 md:py-20">
                        {/* The claim takes the left column, the form the right.
                            Below lg they stack, claim first. */}
                        <div
                            id="form"
                            className="mx-auto grid w-full max-w-[1180px] scroll-mt-8 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24"
                        >
                            {/* Grid items stretch, so this column is as tall as
                                the form beside it — the claim holds the top and
                                the direct routes sit on the bottom edge rather
                                than crowding under the heading. Stacked below
                                lg there's no height to spread into, so the
                                margin does the separating instead. */}
                            <div className="flex flex-col justify-between">
                                <h1 className="max-w-[13ch] font-display text-[clamp(36px,5.4vw,64px)] font-medium leading-[1.02] tracking-[-0.045em] text-chalk">
                                    Let&rsquo;s build the thing.
                                </h1>

                                <div className="mt-16 lg:mt-0">
                                    <p className="text-[12px] uppercase tracking-[0.08em] text-dust">
                                        Or go direct
                                    </p>
                                    <div className="mt-3 flex flex-col items-start gap-2">
                                        <a
                                            href={`mailto:${profile.email}`}
                                            data-umami-event="send_email"
                                            data-umami-event-label="Contact page"
                                            className="text-[15px] text-chalk underline decoration-edge underline-offset-4 transition-colors hover:decoration-chalk"
                                        >
                                            {profile.email}
                                        </a>
                                        <a
                                            href="/book"
                                            data-umami-event="click_book_call"
                                            data-umami-event-label="Contact page"
                                            className="text-[15px] text-ash transition-colors hover:text-chalk"
                                        >
                                            Book a 20-minute call
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <ContactForm />
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1180px]">
                        <SiteFooter />
                    </div>
                </div>
            </div>
        </main>
    );
}
