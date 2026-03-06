"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

interface GlobalLoaderProps {
    isLoading?: boolean;
    message?: string;
    overlay?: boolean;
    className?: string;
}

// Blinking smiley face component
interface BlinkingSmileyProps {
    animate?: boolean;
    className?: string;
    size?: number; // px, default 80
}

const BlinkingSmiley: React.FC<BlinkingSmileyProps> = ({ animate = true, className, size = 80 }) => {
    const [blinkKey, setBlinkKey] = useState(0);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Scale factor relative to the default 80px size
    const s = size / 80;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX - innerWidth / 2) / (innerWidth / 2) * 12 * s;
            const y = (e.clientY - innerHeight / 2) / (innerHeight / 2) * 12 * s;

            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [s]);

    useEffect(() => {
        if (!animate) return;

        let timeout: NodeJS.Timeout;

        const scheduleBlink = () => {
            const nextBlink = 1000 + Math.random() * 1000;

            timeout = setTimeout(() => {
                setBlinkKey(prev => prev + 1);
                scheduleBlink();

                if (Math.random() > 0.7) {
                    setTimeout(() => setBlinkKey(prev => prev + 1), 200);
                }
            }, nextBlink);
        };

        scheduleBlink();
        return () => clearTimeout(timeout);
    }, [animate]);

    // Proportional dimensions
    const borderW = Math.max(1.5, 2 * s);
    const eyeW = 12 * s;
    const eyeH = 20 * s;
    const eyeTop = 24 * s;
    const eyeLeftOffset = 24 * s;
    const eyeRightOffset = 24 * s;
    const closedEyeH = 4 * s;

    return (
        <div className={`relative ${className || ''}`} style={{ width: size, height: size }}>
            <div
                className="absolute inset-0 rounded-full bg-background"
                style={{ border: `${borderW}px solid currentColor` }}
            ></div>

            {animate ? (
                <>
                    <motion.div
                        key={`left-${blinkKey}`}
                        initial={{ scaleY: 1 }}
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute bg-foreground rounded-full origin-center"
                        style={{ top: eyeTop, left: eyeLeftOffset, width: eyeW, height: eyeH, x: springX, y: springY }}
                    />
                    <motion.div
                        key={`right-${blinkKey}`}
                        initial={{ scaleY: 1 }}
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute bg-foreground rounded-full origin-center"
                        style={{ top: eyeTop, right: eyeRightOffset, width: eyeW, height: eyeH, x: springX, y: springY }}
                    />
                </>
            ) : (
                <>
                    <motion.div className="absolute bg-foreground rounded-full" style={{ top: eyeTop, left: eyeLeftOffset, width: eyeW, height: closedEyeH, x: springX, y: springY }} />
                    <motion.div className="absolute bg-foreground rounded-full" style={{ top: eyeTop, right: eyeRightOffset, width: eyeW, height: closedEyeH, x: springX, y: springY }} />
                </>
            )}
        </div>
    );
};


// Global loader component
const GlobalLoader: React.FC<GlobalLoaderProps> = ({
    isLoading = true,
    message,
    overlay = true,
    className = ""
}) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`
            ${overlay ? 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm' : 'absolute inset-0'} 
            flex items-center justify-center
            ${className}
          `}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="flex flex-col items-center space-y-4"
                    >
                        <BlinkingSmiley />

                        {message && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="text-foreground/80 text-sm font-medium"
                            >
                                {message}
                            </motion.p>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Page loader component for full-screen loading
const PageLoader: React.FC<{ message?: string }> = ({ }) => {
    return (
        <GlobalLoader
            isLoading={true}
            overlay={true}
            className="bg-background"
        />
    );
};

// Inline loader component for sections/components
const InlineLoader: React.FC<{ message?: string; className?: string }> = ({
    message,
    className = "h-32"
}) => {
    return (
        <GlobalLoader
            isLoading={true}
            message={message}
            overlay={false}
            className={`relative ${className}`}
        />
    );
};

export { GlobalLoader, PageLoader, InlineLoader, BlinkingSmiley };
export default GlobalLoader;
