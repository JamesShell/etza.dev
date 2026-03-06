'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
                        Privacy Policy
                    </h1>
                    
                    <div className="prose prose-zinc prose-lg max-w-none font-sans text-zinc-600">
                        <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                        <h2 className="text-2xl font-bold text-ink mt-12 mb-4">1. Information I collect</h2>
                        <p className="mb-6">
                            When you visit my site, I automatically collect certain information about your device, 
                            including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
                        </p>

                        <h2 className="text-2xl font-bold text-ink mt-12 mb-4">2. How I use your information</h2>
                        <p className="mb-6">
                            I use the information I collect to communicate with you, screen my orders or requests for potential risk or fraud, 
                            and provide you with information or advertising relating to my products or services according to the preferences you have shared with me.
                        </p>

                        <h2 className="text-2xl font-bold text-ink mt-12 mb-4">3. Sharing your personal information</h2>
                        <p className="mb-6">
                            I share your Personal Information with third parties to help me use your Personal Information, as described above. 
                            For example, I use Google Analytics to help me understand how my visitors use the Site.
                        </p>

                        <h2 className="text-2xl font-bold text-ink mt-12 mb-4">4. Your rights</h2>
                        <p className="mb-6">
                            If you are a European resident, you have the right to access personal information I hold about you 
                            and to ask that your personal information be corrected, updated, or deleted. 
                            If you would like to exercise this right, please contact me.
                        </p>

                        <h2 className="text-2xl font-bold text-ink mt-12 mb-4">5. Contact me</h2>
                        <p className="mb-6">
                            For more information about my privacy practices, if you have questions, or if you would like to make a complaint, 
                            please contact me by e-mail at ettozany@gmail.com.
                        </p>
                    </div>
                </div>
            </section>
            
            <Footer />
        </main>
    );
}
