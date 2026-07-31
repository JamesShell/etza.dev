import { cache } from 'react';
import { supabase } from '@/lib/supabase';
import type { CaseStudy } from '@/types/database';

/**
 * Content reads, de-duplicated per request.
 *
 * `generateMetadata` and the page body are two separate renders of the same
 * route, and both need the same row. Wrapping in React's `cache` collapses
 * them into one round trip instead of two identical queries per request.
 */

export const getCaseStudy = cache(async (slug: string): Promise<CaseStudy | null> => {
    const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single();

    // `single()` errors on no rows, which is the ordinary 404 path — only the
    // rest is worth shouting about.
    if (error && error.code !== 'PGRST116') {
        console.error(`[queries] getCaseStudy(${slug}) failed:`, error.message);
    }

    return (data as CaseStudy | null) ?? null;
});

export const getCaseStudies = cache(async (): Promise<CaseStudy[]> => {
    const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[queries] getCaseStudies failed:', error.message);
    }

    return (data as CaseStudy[]) ?? [];
});

/** Slug + date only — the shape the sitemap and llms.txt need, without pulling
 *  every content block over the wire to build a list of URLs. */
export const getCaseStudySlugs = cache(
    async (): Promise<Pick<CaseStudy, 'slug' | 'created_at' | 'title' | 'description' | 'category'>[]> => {
        const { data, error } = await supabase
            .from('case_studies')
            .select('slug, created_at, title, description, category')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[queries] getCaseStudySlugs failed:', error.message);
        }

        return data ?? [];
    }
);
