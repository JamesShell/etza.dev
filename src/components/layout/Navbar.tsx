'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BlinkingSmiley } from '@/components/ui/GlobalLoader';
import { cn } from '@/lib/utils';
import { clickEvent } from '@/lib/gtag';
import gsap from 'gsap';

const navLinks = [
    { href: '/#work', label: 'Work' },
    { href: '/#process', label: 'Process' },
    { href: '/#archive', label: 'Archive' },
    { href: '/#faq', label: 'FAQ' },
];

function getLuminance(r: number, g: number, b: number) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function getBackgroundColor(el: Element | null): { r: number; g: number; b: number } | null {
    while (el && el !== document.documentElement) {
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            const match = bg.match(/\d+/g);
            if (match && match.length >= 3) {
                return { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
            }
        }
        el = el.parentElement;
    }
    return null;
}

export function Navbar() {
    const isScrolled = true;
    const [isOverDark, setIsOverDark] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    const checkBackground = useCallback(() => {
        if (!navRef.current) return;
        const rect = navRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.bottom + 2;

        navRef.current.style.pointerEvents = 'none';
        const el = document.elementFromPoint(x, y);
        navRef.current.style.pointerEvents = '';

        const color = getBackgroundColor(el);
        if (color) {
            const lum = getLuminance(color.r, color.g, color.b);
            setIsOverDark(lum < 80);
        } else {
            setIsOverDark(false);
        }
    }, []);

    useEffect(() => {
        checkBackground();
        window.addEventListener('scroll', checkBackground, { passive: true });
        return () => window.removeEventListener('scroll', checkBackground);
    }, [checkBackground]);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from('.nav-item', {
                y: -20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.5,
            });
        });
        return () => ctx.revert();
    }, []);

    const dark = isScrolled && isOverDark;

    return (
        <header ref={navRef} className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <nav
                className={cn(
                    'flex items-center justify-between rounded-full px-4 md:px-8 py-3 md:py-4 transition-all duration-500 ease-in-out max-w-[95vw] md:max-w-none',
                    isScrolled
                        ? dark
                            ? 'backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 ring-1 ring-white/5'
                            : 'backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 ring-1 ring-white/20'
                        : 'bg-transparent border-transparent'
                )}
                style={isScrolled ? {
                    WebkitBackdropFilter: 'blur(40px)',
                    backdropFilter: 'blur(40px)',
                    background: dark
                        ? 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.4) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.45) 100%)',
                } : undefined}
            >
                <div className="flex items-center md:mr-10">
                    <Link href="/" className={cn("nav-item flex items-center gap-2 text-xl font-sans font-bold tracking-tighter transition-colors duration-500", dark ? 'text-white' : 'text-ink')}>
                        <BlinkingSmiley size={32} />
                    </Link>
                </div>

                <ul className="hidden md:flex items-center gap-10 md:mr-10">
                    {navLinks.map((link) => (
                        <li key={link.label} className="nav-item">
                            <Link
                                href={link.href}
                                className={cn(
                                    'relative text-base font-medium tracking-wide transition-colors duration-500 group',
                                    dark
                                        ? 'text-zinc-300 hover:text-white'
                                        : isScrolled ? 'text-zinc-600 hover:text-ink' : 'text-zinc-300 hover:text-white'
                                )}
                            >
                                {link.label}
                                <span
                                    className={cn(
                                        "absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full",
                                        dark ? "bg-white" : isScrolled ? "bg-ink" : "bg-white"
                                    )}
                                />
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="nav-item">
                    <Link 
                        href="/book"
                        onClick={() => clickEvent({
                            action: 'click_book_call',
                            category: 'conversion',
                            label: 'Navbar'
                        })}
                    >
                        <Button
                            variant={dark ? 'outline' : isScrolled ? 'primary' : 'outline'}
                            className={cn(
                                "max-md:px-4 max-md:py-2 px-8 py-3 !text-sm whitespace-nowrap transition-colors duration-500",
                                dark
                                    ? "border-white/40 text-white hover:bg-white hover:text-ink"
                                    : !isScrolled ? "border-white/40 text-white hover:bg-white hover:text-ink" : ""
                            )}
                        >
                            Book a Call
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    );
}

