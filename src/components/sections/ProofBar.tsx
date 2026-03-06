'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Lightning, Layout } from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

const proofPoints = [
    {
        icon: Target,
        label: 'Conversion-Focused',
        metric: '+42%',
        desc: 'Average conversion lift'
    },
    {
        icon: Lightning,
        label: 'Performance-Obsessed',
        metric: '< 1.8s',
        desc: 'Largest Contentful Paint'
    },
    {
        icon: Layout,
        label: 'Design-System Driven',
        metric: '-38%',
        desc: 'Reduction in bounce rate'
    }
];

export function ProofBar() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.proof-item', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                },
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power2.out',
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full py-16 bg-white border-b border-zinc-200">
            <div className="container mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
                    {proofPoints.map((point, i) => (
                        <div key={i} className="proof-item flex flex-col items-center text-center px-4 pt-6 md:pt-0">
                            <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-ink mb-4 border border-zinc-200">
                                <point.icon size={24} weight="regular" />
                            </div>
                            <h3 className="font-sans font-bold text-ink text-lg mb-1">{point.label}</h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="font-mono text-xl font-semibold text-ink tracking-tight">
                                    {point.metric}
                                </span>
                            </div>
                            <p className="font-sans text-sm text-zinc-500">{point.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Short Testimonial */}
                <div className="mt-16 pt-12 border-t border-zinc-200">
                    <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
                        <div className="flex gap-1 text-ink mb-4">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <blockquote className="font-serif italic text-2xl text-ink leading-relaxed mb-6">
                            "Abdel brought unmatched professionalism and design discipline to the project. He welcomed feedback, learned fast, and consistently delivered smart solutions under pressure."
                        </blockquote>
                        <div className="flex flex-col">
                            <span className="font-sans font-bold text-sm text-ink uppercase tracking-wider">Kodi Echeozo</span>
                            <span className="font-mono text-xs text-zinc-400 mt-1">CEO, Sybelle</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
