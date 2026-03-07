import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CaseStudyHero } from '@/components/sections/CaseStudyHero';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import { CaseStudy, RichContentBlock } from '@/types/database';
import Image from 'next/image';
import { isVideoUrl } from '@/lib/utils';
import Markdown from 'react-markdown';

export const revalidate = 60;

// Dynamic SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    const { data } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single();

    const study = data as CaseStudy | null;

    if (!study) {
        return { title: 'Case Study Not Found | Ettouzany' };
    }

    return {
        title: `${study.title} | Web Design & Development Case Study`,
        description: `Explore my high-performance web development and design process for ${study.title}. ${study.description.slice(0, 110)}...`,
        keywords: [study.category, 'Web Design Case Study', 'Web Development Case Study', 'Website Redesign', 'Next.js Development', study.title],
        openGraph: {
            title: `${study.title} | Web Design & Development Case Study`,
            description: `Explore my high-performance web development and design process for ${study.title}. ${study.description.slice(0, 110)}...`,
            images: [study.image_url],
            type: 'article',
        }
    };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const { data } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single();

    const study = data as CaseStudy | null;

    if (!study) {
        notFound();
    }

    // Build hero metrics
    const metrics: { label: string; value: React.ReactNode }[] = [
        { label: 'Category', value: study.category },
    ];
    if (study.year) metrics.push({ label: 'Year', value: study.year });
    if (study.timeline) metrics.push({ label: 'Timeline', value: study.timeline });
    if (study.scope_of_work && study.scope_of_work.length > 0) {
        metrics.push({
            label: 'Scope of Work',
            value: (
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {study.scope_of_work.map((item, i) => (
                        <span key={i} className="flex items-center gap-2">
                            {item}
                            {i < study.scope_of_work.length - 1 && <span className="opacity-30">•</span>}
                        </span>
                    ))}
                </div>
            )
        });
    }

    // Parse rich content blocks
    const contentBlocks = (study.content as unknown as RichContentBlock[]) || [];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: `${study.title} | Web Design & Development Case Study`,
        description: study.description,
        image: study.image_url,
        creator: {
            '@type': 'Person',
            name: 'Ettouzany Abdelkader'
        },
        url: `https://etza.dev/work/${study.slug}`
    };

    return (
        <main className="relative z-10 min-h-screen selection:bg-ink selection:text-white bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <CaseStudyHero
                title={study.title}
                type={study.category}
                description={study.description}
                metrics={metrics}
                heroImage={study.image_url}
            />

            {/* Rich Content */}
            <section className="relative w-full bg-white py-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto">
                        {contentBlocks.map((block, index) => {
                            const prevBlock = index > 0 ? contentBlocks[index - 1] : null;
                            const isAfterHeading = prevBlock?.type === 'heading';
                            const mt = index === 0 ? '' : isAfterHeading ? 'mt-8' : 'mt-16';
                            return (
                            <div key={index} className={`w-full ${mt}`}>
                                {block.type === 'heading' && (() => {
                                    const level = block.level || 2;
                                    const className = level === 2
                                        ? "font-sans font-bold text-3xl md:text-4xl text-ink tracking-tight leading-tight"
                                        : level === 3
                                        ? "font-sans font-bold text-2xl md:text-3xl text-ink tracking-tight leading-tight"
                                        : "font-sans font-semibold text-xl md:text-2xl text-ink tracking-tight leading-tight";
                                    const Tag = `h${level}` as 'h2' | 'h3' | 'h4';
                                    return <Tag className={className}>{block.value}</Tag>;
                                })()}
                                {block.type === 'text' && (
                                    <div className="font-sans text-xl text-zinc-600 leading-relaxed prose prose-xl prose-zinc max-w-none prose-headings:text-ink prose-headings:font-sans prose-headings:tracking-tight prose-a:text-ink prose-strong:text-ink prose-img:rounded-xl">
                                        <Markdown>{block.value}</Markdown>
                                    </div>
                                )}
                                {block.type === 'image' && (
                                    <div className="w-full flex justify-center">
                                        {isVideoUrl(block.value) ? (
                                            <video
                                                src={block.value}
                                                autoPlay muted loop playsInline
                                                className="w-full h-auto rounded-xl shadow-lg border border-zinc-200"
                                            />
                                        ) : (
                                            <img
                                                src={block.value}
                                                alt={`${study.title} ${study.category} web development case study visual ${index + 1}`}
                                                className="w-full h-auto rounded-xl shadow-lg border border-zinc-200"
                                            />
                                        )}
                                    </div>
                                )}
                                {block.type === 'video' && (
                                    <div className="w-full flex justify-center">
                                        <video
                                            src={block.value}
                                            autoPlay muted loop playsInline controls
                                            className="w-full h-auto rounded-xl shadow-lg border border-zinc-200"
                                        />
                                    </div>
                                )}
                            </div>
                            );
                        })}

                        {/* Testimonial block at the end */}
                        {study.testimonial_text && (
                            <blockquote className="border-l-4 border-ink pl-8 py-2 mt-16">
                                <div className="font-serif italic text-xl md:text-2xl text-ink leading-snug mb-6">
                                    &ldquo;{study.testimonial_text}&rdquo;
                                </div>
                                <div className="flex items-center gap-4 mt-4">
                                    {study.testimonial_avatar && (
                                        <img src={study.testimonial_avatar} alt={study.testimonial_author} className="w-12 h-12 rounded-full object-cover shadow-sm bg-zinc-100" />
                                    )}
                                    <p className="font-sans font-bold text-ink">{study.testimonial_author}</p>
                                </div>
                            </blockquote>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
