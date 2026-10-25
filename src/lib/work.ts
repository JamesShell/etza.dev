import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import { getCaseStudies } from '@/lib/queries';
import { testimonials } from '@/content/profile';
import type { CaseStudy, SelectedWork } from '@/types/database';
import type { CarouselItem } from '@/components/sections/WorkCarousel';

/**
 * The review pinned to a project, if any, taken at most once. Matched loosely
 * against everything that names the project — `category` carries the project
 * ('Lumen'), `title` the view ('Hero Section') — so 'Sybelle' still pins to
 * 'Sybelle Platform' and a work with no case study can still match.
 */
function reviewFor(haystack: string, used: Set<string>): CarouselItem['review'] {
    const text = haystack.toLowerCase();
    const t = testimonials.find(
        (t) => t.project && !used.has(t.quote) && text.includes(t.project.toLowerCase())
    );
    if (!t) return null;
    used.add(t.quote);
    return { quote: t.quote, author: t.author, detail: t.role ?? t.source ?? null };
}

/** What was done, as the card's second line: "Design & Development". */
function discipline(cs: CaseStudy | null | undefined) {
    const scope = (cs?.scope_of_work ?? []).slice(0, 2);
    return scope.length ? scope.join(' & ') : cs?.category || null;
}

/**
 * The body of work, in the order the home page shows it, one entry per
 * project. The home row draws its cards from this, and a case study takes its
 * hero cover and its "next project" from it too — so a cover looks the same on
 * both sides of the transition between them, and "next" means the next card.
 *
 * The curated shots come first, in their admin order. A second shot of the
 * same case study is dropped: it would repeat its name and line. Then every
 * case study the shots didn't cover, so the row is the whole body of work.
 */
export const getWork = cache(async (): Promise<CarouselItem[]> => {
    const [{ data }, caseStudies] = await Promise.all([
        supabase.from('selected_works').select('*').order('sort_order', { ascending: true }),
        getCaseStudies(),
    ]);
    const selectedWorks = (data as SelectedWork[]) || [];

    const seen = new Set<string>();
    const shots = selectedWorks.filter((work) => {
        if (!work.case_study_id) return true;
        if (seen.has(work.case_study_id)) return false;
        seen.add(work.case_study_id);
        return true;
    });

    const usedReviews = new Set<string>();

    const featured: CarouselItem[] = shots.map((work) => {
        const cs = caseStudies.find((c) => c.id === work.case_study_id) || null;
        // The case study's title is the most authoritative name of the three.
        const name = cs?.title ?? work.category ?? work.title;
        return {
            id: work.id,
            href: cs ? `/work/${cs.slug}` : null,
            image: work.image_url,
            // Optional until supabase/selected_works_cover.sql has been run.
            backdrop: work.cover_bg_url ?? null,
            full: work.cover_full ?? false,
            name,
            discipline: discipline(cs) ?? (work.title !== name ? work.title : null),
            year: cs?.year || null,
            wide: work.display_width === 'wide',
            review: reviewFor(`${work.category} ${work.title} ${cs?.title ?? ''}`, usedReviews),
        };
    });

    const rest: CarouselItem[] = caseStudies
        .filter((cs) => !seen.has(cs.id) && cs.image_url)
        .map((cs) => ({
            id: cs.id,
            href: `/work/${cs.slug}`,
            image: cs.image_url,
            backdrop: null,
            full: false,
            name: cs.title,
            discipline: discipline(cs),
            year: cs.year || null,
            wide: false,
            review: reviewFor(cs.title, usedReviews),
        }));

    return [...featured, ...rest];
});
