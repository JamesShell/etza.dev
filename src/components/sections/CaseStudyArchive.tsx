'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { CaseStudy } from '@/types/database';
import { isVideoUrl } from '@/lib/utils';
import { clickEvent } from '@/lib/gtag';

export function CaseStudyArchive({ studies }: { studies: CaseStudy[] }) {
    // If no studies, hide the section
    if (!studies || studies.length === 0) return null;

    // Helper for alternating styles
    const getCardStyle = (index: number) => {
        const styles = [
            { bg: 'bg-zinc-950', text: 'text-white', border: 'border-zinc-800' },
            { bg: 'bg-zinc-50', text: 'text-ink', border: 'border-zinc-200' },
            { bg: 'bg-ink', text: 'text-white', border: 'border-zinc-800' }
        ];
        return styles[index % styles.length];
    };

    return (
        <section id="archive" className="relative w-full bg-white pt-16 md:pt-24 pb-24 md:pb-48">

            <div className="container mx-auto px-6 max-w-[1400px] mb-12 md:mb-16">
                <h2 className="font-sans font-bold text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight mb-4">
                    The Archive.
                </h2>
                <p className="font-serif italic text-lg md:text-xl text-zinc-500 max-w-xl">
                    Deep dives into system thinking, technical architecture, and resulting metrics.
                </p>
            </div>

            <div className="relative h-full flex flex-col items-center gap-12 sm:gap-16 pt-4 md:pt-8 pb-16 md:pb-32 px-4 md:px-6">
                {studies.map((study, index) => {
                    const style = getCardStyle(index);

                    return (
                        <div
                            key={study.id}
                            className={`archive-card sticky w-full max-w-[90vw] lg:max-w-[1400px] h-[85vh] md:h-[70vh] rounded-system p-6 lg:p-12 border shadow-sm hover:shadow-lg transition-shadow duration-500 flex flex-col md:flex-row gap-8 lg:gap-16 items-center justify-between
                ${style.bg} ${style.text} ${style.border}`}
                            style={{
                                top: `min(15vh, ${100 + index * 30}px)`,
                                zIndex: index,
                            }}
                        >

                            <div className="w-full md:w-[30%] flex flex-col justify-between h-full py-4 z-10">
                                <div>
                                    <span className="font-mono text-xs opacity-60 tracking-widest block mb-1">
                                        Vol {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="font-sans font-bold text-xs uppercase tracking-wider opacity-80 mb-6 py-1 px-3 border border-current rounded-full inline-block">
                                        {study.category}
                                    </span>

                                    <h3 className="font-sans font-bold text-4xl lg:text-5xl tracking-tight mb-6 leading-[1.1]">
                                        {study.title}
                                    </h3>
                                    {study.description && (
                                        <p className="font-serif italic text-lg mb-8 leading-relaxed opacity-80 line-clamp-3">
                                            {study.description}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Link 
                                        href={`/work/${study.slug}`}
                                        onClick={() => clickEvent({
                                            action: 'view_case_study',
                                            category: 'engagement',
                                            label: `Archive: ${study.title}`
                                        })}
                                    >
                                        <Button variant={index % 3 === 0 ? 'outline' : index % 3 === 2 ? 'primary' : 'secondary'} showArrow>
                                            Analyze Study
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="w-full md:w-[70%] h-[50%] md:h-full z-10">
                                <div className="w-full h-full relative border border-current/10 rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center group p-0">
                                    {isVideoUrl(study.image_url) ? (
                                        <video
                                            src={study.image_url}
                                            autoPlay muted loop playsInline
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                                        />
                                    ) : (
                                        <Image
                                            src={study.image_url}
                                            alt={study.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                                        />
                                    )}
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

        </section>
    );
}
