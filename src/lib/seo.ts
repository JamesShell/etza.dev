import type { Metadata } from 'next';
import { capabilities, experience, faqs, profile, stack } from '@/content/profile';
import type { CaseStudy } from '@/types/database';

/**
 * The canonical origin, in one place. Everything that has to print an absolute
 * URL — metadata, sitemap, robots, llms.txt, structured data — reads it from
 * here, so moving domains is a one-line change rather than a grep.
 */
export const SITE_URL = 'https://etza.dev';

/** Stable @id fragments, so one node can be described once and referenced by
 *  every other graph on the site rather than duplicated into each page. */
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SERVICE_ID = `${SITE_URL}/#service`;

export function absoluteUrl(path = '/'): string {
    return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * Every page's metadata goes through here. The point is `alternates.canonical`:
 * it can't be set once on the root layout (that would claim `/` for every URL
 * on the site), so it has to be repeated per route — and a helper is the only
 * version of "repeated per route" that can't be forgotten on the next page.
 */
export function pageMetadata({
    title,
    description,
    path,
    ogType = 'website',
    absoluteTitle = false,
}: {
    title: string;
    description: string;
    path: string;
    ogType?: 'website' | 'article' | 'profile';
    /** Skips the root layout's `%s — Abdelkader Ettouzany` template. Set it
     *  where the title already carries the name, so it isn't printed twice. */
    absoluteTitle?: boolean;
}): Metadata {
    return {
        title: absoluteTitle ? { absolute: title } : title,
        description,
        alternates: { canonical: path },
        // No `images` here on purpose. Declaring `openGraph` on a route
        // replaces the parent's object, and an explicit `images` array also
        // beats the file convention — which would silently swap every route's
        // own generated card for the site-wide one. Each route gets an
        // `opengraph-image.tsx` instead, and this stays out of the way.
        openGraph: {
            title,
            description,
            url: absoluteUrl(path),
            type: ogType,
        },
        twitter: {
            title,
            description,
        },
    };
}

/** Profile links that are real profiles. The Email entry is flagged `external`
 *  like the rest, and a `mailto:` in `sameAs` is invalid — so filter on scheme
 *  rather than on the flag. */
export function profileUrls(): string[] {
    return profile.links
        .filter((link) => link.href.startsWith('http'))
        .map((link) => link.href);
}

export function personSchema() {
    return {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: profile.name,
        alternateName: profile.shortName,
        jobTitle: profile.role,
        description: profile.statement.support,
        email: `mailto:${profile.email}`,
        url: SITE_URL,
        image: absoluteUrl('/images/avatar.jpg'),
        address: {
            '@type': 'PostalAddress',
            addressLocality: profile.location.split(',')[0],
            addressCountry: 'MA',
        },
        knowsAbout: [...capabilities.map((c) => c.title), ...stack],
        knowsLanguage: ['en', 'fr', 'ar'],
        sameAs: profileUrls(),
        ...(experience.length > 0 && {
            hasOccupation: experience.map((role) => ({
                '@type': 'Occupation',
                name: role.role,
                description: role.detail,
            })),
        }),
    };
}

export function websiteSchema() {
    return {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: `${profile.name} — ${profile.role}`,
        alternateName: 'etza.dev',
        inLanguage: 'en',
        publisher: { '@id': PERSON_ID },
    };
}

/**
 * The service side of the same person. No price is claimed: every project is
 * priced in writing after the first call, so there's no figure on the site
 * for a schema to repeat.
 */
export function professionalServiceSchema() {
    return {
        '@type': 'ProfessionalService',
        '@id': SERVICE_ID,
        name: `${profile.name} — ${profile.role}`,
        url: SITE_URL,
        image: absoluteUrl('/images/avatar.jpg'),
        provider: { '@id': PERSON_ID },
        founder: { '@id': PERSON_ID },
        email: `mailto:${profile.email}`,
        areaServed: [
            { '@type': 'Country', name: 'Morocco' },
            { '@type': 'Place', name: 'Remote — worldwide' },
        ],
        address: {
            '@type': 'PostalAddress',
            addressLocality: profile.location.split(',')[0],
            addressCountry: 'MA',
        },
        knowsLanguage: ['en', 'fr', 'ar'],
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Services',
            itemListElement: capabilities.map((capability) => ({
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: capability.title,
                    description: capability.detail,
                },
            })),
        },
    };
}

/** The questions that already exist on the home page, made retrievable.
 *  Answers are used whole — a truncated answer in schema is a different answer
 *  from the one on the page. */
export function faqSchema() {
    return {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

/**
 * The reviews page as data: a list of Review nodes, each by a named person,
 * about the service, linked to the project it concerns. A rating appears only
 * where the review carried one. Google won't show stars for reviews a business
 * publishes about itself, so this isn't for rich results — it's so search and
 * answer engines can read who said what about which project, and quote it.
 */
export function reviewsSchema(
    reviews: { quote: string; author: string; detail: string | null; project: string | null; href: string | null; rating: number | null }[]
) {
    return {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/reviews#reviews`,
        name: `Client reviews of ${profile.name}`,
        numberOfItems: reviews.length,
        itemListElement: reviews.map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'Review',
                author: { '@type': 'Person', name: r.author, ...(r.detail && { description: r.detail }) },
                reviewBody: r.quote,
                itemReviewed: { '@id': SERVICE_ID },
                ...(r.rating && {
                    reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
                }),
                ...(r.project && {
                    about: { '@type': 'CreativeWork', name: r.project, ...(r.href && { url: absoluteUrl(r.href) }) },
                }),
            },
        })),
    };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

export function caseStudySchema(study: CaseStudy) {
    const keywords = [study.category, ...(study.scope_of_work ?? [])].filter(Boolean);

    return {
        '@type': 'CreativeWork',
        '@id': `${SITE_URL}/work/${study.slug}#work`,
        name: study.title,
        headline: study.title,
        description: study.description,
        image: study.image_url,
        url: absoluteUrl(`/work/${study.slug}`),
        genre: study.category,
        ...(keywords.length > 0 && { keywords: keywords.join(', ') }),
        ...(study.created_at && { datePublished: study.created_at }),
        ...(study.year && { copyrightYear: study.year }),
        creator: { '@id': PERSON_ID },
        author: { '@id': PERSON_ID },
        isPartOf: { '@id': WEBSITE_ID },
        ...(study.testimonial_text && {
            review: {
                '@type': 'Review',
                reviewBody: study.testimonial_text,
                ...(study.testimonial_author && {
                    author: { '@type': 'Person', name: study.testimonial_author },
                }),
                itemReviewed: { '@id': SERVICE_ID },
            },
        }),
    };
}

/**
 * Wraps any number of schema nodes into one `@graph` document, so a page emits
 * a single script tag whose nodes can cross-reference each other by @id.
 */
export function graph(...nodes: object[]) {
    return {
        '@context': 'https://schema.org',
        '@graph': nodes,
    };
}

/**
 * Real modification dates for the routes that aren't database-backed. A sitemap
 * that stamps `new Date()` on every entry tells a crawler that the whole site
 * changed on every fetch, which is the same as telling it nothing.
 *
 * Bump the date on a route when you meaningfully change its copy.
 */
export const ROUTE_UPDATED: Record<string, string> = {
    '/': '2026-10-17',
    '/about': '2026-10-17',
    '/contact': '2026-10-25',
    '/reviews': '2026-10-26',
    '/privacy': '2026-07-31',
    '/cookies': '2026-07-31',
};
