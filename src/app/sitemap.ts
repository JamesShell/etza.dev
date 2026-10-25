import { MetadataRoute } from 'next';
import { getCaseStudySlugs } from '@/lib/queries';
import { ROUTE_UPDATED, absoluteUrl } from '@/lib/seo';

/** Re-read hourly so a case study published in /admin appears without a
 *  redeploy. Without this the sitemap is frozen at build time. */
export const revalidate = 3600;

type Entry = {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
};

/**
 * `lastModified` is real here. Stamping `new Date()` on every route — which is
 * what this file used to do — tells a crawler the entire site changed on every
 * fetch, which is indistinguishable from telling it nothing. Static dates come
 * from ROUTE_UPDATED in src/lib/seo.ts; case studies use their own row.
 */
const staticRoutes: Entry[] = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/reviews', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const studies = await getCaseStudySlugs();

    return [
        ...staticRoutes.map((route) => ({
            url: absoluteUrl(route.path),
            lastModified: new Date(ROUTE_UPDATED[route.path] ?? Date.now()),
            changeFrequency: route.changeFrequency,
            priority: route.priority,
        })),
        ...studies.map((study) => ({
            url: absoluteUrl(`/work/${study.slug}`),
            lastModified: new Date(study.created_at ?? Date.now()),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ];
}
