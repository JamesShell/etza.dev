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
            'I design and build websites, booking and payment systems, and web apps for businesses that have outgrown their current setup. Owning both halves means fewer handoffs, and fewer things lost between them.',
    },

    /**
     * The proof line directly under the statement. Every item has to be
     * checkable — no ratings here, they already sit beside the links in the
     * rail. Only list client locations that are actually true.
     */
    proof: [
        '4 years of client work',
    ],

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

    /**
     * Footer links. The job-search route comes first so someone hiring for a
     * role finds it without reading the project pitch above it.
     */
    footerLinks: [
        { label: 'Hiring? See my CV', href: '/cv', external: false },
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
 * discipline behind it. No longer a section on the page — the pricing
 * estimator covers it — but still the service list in structured data and
 * llms.txt.
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
 * The estimator in the Pricing section. All prices in USD — change a number
 * here and the estimate, the summary and the contact hand-off all follow.
 *
 * `weeks` is roughly how much each feature adds to the timeline; the estimate
 * shows a two-week range on top of the sum, so it can stay rough. A feature
 * with `max` is counted (pages, integrations) rather than switched on.
 */
export type PricingFeature = {
    id: string;
    name: string;
    detail: string;
    price: number;
    weeks: number;
    max?: number;
};

export type ProjectKind = 'website' | 'webapp';

export const pricing: {
    types: Record<
        ProjectKind,
        {
            title: string;
            pitch: string;
            base: { name: string; detail: string; price: number; weeks: number };
            groups: { title: string; features: PricingFeature[] }[];
        }
    >;
    plan: { monthly: number; capacity: number };
    planningSession: number;
} = {
    types: {
        website: {
            title: 'Website',
            pitch: 'A business site, with bookings or payments if you need them.',
            base: {
                name: 'Website design and build',
                detail: 'Up to 5 pages you can edit yourself — text, photos, events, menus — designed for phones first, set up for search, with visitor analytics.',
                price: 1500,
                weeks: 3,
            },
            // Editing your own content is part of every site, so it's in the
            // base rather than sold back as an extra. These are the things that
            // genuinely change the size of the job.
            groups: [
                {
                    title: 'Design and content',
                    features: [
                        { id: 'pages', name: 'Extra pages', detail: 'Beyond the five included — say, one per service or location.', price: 150, weeks: 0.2, max: 15 },
                        { id: 'copy', name: 'Words written for you', detail: 'I write the copy for every page, so it reads well and shows up in search.', price: 500, weeks: 0.5 },
                        { id: 'brand', name: 'Logo and brand basics', detail: 'A simple logo, colours and type, if you don’t have them yet.', price: 600, weeks: 1 },
                        { id: 'migrate', name: 'Move your old site over', detail: 'Pages and images carried across, with redirects so old links and search rankings survive.', price: 400, weeks: 0.5 },
                    ],
                },
                {
                    title: 'Bookings and sales',
                    features: [
                        { id: 'booking', name: 'Online booking', detail: 'Customers pick a time themselves. Staff schedules and reminders included.', price: 900, weeks: 1 },
                        { id: 'payments', name: 'Payments and deposits', detail: 'Take card payments at checkout or when someone books.', price: 350, weeks: 0.5 },
                        { id: 'shop', name: 'Online shop', detail: 'Sell products with stock, shipping options and order emails.', price: 1200, weeks: 1.5 },
                        { id: 'loyalty', name: 'Customer accounts and rewards', detail: 'Logins, saved details, points and a loyalty program.', price: 900, weeks: 1 },
                    ],
                },
                {
                    title: 'Get found, reach more people',
                    features: [
                        { id: 'local', name: 'Local search setup', detail: 'Google Business Profile and maps listing, so people nearby find you.', price: 250, weeks: 0.2 },
                        { id: 'blog', name: 'Blog or news', detail: 'Posts that keep the site fresh and bring in search traffic.', price: 300, weeks: 0.5 },
                        { id: 'lang', name: 'Second language', detail: 'Including Arabic, with right-to-left layouts.', price: 400, weeks: 0.5 },
                        { id: 'a11y', name: 'Accessibility check', detail: 'Tested so people using screen readers or a keyboard can use it.', price: 350, weeks: 0.5 },
                        { id: 'ai', name: 'AI assistant', detail: 'Answers common questions and books appointments, day or night.', price: 700, weeks: 1 },
                    ],
                },
            ],
        },
        webapp: {
            title: 'Web app',
            pitch: 'Accounts, dashboards and internal tools that replace spreadsheets.',
            base: {
                name: 'Web app design and build',
                detail: 'Sign-in, an admin dashboard, a database, and it works on phones.',
                price: 3500,
                weeks: 6,
            },
            groups: [
                {
                    title: 'People and access',
                    features: [
                        { id: 'roles', name: 'Access levels', detail: 'Decide who sees and changes what — staff, managers, clients.', price: 600, weeks: 0.5 },
                        { id: 'pwa', name: 'Installable on phones', detail: 'Opens from the home screen like an app, no app store needed.', price: 500, weeks: 0.5 },
                        { id: 'lang', name: 'Second language', detail: 'Including Arabic, with right-to-left layouts.', price: 500, weeks: 0.5 },
                    ],
                },
                {
                    title: 'Running the business',
                    features: [
                        { id: 'booking', name: 'Booking and scheduling', detail: 'Availability, reservations and reminders.', price: 900, weeks: 1 },
                        { id: 'payments', name: 'Payments and subscriptions', detail: 'Checkout, recurring plans and invoices.', price: 900, weeks: 1 },
                        { id: 'notify', name: 'Email and SMS notifications', detail: 'Confirmations, alerts and reminders, sent automatically.', price: 350, weeks: 0.5 },
                        { id: 'reports', name: 'Reports', detail: 'Charts and exports from your own data, instead of a spreadsheet.', price: 900, weeks: 1 },
                    ],
                },
                {
                    title: 'Your data and tools',
                    features: [
                        { id: 'import', name: 'Bring in your existing data', detail: 'Spreadsheets or records from the tool you use today, imported and cleaned up.', price: 500, weeks: 0.5 },
                        { id: 'integr', name: 'Connect a tool you already use', detail: 'Your CRM, calendar or accounting software. Priced per tool.', price: 500, weeks: 0.5, max: 6 },
                        { id: 'ai', name: 'AI features', detail: 'An assistant, automatic summaries and smarter search.', price: 1000, weeks: 1 },
                    ],
                },
            ],
        },
    },
    // `capacity` is how much work, at one-off prices, a month on the plan buys.
    plan: { monthly: 3000, capacity: 6000 },
    planningSession: 500,
};

/** The budget options on the contact form. The estimator picks one of these
 *  when it hands a quote over, so the strings have to match exactly. */
export const budgets = ['$2.5–5k', '$5–10k', '$10k+', 'Monthly plan'];

/**
 * These are real steps in a fixed order, which is the only reason they're
 * numbered. Keep each one short enough to read at a glance.
 */
export const steps = [
    '30-minute call.',
    'Fixed price in writing.',
    'Design, you approve it.',
    'Build and launch.',
    'Two weeks of free fixes after launch.',
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
            'The estimate on the pricing page gives you a starting number. The final price is fixed in writing after the first call, usually within 10% of that estimate, and paid 40% to start, 40% when you approve the design and 20% at launch. If you have steady work, the monthly plan can cost about half.',
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
            'Two weeks of fixes on me for anything that turns out to be broken or wrong against the scope. After that I am available for changes at an hourly rate, or on the monthly plan if you have steady work. Neither is required to keep the site running — it is yours, on your own hosting.',
    },
    {
        question: 'What happens if I cancel the monthly plan early?',
        answer:
            'You can pause or cancel the monthly plan anytime, with no fee to leave. If you leave in the first three months, you keep all the work by paying the difference to the one-off price.',
    },
    {
        question: 'You’re in Morocco, what hours do you work?',
        answer:
            'Morocco is on GMT+1, so I’m within an hour of the UK and central Europe all year round, and my afternoons overlap with US mornings.',
    },
    {
        question: 'Are you open to full-time roles?',
        answer:
            'Yes — front-end and product engineering, remote or based in Morocco. Write to me and tell me what the team is building, and I will send the CV back the same day. Four years of it is on this site already, in the work and the case studies behind it.',
    },
];
