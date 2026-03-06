import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { CaseStudy } from '@/types/database';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://etza.dev'; // Adjust exactly to your real deployed domain

    // Fetch dynamic routes from database (e.g. case studies)
    const { data: caseStudies } = await supabase
        .from('case_studies')
        .select('slug, created_at');
        
    const studies = (caseStudies as Pick<CaseStudy, 'slug' | 'created_at'>[]) || [];

    const dynamicRoutes = studies.map((study) => ({
        url: `${baseUrl}/work/${study.slug}`,
        lastModified: new Date(study.created_at || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // Define all static pages
    const staticRoutes = [
        {
            url: baseUrl, // Home page
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/book`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/cookies`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        }
    ];

    return [...staticRoutes, ...dynamicRoutes];
}
