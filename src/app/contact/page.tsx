import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowDownRight } from '@phosphor-icons/react/dist/ssr';
import { BarSpace } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ContactForm } from '@/components/sections/ContactForm';
import { RiseText } from '@/components/ui/Rise';
import { JsonLd } from '@/components/seo/JsonLd';
import { profile } from '@/content/profile';
import { PERSON_ID, SERVICE_ID, breadcrumbSchema, graph, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    title: 'Contact — start a project',
    description:
        'Start a project with Abdelkader Ettouzany, web engineer and interface designer in Casablanca. Tell me what it is, what it needs and roughly the budget — you’ll get a reply within a day.',
    path: '/contact',
});

const jsonLd = graph(
    {
        '@type': 'ContactPage',
        name: 'Contact Abdelkader Ettouzany',
        url: 'https://etza.dev/contact',
        description: 'Start a website or web app project.',
        mainEntity: { '@id': PERSON_ID },
        about: { '@id': SERVICE_ID },
    },
    breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
    ])
);

/** Small upper-case chrome, the same voice as the bar. */
const chrome = 'text-[11px] uppercase leading-[1.45] tracking-[0.06em]';

/**
 * Starting a project. The layout follows the reference: the invitation set
 * large with the person beside it and an arrow down to the form, then the
 * form as numbered questions on rules, with the direct routes in a column of
 * their own. The type, the grey and the four columns are the home page's —
 * the details column is the one the bar keeps the local time in.
 */
export default function ContactPage() {
    const socials = profile.links.filter((l) => l.label !== 'Email');
    const detail = 'text-[16px] leading-[1.6] text-chalk';

    return (
        <main>
            <JsonLd id="schema-contact" data={jsonLd} />
            <BarSpace />

            <div className="px-5 md:px-8">
                <section className="grid grid-cols-1 gap-x-5 gap-y-10 pb-16 pt-20 md:grid-cols-4 md:pb-28 md:pt-36">
                    <RiseText
                        as="h1"
                        text="Let’s start a project together"
                        className="max-w-[13ch] font-display text-[clamp(48px,6.6vw,128px)] font-normal leading-[0.94] tracking-[-0.055em] text-chalk md:col-span-3"
                    />

                    {/* The person beside the invitation, and the arrow down to
                        where you talk to him. */}
                    <div className="flex items-end gap-8 md:flex-col md:items-start md:justify-center md:gap-14">
                        <Image
                            src="/images/avatar.jpg"
                            alt={profile.name}
                            width={128}
                            height={128}
                            priority
                            className="h-20 w-20 rounded-full object-cover md:h-28 md:w-28"
                        />
                        <ArrowDownRight size={22} aria-hidden="true" className="mb-1 text-chalk md:mb-0" />
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-x-5 gap-y-16 pb-24 md:grid-cols-4 md:pb-40">
                    <div className="md:col-span-3 lg:col-span-2">
                        <ContactForm />
                    </div>

                    <aside className="space-y-10 md:col-start-4 md:pt-11">
                        <div>
                            <h2 className={`${chrome} text-dust`}>Contact details</h2>
                            <ul className={`mt-3 ${detail}`}>
                                <li>
                                    <a
                                        href={`mailto:${profile.email}`}
                                        data-umami-event="send_email"
                                        data-umami-event-label="Contact page"
                                        className="transition-colors hover:text-dust"
                                    >
                                        {profile.email}
                                    </a>
                                </li>

                            </ul>
                        </div>

                        <div>
                            <h2 className={`${chrome} text-dust`}>Business details</h2>
                            <ul className={`mt-3 ${detail}`}>
                                <li>{profile.name}</li>
                                <li>{profile.location}</li>
                                <li>Working worldwide, GMT+1</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className={`${chrome} text-dust`}>Socials</h2>
                            <ul className={`mt-3 ${detail}`}>
                                {socials.map((link) => {
                                    const rating = 'rating' in link ? link.rating : null;
                                    return (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="transition-colors hover:text-dust"
                                            >
                                                {link.label}
                                                {rating && (
                                                    <span
                                                        aria-label={`, rated ${rating} out of 5`}
                                                        className="tabular ml-2 text-[13px] text-dust"
                                                    >
                                                        {rating} ★
                                                    </span>
                                                )}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </aside>
                </section>

                <SiteFooter />
            </div>
        </main>
    );
}
