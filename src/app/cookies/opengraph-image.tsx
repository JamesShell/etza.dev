import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Cookie policy — etza.dev';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
    return renderOgImage({
        eyebrow: 'Policy',
        title: 'Cookie policy',
        subtitle: 'Cookieless analytics, and the two things that do get stored',
    });
}
