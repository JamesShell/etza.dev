import React from 'react';
import Image from 'next/image';
import { isVideoUrl } from '@/lib/utils';

interface CaseStudyHeroProps {
    title: string;
    type: string;
    description: string;
    metrics?: { label: string; value: React.ReactNode }[];
    heroImage?: string;
}

export function CaseStudyHero({ title, type, description, metrics, heroImage }: CaseStudyHeroProps) {
    return (
        <section className="mx-auto max-w-[1240px] px-5 pt-14 md:px-8 md:pt-20">
            <p className="text-[12px] text-dust">{type}</p>

            <h1 className="mt-5 max-w-[16ch] font-display text-[clamp(34px,6vw,62px)] font-medium leading-[1.05] tracking-[-0.04em] text-chalk">
                {title}
            </h1>

            <p className="mt-7 max-w-[58ch] font-sans text-[17px] leading-relaxed text-ash md:text-[18px]">
                {description.split('\n\n')[0]}
            </p>

            {metrics && metrics.length > 0 && (
                <dl className="mt-12">
                    {metrics.map((metric, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8"
                        >
                            <dt className="shrink-0 text-[12px] text-dust sm:w-[160px]">
                                {metric.label}
                            </dt>
                            <dd className="font-sans text-[15px] text-chalk">{metric.value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {heroImage && (
                <div className="mt-12 overflow-hidden rounded-2xl bg-shell md:mt-16">
                    {isVideoUrl(heroImage) ? (
                        <video
                            src={heroImage}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-label={`${title} — ${type}`}
                            className="block w-full"
                        />
                    ) : (
                        /* The largest contentful paint on this route, so it
                           loads eagerly rather than waiting on the observer. */
                        <Image
                            src={heroImage}
                            alt={`${title} — ${type}`}
                            width={1240}
                            height={0}
                            sizes="(min-width: 1240px) 1240px, 100vw"
                            priority
                            className="block h-auto w-full"
                        />
                    )}
                </div>
            )}
        </section>
    );
}
