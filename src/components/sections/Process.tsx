import React from 'react';
import { steps } from '@/content/profile';

/** The steps run in a fixed order, so an ordered list — the numbers are real. */
export function Process() {
    return (
        <ol className="max-w-[62ch]">
            {steps.map((step, i) => (
                <li key={step} className="flex items-baseline gap-6 py-3 first:pt-0">
                    <span className="tabular w-6 shrink-0 text-[12px] text-dust">
                        {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="font-sans text-[16px] leading-relaxed text-chalk">{step}</p>
                </li>
            ))}
        </ol>
    );
}
