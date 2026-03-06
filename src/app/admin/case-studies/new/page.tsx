'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CaseStudyInsert, RichContentBlock } from '@/types/database';
import { UploadSimple, CaretLeft, Trash, TextH, TextT, Image as ImageIcon, ArrowUp, ArrowDown, VideoCamera, TextB, TextItalic, LinkSimple, ListBullets, ListNumbers, Quotes } from '@phosphor-icons/react';
import Link from 'next/link';

export default function NewCaseStudy() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<CaseStudyInsert>>({
        title: '',
        slug: '',
        category: '',
        description: '',
        logo_text: '',
        logo_bg: 'bg-zinc-800',
        testimonial_text: '',
        testimonial_author: '',
        testimonial_stars: 5,
        testimonial_avatar: '',
        is_featured: false,
        year: '',
        timeline: '',
    });

    const [badgesRaw, setBadgesRaw] = useState('Product, Website, Branding');
    const [scopeRaw, setScopeRaw] = useState('Product Strategy, UI/UX Design, Engineering');

    // Content Blocks State
    const [contentBlocks, setContentBlocks] = useState<RichContentBlock[]>([]);
    const [blockImageFiles, setBlockImageFiles] = useState<Record<number, File>>({});
    const textareaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});

    const insertMarkdown = useCallback((index: number, before: string, after: string = '') => {
        const textarea = textareaRefs.current[index];
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selected = text.slice(start, end);
        const newValue = text.slice(0, start) + before + selected + after + text.slice(end);
        setContentBlocks(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], value: newValue };
            return updated;
        });
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = start + before.length;
            textarea.selectionEnd = start + before.length + selected.length;
        }, 0);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleGenerateSlug = () => {
        if (formData.title) {
            setFormData({ ...formData, slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') });
        }
    };

    // Content Block Helpers
    const addBlock = (type: RichContentBlock['type'], level?: 2 | 3 | 4) => {
        setContentBlocks([...contentBlocks, { type, value: '', ...(level ? { level } : {}) }]);
    };

    const updateBlock = (index: number, value: string) => {
        const updated = [...contentBlocks];
        updated[index] = { ...updated[index], value };
        setContentBlocks(updated);
    };

    const removeBlock = (index: number) => {
        setContentBlocks(contentBlocks.filter((_, i) => i !== index));
        const newFiles = { ...blockImageFiles };
        delete newFiles[index];
        setBlockImageFiles(newFiles);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= contentBlocks.length) return;
        const updated = [...contentBlocks];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        setContentBlocks(updated);
    };

    const handleBlockImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setBlockImageFiles({ ...blockImageFiles, [index]: e.target.files[0] });
            updateBlock(index, e.target.files[0].name); // preview name
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            let image_url = '';

            // 1. Upload Hero Image
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}-hero.${fileExt}`;
                const filePath = `case-studies/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, imageFile, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: imageFile.type || (fileExt === 'mp4' ? 'video/mp4' : 'application/octet-stream')
                    });

                if (uploadError) {
                    throw new Error('Hero image upload failed: ' + uploadError.message);
                }

                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
                image_url = publicUrl;
            }

            // 1b. Upload Logo Image
            let logo_url = '';
            if (logoFile) {
                const logoExt = logoFile.name.split('.').pop();
                const logoPath = `case-studies/${Date.now()}-logo.${logoExt}`;
                const { error: logoErr } = await supabase.storage.from('images').upload(logoPath, logoFile, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: logoFile.type || (logoExt === 'mp4' ? 'video/mp4' : 'application/octet-stream')
                });
                if (logoErr) { throw new Error('Logo upload failed: ' + logoErr.message); }
                const { data: { publicUrl: logoPublicUrl } } = supabase.storage.from('images').getPublicUrl(logoPath);
                logo_url = logoPublicUrl;
            }

            // 2. Upload content block images
            const processedBlocks: RichContentBlock[] = [];
            for (let i = 0; i < contentBlocks.length; i++) {
                const block = contentBlocks[i];
                if (block.type === 'image' && blockImageFiles[i]) {
                    const file = blockImageFiles[i];
                    const ext = file.name.split('.').pop();
                    const path = `case-studies/${Date.now()}-block-${i}.${ext}`;

                    const { error: blockUploadErr } = await supabase.storage.from('images').upload(path, file, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: file.type || (ext === 'mp4' ? 'video/mp4' : 'application/octet-stream')
                    });
                    if (blockUploadErr) {
                        throw new Error('Block image upload failed: ' + blockUploadErr.message);
                    }

                    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path);
                    processedBlocks.push({ type: 'image', value: publicUrl });
                } else {
                    processedBlocks.push(block);
                }
            }

            // 3. Format Badges
            const badges = badgesRaw.split(',').map(b => ({
                icon: 'Browser',
                text: b.trim()
            }));

            // 4. Format Scope of Work
            const scope_of_work = scopeRaw.split(',').map(s => s.trim()).filter(Boolean);

            // 5. Insert into Database
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any).from('case_studies').insert([{
                ...formData as CaseStudyInsert,
                image_url,
                logo_url: logo_url || null,
                badges,
                scope_of_work,
                content: processedBlocks
            }]);

            if (error) {
                throw new Error('Database error: ' + error.message + (error.hint ? ' — ' + error.hint : ''));
            }

            router.push('/admin');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Submission error:', error?.message || JSON.stringify(error));
            setSubmitError(error?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="font-sans pb-12">
            <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-ink mb-8 transition-colors">
                <CaretLeft weight="bold" /> Back to Operations
            </Link>

            <h1 className="text-3xl font-bold text-ink mb-8">Deploy New Case Study</h1>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Basic Info */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                    <h2 className="text-xl font-bold text-ink mb-4">Core Identity</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Project Title</label>
                            <input
                                required type="text"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                onBlur={handleGenerateSlug}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">URL Slug</label>
                            <input
                                required type="text"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink font-mono text-sm"
                                value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Category</label>
                            <input
                                required type="text"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Badges (comma separated)</label>
                            <input
                                required type="text"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={badgesRaw} onChange={e => setBadgesRaw(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Year</label>
                            <input
                                type="text" placeholder="e.g. 2024"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Timeline</label>
                            <input
                                type="text" placeholder="e.g. 12 weeks"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={formData.timeline} onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Scope of Work (comma separated)</label>
                            <input
                                required type="text"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={scopeRaw} onChange={e => setScopeRaw(e.target.value)}
                                placeholder="e.g. Design System, Frontend Dev, Mobile App"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">Short Description</label>
                        <textarea
                            required rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink resize-none"
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                {/* Rich Content Blocks */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-ink">Content Blocks</h2>
                        <p className="text-sm text-zinc-400">Build your case study page</p>
                    </div>

                    {contentBlocks.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400">
                            <p className="mb-2 font-medium">No content blocks yet</p>
                            <p className="text-sm">Add headings, paragraphs, and images below</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {contentBlocks.map((block, index) => (
                            <div key={index} className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50/50">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                        {block.type === 'heading' && <><TextH size={16} /> Heading</>}
                                        {block.type === 'text' && <><TextT size={16} /> Paragraph</>}
                                        {block.type === 'image' && <><ImageIcon size={16} /> Image</>}
                                        {block.type === 'video' && <><VideoCamera size={16} /> Video</>}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0}
                                            className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-500 disabled:opacity-30 transition-colors">
                                            <ArrowUp size={14} />
                                        </button>
                                        <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === contentBlocks.length - 1}
                                            className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-500 disabled:opacity-30 transition-colors">
                                            <ArrowDown size={14} />
                                        </button>
                                        <button type="button" onClick={() => removeBlock(index)}
                                            className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors ml-2">
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                </div>

                                {block.type === 'heading' && (
                                    <div className="flex gap-2">
                                        <select
                                            className="px-3 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink text-sm font-semibold bg-white"
                                            value={block.level || 2}
                                            onChange={e => {
                                                const updated = [...contentBlocks];
                                                updated[index] = { ...updated[index], level: Number(e.target.value) as 2 | 3 | 4 };
                                                setContentBlocks(updated);
                                            }}
                                        >
                                            <option value={2}>H2</option>
                                            <option value={3}>H3</option>
                                            <option value={4}>H4</option>
                                        </select>
                                        <input
                                            type="text" placeholder="Section heading..."
                                            className={`w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink font-bold ${(block.level || 2) === 2 ? 'text-lg' : (block.level || 2) === 3 ? 'text-base' : 'text-sm'}`}
                                            value={block.value} onChange={e => updateBlock(index, e.target.value)}
                                        />
                                    </div>
                                )}
                                {block.type === 'text' && (
                                    <div>
                                        <div className="flex items-center gap-0.5 mb-2 p-1 bg-zinc-100 rounded-lg w-fit">
                                            <button type="button" onClick={() => insertMarkdown(index, '**', '**')} className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 transition-colors" title="Bold">
                                                <TextB size={16} weight="bold" />
                                            </button>
                                            <button type="button" onClick={() => insertMarkdown(index, '*', '*')} className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 transition-colors" title="Italic">
                                                <TextItalic size={16} />
                                            </button>
                                            <button type="button" onClick={() => insertMarkdown(index, '[', '](url)')} className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 transition-colors" title="Link">
                                                <LinkSimple size={16} />
                                            </button>
                                            <div className="w-px h-4 bg-zinc-300 mx-1" />
                                            <button type="button" onClick={() => insertMarkdown(index, '- ')} className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 transition-colors" title="Bullet list">
                                                <ListBullets size={16} />
                                            </button>
                                            <button type="button" onClick={() => insertMarkdown(index, '1. ')} className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 transition-colors" title="Numbered list">
                                                <ListNumbers size={16} />
                                            </button>
                                            <div className="w-px h-4 bg-zinc-300 mx-1" />
                                            <button type="button" onClick={() => insertMarkdown(index, '> ')} className="p-1.5 rounded hover:bg-zinc-200 text-zinc-600 transition-colors" title="Blockquote">
                                                <Quotes size={16} />
                                            </button>
                                        </div>
                                        <textarea
                                            ref={el => { textareaRefs.current[index] = el; }}
                                            rows={6} placeholder="Write your content... (Markdown supported)"
                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink resize-y font-mono text-sm leading-relaxed"
                                            value={block.value} onChange={e => updateBlock(index, e.target.value)}
                                        />
                                    </div>
                                )}
                                {(block.type === 'image' || block.type === 'video') && (
                                    <div>
                                        <input
                                            type="file" accept={block.type === 'video' ? 'video/*' : 'image/*,video/*'} id={`block-media-${index}`} className="hidden"
                                            onChange={e => handleBlockImageChange(index, e)}
                                        />
                                        <label htmlFor={`block-media-${index}`}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-zinc-300 cursor-pointer hover:bg-zinc-50 transition-colors">
                                            <UploadSimple size={20} className="text-zinc-400" />
                                            <span className="text-sm text-zinc-600">{blockImageFiles[index]?.name || block.value || `Click to upload ${block.type}`}</span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Block Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button type="button" onClick={() => addBlock('heading')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all">
                            <TextH size={16} /> Heading
                        </button>
                        <button type="button" onClick={() => addBlock('text')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all">
                            <TextT size={16} /> Paragraph
                        </button>
                        <button type="button" onClick={() => addBlock('image')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all">
                            <ImageIcon size={16} /> Image
                        </button>
                        <button type="button" onClick={() => addBlock('video')}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all">
                            <VideoCamera size={16} /> Video
                        </button>
                    </div>
                </div>

                {/* Media & Logo */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                    <h2 className="text-xl font-bold text-ink mb-4">Media & Visuals</h2>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">Hero Media (Image or Video)</label>
                        <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 text-center hover:bg-zinc-50 transition-colors">
                            <input
                                type="file" id="image-upload" className="hidden"
                                accept="image/*,video/*" onChange={handleImageChange} required
                            />
                            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center">
                                <UploadSimple size={32} className="text-zinc-400 mb-2" />
                                <span className="text-ink font-semibold">Click to upload mockup</span>
                                <span className="text-zinc-400 text-sm mt-1">{imageFile ? imageFile.name : 'PNG, JPG, MP4, WEBM up to 50MB'}</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">Logo Image (optional)</label>
                        <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-6 text-center hover:bg-zinc-50 transition-colors">
                            <input
                                type="file" id="logo-upload" className="hidden"
                                accept="image/*" onChange={e => { if (e.target.files?.[0]) setLogoFile(e.target.files[0]); }}
                            />
                            <label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center justify-center">
                                <UploadSimple size={24} className="text-zinc-400 mb-2" />
                                <span className="text-ink font-semibold text-sm">{logoFile ? logoFile.name : 'Upload logo image'}</span>
                                <span className="text-zinc-400 text-xs mt-1">PNG, SVG — shown in overlays and cards</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Logo Text (Letter)</label>
                            <input
                                required type="text" maxLength={2}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={formData.logo_text} onChange={e => setFormData({ ...formData, logo_text: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Logo Background</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={formData.logo_bg} onChange={e => setFormData({ ...formData, logo_bg: e.target.value })}
                            >
                                <option value="bg-zinc-800">Dark (bg-zinc-800)</option>
                                <option value="bg-blue-600">Blue (bg-blue-600)</option>
                                <option value="bg-orange-500">Orange (bg-orange-500)</option>
                                <option value="bg-emerald-500">Green (bg-emerald-500)</option>
                                <option value="bg-purple-500">Purple (bg-purple-500)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Testimonial */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                    <h2 className="text-xl font-bold text-ink mb-4">Client Testimonial</h2>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">Quote</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink resize-none"
                            value={formData.testimonial_text} onChange={e => setFormData({ ...formData, testimonial_text: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Author Name & Role</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={formData.testimonial_author} onChange={e => setFormData({ ...formData, testimonial_author: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Avatar URL</label>
                            <input
                                type="url"
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={formData.testimonial_avatar} onChange={e => setFormData({ ...formData, testimonial_avatar: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Settings & Submit */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox" id="featured"
                            className="w-5 h-5 rounded border-zinc-300 text-ink focus:ring-ink"
                            checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                        />
                        <label htmlFor="featured" className="text-sm font-semibold text-zinc-700 cursor-pointer">Feature on Homepage</label>
                    </div>

                    {submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                            <p className="text-red-600 font-semibold text-sm mb-1">Failed to publish case study</p>
                            <p className="text-red-400 text-xs">{submitError}</p>
                        </div>
                    )}

                    <button
                        type="submit" disabled={isSubmitting}
                        className="bg-ink text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isSubmitting ? 'Deploying...' : 'Publish Case Study'}
                    </button>
                </div>

            </form>
        </div>
    );
}
