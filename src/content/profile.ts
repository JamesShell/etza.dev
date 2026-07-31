/**
 * Everything on the site that isn't in Supabase lives here.
 * Edit this file to change copy — no component changes needed.
 */

export const profile = {
    name: 'Abdelkader Ettouzany',
    shortName: 'Ettouzany',
    role: 'Web engineer & interface designer',
    location: 'Casablanca, Morocco',
    timeZone: 'Africa/Casablanca',
    email: 'ettozany@gmail.com',

    /**
     * Shown in the rail. Keep it honest and specific — it does the work of a CTA.
     * Project work leads; the role is the second line, deliberately. Whatever
     * comes first here is what the site is understood to be for.
     */
    availability: {
        headline: 'Taking on new projects',
        detail: 'and open to full-time roles',
    },

    /**
     * The page's opening line, split so the two halves can be set in different
     * weights: the introduction, then the claim that does the work.
     *
     * `descriptor` is the whole pitch — the surprise is the second noun. Flip it
     * to 'a designer who engineers.' if you'd rather lead with design; keep it
     * as one short clause either way.
     */
    statement: {
        greeting: 'I’m Ettouzany,',
        descriptor: 'a web engineer who designs.',
        support:
            'Four years across real-estate platforms, early startup products and agency work. Owning both halves means fewer handoffs, and fewer things lost between them.',
    },

    /**
     * `rating` puts the score on a pill beside the link. Only set it where the
     * number is public on the other end and someone could go and check it —
     * an unverifiable score next to your own name is worth less than no score.
     */
    links: [
        { label: 'Email', href: 'mailto:ettozany@gmail.com', external: true },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ettouzany-abdelkader', external: true },
        { label: 'Contra', href: 'https://contra.com/ettouzany', external: true, rating: '4.9' },
        { label: 'Dribbble', href: 'https://dribbble.com/ettza', external: true, rating: '5' },
    ],

    /**
     * Set `href` to a PDF in /public to turn on the CV link (e.g. '/ettouzany-cv.pdf').
     * Left null, the link stays hidden rather than 404ing.
     */
    cv: {
        href: null as string | null,
        label: 'Download CV',
    },
} as const;

/**
 * The /about page — who he is and how he works, told the way you'd tell it to
 * someone at a table rather than the way a bio is usually written.
 *
 * `lead` is the page's h1 and carries the name, so it has to stand alone as a
 * sentence: it's the first thing read aloud by a screen reader and the first
 * thing shown in a search result. The paragraphs after it are deliberately
 * short — one idea each, no paragraph doing two jobs — because the column is
 * narrow and centred, and long blocks collapse into a wall at that width.
 */
export const about = {
    lead: 'Designer, engineer & serial re-doer of my own homepaget.',

    paragraphs: [
        'I started out designing, then picked up engineering because I kept wanting control over how things actually behaved — the timing of a transition, the way a layout breaks at an awkward width, what happens on a slow connection. Four years later I do both halves, which mostly means nobody to argue with but myself.',
        'Most of my work is real-estate platforms, early-stage products and agency overflow. Usually the same story: a business whose site no longer matches what it does, and a small team with no time to fix it. I scope it, design it, build it, and hand over a repo they own.',
        'Taking on new projects right now, and open to full-time front-end roles too. If you’re building something good, let’s talk.',
    ],

    /**
     * The human list. Keep adding real ones — it reads better the more specific
     * and the less professional it gets, and the off-screen entries are the
     * ones people actually remember.
     */
    listLead: 'Outside of client work, I’m:',
    list: [
        'playing chess',
        'rebuilding this site instead of leaving it alone',
        'chasing scroll-driven motion that doesn’t drop frames',
        'teaching a small blinking face to follow your cursor',
    ],

    signoff: 'To hire me or just say hi — I reply within a day, and I like the emails that start with what you’re stuck on.',
} as const;

/**
 * TODO(you): fill these in and they appear automatically; left empty they stay
 * hidden. Don't pad them — a short honest list reads better than a long soft one.
 */
export const education: { period: string; title: string; org: string; detail?: string }[] = [];

export const awards: { year: string; title: string; org?: string }[] = [];

/**
 * Teaching, mentoring, community work — anything real that wasn't paid work.
 * Same shape as `experience` so it renders through the same list on /about.
 */
export const volunteering: {
    period: string;
    role: string;
    org: string;
    detail?: string;
}[] = [];

/** What he actually does, grouped. No proficiency bars, no percentages. */
export const capabilities = [
    {
        title: 'Interface design',
        detail: 'Design systems, type scales, responsive layout, prototypes in Figma.',
    },
    {
        title: 'Front-end engineering',
        detail: 'React, Next.js, TypeScript, Tailwind, GSAP and Framer Motion.',
    },
    {
        title: 'Full-stack delivery',
        detail: 'Laravel and Supabase back-ends, auth, admin tooling, deploys.',
    },
    {
        title: 'Performance & SEO',
        detail: 'Core Web Vitals, semantic markup, structured data, image budgets.',
    },
];

export const stack = [
    'TypeScript',
    'React',
    'Next.js',
    'Tailwind CSS',
    'Framer Motion',
    'GSAP',
    'Laravel',
    'PHP',
    'Supabase',
    'PostgreSQL',
    'Figma',
    'Vercel',
];

/**
 * TODO(you): replace with your real history before shipping.
 * Entries render exactly as written — an empty array hides the section.
 */
