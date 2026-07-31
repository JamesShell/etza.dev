import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Book a call with Abdelkader Ettouzany';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
    return renderOgImage({
        eyebrow: 'Book a call',
        title: 'Bring the problem, not a brief.',
        subtitle: 'Twenty minutes to work out whether this is a fit',
    });
}
