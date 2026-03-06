'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Check } from '@phosphor-icons/react';
import { clickEvent } from '@/lib/gtag';

const packages = [
    {
        name: 'Starter Setup',
        for: 'Early-stage founders needing a professional foundation.',
        price: '$4,500',
        timeline: '2-3 Weeks',
        features: [
            'Custom 3-page marketing site',
            'Fundamental messaging strategy',
            'Responsive component system',
            'Basic SEO & performance setup',
            'CMS configuration'
        ],
        highlight: false
    },
    {
        name: 'Performance Build',
        for: 'Funded startups aiming for scale and low acquisition costs.',
        price: '$12,500',
        timeline: '6-8 Weeks',
        features: [
            'Comprehensive 10+ page build out',
            'Conversion-focused architecture',
            'Premium design system',
            'Advanced micro-interactions (GSAP)',
            'Sub-second load optimization (LCP)',
            'A/B testing infrastructure setup',
            'Technical SEO architecture'
        ],
        highlight: true
    },
    {
        name: 'Retained Growth',
        for: 'Established brands needing continuous iteration.',
        price: '$4k / mo',
        timeline: 'Ongoing',
        features: [
            'Dedicated weekly engineering hours',
            'Continuous conversion rate optimization',
            'Priority bug fixes and feature rollouts',
            'Monthly performance auditing',
            'Strategic architectural consulting'
        ],
        highlight: false
    }
];

export function Pricing() {
    return (
        <section id="pricing" className="relative w-full py-24 lg:py-32 bg-white">
            <div className="container mx-auto px-6">

                <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
                    <h2 className="font-sans font-bold text-4xl lg:text-5xl text-ink tracking-tight mb-4">
                        Transparent Investments.
                    </h2>
                    <p className="font-serif italic text-xl text-zinc-500">
                        No vague quotes. Just high-ROI engineering packaged for your growth stage.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {packages.map((pkg, i) => (
                        <div
                            key={i}
                            className={`relative rounded-[2.5rem] p-8 lg:p-10 flex flex-col h-full border transition-all duration-300 ${pkg.highlight
                                ? 'bg-ink text-white border-ink shadow-2xl scale-100 md:scale-105 z-10'
                                : 'bg-white text-ink border-zinc-200 shadow-sm hover:shadow-lg'
                                }`}
                        >
                            <div className="mb-8">
                                <h3 className="font-sans font-bold text-2xl lg:text-3xl tracking-tight mb-2">
                                    {pkg.name}
                                </h3>
                                <p className={`text-sm ${pkg.highlight ? 'text-zinc-400' : 'text-zinc-500'} h-10`}>
                                    {pkg.for}
                                </p>
                            </div>

                            <div className={`mb-10 flex items-end gap-3 border-b pb-8 ${pkg.highlight ? 'border-zinc-700' : 'border-zinc-200'}`}>
                                <span className="font-mono text-4xl lg:text-5xl font-bold tracking-tighter">
                                    {pkg.price}
                                </span>
                                <span className={`font-sans text-xs tracking-widest uppercase ${pkg.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                    / {pkg.timeline}
                                </span>
                            </div>

                            <ul className="flex-1 space-y-4 mb-10">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className={`mt-0.5 rounded-full p-0.5 ${pkg.highlight ? 'bg-white/20' : 'bg-zinc-100'}`}>
                                            <Check className={`w-3.5 h-3.5 ${pkg.highlight ? 'text-white' : 'text-ink'}`} weight="bold" />
                                        </div>
                                        <span className="font-sans text-sm leading-tight opacity-90">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link 
                                href="/book" 
                                className="w-full"
                                onClick={() => clickEvent({
                                    action: 'click_book_call',
                                    category: 'conversion',
                                    label: `Pricing: ${pkg.name}`
                                })}
                            >
                                <Button
                                    variant={pkg.highlight ? 'outline' : 'secondary'}
                                    className={`w-full ${!pkg.highlight && 'border-zinc-300 hover:border-ink'}`}
                                >
                                    Book a Call
                                </Button>
                            </Link>

                            {pkg.highlight && (
                                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-blue-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                    Most Selected
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