export const experience: {
    period: string;
    role: string;
    org: string;
    detail?: string;
}[] = [
    {
        period: '2023 — Present',
        role: 'Independent web engineer & designer',
        org: 'Freelance',
        detail:
            'Design and build websites and web platforms for real-estate agencies and early-stage products. Rated 5 stars on Contra.',
    },
];

/**
 * Real numbers only, and every one has to point at the project it came from.
 * `project` must match a case study title and `slug` must resolve to /work/<slug>
 * — entries missing either are not rendered, so nothing unattributed ever ships.
 */
export const results: {
    metric: string;
    label: string;
    project: string | null;
    slug: string | null;
}[] = [
    { metric: '+42%', label: 'conversion lift', project: null, slug: null },
    { metric: '−38%', label: 'bounce rate', project: null, slug: null },
    { metric: '<1.8s', label: 'largest contentful paint', project: null, slug: null },
];

/**
 * Client reviews, shown as cards inside the work grid so praise sits next to
 * the thing being praised rather than in a carousel of its own.
 *
 * Note: the original captures were dated relatively ("5 days ago"), which goes
 * stale the moment it's published — so only the name and the words are kept.
 * Star ratings are gone too: five stars on every card says nothing, and a row
 * of gold pips is the one thing on this site that would look like a widget.
 *
 * `source` is who the person is to the project — a team, a platform, wherever
 * the review is publicly visible — and shows only when `role` is unset.
 */
export const testimonials: {
    quote: string;
    author: string;
    role?: string;
    source?: string;
    /**
     * Pins the review to a project: matched loosely against the work and case
     * study titles, so it renders in the cell beside that project. Leave unset
     * and it fills a free cell further down the grid instead.
     */
    project?: string;
}[] = [
    {
        quote:
            'Abdel brought unmatched professionalism and design discipline to the project. He welcomed feedback, learned fast, and consistently delivered smart solutions under pressure.',
        author: 'Kodi Echeozo',
        role: 'CEO, Sybelle',
        project: 'Sybelle',
    },
    {
        quote:
            'Ettouzany was amazing to work with. Very friendly, professional and I’m very happy with the project he did. High quality, fast pace and easy to work with. Thank you so much for everything!!',
        author: 'Ariel Efrat',
        source: 'Dribbble',
        // Matches on 'Warehouse' rather than 'Hotline' on purpose: that work's
        // category is currently spelled 'Warehouse Hotiline' in Supabase, and
        // 'Warehouse' keeps matching after you fix the typo.
        project: 'Warehouse',
    },
    {
        quote: 'Great work. Very professional!',
        author: 'Zach Lloyd',
        source: 'STN Team',
        // Matched against the work's category and title, which are 'Mobile
        // Design' and 'STN App' — 'STN' is the part that survives either being
        // renamed, so this stays pinned beside the app shot.
        project: 'STN',
    },
];

/**
 * The questions that actually arrive by email, answered the way they'd be
 * answered on a call. Two audiences read this section — someone deciding
 * whether to hand over a project, and someone deciding whether to open a
 * conversation about a role — so the last question belongs to the second one.
 *
 * Rules for editing: no ranges you wouldn't commit to, no "it depends" without
 * saying what it depends on, and nothing that reads as a sales page.
 */
export const faqs = [
    {
        question: 'How does a project actually run?',
        answer:
            'A short call to find out what the problem is, then a written scope with a timeline and a fixed price before anything starts. From there you get something to look at every week — designs first, then the real thing on a staging URL — so nothing is a surprise at the end. Most sites take three to eight weeks, driven mostly by page count and whether the content already exists.',
    },
    {
        question: 'What does it cost?',
        answer:
            'Fixed price per project, quoted against the written scope, invoiced in two or three stages rather than all up front. I quote after the first call and not before it — a number given without knowing the page count, the content situation and whether there is a back end behind it is a guess, and guesses get corrected in the wrong direction later.',
    },
    {
        question: 'Do you design, or only build?',
        answer:
            'Both, and that is the point of hiring me rather than two people. I design in Figma and write the code that ships it, so the layout, the motion and the awkward breakpoints are decided once. If you already have a designer or a brand system, I build inside it and stay faithful to the spec.',
    },
    {
        question: 'Can you work on a site that already exists?',
        answer:
            'Yes — a rebuild, a redesign of a few key pages, or joining an existing codebase and working the way that team already works. I will tell you honestly which of the three your situation calls for, including when the answer is that the site you have is fine and the problem is somewhere else.',
    },
    {
        question: 'What do I get at handover, and who owns it?',
        answer:
            'You do, all of it. The code ships to your repository and your hosting account, with the Figma file, a short walkthrough of how to edit content, and no proprietary builder or licence to keep paying for. Nothing is held hostage — you can hand the whole thing to another developer the week after launch.',
    },
    {
        question: 'What happens after launch?',
        answer:
            'Two weeks of fixes on me for anything that turns out to be broken or wrong against the scope. After that I am available for changes at an hourly rate, or on a small monthly retainer if you would rather have someone on call. Neither is required to keep the site running.',
    },
    {
        question: 'Are you open to full-time roles?',
        answer:
            'Yes — front-end and product engineering, remote or based in Morocco. Write to me and tell me what the team is building, and I will send the CV back the same day. Four years of it is on this site already, in the work and the case studies behind it.',
    },
];
