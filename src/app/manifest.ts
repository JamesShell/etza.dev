import type { MetadataRoute } from 'next';
import { profile } from '@/content/profile';

/**
 * The android-chrome icons have been sitting in /public/favicon with nothing
 * pointing at them. This is that pointer.
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${profile.name} — ${profile.role}`,
        short_name: profile.shortName,
        description: `Portfolio of ${profile.name}, ${profile.role.toLowerCase()} in ${profile.location}.`,
        start_url: '/',
        display: 'minimal-ui',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                src: '/favicon/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/favicon/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
