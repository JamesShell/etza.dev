'use client';

import React from 'react';
import { Coins, BoundingBox, ArrowsClockwise, Users } from '@phosphor-icons/react';

const features = [
    {
        icon: Coins,
        iconColor: 'text-purple-500',
        content: (
            <>
                Fair and transparent pricing.{' '}
                <strong className="font-semibold text-ink">No extra cost</strong> or surprising fees
            </>
        )
    },
    {
        icon: BoundingBox,
        iconColor: 'text-amber-500',
        content: (
            <>
                Collaborate with a{' '}
                <strong className="font-semibold text-ink">Senior Designer</strong> with +4 yrs experience
            </>
        )
    },
    {
        icon: ArrowsClockwise,
        iconColor: 'text-blue-500',
        content: (
            <>
                Iterating on projects until{' '}
                <strong className="font-semibold text-ink">you're satisfied</strong> with the outcome
            </>
        )
    },
    {
        icon: Users,
        iconColor: 'text-emerald-500',
        content: (
            <>
                Limited amount of customers ensuring top{' '}
                <strong className="font-semibold text-ink">design quality</strong>
            </>
        )
    }
];

export function ResultsDashboard() {
    return (
        <section id="results" className="relative w-full py-16 md:py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1400px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-zinc-50 rounded-system p-8 border border-zinc-100 flex flex-col items-start transition-all duration-300 hover:shadow-sm"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-zinc-100/50 flex items-center justify-center mb-6">
                                    <Icon className={`w-7 h-7 ${feature.iconColor}`} weight="regular" />
                                </div>
                                <p className="text-zinc-500 text-[17px] leading-relaxed font-sans">
                                    {feature.content}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
