import type { Metadata } from 'next';
import { BarSpace } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PageSection, PageTitle, chrome, prose } from '@/components/layout/Page';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    title: 'Cookie policy',
    description:
        'Which cookies etza.dev sets and why. Analytics here is cookieless; the only storage used is the consent choice itself and whatever Cal.com needs to book a call.',
    path: '/cookies',
});

const set = [
    {
        kind: 'Essential',
        detail: 'Remembers that you dismissed the cookie notice. Stored in your browser, never sent anywhere.',
    },
    {
        kind: 'Analytics',
        detail: 'None. Umami counts visits and shows which pages get read without setting a cookie or identifying anyone.',
    },
];

export default function CookiesPage() {
    return (
        <main>
            <BarSpace />

            <div className="px-5 md:px-8">
                <PageTitle eyebrow="Last updated 31 July 2026" title="Cookie policy" />

                <PageSection label="What cookies are">
                    <p className={prose}>
                        Small text files a site stores on your device, used to keep it working and to count visits.
                    </p>
                </PageSection>

                <PageSection label="What this site sets">
                    <dl>
                        {set.map((row) => (
                            <div
                                key={row.kind}
                                className="grid grid-cols-1 gap-x-5 gap-y-1 border-t border-raise py-4 first:border-t-0 first:pt-0 sm:grid-cols-[8rem_1fr]"
                            >
                                <dt className={`${chrome} pt-[0.4em] text-chalk`}>{row.kind}</dt>
                                <dd className={prose}>{row.detail}</dd>
                            </div>
                        ))}
                    </dl>
                </PageSection>

                <PageSection label="Turning them off">
                    <p className={prose}>
                        Every major browser can block or clear cookies in its settings. The site works fine without them.
                    </p>
                </PageSection>

                <div className="pt-16">
                    <SiteFooter />
                </div>
            </div>
        </main>
    );
}
