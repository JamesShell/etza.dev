import React from 'react';
import { capabilities, stack } from '@/content/profile';

/** What he does and what he uses. Plain list, no icons, no proficiency bars. */
export function Practice() {
    return (
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-[1fr_auto]">
            <ul className="max-w-[62ch]">
                {capabilities.map((item) => (
                    <li
                        key={item.title}
                        className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:gap-8"
                    >
                        <h3 className="shrink-0 font-sans text-[15px] font-medium text-chalk sm:w-[190px]">
                            {item.title}
                        </h3>
                        <p className="font-sans text-[15px] leading-relaxed text-ash">{item.detail}</p>
                    </li>
                ))}
            </ul>

            <div className="lg:w-[210px]">
                <h3 className="mb-4 text-[12px] text-dust">Stack</h3>
                <ul className="flex flex-wrap gap-x-2 gap-y-2">
                    {stack.map((tool) => (
                        <li
                            key={tool}
                            className="rounded-full bg-shell px-3 py-1 text-[13px] text-ash"
                        >
                            {tool}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
