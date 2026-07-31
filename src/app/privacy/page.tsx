import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { profile } from '@/content/profile';
import type { Metadata } from 'next';
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
        <main className="min-h-screen">
            <SiteNav />

            <div className="mx-auto max-w-[1240px] px-5 md:px-8">
                <section className="py-16 md:py-24">
                    <h1 className="font-display text-[clamp(30px,5vw,48px)] font-medium tracking-[-0.04em] text-chalk">
                        Privacy policy
                    </h1>
                    <p className="mt-4 text-[12px] text-dust">
                        Last updated 31 July 2026
                    </p>

                    <div className="mt-12 max-w-[68ch] space-y-10">
                        {sections.map((section) => (
                            <section key={section.heading}>
                                <h2 className="font-display text-[20px] font-medium tracking-[-0.02em] text-chalk">
                                    {section.heading}
                                </h2>
                                <p className="mt-3 font-sans text-[15px] leading-relaxed text-ash">
                                    {section.body}
                                </p>
                            </section>
                        ))}

                        <section>
                            <h2 className="font-display text-[20px] font-medium tracking-[-0.02em] text-chalk">
                                Contact
                            </h2>
                            <p className="mt-3 font-sans text-[15px] leading-relaxed text-ash">
                                Questions or complaints go to{' '}
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="text-chalk underline decoration-edge underline-offset-4 transition-colors hover:decoration-chalk"
                                >
                                    {profile.email}
                                </a>
                                .
                            </p>
                        </section>
                    </div>
                </section>

                <SiteFooter />
            </div>
        </main>
    );
}
