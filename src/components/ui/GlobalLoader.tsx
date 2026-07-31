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
    /**
     * Eyes drift toward the pointer. Turn it off when the face is itself at the
     * pointer — there's nothing to look at, and at small sizes the drift is
     * wide enough to push an eye into the border.
     */
    track?: boolean;
    /** 'happy' arcs the eyes; 'angry' caves their top edges into a V. */
    mood?: 'default' | 'happy' | 'angry';
    /**
     * Enlarges the eyes relative to the head. Shrinking the whole face shrinks
     * the expression with it, and the eyes are the only thing carrying it — so
     * at small sizes give them more of the face than the proportions want.
     */
    eyeScale?: number;
}

const BlinkingSmiley: React.FC<BlinkingSmileyProps> = ({ animate = true, className, size = 80, track = true, mood = 'default', eyeScale = 1 }) => {
    const [blinkKey, setBlinkKey] = useState(0);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Scale factor relative to the default 80px size
    const s = size / 80;

    useEffect(() => {
        if (!track) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX - innerWidth / 2) / (innerWidth / 2) * 12 * s;
            const y = (e.clientY - innerHeight / 2) / (innerHeight / 2) * 12 * s;

            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [s, track]);

    useEffect(() => {
        if (!animate) return;

        let timeout: NodeJS.Timeout;

        const scheduleBlink = () => {
            // Roughly a human resting rate. Anything near a second reads as a
            // twitch and pulls the eye away from the page.
            const nextBlink = 4000 + Math.random() * 4000;

            timeout = setTimeout(() => {
                setBlinkKey(prev => prev + 1);
                scheduleBlink();

                if (Math.random() > 0.88) {
                    setTimeout(() => setBlinkKey(prev => prev + 1), 200);
                }
            }, nextBlink);
        };

        scheduleBlink();
        return () => clearTimeout(timeout);
    }, [animate]);

    // Proportional dimensions
    const borderW = Math.max(1.5, 2 * s);
    const baseW = 12 * s;
    const baseH = 20 * s;

    // Each eye grows about its own centre, so enlarging them doesn't shove the
    // pair apart or drop them down the face.
    const eyeW = baseW * eyeScale;
    const eyeH = baseH * eyeScale;
    const eyeTop = 24 * s - (eyeH - baseH) / 2;
    const eyeInset = 24 * s - (eyeW - baseW) / 2;

    const angry = mood === 'angry';
    const happy = mood === 'happy';

    /**
     * Expression is carried by the shape of each eye, not by rotating it —
     * a rotated capsule reads as a tilted eye, not as a brow.
     *
     * angry: the top edge is sliced away toward the nose, so the pair of top
     *        edges meet as \ / — a V across the face.
     * happy: the eye becomes a dome, flat along the bottom, which reads as the
     *        arc of a smiling eye.
     */
    const leftClip = angry ? 'polygon(0% 0%, 100% 22%, 100% 100%, 0% 100%)' : undefined;
    const rightClip = angry ? 'polygon(0% 22%, 100% 0%, 100% 100%, 0% 100%)' : undefined;

    const eyeShape = {
        width: eyeW,
        height: happy ? eyeH * 0.6 : eyeH,
        top: happy ? eyeTop + eyeH * 0.36 : eyeTop,
        borderRadius: happy ? `${eyeW}px ${eyeW}px 0 0` : '999px',
    };

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
                        className="absolute bg-foreground origin-center transition-[width,height,top,left,right] duration-300 ease-out"
                        style={{ ...eyeShape, left: eyeInset, x: springX, y: springY, clipPath: leftClip }}
                    />
                    <motion.div
                        key={`right-${blinkKey}`}
                        initial={{ scaleY: 1 }}
                        animate={{ scaleY: [1, 0.1, 1] }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute bg-foreground origin-center transition-[width,height,top,left,right] duration-300 ease-out"
                        style={{ ...eyeShape, right: eyeInset, x: springX, y: springY, clipPath: rightClip }}
                    />
                </>
            ) : (
                /* Static, but awake — squashing the eyes flat here would read as
                   a face asleep rather than one that simply isn't blinking. */
                <>
                    <motion.div className="absolute bg-foreground transition-[width,height,top,left,right] duration-300 ease-out" style={{ ...eyeShape, left: eyeInset, x: springX, y: springY, clipPath: leftClip }} />
                    <motion.div className="absolute bg-foreground transition-[width,height,top,left,right] duration-300 ease-out" style={{ ...eyeShape, right: eyeInset, x: springX, y: springY, clipPath: rightClip }} />
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
