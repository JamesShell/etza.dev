import React from 'react';

export interface ContentBlock {
    type: 'text' | 'image' | 'quote' | 'metrics';
    content: React.ReactNode;
}

interface CaseStudyContentProps {
    blocks: ContentBlock[];
}

export function CaseStudyContent({ blocks }: CaseStudyContentProps) {
    return (
        <section className="relative w-full bg-white py-24">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto space-y-24">
                    {blocks.map((block, index) => (
                        <div key={index} className="w-full">
                            {block.type === 'text' && (
                                <div className="font-sans text-xl text-zinc-600 leading-relaxed space-y-6">
                                    {block.content}
                                </div>
                            )}
                            {block.type === 'image' && (
                                <div className="w-full flex justify-center">
                                    {block.content}
                                </div>
                            )}
                            {block.type === 'quote' && (
                                <blockquote className="border-l-4 border-ink pl-8 py-2">
                                    <div className="font-serif italic text-3xl md:text-4xl text-ink leading-tight mb-6">
                                        "{block.content}"
                                    </div>
                                </blockquote>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
