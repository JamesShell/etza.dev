'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, X, Star, Browser, Desktop, PenNib, Code, DeviceMobile, PaintBrush, RocketLaunch } from '@phosphor-icons/react';
import { CaseStudy, SelectedWork } from '@/types/database';
import { isVideoUrl } from '@/lib/utils';
import { clickEvent } from '@/lib/gtag';

// Map string icon names to actual Phosphor components
const IconMap: Record<string, any> = {
    'Browser': Browser,
    'Desktop': Desktop,
    'PenNib': PenNib,
    'Code': Code,
    'Mobile': DeviceMobile,
    'PaintBrush': PaintBrush,
    'RocketLaunch': RocketLaunch
};

interface FeaturedWorkProps {
    works: (SelectedWork & { case_study?: CaseStudy | null })[];
}

export function FeaturedWork({ works }: FeaturedWorkProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (!works || works.length === 0) return null;

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -800, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 800, behavior: 'smooth' });
        }
    };

    const getWidthClass = (width: string) => {
        return width === 'narrow'
            ? 'w-[85vw] sm:w-[350px] lg:w-[450px] xl:w-[550px]'
            : 'w-[90vw] sm:w-[500px] lg:w-[700px] xl:w-[900px]';
    };

    return (
        <section id="work" className="relative w-full pt-20 max-w-[100vw] lg:pt-32 bg-white overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1400px]">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12">
                    <div>
                        <h2 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink mb-2 md:mb-3">
                            Selected Works
                        </h2>
                        <p className="font-sans text-lg md:text-xl text-zinc-500 max-w-lg">
                            A glimpse into some of my recent digital products and engineered outcomes.
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={scrollLeft}
                            className="cursor-pointer w-12 h-12 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:text-ink hover:border-zinc-300 hover:bg-zinc-50 transition-all shadow-sm"
                            aria-label="Scroll left"
                        >
                            <ArrowLeft size={20} weight="bold" />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="cursor-pointer w-12 h-12 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:text-ink hover:border-zinc-300 hover:bg-zinc-50 transition-all shadow-sm"
                            aria-label="Scroll right"
                        >
                            <ArrowRight size={20} weight="bold" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-12 pt-4 px-6 md:px-12 lg:px-[max(6vw,calc((100vw-1400px)/2+24px))] hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {works.map((work) => {
                        const cs = work.case_study;
                        const showOverlay = work.show_hover_overlay && cs;

                        return (
                            <div
                                key={work.id}
                                className={`snap-center shrink-0 ${getWidthClass(work.display_width)} group flex flex-col`}
                            >
                                {/* Conditional Layout: Videos get the inner frame, Images fill the container straight away */}
                                {isVideoUrl(work.image_url) ? (
                                    <div className="relative w-full h-[50vw] sm:h-[400px] lg:h-[550px] xl:h-[650px] rounded-[24px] p-2 sm:p-4 bg-zinc-100 border border-zinc-200/80 mb-6 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:shadow-md group-hover:bg-zinc-200/50">
                                        <video
                                            src={work.image_url}
                                            autoPlay muted loop playsInline
                                            className="overflow-hidden max-w-full max-h-full object-cover rounded-[20px] shadow-sm border border-zinc-200/50"
                                        />

                                        {/* Hover Overlay — only if enabled AND linked to a case study */}
                                        {showOverlay && cs && (
                                            <div className="absolute top-6 bottom-6 left-6 right-6 md:right-auto md:w-[360px] lg:w-[420px] bg-white/95 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 p-6 flex flex-col shadow-2xl rounded-3xl translate-y-4 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto border border-zinc-100">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex items-center gap-3">
                                                        {cs.logo_url ? (
                                                            <div className={`w-12 h-12 rounded-full ${cs.logo_bg} flex items-center justify-center shadow-sm shrink-0 overflow-hidden`}>
                                                                <img src={cs.logo_url} alt={cs.title} className="w-full h-full object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className={`w-12 h-12 rounded-full ${cs.logo_bg} flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0`}>
                                                                {cs.logo_text}
                                                            </div>
                                                        )}
                                                        <h3 className="text-2xl lg:text-3xl font-sans font-bold text-ink tracking-tight">{cs.title}</h3>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {(cs.badges as any[])?.map((badge, i) => {
                                                        const BadgeIcon = IconMap[badge.icon] || Browser;
                                                        return (
                                                            <span key={i} className="px-3 py-1.5 bg-zinc-100/80 text-zinc-600 rounded-full text-xs font-sans font-medium flex items-center gap-1.5">
                                                                <BadgeIcon size={14} />
                                                                {badge.text}
                                                            </span>
                                                        );
                                                    })}
                                                </div>

                                                <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar flex flex-col">
                                                    <div className="mb-6">
                                                        {cs.description.split('\n\n').map((para, i) => (
                                                            <p key={i} className="text-zinc-600 text-[17px] leading-relaxed mb-4 font-sans">
                                                                {para}
                                                            </p>
                                                        ))}
                                                    </div>

                                                    {cs.testimonial_text && (
                                                        <div className="border-l-2 border-ink/20 pl-6 mb-6 min-w-0">
                                                            <p className="font-sans text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Client Testimonial</p>
                                                            <p className="text-zinc-700 text-base leading-relaxed mb-5 font-serif italic break-words line-clamp-4">
                                                                {cs.testimonial_text}
                                                            </p>
                                                            <div className="flex items-center gap-4">
                                                                <img src={cs.testimonial_avatar} alt={cs.testimonial_author} className="w-10 h-10 rounded-full object-cover shadow-sm bg-zinc-100" />
                                                                <div>
                                                                    <div className="flex text-amber-500 mb-1 gap-0.5">
                                                                        {[...Array(cs.testimonial_stars)].map((_, i) => (
                                                                            <Star key={i} size={14} weight="fill" />
                                                                        ))}
                                                                    </div>
                                                                    <p className="text-sm text-zinc-800 font-sans font-medium">{cs.testimonial_author}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="mt-auto">
                                                        <Link 
                                                            href={`/work/${cs.slug}`}
                                                            onClick={() => clickEvent({
                                                                action: 'view_case_study',
                                                                category: 'engagement',
                                                                label: `Slider Video: ${cs.title}`
                                                            })}
                                                        >
                                                            <button className="cursor-pointer w-full py-4 bg-ink text-white rounded-xl font-sans font-bold text-base hover:bg-zinc-800 transition-colors shadow-md">
                                                                View Full Case Study
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative w-full h-[50vw] sm:h-[400px] lg:h-[550px] xl:h-[650px] rounded-system overflow-hidden bg-zinc-50 border border-zinc-200/60 mb-6 shadow-sm transition-all duration-500 group-hover:shadow-md">
                                        <Image
                                            src={work.image_url}
                                            alt={work.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 600px, 1000px"
                                        />
                                        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/[0.02] transition-colors duration-500 pointer-events-none" />

                                        {/* Hover Overlay — only if enabled AND linked to a case study */}
                                        {showOverlay && cs && (
                                            <div className="absolute top-4 bottom-4 left-4 right-4 md:right-auto md:w-[360px] lg:w-[420px] bg-white/95 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 p-6 flex flex-col shadow-2xl rounded-3xl translate-y-4 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto border border-zinc-100">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex items-center gap-3">
                                                        {cs.logo_url ? (
                                                            <div className={`w-12 h-12 rounded-full ${cs.logo_bg} flex items-center justify-center shadow-sm shrink-0 overflow-hidden`}>
                                                                <img src={cs.logo_url} alt={cs.title} className="w-full h-full object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className={`w-12 h-12 rounded-full ${cs.logo_bg} flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0`}>
                                                                {cs.logo_text}
                                                            </div>
                                                        )}
                                                        <h3 className="text-2xl lg:text-3xl font-sans font-bold text-ink tracking-tight">{cs.title}</h3>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {(cs.badges as any[])?.map((badge, i) => {
                                                        const BadgeIcon = IconMap[badge.icon] || Browser;
                                                        return (
                                                            <span key={i} className="px-3 py-1.5 bg-zinc-100/80 text-zinc-600 rounded-full text-xs font-sans font-medium flex items-center gap-1.5">
                                                                <BadgeIcon size={14} />
                                                                {badge.text}
                                                            </span>
                                                        );
                                                    })}
                                                </div>

                                                <div className="w-full flex-1 overflow-y-auto pr-2 hide-scrollbar flex flex-col">
                                                    <div className="mb-6">
                                                        {cs.description.split('\n\n').map((para, i) => (
                                                            <p key={i} className="text-zinc-600 text-[17px] leading-relaxed mb-4 font-sans">
                                                                {para}
                                                            </p>
                                                        ))}
                                                    </div>

                                                    {cs.testimonial_text && (
                                                        <div className="w-full border-l-2 border-ink/20 pl-6 mb-6 min-w-0">
                                                            <p className="font-sans text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Client Testimonial</p>
                                                            <p className="text-zinc-700 text-base leading-relaxed mb-5 font-serif italic break-words line-clamp-4">
                                                                {cs.testimonial_text}
                                                            </p>
                                                            <div className="flex items-center gap-4">
                                                                <img src={cs.testimonial_avatar} alt={cs.testimonial_author} className="w-10 h-10 rounded-full object-cover shadow-sm bg-zinc-100" />
                                                                <div>
                                                                    <div className="flex text-amber-500 mb-1 gap-0.5">
                                                                        {[...Array(cs.testimonial_stars)].map((_, i) => (
                                                                            <Star key={i} size={14} weight="fill" />
                                                                        ))}
                                                                    </div>
                                                                    <p className="text-sm text-zinc-800 font-sans font-medium">{cs.testimonial_author}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="mt-auto">
                                                        <Link 
                                                            href={`/work/${cs.slug}`}
                                                            onClick={() => clickEvent({
                                                                action: 'view_case_study',
                                                                category: 'engagement',
                                                                label: `Slider Image: ${cs.title}`
                                                            })}
                                                        >
                                                            <button className="w-full cursor-pointer py-4 bg-ink text-white rounded-xl font-sans font-bold text-base hover:bg-zinc-800 transition-colors shadow-md">
                                                                View Full Case Study
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between items-start px-2 mt-2">
                                    <div>
                                        <h3 className="font-sans font-bold text-2xl text-ink mb-1 group-hover:text-zinc-600 transition-colors">
                                            {work.title}
                                        </h3>
                                        <p className="font-sans text-zinc-500 text-sm tracking-wide uppercase font-semibold">
                                            {work.category}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </section >
    );
}
