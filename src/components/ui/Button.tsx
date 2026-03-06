'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { ArrowRight } from '@phosphor-icons/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    showArrow?: boolean;
}

export function Button({
    children,
    className,
    variant = 'primary',
    showArrow = false,
    ...props
}: ButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        let ctx = gsap.context(() => {
            const xTo = gsap.quickTo(button, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.3)' });
            const yTo = gsap.quickTo(button, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.3)' });

            const textXTo = gsap.quickTo(textRef.current, 'x', { duration: 0.6, ease: 'power3.out' });
            const textYTo = gsap.quickTo(textRef.current, 'y', { duration: 0.6, ease: 'power3.out' });

            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                xTo(x * 0.3);
                yTo(y * 0.3);

                textXTo(x * 0.15);
                textYTo(y * 0.15);
            });

            button.addEventListener('mouseleave', () => {
                xTo(0);
                yTo(0);
                textXTo(0);
                textYTo(0);
            });
        }, button);

        return () => ctx.revert();
    }, []);

    const variants = {
        primary:
            'bg-ink text-white border border-ink hover:text-white',
        secondary:
            'bg-transparent text-ink border border-zinc-300 hover:border-ink',
        outline:
            'bg-transparent text-white border border-white/30 hover:border-white',
    };

    return (
        <button
            ref={buttonRef}
            className={cn(
                'group relative overflow-hidden rounded-full px-8 py-4 font-sans text-sm font-semibold tracking-wide transition-colors duration-300 cursor-pointer',
                variants[variant],
                className
            )}
            {...props}
        >
            {/* Sliding Background Layer */}
            {variant === 'primary' && (
                <div
                    ref={bgRef}
                    className="absolute inset-0 z-0 bg-zinc-800 translate-y-[100%] rounded-full transition-transform duration-500 ease-out group-hover:translate-y-0"
                />
            )}
            {variant === 'secondary' && (
                <div
                    ref={bgRef}
                    className="absolute inset-0 z-0 bg-zinc-100 translate-y-[100%] rounded-full transition-transform duration-500 ease-out group-hover:translate-y-0"
                />
            )}
            {variant === 'outline' && (
                <div
                    ref={bgRef}
                    className="absolute inset-0 z-0 bg-white text-ink translate-y-[100%] rounded-full transition-transform duration-500 ease-out group-hover:translate-y-0"
                />
            )}

            {/* Content */}
            <span
                ref={textRef}
                className={cn("relative z-10 flex items-center justify-center gap-2",
                    variant === 'outline' ? "group-hover:text-ink transition-colors duration-300" : ""
                )}
            >
                {children}
                {showArrow && (
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-45" />
                )}
            </span>
        </button>
    );
}
