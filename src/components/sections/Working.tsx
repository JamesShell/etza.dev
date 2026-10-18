import React from 'react';
import { faqs } from '@/content/profile';

/**
 * Native disclosure elements — keyboard and screen-reader behaviour for free,
 * and no JavaScript to ship for six lines of text.
 *
 * Which question someone opens says what they're worried about before they
 * write, so it's worth recording. Umami's `data-umami-event` attributes do it
 * declaratively, which keeps this a server component with no JS of its own.
 */
export function Working({ items = faqs }: { items?: readonly { question: string; answer: string }[] }) {
    return (
        <div className="max-w-[68ch]">
            {items.map((faq) => (
                <details
                    key={faq.question}
                    className="group py-1"
                >
                    <summary
                        data-umami-event="faq_opened"
                        data-umami-event-question={faq.question}
                        className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-4 marker:hidden [&::-webkit-details-marker]:hidden"
                    >
                        {/* A heading, not loose text in a summary. These seven
                            questions are the most specific language on the site
                            and the part an answer engine quotes — they should
                            appear in the document outline like anything else
                            worth reading. Styling is unchanged. */}
                        <h3 className="font-sans text-[16px] font-normal text-chalk">
                            {faq.question}
                        </h3>
                        <span
                            aria-hidden="true"
                            className="shrink-0 text-[14px] text-dust transition-transform duration-300 group-open:rotate-45"
                        >
                            +
                        </span>
                    </summary>
                    <p className="max-w-[58ch] pb-5 pr-8 font-sans text-[15px] leading-relaxed text-ash">
                        {faq.answer}
                    </p>
                </details>
            ))}
        </div>
    );
}
