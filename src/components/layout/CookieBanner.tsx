"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const CookieBanner = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already acknowledged
        const hasAcknowledged = localStorage.getItem('cookie-acknowledged');
        if (!hasAcknowledged) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-acknowledged', 'true');
        setShowBanner(false);
    };

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="fixed bottom-6 left-4 right-4 mx-auto md:bottom-8 md:right-8 md:left-auto md:mx-0 z-[100] w-auto max-w-md pointer-events-auto flex justify-center md:block"
                >
                    <div className="relative w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-center gap-6">
                        <div className="flex-1">
                            <p className="text-zinc-300 text-sm leading-relaxed pr-2">
                                I use cookies and analytics to understand <br className="hidden md:block" /> how you experience the site.{' '}
                                <Link
                                    href="/cookies"
                                    className="text-white underline underline-offset-2 hover:text-zinc-300 transition-colors font-medium whitespace-nowrap"
                                >
                                    Policy
                                </Link>
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center justify-center">
                            <Button
                                variant="outline"
                                onClick={handleAccept}
                                className="!px-6 !py-2.5 !text-sm border-zinc-700 hover:bg-white hover:text-zinc-900"
                            >
                                Got it
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;