import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
    title: 'Cookie policy',
    description:
        'Which cookies etza.dev sets and why. Analytics here is cookieless; the only storage used is the consent choice itself and whatever Cal.com needs to book a call.',
    path: '/cookies',
});

export default function CookiesPage() {
    return (
        <main className="min-h-screen">
            <SiteNav />

            <div className="mx-auto max-w-[1240px] px-5 md:px-8">
                <section className="py-16 md:py-24">
                    <h1 className="font-display text-[clamp(30px,5vw,48px)] font-medium tracking-[-0.04em] text-chalk">
                        Cookie policy
                    </h1>
                    <p className="mt-4 text-[12px] text-dust">
                        Last updated 31 July 2026
                    </p>

                    <div className="mt-12 max-w-[68ch] space-y-10">
                        <section>
                            <h2 className="font-display text-[20px] font-medium tracking-[-0.02em] text-chalk">
                                What cookies are
                            </h2>
                            <p className="mt-3 font-sans text-[15px] leading-relaxed text-ash">
                                Small text files a site stores on your device, used to keep it working and
                                to count visits.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-[20px] font-medium tracking-[-0.02em] text-chalk">
                                What this site sets
                            </h2>
                            <dl className="mt-5">
                                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
                                    <dt className="shrink-0 text-[12px] text-dust sm:w-[130px]">
                                        Essential
                                    </dt>
                                    <dd className="font-sans text-[15px] leading-relaxed text-ash">
                                        Remembers that you dismissed the cookie notice. Stored in your browser,
                                        never sent anywhere.
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
                                    <dt className="shrink-0 text-[12px] text-dust sm:w-[130px]">
                                        Analytics
                                    </dt>
                                    <dd className="font-sans text-[15px] leading-relaxed text-ash">
                                        None. Umami counts visits and shows which pages get read without
                                        setting a cookie or identifying anyone.
                                    </dd>
                                </div>
                            </dl>
                        </section>

                        <section>
                            <h2 className="font-display text-[20px] font-medium tracking-[-0.02em] text-chalk">
                                Turning them off
                            </h2>
                            <p className="mt-3 font-sans text-[15px] leading-relaxed text-ash">
                                Every major browser can block or clear cookies in its settings. The site works
                                fine without them.
                            </p>
                        </section>
                    </div>
                </section>

                <SiteFooter />
            </div>
        </main>
    );
}
