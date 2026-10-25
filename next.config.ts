import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
    /**
     * Development only. On an IPv6/NAT64 network, DNS hands back addresses in
     * the well-known translation prefix 64:ff9b::/96 — e.g. Supabase's public
     * Cloudflare IPs arrive as 64:ff9b::ac40:95f6. ipaddr.js reports that
     * prefix as non-unicast, so Next's SSRF guard rejects it as a private
     * address and the optimizer refuses to fetch the image.
     *
     * The guard is doing real work in production, so it stays on there; this
     * only relaxes it for local dev, where the false positive occurs.
     */
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
  },

  /**
   * The referral shortlinks used to be pages that rendered nothing and then
   * redirected with client JavaScript — which a crawler sees as two indexable
   * empty pages. Handled here they never render at all, and Umami still gets
   * the source because it reads the query string off the landing URL.
   *
   * Not permanent: these are campaign links whose destination may change, and
   * a 308 is cached by browsers indefinitely.
   */
  async redirects() {
    return [
      { source: '/contra', destination: '/?ref=contra', permanent: false },
      { source: '/discord', destination: '/?ref=discord', permanent: false },
      // The pricing page and its estimator are gone; a project now starts on
      // the contact page, so old links and search results land there.
      { source: '/pricing', destination: '/contact', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // /book embeds Cal.com in an iframe but is never framed itself, so
          // a site-wide DENY is safe here.
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
      {
        // Generated once per deploy and immutable in between.
        source: '/:path(opengraph-image|twitter-image)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

export default nextConfig;
