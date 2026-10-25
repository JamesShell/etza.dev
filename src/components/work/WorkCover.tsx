'use client';

import React from 'react';
import Image from 'next/image';
import { isPngUrl, isVideoUrl } from '@/lib/utils';

/**
 * Video plays only while it's on screen. The home row renders every card
 * several times over, and a dozen hidden videos decoding at once is what makes
 * a carousel stutter.
 */
function CoverVideo({ src, className, label }: { src: string; className: string; label?: string }) {
    const ref = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        const video = ref.current;
        if (!video) return;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
        });
        io.observe(video);
        return () => io.disconnect();
    }, []);

    return (
        <video
            ref={ref}
            src={src}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={label}
            className={className}
        />
    );
}

/**
 * A project's cover, drawn the same way wherever it appears — the home row and
 * the top of its case study — so the one can turn into the other. The two
 * must stay pixel-identical in everything but size, or the morph between them
 * shows a seam.
 *
 * A backdrop — a photo when the work has one, quiet grey when it doesn't —
 * and the work itself in the middle, at most 84% of the cover either way.
 * Shown whole, never cropped: the media keeps its own proportions. A PNG may
 * be a cut-out with its own transparency, so it sits straight on the backdrop
 * with no fill behind it and no rounded clip; anything else is a screen, and
 * gets a display's rounded corners. The photo is softened just enough to sit
 * behind the work, not so much that it stops being a place.
 *
 * A `full` cover skips all of that: the shot is already a composed image, so
 * it takes the whole cover.
 *
 * Inside a `group`, the work (not the backdrop) eases forward on hover.
 * `className` sizes the cover; `children` is laid over it.
 */
export function WorkCover({
    image,
    backdrop,
    full,
    alt,
    priority = false,
    className = '',
    children,
    ...rest
}: {
    image: string;
    backdrop: string | null;
    full: boolean;
    alt: string;
    priority?: boolean;
    className?: string;
    children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>) {
    const fit = 'block h-auto max-h-full w-auto max-w-full object-contain';
    const screen = `${fit} rounded-[clamp(6px,0.75vw,12px)] bg-raise`;
    const cutout = isPngUrl(image);
    const video = isVideoUrl(image);

    // One `sizes` for both places the cover appears, so the image the home
    // card loaded is the one the case study asks for: the morph lands on a
    // picture that's already decoded instead of one still on its way.
    const sizes = '(max-width: 1024px) 90vw, 45vw';

    return (
        <div
            data-cover
            className={`cover-backdrop relative flex items-center justify-center overflow-hidden ${className}`}
            {...rest}
        >
            {backdrop && !full && (
                <Image
                    src={backdrop}
                    alt=""
                    fill
                    // Loaded with the picture it sits behind: a cover that
                    // opens from a closed clip never counts as visible to lazy
                    // loading until it's open, which is too late.
                    priority={priority}
                    sizes="(max-width: 1024px) 40vw, 20vw"
                    className="scale-110 object-cover blur-[5px] will-change-transform"
                />
            )}

            {full ? (
                <div className="relative h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                    {video ? (
                        <CoverVideo src={image} label={alt} className="h-full w-full object-cover" />
                    ) : (
                        <Image src={image} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
                    )}
                </div>
            ) : (
                <div className="relative flex h-[84%] w-[84%] items-center justify-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
                    {video ? (
                        <CoverVideo src={image} label={alt} className={screen} />
                    ) : (
                        <Image
                            src={image}
                            alt={alt}
                            // Placeholder proportions for layout before load;
                            // w-auto/h-auto hand over to the file's own once it's in.
                            width={1600}
                            height={1000}
                            priority={priority}
                            sizes={sizes}
                            className={cutout ? fit : screen}
                        />
                    )}
                </div>
            )}

            {children}
        </div>
    );
}
