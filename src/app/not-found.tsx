"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MonkeyCanvas } from "@/components/canvas";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "@phosphor-icons/react";

export default function NotFound() {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    // Staggered entrance variants
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15, delayChildren: 0.2 },
        },
    };
    
    const item = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
        },
    };

    return (
        <main className="relative z-10 min-h-screen bg-cinematic text-paper selection:bg-white selection:text-ink flex flex-col overflow-hidden">
            <Navbar />
            
            <div className="flex-1 relative flex items-center justify-center pt-24 pb-20 w-full overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 dotted-field opacity-20 pointer-events-none"></div>
                
                {/* Background Canvas (Faded & blurred) */}
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20 blur-[2px]">
                    <div className="w-full h-full transform scale-150 sm:scale-125">
                        {mounted && <MonkeyCanvas className="w-full h-full object-contain" hovered="" />}
                    </div>
                </div>

                {/* Content */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={container}
                    className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center"
                >
                    <motion.div variants={item} className="mb-6">
                        <div className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                            <span className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></span>
                            <span className="font-sans text-sm font-medium tracking-wide text-zinc-300">System Error</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        variants={item}
                        className="text-[12vw] sm:text-7xl md:text-8xl lg:text-[10rem] font-bold leading-[0.85] tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500"
                    >
                        404
                    </motion.h1>

                    <motion.h2
                        variants={item}
                        className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-zinc-300 mb-6"
                    >
                        Lost in the digital void.
                    </motion.h2>

                    <motion.p
                        variants={item}
                        className="text-lg text-zinc-400 max-w-md mx-auto leading-relaxed mb-10"
                    >
                        The page you're looking for has ceased to exist, was moved, or never was.
                    </motion.p>

                    <motion.div variants={item}>
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="group bg-transparent border-white/20 text-white hover:bg-white hover:text-ink transition-all duration-300 px-8 py-4 font-semibold text-[16px] flex items-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" weight="bold" />
                                Return to transmission
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
            
            <Footer />
        </main>
    );
}
