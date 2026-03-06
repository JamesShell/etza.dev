'use client';

import { Navbar } from "@/components/layout/Navbar";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { clickEvent } from "@/lib/gtag";

export default function BookPage() {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({});
            cal("ui", {
                theme: "light",
                styles: { branding: { brandColor: "#000000" } },
                hideEventTypeDetails: false,
                layout: "month_view"
            });
        })();
    }, []);

    return (
        <main className="min-h-screen bg-white selection:bg-zinc-200 selection:text-ink">
            <Navbar />

            <section className="pt-40 lg:pt-48 pb-20 px-4 md:px-[10vw] xl:px-[15vw]">
                <div className="mb-12 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-ink transition-colors mb-8">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-sans font-bold text-ink tracking-tighter mb-6">
                        Let's Talk
                    </h1>
                    <p className="text-xl text-zinc-600 font-sans max-w-2xl mx-auto leading-relaxed">
                        Find a time that works for you. I'm looking forward to discussing how we can work together.
                    </p>
                    <p className="text-lg text-zinc-500 font-sans mt-3">
                        Or email me at{' '}
                        <Link 
                            href="mailto:ettozany@gmail.com" 
                            className="text-ink underline underline-offset-4 hover:text-zinc-600 transition-colors"
                            onClick={() => clickEvent({
                                action: 'send_email',
                                category: 'engagement',
                                label: 'Booking Page Mailto'
                            })}
                        >
                            ettozany@gmail.com
                        </Link>
                    </p>
                </div>

                <div className="w-full bg-zinc-50 border border-zinc-200/50 rounded-3xl p-2 sm:p-4 shadow-sm">
                    
                        <Cal
                            calLink="ettouza/30min"
                            style={{ width: "100%", height: "100%", minHeight: "700px", overflow: "scroll", maxHeight: "2000px", maxWidth: "2000px" }}
                            config={{ layout: 'month_view', theme: 'light' }}
                        />
                </div>
            </section>

        </main>
    );
}
