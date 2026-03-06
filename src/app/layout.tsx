import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit, Cormorant_Garamond, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import GoogleAnalytics from '@/components/layout/GoogleAnalytics';
import CookieBanner from '@/components/layout/CookieBanner';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Ettouzany | Premium Web Design & Development for Agencies',
  description: 'Web Developer & Designer with 4+ years of experience crafting high-performance, conversion-driven websites for agencies and ambitious brands.',
  keywords: ['Web Developer', 'Web Designer', 'Freelance Web Developer', 'Agency Web Development', 'React Developer', 'Ettouzany', 'Creative Developer'],
  authors: [{ name: 'Ettouzany' }],
  creator: 'Ettouzany',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Ettouzany | Premium Web Design & Development',
    description: 'Web Developer & Designer with 4+ years of experience crafting high-performance websites for agencies and ambitious brands.',
    siteName: 'Ettouzany',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${plusJakartaSans.variable} ${outfit.variable} ${cormorantGaramond.variable} ${playfairDisplay.variable} antialiased`}
      >
        <div className="noise-overlay"></div>
        {children}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <CookieBanner />
      </body>
    </html>
  );
}
