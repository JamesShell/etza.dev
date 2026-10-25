'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkCover } from '@/components/work/WorkCover';
import { Reveal, RiseIn, RiseText } from '@/components/ui/Rise';
import { navigateWithCover } from '@/lib/cover-transition';
import { clickEvent } from '@/lib/analytics';
import type { CarouselItem } from '@/components/sections/WorkCarousel';

const chrome = 'text-[11px] uppercase leading-[1.45] tracking-[0.06em]';

/**
 * The way on at the end of a case study: the next project in the home row's
 * order, laid out as a smaller version of its own hero — name bottom left,
 * cover right — so following it is the same cover growing into the same
 * place it's about to occupy.
 */
export function NextProject({ item }: { item: CarouselItem }) {
    const router = useRouter();
    if (!item.href) return null;
    const href = item.href;

    return (
        <Link
            href={href}
            onPointerEnter={() => router.prefetch(href)}
            onFocus={() => router.prefetch(href)}
            onClick={(e) => {
                clickEvent({ action: 'view_case_study', category: 'engagement', label: `Next project: ${item.name}` });
                navigateWithCover(e, href, e.currentTarget.querySelector<HTMLElement>('[data-cover]'), router);
            }}
            className="group grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-4"
        >
            <div className="flex flex-col justify-between gap-10 md:col-span-2">
                <p className={`${chrome} text-dust`}>
                    <RiseIn inView>Next project</RiseIn>
                </p>
                <div>
                    <RiseText
                        inView
                        delay={0.1}
                        text={item.name}
                        className="max-w-[12ch] font-display text-[clamp(44px,5.6vw,104px)] font-normal leading-[0.94] tracking-[-0.05em] text-chalk transition-colors duration-500 group-hover:text-dust"
                    />
                    <div className={`mt-8 ${chrome} text-chalk`}>
                        {[item.discipline, item.year].filter(Boolean).map((line, i) => (
                            <RiseIn key={line} block inView delay={0.4 + i * 0.06}>
                                {line}
                            </RiseIn>
                        ))}
                    </div>
                </div>
            </div>

            <Reveal kind="media" className="md:col-span-2">
                <WorkCover
                    image={item.image}
                    backdrop={item.backdrop}
                    full={item.full}
                    alt={`${item.name}${item.discipline ? ` — ${item.discipline}` : ''}`}
                    className="aspect-square w-full lg:aspect-auto lg:h-[72svh]"
                />
            </Reveal>
        </Link>
    );
}
