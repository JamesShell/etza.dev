"use client";

import React from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import { Navbar } from '@/components/layout/Navbar';
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "@phosphor-icons/react";

export default function NotFound() {
    return (
        <main className="relative w-full h-screen flex flex-col bg-paper text-ink overflow-hidden select-none">
            {/* Navbar is typically absolute or fixed, so it won't affect flex-1 centering much if handled correctly */}
            <Navbar />

            <div className="relative flex-1 flex flex-col items-center justify-center px-6 w-full h-full">
                {/* Background Pattern - subtle center focus */}
                <div
                    className="absolute inset-0 z-0 dotted-field opacity-60 pointer-events-none"
                    style={{
                        maskImage: "radial-gradient(circle at center, black 10%, transparent 60%)",
                        WebkitMaskImage: "radial-gradient(circle at center, black 10%, transparent 60%)"
                    }}
                ></div>

                {/* Main Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 flex flex-col items-center text-center max-w-5xl w-full"
                >
                    <motion.h1
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[30vw] md:text-[22rem] font-bold tracking-tighter leading-none text-ink mb-24 mix-blend-darken"
                    >
                        404
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col items-center -mt-8 md:-mt-12"
                    >
                        <h2 className="text-3xl md:text-6xl font-instrument italic text-zinc-800 mb-8">
                            Page not found
                        </h2>

                        <p className="max-w-md text-zinc-500 mb-12 text-lg md:text-xl leading-relaxed">
                            The link might be broken, or the page may have been removed or moved to another URL.
                        </p>

                        <Link href="/">
                            <Button
                                variant="primary"
                                className="font-semibold text-[18px] px-12 py-5 shadow-2xl shadow-black/10 flex items-center gap-3 transition-transform hover:scale-[1.03] active:scale-[0.97]"
                            >
                                <ArrowLeft className="w-6 h-6" weight="bold" />
                                Return home
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Simple Minimal Footer for 404 */}
            <footer className="absolute bottom-0 w-full px-6 py-8 flex justify-between items-center text-zinc-400 text-sm z-20">
                <p>© {new Date().getFullYear()} Ettouzany Abdelkader</p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
                    <Link href="/cookies" className="hover:text-ink transition-colors">Cookies</Link>
                </div>
            </footer>
        </main>
    );
}
