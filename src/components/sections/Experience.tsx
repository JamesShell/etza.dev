import React from 'react';
import { experience } from '@/content/profile';

/** The CV surface. Dates left, role right, no logos, no timeline graphics. */
export function Experience() {
    if (experience.length === 0) return null;

    return (
        <ol className="max-w-[62ch]">
            {experience.map((entry) => (
                <li
                    key={`${entry.period}-${entry.org}`}
                    className="flex flex-col gap-1 py-5 first:pt-0 sm:flex-row sm:gap-8"
                >
                    <span className="tabular shrink-0 pt-[3px] text-[12px] text-dust sm:w-[130px]">
                        {entry.period}
                    </span>
                    <div>
                        <h3 className="font-sans text-[16px] font-medium text-chalk">
                            {entry.role}
                            <span className="text-ash"> · {entry.org}</span>
                        </h3>
                        {entry.detail && (
                            <p className="mt-2 font-sans text-[15px] leading-relaxed text-ash">
                                {entry.detail}
                            </p>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    );
}
