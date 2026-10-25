import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { BarSpace } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PageTitle, prose } from '@/components/layout/Page';

/**
 * The root layout declares `index, follow`, and a page that doesn't override it
 * inherits that tag — which on a 404 directly contradicts the `noindex` Next
 * emits for not-found. This restates the restrictive answer so both tags agree.
 */
export const metadata: Metadata = {
    title: 'Page not found',
    robots: { index: false, follow: true },
};

/** Fills the screen like the home page, with the one way out at the bottom. */
export default function NotFound() {
    return (
        <main className="flex min-h-svh flex-col">
            <BarSpace />

            <div className="flex flex-1 flex-col px-5 md:px-8">
                <div className="flex flex-1 flex-col justify-end">
                    <PageTitle
                        eyebrow="404"
                        title="This page isn’t here."
                        aside={
                            <div className="space-y-6">
                                <p className={prose}>
                                    The link may be broken, or the page may have moved. The work is all still one click away.
                                </p>
                                <Link
                                    href="/"
                                    className="group inline-flex items-center gap-2 font-display text-[19px] font-medium tracking-[-0.02em] text-chalk transition-colors hover:text-dust lg:text-[clamp(17px,1.3vw,22px)]"
                                >
                                    Back to the work
                                    <ArrowRight
                                        size={18}
                                        aria-hidden="true"
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </Link>
                            </div>
                        }
                    />
                </div>

                <SiteFooter />
            </div>
        </main>
    );
}
