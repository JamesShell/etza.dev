'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CookiesPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-zinc-200 selection:text-ink">
            <Navbar />

            <section className="pt-40 lg:pt-48 pb-32 px-4 md:px-[10vw] xl:px-[15vw]">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-ink transition-colors mb-12">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                    
                    <h1 className="text-4xl md:text-6xl font-sans font-bold text-ink tracking-tighter mb-12">
                        Cookie Policy
                    </h1>
                    
                    <div className="prose prose-zinc prose-lg max-w-none font-sans text-zinc-600">
                        <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                        <h2 className="text-2xl font-bold text-ink mt-12 mb-4">1. What are cookies?</h2>
                        <p className="mb-6">
                            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                            They are widely used to make websites work more efficiently and to provide statistical information to the owners of the site.
                        </p>

                        <h2 className="text-2xl font-bold text-ink mt-12 mb-4">2. How I use cookies</h2>
                        <p className="mb-6">
                            I use cookies to understand how you use my site, analyze site traffic, and improve your experience. 
                            Specifically, I use Google Analytics to collect data on site usage.
                        </p>

                        <h2 className="text-2xl font-bold text-ink mt-12 mb-4">3. Types of cookies I use</h2>
                        <ul className="list-disc pl-6 mb-6 space-y-2">
                            <li><strong>Essential cookies:</strong> These are required for the operation of my website.</li>
                            <li><strong>Analytics cookies:</strong> These allow me to recognize and count the number of visitors and see how visitors move around my site.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-ink mt-12 mb-4">4. Managing cookies</h2>
                        <p className="mb-6">
                            Most web browsers allow some control of most cookies through the browser settings. 
                            To find out more about cookies, including how to see what cookies have been set, visit aboutcookies.org or allaboutcookies.org.
                        </p>
                    </div>
                </div>
            </section>
            
            <Footer />
        </main>
    );
}
