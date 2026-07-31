'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CookieBanner = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('cookie-acknowledged')) {
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
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-6 md:max-w-[380px]"
                >
                    <div className="flex items-center gap-5 rounded-2xl bg-shell p-5">
                        <p className="flex-1 font-sans text-[13px] leading-relaxed text-ash">
                            This site counts visits without cookies or tracking.{' '}
                            <Link
                                href="/cookies"
                                className="text-chalk underline decoration-edge underline-offset-4 transition-colors hover:decoration-chalk"
                            >
                                Policy
                            </Link>
                        </p>
                        <button
                            type="button"
                            onClick={handleAccept}
                            className="shrink-0 cursor-pointer rounded-full bg-raise px-4 py-2 text-[11px] text-chalk transition-colors hover:bg-raise"
                        >
                            Got it
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
