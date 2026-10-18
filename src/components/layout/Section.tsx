import React from 'react';

/**
 * One spacing and labelling rule for every band on the page, so section
 * padding is defined in exactly one place and can't fight itself.
 */
export function Section({
    id,
    label,
    count,
    children,
    className = '',
}: {
    id: string;
    label: string;
    count?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section id={id} className={`reveal scroll-mt-8 py-14 md:py-20 ${className}`}>
            <div className="mb-8 flex items-baseline justify-between gap-4 md:mb-10">
                {/* Small text gets a touch of positive tracking, not negative —
                    tightening only helps type once it's large. */}
                <h2 className="text-[12px] tracking-[0.01em] text-dust">{label}</h2>
                {count && (
                    <span className="tabular text-[12px] text-dust">{count}</span>
                )}
            </div>
            {children}
        </section>
    );
}
