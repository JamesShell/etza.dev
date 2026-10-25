import type { Metadata } from 'next';
import { BarSpace } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PageSection, PageTitle, prose } from '@/components/layout/Page';
import { profile } from '@/content/profile';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    title: 'Privacy policy',
    description:
        'How etza.dev handles your data: what analytics records, what happens to an enquiry, who else processes it, and how to have it deleted.',
    path: '/privacy',
});

const sections = [
    {
        heading: 'What I collect',
        body: 'When you visit this site, analytics records your browser, approximate location and the pages you open. It sets no cookies and does not identify you or follow you to other sites. If you email me or book a call, I keep what you send so I can reply.',
    },
    {
        heading: 'What I use it for',
        body: 'Understanding which work people actually look at, and replying to enquiries. Nothing is sold, and nothing is used for advertising.',
    },
    {
        heading: 'Who else sees it',
        body: 'Umami processes site usage. Cal.com processes any call you book. No one else receives your data.',
    },
    {
        heading: 'Your rights',
        body: 'You can ask to see the personal data I hold about you, correct it, or have it deleted. Email me and I will action it.',
    },
];

export default function PrivacyPage() {
    return (
        <main>
            <BarSpace />

            <div className="px-5 md:px-8">
                <PageTitle eyebrow="Last updated 31 July 2026" title="Privacy policy" />

                {sections.map((section) => (
                    <PageSection key={section.heading} label={section.heading}>
                        <p className={prose}>{section.body}</p>
                    </PageSection>
                ))}

                <PageSection label="Contact">
                    <p className={prose}>
                        Questions or complaints go to{' '}
                        <a
                            href={`mailto:${profile.email}`}
                            className="text-chalk underline decoration-edge underline-offset-4 transition-colors hover:decoration-chalk"
                        >
                            {profile.email}
                        </a>
                        .
                    </p>
                </PageSection>

                <div className="pt-16">
                    <SiteFooter />
                </div>
            </div>
        </main>
    );
}
