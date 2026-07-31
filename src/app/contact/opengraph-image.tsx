import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Contact Abdelkader Ettouzany';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
    return renderOgImage({
        eyebrow: 'Contact',
        title: 'Let’s build the thing.',
        subtitle: 'A reply within a day, with what I’d do first',
    });
}
