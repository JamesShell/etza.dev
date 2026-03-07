"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MonkeyCanvas } from "@/components/canvas";
import { ArrowRight, CaretDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { clickEvent } from "@/lib/gtag";

type HoverState = "" | "about" | "work" | "contact" | "github" | "linkedin" | "twitter" | "dribbble";

export function Hero() {
    const [hoveredOne, setHoveredOne] = useState<HoverState>("");
    const [isDesktop, setIsDesktop] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();

    const smoothScrollY = useSpring(scrollY, {
        stiffness: 50,
        damping: 20,
        restDelta: 0.001,
    });

    // Canvas: slide from right (+25 vw) → centre (0)
    const canvasXRaw = useTransform(smoothScrollY, [0, 600], [25, 0]);
    const canvasX = useTransform(canvasXRaw, (v) => `${v}vw`);
    const canvasOpacity = useTransform(smoothScrollY, [0, 1000], [1, 0.3]);
    const canvasY = useTransform(smoothScrollY, [0, 600], [0, 30]);

    // Text: fade + blur + drift on scroll
    const textOpacity = useTransform(smoothScrollY, [0, 400], [1, 0]);
    const textBlurRaw = useTransform(smoothScrollY, [0, 400], [0, 8]);
    const textBlur = useTransform(textBlurRaw, (v) => `blur(${v}px)`);
    const textY = useTransform(smoothScrollY, [0, 400], [0, -30]);

    // Desktop check
    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 1024);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const scrollToWork = () => {
        document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToPricing = () => {
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    };

    // Staggered entrance variants
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" as const, staggerChildren: 0.15, delayChildren: 0.1 },
        },
    };
    const item = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
        },
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full min-h-screen lg:min-h-[100vh] flex items-center"
            style={{ touchAction: "pan-y" }}
        >
            <motion.div
                initial="visible"
                animate="visible"
                className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between w-full py-20 lg:py-0"
                variants={container}
            >
                {/* ---------- Left: text content ---------- */}
                <motion.div
                    className="flex flex-col justify-center z-10 w-full lg:w-3/4 max-w-6xl lg:pr-8"
                    variants={item}
                    style={{ opacity: textOpacity, filter: textBlur, y: textY }}
                >

                    {/* Badge */}
                    <motion.div variants={item} className="mb-10 flex self-start">
                        <div className="inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-full bg-white border border-zinc-200 select-none transition-transform duration-300 hover:scale-[1.02]">
                            <div className="relative flex items-center justify-center w-4 h-4">
                                <span className="absolute inset-0 rounded-full bg-green-400/30 animate-pulse"></span>
                                <span className="relative w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]"></span>
                            </div>
                            <span className="font-sans text-[16px] font-medium text-zinc-800 tracking-tight leading-none mb-[2px]">Accepting new projects</span>
                        </div>
                    </motion.div>



                    {/* Headline */}
                    <motion.h1
                        className="text-[12vw] sm:text-5xl md:text-6xl lg:text-[6.5rem] font-bold text-black leading-[0.95] mb-6 sm:mb-8 tracking-[-0.04em]"
                        variants={item}
                    >
                        LEVEL UP YOUR<br />
                        AGENCY'S<br />
                        PRESENCE
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        className="text-sm sm:text-base lg:text-xl text-zinc-500 leading-relaxed max-w-xl mb-6 sm:mb-8"
                        variants={item}
                    >
                        Design & engineering for agencies who'd rather deliver results than wrestle with their own website.
                    </motion.p>

                    {/* CTA */}
                    <motion.div className="flex flex-row gap-3 sm:gap-4 items-center sm:items-start flex-wrap" variants={item}>
                        <Button
                            variant="primary"
                            className="font-semibold text-[14px] sm:text-[17px] flex items-center justify-center transition-all duration-300 shadow-xl shadow-black/10 px-4 sm:px-8 py-2.5 sm:py-4"
                            onClick={scrollToWork}
                            onMouseEnter={() => setHoveredOne("about")}
                            onMouseLeave={() => setHoveredOne("")}
                        >
                            View works
                        </Button>
                        <Link 
                            href="/book"
                            onClick={() => clickEvent({
                                action: 'click_book_call',
                                category: 'conversion',
                                label: 'Hero Section'
                            })}
                        >
                            <Button
                                variant="secondary"
                                className="bg-transparent border border-zinc-300 text-black font-semibold text-[14px] sm:text-[17px] hover:bg-zinc-100/50 transition-all duration-300 px-4 sm:px-8 py-2.5 sm:py-4"
                                onMouseEnter={() => setHoveredOne("about")}
                                onMouseLeave={() => setHoveredOne("")}
                            >
                                Book a free call
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* ---------- Right: 3-D canvas (fixed layer) ---------- */}
                <motion.div
                    className="fixed inset-0 z-[-1] flex items-end lg:items-center justify-center pointer-events-none will-change-transform overflow-visible"
                    style={{ x: isDesktop ? canvasX : 0 }}
                >
                    <motion.div
                        className="relative w-full h-[60vh] lg:h-full will-change-transform overflow-visible mb-[-10vh] lg:mb-0"
                        style={{
                            opacity: canvasOpacity,
                            y: canvasY,
                            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                        }}
                    >
                        <div className="w-full h-full transform translate-y-0 lg:translate-y-12 scale-[1.3] lg:scale-100">
                            <MonkeyCanvas
                                className="w-full h-full invert dark:invert-0 object-contain"
                                hovered={hoveredOne}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                style={{ opacity: textOpacity }}
            >
                {/* Trust strip */}
                <motion.div variants={item} className="mb-6 flex self-start">
                    <a
                        href="https://contra.com/ettouzany"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => clickEvent({
                            action: 'click_contra_badge',
                            category: 'engagement',
                            label: 'Hero Section'
                        })}
                        className="bg-[#1a1a1a] border border-zinc-200/20 text-white rounded-full inline-flex items-center justify-center gap-2.5 pr-5 p-[3px] shadow-md select-none hover:scale-[1.02] transition-transform duration-300"
                    >
                        <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                                src="https://framerusercontent.com/images/qF8rcDA7pTJnw1tG4uApxBVnkTE.svg"
                                alt="Contra"
                                className="w-[30px] h-[30px] scale-[1.15]"
                            />
                        </div>
                        <span className="font-sans font-medium text-[16px] tracking-tight leading-none mb-[2px]">Rated 5 stars on Contra</span>
                    </a>
                </motion.div>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-1 cursor-pointer"
                    onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
                >
                    <CaretDown className="w-6 h-6 text-ink/40" weight="bold" />
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Hero;
