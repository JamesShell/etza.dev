import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import CookieBanner from '@/components/layout/CookieBanner';
import { CursorFace } from '@/components/layout/CursorFace';
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
  'Web engineer and interface designer in Rabat. I design and build web interfaces end to end — real-estate platforms, startup products and agency work. Currently taking on new projects, and open to full-time roles.';

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
    'Front-end Engineer',
    'UI/UX Designer',
    'React Developer',
    'Next.js Developer',
    'Laravel Developer',
    'Ettouzany',
    'Rabat',
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
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${dmSans.variable} antialiased`}>
        {/* Who the site is and who runs it, stated once for every route. Pages
            reference these two nodes by @id rather than restating them. */}
        <JsonLd id="schema-site" data={graph(websiteSchema(), personSchema())} />

        {children}
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
