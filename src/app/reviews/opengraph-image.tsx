import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Client reviews of Abdelkader Ettouzany';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
    return renderOgImage({
        eyebrow: 'Reviews',
        title: 'Praise from clients',
    });
}
