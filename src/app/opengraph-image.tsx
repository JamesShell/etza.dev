import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { profile } from '@/content/profile';

export const alt = `${profile.name} — ${profile.role}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * The site-wide card. Any route without an `opengraph-image` of its own
 * inherits this one, so no page can ship a bare text share card.
 */
export default function OpengraphImage() {
    // The statement is written to follow "I'm Abdelkader," so it opens
    // lower-case. On a card it stands alone and has to read as a sentence.
    const descriptor =
        profile.statement.descriptor.charAt(0).toUpperCase() +
        profile.statement.descriptor.slice(1);

    return renderOgImage({
        eyebrow: profile.location,
        title: descriptor,
        subtitle: profile.role,
    });
}
