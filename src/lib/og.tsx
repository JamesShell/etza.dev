import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { profile } from '@/content/profile';

/**
 * One card for the whole site, so a link to /about and a link to a case study
 * are recognisably the same place.
 *
 * The card is the site: white page, near-black display type, grey metadata,
 * one thin rule. Same palette tokens as globals.css, hard-coded here because
 * Satori resolves no CSS variables and no Tailwind.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const VOID = '#ffffff';
const CHALK = '#17171a';
const ASH = '#55555c';
const DUST = '#6c6c74';
const EDGE = '#e8e8ea';

// Read at module scope: this runs once per lambda rather than once per image.
// `next/font` can't be used here — Satori needs the raw font buffer.
const fontDir = join(process.cwd(), 'src/lib/og-fonts');
const dmSansRegular = readFileSync(join(fontDir, 'DMSans-Regular.ttf'));
const dmSansMedium = readFileSync(join(fontDir, 'DMSans-Medium.ttf'));

export function renderOgImage({
    title,
    eyebrow,
    subtitle,
}: {
    title: string;
    /** Small grey line above the title — the section or route name. */
    eyebrow?: string;
    /** Replaces the availability line at the bottom left when set. */
    subtitle?: string;
}) {
    // Long titles get smaller type rather than a clipped card.
    const titleSize = title.length > 68 ? 58 : title.length > 40 ? 72 : 88;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: VOID,
                    padding: '72px 80px',
                    fontFamily: 'DM Sans',
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {eyebrow && (
                        <div
                            style={{
                                fontSize: 22,
                                color: DUST,
                                letterSpacing: '0.02em',
                                marginBottom: 28,
                            }}
                        >
                            {eyebrow}
                        </div>
                    )}

                    <div
                        style={{
                            fontSize: titleSize,
                            fontWeight: 500,
                            color: CHALK,
                            letterSpacing: '-0.04em',
                            lineHeight: 1.06,
                            maxWidth: 940,
                        }}
                    >
                        {title}
                    </div>
                </div>

                {/* The rule and the footer row do the same job as the identity
                    rail: they say whose page this is without a logo. */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: 1, backgroundColor: EDGE, marginBottom: 28 }} />

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: 24,
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: CHALK, fontWeight: 500 }}>{profile.name}</span>
                            <span style={{ color: ASH, fontSize: 21, marginTop: 6 }}>
                                {subtitle ?? `${profile.availability.headline} ${profile.availability.detail}`}
                            </span>
                        </div>

                        <span style={{ color: DUST, fontSize: 21 }}>etza.dev</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...OG_SIZE,
            fonts: [
                { name: 'DM Sans', data: dmSansRegular, weight: 400, style: 'normal' },
                { name: 'DM Sans', data: dmSansMedium, weight: 500, style: 'normal' },
            ],
        }
    );
}
