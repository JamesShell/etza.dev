import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import CookieBanner from '@/components/layout/CookieBanner';
import { CursorFace } from '@/components/layout/CursorFace';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteLoader } from '@/components/layout/SiteLoader';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { LOADED_KEY } from '@/lib/loader';
import { preconnect } from 'react-dom';
import { JsonLd } from '@/components/seo/JsonLd';
import { profile } from '@/content/profile';
import { SITE_URL, graph, personSchema, websiteSchema } from '@/lib/seo';

/**
 * One family for the whole site. Hierarchy comes from size, weight and grey —
 * never from a second typeface. Adding one would undo the point.
 */
const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

const title = `${profile.name} — ${profile.role}`;
const description =
  'Web engineer and designer in Casablanca. I design and build websites, booking and payment systems, and web apps for businesses, from the first call to launch.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    // The full name, not the short one: this is what a search result shows,
    // and "Ettouzany" alone doesn't tell a stranger whose page they found.
    template: `%s — ${profile.name}`,
  },
  description,
  keywords: [
    'Web Developer',
    'Web Designer',
    'Website Design and Development',
    'Booking System Development',
    'Web App Development',
    'Next.js Developer',
    'Laravel Developer',
    'Ettouzany',
    'Casablanca',
    'Morocco',
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  publisher: profile.name,
  applicationName: 'etza.dev',
  // No canonical here on purpose. A canonical set on the root layout would
  // claim `/` for every URL that inherits it, so each route declares its own
  // through `pageMetadata` in src/lib/seo.ts.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title,
    description,
    siteName: profile.shortName,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Uncapped snippets and full-size previews: this site wants to be
      // quoted in AI overviews and rich results, not summarised at 160
      // characters with a thumbnail.
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }),
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The work's pictures come from Supabase storage: open that connection
  // while the page is still arriving, so the covers the home page's loader
  // waits for start sooner.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) preconnect(process.env.NEXT_PUBLIC_SUPABASE_URL);

  return (
    <html
      lang="en"
      className="scroll-smooth"
      // Tells Next to drop smooth scrolling while it changes route, so a
      // page arrives at the top instantly — a glide up from the bottom of a
      // case study would otherwise run under the cover transition.
      data-scroll-behavior="smooth"
      // The inline script below may add data-loaded before hydration.
      suppressHydrationWarning
    >
      <body className={`${dmSans.variable} antialiased`}>
        {/* Later in the same session the loader is skipped: this marks <html>
            before first paint, so CSS hides the loader before it can flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem(${JSON.stringify(LOADED_KEY)}))document.documentElement.dataset.loaded=''}catch(e){}`,
          }}
        />
        {/* Inline rather than in globals.css: Turbopack's CSS step silently
            dropped this rule there, and the loader would flash on every load. */}
        <style dangerouslySetInnerHTML={{ __html: 'html[data-loaded] [data-site-loader]{display:none}' }} />
        {/* Who the site is and who runs it, stated once for every route. Pages
            reference these two nodes by @id rather than restating them. */}
        <JsonLd id="schema-site" data={graph(websiteSchema(), personSchema())} />

        {/* The bar lives here rather than in each page, so it persists
            across navigation; each page holds its space open with BarSpace. */}
        <SiteHeader />
        {children}
        <SiteLoader />
        <SmoothScroll />
        <CursorFace />
        {/* Umami tracks page views by itself, including client-side route
            changes, so there's nothing to wire into the router. */}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="ed47da09-20e5-4e82-befd-d18824cb6582"
        />
        <CookieBanner />
      </body>
    </html>
  );
}
