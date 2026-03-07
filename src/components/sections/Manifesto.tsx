'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Manifesto() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                }
            });

            tl.from('.manifesto-line-1', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            })
                .from('.manifesto-line-2', {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }, "-=0.4")
                .from('.process-step', {
                    y: 30,
                    opacity: 0,
                    stagger: 0.15,
                    duration: 0.6,
                    ease: 'power2.out'
                }, "-=0.2");

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="process" ref={containerRef} className="relative w-full py-20 md:py-32 bg-ink border-t border-zinc-800 overflow-hidden text-white">

            {/* Textured Pattern */}
            <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay pointer-events-none">
                <div className="absolute inset-0 dotted-field opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                <div className="max-w-4xl mb-16 md:mb-24">
                    <h2 className="flex flex-col gap-2 md:gap-4 font-sans font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1]">
                        <span className="manifesto-line-1" style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)', color: 'transparent' }}>
                            Most portfolios show visuals.
                        </span>
                        <span className="manifesto-line-2 text-white drop-shadow-2xl">
                            I show outcomes.
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-5xl mx-auto w-full text-left">

                    <div className="process-step relative border-l border-zinc-700 pl-6 lg:pl-8 py-2">
                        <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-blue-primary shadow-[0_0_10px_rgba(30,79,255,0.8)]" />
                        <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase mb-4 block">01</span>
                        <h3 className="font-serif italic text-2xl sm:text-3xl text-white mb-3">Strategy + Message</h3>
                        <p className="font-sans text-zinc-400 leading-relaxed text-sm">
                            Before a single pixel is drawn, I establish the conversion hierarchy. Aligning business objectives with user intent through precise positioning.
                        </p>
                    </div>

                    <div className="process-step relative border-l border-zinc-700 pl-6 lg:pl-8 py-2">
                        <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-blue-primary shadow-[0_0_10px_rgba(30,79,255,0.8)]" />
                        <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase mb-4 block">02</span>
                        <h3 className="font-serif italic text-2xl sm:text-3xl text-white mb-3">Design System + UI</h3>
                        <p className="font-sans text-zinc-400 leading-relaxed text-sm">
                            Crafting a scalable aesthetic that signals premium quality and trust, utilizing micro-interactions to guide the eye.
                        </p>
                    </div>

                    <div className="process-step relative border-l border-zinc-700 pl-6 lg:pl-8 py-2">
                        <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-blue-primary shadow-[0_0_10px_rgba(30,79,255,0.8)]" />
                        <span className="font-mono text-xs text-zinc-500 tracking-widest uppercase mb-4 block">03</span>
                        <h3 className="font-serif italic text-2xl sm:text-3xl text-white mb-3">Build + Optimize</h3>
                        <p className="font-sans text-zinc-400 leading-relaxed text-sm">
                            Engineering zero-jank, sub-second load times using cutting-edge frameworks. Because speed is the foundation of conversion.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}
