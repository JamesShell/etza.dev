'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { PlusCircle, MinusCircle } from '@phosphor-icons/react';

const faqs = [
    {
        question: 'How long does it take to build a website?',
        answer: 'The timeline for building a website depends on its complexity and specific requirements. On average, I\'ll provide a detailed timeline during the initial consultation to ensure clear expectations.'
    },
    {
        question: 'Do you offer custom websites or use templates?',
        answer: 'Everything I build is completely custom from the ground up. I do not use pre-made templates, ensuring your site is entirely unique to your brand\'s needs and perfectly optimized for performance.'
    },
    {
        question: 'What\'s included in your SEO services?',
        answer: 'My SEO services include technical on-page optimization, site architecture refinement, keyword mapping, semantic HTML restructuring, and performance enhancements to ensure search engines can properly index and rank your content.'
    },
    {
        question: 'How does the monthly subscription model work?',
        answer: 'The monthly model covers ongoing maintenance, performance monitoring, continuous optimization, and priority support. It ensures your platform evolves with your business rather than becoming outdated the day it launches.'
    },
    {
        question: 'Can you redesign my existing website?',
        answer: 'Yes. Most of my work consists of re-architecting existing platforms that are underperforming. I take your established brand equity and inject it into a high-performance framework.'
    },
    {
        question: 'How do I get started?',
        answer: 'Simply reach out via my contact form to schedule an initial discovery call. I\'ll discuss your current bottlenecks, align on objectives, and map out a strategic plan of action.'
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        contentRefs.current.forEach((ref, index) => {
            if (!ref) return;

            if (index === openIndex) {
                gsap.to(ref, {
                    height: 'auto',
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(ref, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.inOut'
                });
            }
        });
    }, [openIndex]);

    return (
        <section id="faq" className="w-full py-20 md:py-32 bg-zinc-50 border-t border-zinc-200">
            <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row gap-12 lg:gap-24">
                {/* Left Side: Title */}
                <div className="w-full lg:w-5/12 lg:sticky lg:top-32 self-start">
                    <h2 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ink tracking-tighter mb-4 md:mb-6 leading-none">
                        FAQ
                    </h2>
                    <p className="font-sans text-lg md:text-xl text-zinc-600 max-w-sm leading-relaxed">
                        Got questions? I've got answers. Here's everything you need to know about working with me.
                    </p>
                </div>

                {/* Right Side: Accordion */}
                <div className="w-full lg:w-7/12 space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-system shadow-sm transform transition-all duration-300 hover:shadow-md"
                        >
                            <button
                                className="cursor-pointer w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                aria-expanded={openIndex === index}
                            >
                                <span className={`font-sans text-lg font-medium transition-colors ${openIndex === index ? 'text-ink' : 'text-zinc-800'}`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <MinusCircle weight="fill" className="w-6 h-6 text-ink shrink-0" />
                                ) : (
                                    <PlusCircle weight="fill" className="w-6 h-6 text-ink shrink-0" />
                                )}
                            </button>

                            <div
                                ref={(el) => { contentRefs.current[index] = el; }}
                                className="h-0 opacity-0 overflow-hidden px-8"
                            >
                                <p className="font-sans text-zinc-600 leading-relaxed pb-8 text-base">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
