import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Privacy policy — etza.dev';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
    return renderOgImage({
        eyebrow: 'Policy',
        title: 'Privacy policy',
        subtitle: 'What this site records, and what it doesn’t',
    });
}
