'use client';

import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * A picture that drifts against the scroll inside its frame: as the frame
 * passes through the screen, the picture moves `strength` of its height the
 * other way, so it seems to sit a little deeper than the page. It's scaled up
 * just enough that its edges never come into the frame. Put it inside an
 * element that clips (overflow hidden). Still for anyone who has asked for
 * less motion.
 */
export function Parallax({ children, strength = 0.07 }: { children: React.ReactNode; strength?: number }) {
    const ref = React.useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], [`${-strength * 100}%`, `${strength * 100}%`]);

    return (
        <div ref={ref}>
            <motion.div style={reduce ? undefined : { y, scale: 1 + strength * 2 + 0.02 }} className="will-change-transform">
                {children}
            </motion.div>
        </div>
    );
}
