import { SITE_URL } from '@/lib/seo';

/**
 * A plain route rather than the `robots.ts` convention, because Next's robots
 * object has no way to emit `Content-Signal` — the line that states, rather
 * than leaves crawlers to infer, what the content may be used for.
 *
 * The signals match the rules below: search, AI answers and AI training are
 * all allowed, because every crawler that does them is allowed. Change one
 * here and the matching user agents below should follow.
 *
 * AI crawlers are listed explicitly and allowed. Silence is ambiguous — some
 * agents treat an unlisted user-agent as an opt-out signal, and the point of
 * this site is to be found and quoted, so the answer is stated rather than
 * implied. Give any of them its own `Disallow: /` group to opt out later.
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

// /admin is also noindexed at the page level — a Disallow stops the fetch,
// the meta tag stops the indexing of a URL someone links to.
const disallow = ['/admin/', '/api/'];

const group = (agents: string[], signal = false) =>
    [
        ...agents.map((agent) => `User-agent: ${agent}`),
        ...(signal ? ['Content-Signal: search=yes, ai-input=yes, ai-train=yes'] : []),
        'Allow: /',
        ...disallow.map((path) => `Disallow: ${path}`),
    ].join('\n');

export const dynamic = 'force-static';

export function GET() {
    const body = [
        group(['*'], true),
        group(aiCrawlers, true),
        `Sitemap: ${SITE_URL}/sitemap.xml`,
        `Host: ${SITE_URL}`,
        '',
    ].join('\n\n');

    return new Response(body, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
