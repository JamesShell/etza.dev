'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { CaseStudy } from '@/types/database';
import { clickEvent } from '@/lib/analytics';

/**
 * Every case study as one line. The grid above is for looking; this is for
 * scanning — a hiring manager reads it in about four seconds.
 */
export function WorkIndex({ studies }: { studies: CaseStudy[] }) {
    if (!studies || studies.length === 0) return null;

    return (
        <ul className="space-y-1">
            {studies.map((study) => (
                <li key={study.id} className="">
                    <Link
                        href={`/work/${study.slug}`}
                        onClick={() =>
                            clickEvent({
                                action: 'view_case_study',
                                category: 'engagement',
                                label: `Index: ${study.title}`,
                            })
                        }
                        className="group -mx-4 flex items-baseline gap-4 rounded-xl px-4 py-4 transition-colors duration-300 hover:bg-shell md:gap-8"
                    >
                        <span className="min-w-0 flex-1 truncate font-display text-[17px] font-medium tracking-[-0.02em] text-chalk md:text-[19px]">
                            {study.title}
                        </span>
                        <span className="hidden shrink-0 text-[12px] text-dust sm:block">
                            {study.category}
                        </span>
                        <span className="tabular w-12 shrink-0 text-right text-[12px] text-dust">
                            {study.year || '—'}
                        </span>
                        <ArrowRight
                            size={14}
                            aria-hidden="true"
                            className="shrink-0 self-center text-dust transition-all duration-300 group-hover:translate-x-1 group-hover:text-chalk"
                        />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
