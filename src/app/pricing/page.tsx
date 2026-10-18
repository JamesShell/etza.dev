import React from 'react';
import type { Metadata } from 'next';
import { IdentityRail } from '@/components/layout/IdentityRail';
import { Section } from '@/components/layout/Section';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PricingBuilder } from '@/components/sections/PricingBuilder';
import { Process } from '@/components/sections/Process';
import { Working } from '@/components/sections/Working';
import { JsonLd } from '@/components/seo/JsonLd';
import { pricing } from '@/content/profile';
import { money, pricingQuestions } from '@/lib/pricing';
import { SERVICE_ID, SITE_URL, breadcrumbSchema, graph, pageMetadata, pricingSchema } from '@/lib/seo';

// The starting prices go in the description itself: it's the line a search
// result shows, and "from $1,500" answers the query before the click.
export const metadata: Metadata = pageMetadata({
    title: 'Website & web app pricing',
    description: `Websites from ${money(pricing.types.website.base.price)}, web apps from ${money(pricing.types.webapp.base.price)}. Pick features, see an instant estimate, then fix the price in writing on a 30-minute call.`,
    path: '/pricing',
});

const jsonLd = graph(
    {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/pricing#webpage`,
        name: 'Website & web app pricing',
        url: `${SITE_URL}/pricing`,
        description: 'An instant project estimate, followed by a fixed price in writing.',
        about: { '@id': SERVICE_ID },
        mainEntity: { '@id': `${SITE_URL}/pricing#catalog` },
    },
    pricingSchema(),
    breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Pricing', path: '/pricing' },
    ])
);

/**
 * Its own page rather than a band on the home page: someone ready to price a
 * project shouldn't have to scroll past the portfolio to get to it, and the
 * estimate needs the full width of the column for its two-up layout.
 *
 * The steps follow the estimate on purpose — they answer "what happens after
 * I book?" at the moment that question comes up.
 */
export default function PricingPage() {
    return (
        <main className="min-h-screen">
            <JsonLd id="schema-pricing" data={jsonLd} />

            <div className="flex flex-col lg:flex-row">
                <header className="px-5 py-10 md:px-8 lg:sticky lg:top-0 lg:h-screen lg:w-[276px] lg:shrink-0 lg:py-12">
                    <IdentityRail />
                </header>

                <div className="min-w-0 flex-1 px-5 md:px-8 lg:px-10 lg:py-12">
                    <div className="pb-14 pt-2 md:pb-16 md:pt-6">
                        <h1 className="max-w-[17ch] font-display text-[clamp(34px,5vw,58px)] font-medium leading-[1.08] tracking-[-0.04em] text-chalk">
                            Get a price for your project
                        </h1>
                        <p className="mt-7 max-w-[56ch] font-sans text-[16px] leading-relaxed text-ash md:text-[17px]">
                            Pick what you need and see an estimate. The final price is fixed in writing after
                            a 30&#8209;minute call, and is usually within 10% of this.
                        </p>
                    </div>

                    <PricingBuilder />

                    {/* The same numbers as the estimator, in sentences. They
                        answer the question in the words people search with,
                        and they're the only place the web app prices exist
                        in the HTML before anyone switches the estimate over. */}
                    <Section id="questions" label="Pricing questions">
                        <Working items={pricingQuestions()} />
                    </Section>

                    <Section id="process" label="After you book">
                        <Process />
                    </Section>

                    <SiteFooter />
                </div>
            </div>
        </main>
    );
}
