import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';

/**
 * The root layout declares `index, follow`, and a page that doesn't override it
 * inherits that tag — which on a 404 directly contradicts the `noindex` Next
 * emits for not-found. This restates the restrictive answer so both tags agree.
 */
export const metadata: Metadata = {
    title: 'Page not found',
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col">
            <SiteNav />

            <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col px-5 md:px-8">
                <section className="flex flex-1 flex-col justify-center py-24">
                    <p className="tabular text-[12px] text-dust">404</p>

                    <h1 className="mt-5 max-w-[16ch] font-display text-[clamp(30px,5vw,48px)] font-medium leading-[1.08] tracking-[-0.04em] text-chalk">
                        This page isn&rsquo;t here.
                    </h1>

                    <p className="mt-6 max-w-[46ch] font-sans text-[16px] leading-relaxed text-ash">
                        The link may be broken, or the page may have moved. The work is all still one
                        click away.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                        <Link
                            href="/"
                            className="group inline-flex items-baseline gap-2 text-[12px] text-ash transition-colors hover:text-chalk"
                        >
                            <ArrowLeft
                                size={14}
                                aria-hidden="true"
                                className="self-center transition-transform duration-300 group-hover:-translate-x-1"
                            />
                            Home
                        </Link>
                        <Link
                            href="/#work"
                            className="group inline-flex items-baseline gap-2 text-[12px] text-ash transition-colors hover:text-chalk"
                        >
                            Works
                            <ArrowRight
                                size={14}
                                aria-hidden="true"
                                className="self-center transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </section>

                <SiteFooter />
            </div>
        </main>
    );
}
