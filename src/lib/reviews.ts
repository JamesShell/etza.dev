import { cache } from 'react';
import { getCaseStudies } from '@/lib/queries';
import { testimonials } from '@/content/profile';

export type Review = {
    quote: string;
    author: string;
    /** Who they are to the work: a role, or where the review is published. */
    detail: string | null;
    /** The project it's about, and its case study when there is one. */
    project: string | null;
    href: string | null;
    /** Out of 5 — only where the review itself carried a score. */
    rating: number | null;
};

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Every client review, once. The reviews in profile.ts are the record; each is
 * matched to its case study by project name, and takes its star rating only
 * from that case study's own testimonial when it's the same quote — a score is
 * never attached to words it didn't come with. A testimonial written into a
 * case study in /admin but missing from profile.ts is still included.
 */
export const getReviews = cache(async (): Promise<Review[]> => {
    const studies = await getCaseStudies();

    const fromProfile: Review[] = testimonials.map((t) => {
        const cs = t.project ? studies.find((s) => s.title.toLowerCase().includes(t.project!.toLowerCase())) : undefined;
        const scored = cs && cs.testimonial_text && same(cs.testimonial_text, t.quote) ? cs.testimonial_stars : null;
        return {
            quote: t.quote,
            author: t.author,
            detail: t.role ?? t.source ?? null,
            project: cs?.title ?? t.project ?? null,
            href: cs ? `/work/${cs.slug}` : null,
            rating: scored || null,
        };
    });

    const extra: Review[] = studies
        .filter((cs) => cs.testimonial_text && !testimonials.some((t) => same(t.quote, cs.testimonial_text)))
        .map((cs) => {
            const [author, ...role] = cs.testimonial_author.split(',');
            return {
                quote: cs.testimonial_text,
                author: author.trim() || 'Client',
                detail: role.join(',').trim() || null,
                project: cs.title,
                href: `/work/${cs.slug}`,
                rating: cs.testimonial_stars || null,
            };
        });

    return [...fromProfile, ...extra];
});
