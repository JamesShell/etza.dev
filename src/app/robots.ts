import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * AI crawlers are listed explicitly and allowed.
 *
 * Silence is ambiguous — some agents treat an unlisted user-agent as an opt-out
 * signal, and the point of this site is to be found and quoted, so the answer
 * is stated rather than implied. Flip any of these to `disallow` to opt out of
 * that specific crawler later.
 */
const aiCrawlers = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'Claude-SearchBot',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Applebot-Extended',
    'meta-externalagent',
    'CCBot',
    'Bytespider',
];

export default function robots(): MetadataRoute.Robots {
    // /admin is also noindexed at the page level — a Disallow stops the fetch,
    // the meta tag stops the indexing of a URL someone links to.
    const disallow = ['/admin/', '/api/'];

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow,
            },
            ...aiCrawlers.map((userAgent) => ({
                userAgent,
                allow: '/',
                disallow,
            })),
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
