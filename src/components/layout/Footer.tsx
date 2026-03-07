'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PaperPlaneTilt, ChatCircle, TrendUp, VideoCamera } from '@phosphor-icons/react';
import { Button } from '@/components/ui/Button';
import { BlinkingSmiley } from '@/components/ui/GlobalLoader';
import { clickEvent } from '@/lib/gtag';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
    const [copied, setCopied] = useState(false);
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Section 1: Let's Talk
            gsap.from('.talk-title', {
                scrollTrigger: {
                    trigger: '.talk-section',
                    start: 'top 80%',
                },
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.1
            });

            gsap.from('.talk-content', {
                scrollTrigger: {
                    trigger: '.talk-section',
                    start: 'top 75%',
                },
                y: 40,
                opacity: 0,
                duration: 1,
                delay: 0.3,
                ease: 'power3.out',
                stagger: 0.2
            });

            // Book a call card animation
            gsap.from('.booking-card', {
                scrollTrigger: {
                    trigger: '.talk-section',
                    start: 'top 60%',
                },
                x: 60,
                rotate: 15,
                scale: 0.9,
                opacity: 0,
                duration: 1.5,
                ease: 'elastic.out(1, 0.8)',
            });

            // Section 2: Email Banner
            gsap.from('.email-pill', {
                scrollTrigger: {
                    trigger: '.email-section',
                    start: 'top 85%',
                },
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });

            gsap.from('.email-address', {
                scrollTrigger: {
                    trigger: '.email-section',
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 1.2,
                delay: 0.2,
                ease: 'power4.out'
            });

            gsap.from('.email-text', {
                scrollTrigger: {
                    trigger: '.email-section',
                    start: 'top 75%',
                },
                y: 30,
                opacity: 0,
                duration: 1,
                delay: 0.4,
                ease: 'power3.out'
            });
        }, footerRef);

        return () => ctx.revert();
    }, []);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('ettozany@gmail.com');
        setCopied(true);
        clickEvent({
            action: 'copy_email',
            category: 'engagement',
            label: 'Footer'
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div ref={footerRef}>
            {/* Banner 1: Let's Talk & Contact Form (Dark) */}
            <section className="talk-section bg-[#0f0f0f] text-white pt-20 md:pt-32 pb-12 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 md:gap-16 items-center lg:gap-24">
                    {/* Left Column */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        <h2 className="talk-title font-sans font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter mb-8 md:mb-12 leading-none">
                            Let's<br />talk
                        </h2>

                        <p className="talk-content font-sans text-xl sm:text-2xl md:text-3xl lg:text-3xl text-zinc-400 font-medium leading-[1.3] mb-12 md:mb-16 max-w-md">
                            <span className="text-white font-bold tracking-tight">Have an idea in mind</span> — website,
                            app, or rebrand? Let's make it real.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-auto">
                            <div className="talk-content">
                                <h4 className="font-sans font-bold text-lg mb-4 flex items-center gap-3">
                                    <ChatCircle weight="fill" className="text-zinc-500 w-5 h-5" /> Quick response.
                                </h4>
                                <p className="font-sans text-sm text-zinc-400 leading-relaxed max-w-[200px]">
                                    I'll reach out within 24 hours to discuss your goals and expectations.
                                </p>
                            </div>
                            <div className="talk-content">
                                <h4 className="font-sans font-bold text-lg mb-4 flex items-center gap-3">
                                    <TrendUp className="text-zinc-500 w-5 h-5" weight="bold" /> Clear next steps.
                                </h4>
                                <p className="font-sans text-sm text-zinc-400 leading-relaxed max-w-[200px]">
                                    After the consultation, I'll provide you with a detailed plan and timeline.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Book a Call Card) */}
                    <div className="booking-card w-full h-fit lg:w-1/2 flex justify-center lg:justify-end lg:pr-12 lg:rotate-6">
                        <div className="bg-[#fafafa] rounded-system border border-zinc-200 shadow-2xl max-w-sm w-full relative -mt-4 overflow-hidden flex flex-col">
                            {/* Top light gray background area */}
                            <div className="h-24 bg-[#f4f4f5] border-b border-zinc-100 w-full absolute top-0 left-0"></div>

                            <div className="relative pt-14 px-8 pb-8 text-center z-10 flex-col flex items-center">
                                {/* Profile Image Wrap */}
                                <div className="flex justify-center mb-5 border-2 border-black rounded-full">
                                    <BlinkingSmiley size={80} />
                                </div>

                                {/* Tag */}
                                <div className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
                                    <VideoCamera className="w-3.5 h-3.5 text-zinc-400" weight="fill" />
                                    <span className="font-sans font-medium text-sm text-zinc-600">Intro call</span>
                                </div>

                                <h3 className="font-sans font-bold text-2xl text-[#282828] tracking-tight leading-tight mb-3">
                                    Book a 20 minute<br />call with Ettouzany
                                </h3>

                                <p className="font-sans text-sm text-zinc-500 mb-8 leading-relaxed max-w-[250px] mx-auto">
                                    Let's have a quick call and make sure we're a great fit...
                                </p>

                                <Link 
                                    href="/book" 
                                    className="w-full"
                                    onClick={() => clickEvent({
                                        action: 'click_book_call',
                                        category: 'conversion',
                                        label: 'Footer Card'
                                    })}
                                >
                                    <Button variant="primary" className="w-full py-4 text-[15px] font-bold shadow-md">
                                        Book a call
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Banner 2: Email Banner (Dark) */}
            <section className="email-section bg-[#0f0f0f] py-16 border-b border-zinc-800 relative overflow-hidden flex flex-col items-center justify-center">

                <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center max-w-5xl">
                    <div className="email-pill bg-zinc-900 border border-zinc-800 rounded-full px-5 py-2.5 flex items-center gap-2 mb-12 shadow-sm">
                        <PaperPlaneTilt weight="bold" className="text-zinc-400 w-4 h-4" />
                        <span className="font-sans text-[15px] font-medium text-zinc-300">Going old school?</span>
                    </div>

                    <div
                        className="email-address relative group cursor-pointer w-full max-w-[90vw]"
                        onClick={handleCopyEmail}
                    >
                        <h2 className="font-sans font-bold text-2xl sm:text-3xl md:text-5xl lg:text-7xl text-white tracking-tight mb-8 transition-colors hover:text-zinc-400 break-words">
                            ettozany@gmail.com
                        </h2>

                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                            <div className="bg-white text-ink text-sm font-sans font-medium px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
                                {copied ? 'Copied!' : 'Copy to clipboard'}
                                {/* Tooltip Arrow */}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                            </div>
                        </div>
                    </div>

                    <p className="email-text font-sans text-xl md:text-2xl text-zinc-400 max-w-2xl leading-relaxed">
                        I understand that not everyone wants to book a call
                        right away. Feel free to email me anytime!
                    </p>
                </div>
            </section>

            {/* Bottom Bar: Copyright & Policies */}
            <footer className="bg-[#0f0f0f] text-white">
                <div className="px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <p className="font-sans text-sm text-zinc-400">
                        © {new Date().getFullYear()} Ettouznay Abdelkader. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="/privacy" className="font-sans text-sm font-bold text-white hover:text-zinc-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/cookies" className="font-sans text-sm font-bold text-white hover:text-zinc-400 transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
