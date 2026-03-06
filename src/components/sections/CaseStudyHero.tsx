import React from 'react';
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
        <section className="relative w-full bg-white pt-48 pb-24 border-b border-zinc-200 overflow-hidden">
            <div className={`container mx-auto px-6 ${heroImage ? 'flex flex-col lg:flex-row items-center gap-12 lg:gap-16' : ''}`}>
                <div className={heroImage ? "w-full lg:w-1/2" : "max-w-4xl"}>
                    <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-6 py-1 px-3 border border-zinc-200 rounded-full inline-block">
                        {type}
                    </span>
                    <h1 className="font-sans font-bold text-5xl md:text-7xl text-ink tracking-tight mb-8 leading-[1.1]">
                        {title}
                    </h1>
                    <p className="font-serif italic text-2xl text-zinc-600 mb-16 max-w-2xl leading-relaxed">
                        {description}
                    </p>

                    {metrics && metrics.length > 0 && (
                        <div className="w-full flex flex-col pt-12">
                            {metrics.map((metric, i) => (
                                <div key={i} className={`flex flex-col md:flex-row md:items-start justify-between py-6 border-t border-zinc-200 ${i === metrics.length - 1 ? 'border-b' : ''}`}>
                                    <div className="font-sans text-sm text-zinc-500 mb-2 md:mb-0 shrink-0 md:w-1/4">{metric.label}</div>
                                    <div className="font-sans text-lg text-ink font-medium md:w-3/4 md:text-right leading-relaxed flex flex-wrap md:justify-end">
                                        {metric.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {heroImage && (
                    <div className="w-full lg:w-1/2 mt-16 lg:mt-0">
                        <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-200">
                            {isVideoUrl(heroImage) ? (
                                <video src={heroImage} autoPlay muted loop playsInline className="w-full h-auto block" />
                            ) : (
                                <img src={heroImage} alt={title} className="w-full h-auto block" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
