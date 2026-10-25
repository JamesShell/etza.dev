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
     * Shown in the menu and on the contact page. Keep it honest and specific —
     * it does the work of a CTA. The site exists to take on projects, so that's
     * the only thing it says it's open to.
     */
    availability: {
        headline: 'Taking on new projects',
        detail: 'with a reply within a day',
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
            'I design and build websites, booking and payment systems, and web apps for businesses that have outgrown their current setup. Owning both halves means fewer handoffs, and fewer things lost between them.',
    },

    /**
     * The figures on the About card, beside the ratings from `links`. Every one
     * has to be checkable, and this one has to agree with the "four years of
     * client work" the About text and the FAQ already state.
     */
    yearsOfClientWork: 4,

    /**
     * `rating` puts the score on a pill beside the link. Only set it where the
     * number is public on the other end and someone could go and check it —
     * an unverifiable score next to your own name is worth less than no score.
     */
    links: [
        { label: 'Email', href: 'mailto:ettozany@gmail.com', external: true },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ettouzany-abdelkader', external: true },
        { label: 'Contra', href: 'https://contra.com/ettouzany', external: true, rating: '5' },
        { label: 'Dribbble', href: 'https://dribbble.com/ettza', external: true, rating: '5' },
    ],

    /** Footer links: where else the work and the reviews live. */
    footerLinks: [
        { label: 'Dribbble', href: 'https://dribbble.com/ettza', external: true },
        { label: 'Contra', href: 'https://contra.com/ettouzany', external: true },
        { label: 'GitHub', href: 'https://github.com/JamesShell', external: true },
    ],
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
    lead: 'I’m a web engineer who designs, based in Morocco and currently studying Business Administration.',

    paragraphs: [
        'I design websites and web apps, then build them myself. Four years of client work have taught me that what makes a site good is mostly in the details — how it feels on a phone, how fast it loads, how easy it is to book or pay — so that’s where I spend my time.',
        'Outside of design, I love playing chess & reading from time to time — currently *Phantoms in the Brain* by V.S. Ramachandran.',
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

/**
 * What he builds, named after what the client needs rather than the
 * discipline behind it. The contact form offers these as the answer to "what
 * do you need?", and they're the service list in structured data and llms.txt.
 */
export const capabilities = [
    {
        title: 'Websites',
        detail: 'A new site or a rebuild, set up for search from the start.',
    },
    {
        title: 'Booking and payments',
        detail: 'Customers book and pay on your site instead of by phone or message.',
    },
    {
        title: 'Web apps and internal tools',
        detail: 'Dashboards and admin tools that replace spreadsheets.',
    },
];

/**
 * The budget options on the contact form, as the CRM receives them. Ranges
 * rather than a number: the price itself is fixed in writing after the first
 * call, and this only says which conversation to have.
 */
export const budgets = ['Under $2.5k', '$2.5–5k', '$5–10k', '$10k+', 'Not sure yet'];

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
 * answered on a call, for someone deciding whether to hand over a project.
 * They're published through llms.txt for answer engines to quote.
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
            'The price is fixed in writing after the first call, before any work starts, so you know the whole number up front. It’s paid 40% to start, 40% when you approve the design and 20% at launch.',
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
        question: 'What do I get at handover?',
        answer:
            'The code in your repository and your hosting account, the Figma file, and a short walkthrough of how to edit content. No proprietary builder and no licence to keep paying for.',
    },
    {
        question: 'Do I own the site?',
        answer:
            'Yes, all of it — the code, the design files, the domain and the hosting account are in your name. Nothing is held hostage: you can hand the whole thing to another developer the week after launch.',
    },
    {
        question: 'What happens after launch?',
        answer:
            'Two weeks of fixes on me for anything that turns out to be broken or wrong against the scope. After that I am available for changes at an hourly rate. That isn’t required to keep the site running — it is yours, on your own hosting.',
    },
    {
        question: 'You’re in Morocco, what hours do you work?',
        answer:
            'Morocco is on GMT+1, so I’m within an hour of the UK and central Europe all year round, and my afternoons overlap with US mornings.',
    },
];
