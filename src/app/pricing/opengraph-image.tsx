import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Pricing — Abdelkader Ettouzany';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
    return renderOgImage({
        eyebrow: 'Pricing',
        title: 'Get a price for your project in a minute',
    });
}
