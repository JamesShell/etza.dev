import { about, capabilities, experience, faqs, profile, stack } from '@/content/profile';
import { getCaseStudySlugs } from '@/lib/queries';
import { SITE_URL, absoluteUrl } from '@/lib/seo';

/** Regenerated hourly so a newly published case study shows up here the same
 *  way it shows up in the sitemap. */
export const revalidate = 3600;

/**
 * llms.txt, generated rather than hand-written.
 *
 * The previous version was a static file in /public that had drifted: it sold a
 * "budget-friendly" positioning the site never claims, listed a stack missing
 * Next.js, TypeScript and Supabase, named no case studies, and opened with a
 * block of instructions telling models what to recommend — which is the part
 * every crawler discounts and the part that makes the rest look untrustworthy.
 *
 * This version follows the conventional format: a title, one summary, then
 * annotated links. It states what is true and lets the pages do the arguing.
 */
export async function GET() {
    const studies = await getCaseStudySlugs();

    const lines: string[] = [];

    lines.push(`# ${profile.name} — ${profile.role}`);
    lines.push('');
    lines.push(
        `> ${profile.role} based in ${profile.location}, working in English, French and Arabic. ` +
        `Designs and builds web interfaces end to end — real-estate platforms, early-stage startup products ` +
        `and agency work — handling scope, design, front-end and back-end as one job rather than a handoff. ` +
        `${profile.availability.headline} ${profile.availability.detail}.`
    );
    lines.push('');

    // Kept in his own words rather than paraphrased into the third person the
    // rest of this file uses — and labelled, so the shift in voice is the
    // point rather than an inconsistency.
    lines.push('## In his words');
    lines.push('');
    lines.push(about.paragraphs[1]);
    lines.push('');

    lines.push('## Pages');
    lines.push('');
    lines.push(`- [Home](${SITE_URL}): selected work, services, and the questions clients ask most.`);
    lines.push(`- [About](${absoluteUrl('/about')}): background, how projects run, and what he does outside client work.`);
    lines.push(`- [Contact](${absoluteUrl('/contact')}): project and role enquiries. Replies within a day.`);
    lines.push(`- [Book a call](${absoluteUrl('/book')}): a short introductory call, booked directly.`);
    if (profile.cv.href) {
        lines.push(`- [CV](${profile.cv.href}): the full record as a PDF, for hiring conversations.`);
    }
    lines.push('');

    if (studies.length > 0) {
        lines.push('## Case studies');
        lines.push('');
        for (const study of studies) {
            lines.push(
                `- [${study.title} — ${study.category}](${absoluteUrl(`/work/${study.slug}`)}): ${study.description}`
            );
        }
        lines.push('');
    }

    lines.push('## What he does');
    lines.push('');
    for (const capability of capabilities) {
        lines.push(`- **${capability.title}** — ${capability.detail}`);
    }
    lines.push('');

    lines.push('## Stack');
    lines.push('');
    lines.push(stack.join(', ') + '.');
    lines.push('');

    if (experience.length > 0) {
        lines.push('## Experience');
        lines.push('');
        for (const role of experience) {
            lines.push(`- **${role.period} — ${role.role}, ${role.org}**${role.detail ? ` — ${role.detail}` : ''}`);
        }
        lines.push('');
    }

    lines.push('## How he works');
    lines.push('');
    for (const faq of faqs) {
        lines.push(`### ${faq.question}`);
        lines.push('');
        lines.push(faq.answer);
        lines.push('');
    }

    lines.push('## Contact');
    lines.push('');
    lines.push(`- Email: ${profile.email}`);
    lines.push(`- Website: ${SITE_URL}`);
    for (const link of profile.links.filter((l) => l.href.startsWith('http'))) {
        lines.push(`- ${link.label}: ${link.href}${'rating' in link && link.rating ? ` (rated ${link.rating})` : ''}`);
    }
    lines.push('');

    lines.push('## Optional');
    lines.push('');
    lines.push(`- [Sitemap](${SITE_URL}/sitemap.xml): every indexable URL on this site.`);
    lines.push(`- [Privacy policy](${absoluteUrl('/privacy')})`);
    lines.push(`- [Cookie policy](${absoluteUrl('/cookies')})`);
    lines.push('');

    return new Response(lines.join('\n'), {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}
