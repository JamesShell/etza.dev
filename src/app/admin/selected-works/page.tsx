'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CaseStudy, SelectedWork } from '@/types/database';
import { isVideoUrl } from '@/lib/utils';
import { Plus, Trash, UploadSimple, Eye, EyeSlash, ArrowsVertical, Pencil, FloppyDisk } from '@phosphor-icons/react';

interface EditForm {
    title: string;
    category: string;
    display_width: string;
    show_hover_overlay: boolean;
    case_study_id: string | null;
    sort_order: number;
    newImageFile: File | null;
}

export default function SelectedWorksAdmin() {
    const [works, setWorks] = useState<SelectedWork[]>([]);
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<EditForm | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // New item form state
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [newItem, setNewItem] = useState({
        title: '',
        category: '',
        display_width: 'full',
        show_hover_overlay: true,
        case_study_id: '' as string | null,
        sort_order: 0,
    });

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setIsLoading(true);
        const [worksRes, studiesRes] = await Promise.all([
            supabase.from('selected_works').select('*').order('sort_order', { ascending: true }),
            supabase.from('case_studies').select('*').order('title', { ascending: true })
        ]);
        if (worksRes.data) setWorks(worksRes.data as SelectedWork[]);
        if (studiesRes.data) setCaseStudies(studiesRes.data as CaseStudy[]);
        setIsLoading(false);
    };

    // --- Add handlers ---
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let image_url = '';
            if (imageFile) {
                const ext = imageFile.name.split('.').pop();
                const path = `selected-works/${Date.now()}.${ext}`;
                const { error } = await supabase.storage.from('images').upload(path, imageFile, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: imageFile.type || (ext === 'mp4' ? 'video/mp4' : 'application/octet-stream')
                });
                if (error) { alert('Upload error: ' + error.message); return; }
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path);
                image_url = publicUrl;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any).from('selected_works').insert([{
                ...newItem,
                case_study_id: newItem.case_study_id || null,
                image_url,
            }]);

            if (error) { alert('Error: ' + error.message); return; }

            setShowForm(false);
            setNewItem({ title: '', category: '', display_width: 'full', show_hover_overlay: true, case_study_id: '', sort_order: 0 });
            setImageFile(null);
            fetchAll();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this selected work?')) return;
        await supabase.from('selected_works').delete().eq('id', id);
        fetchAll();
    };

    // --- Inline quick-toggle handlers (used when NOT in edit mode) ---
    const handleToggleOverlay = async (id: string, current: boolean) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('selected_works').update({ show_hover_overlay: !current }).eq('id', id);
        fetchAll();
    };

    const handleWidthChange = async (id: string, width: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('selected_works').update({ display_width: width }).eq('id', id);
        fetchAll();
    };

    const handleSortChange = async (id: string, sort: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('selected_works').update({ sort_order: sort }).eq('id', id);
        fetchAll();
    };

    // --- Edit handlers ---
    const startEdit = (work: SelectedWork) => {
        setEditingId(work.id);
        setEditForm({
            title: work.title,
            category: work.category,
            display_width: work.display_width,
            show_hover_overlay: work.show_hover_overlay,
            case_study_id: work.case_study_id,
            sort_order: work.sort_order,
            newImageFile: null,
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const handleSave = async (id: string) => {
        if (!editForm) return;
        setIsSaving(true);

        try {
            let image_url: string | undefined;

            // Upload new image if provided
            if (editForm.newImageFile) {
                const ext = editForm.newImageFile.name.split('.').pop();
                const path = `selected-works/${Date.now()}.${ext}`;
                const { error } = await supabase.storage.from('images').upload(path, editForm.newImageFile, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: editForm.newImageFile.type || (ext === 'mp4' ? 'video/mp4' : 'application/octet-stream')
                });
                if (error) { alert('Upload error: ' + error.message); setIsSaving(false); return; }
                const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path);
                image_url = publicUrl;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updateData: Record<string, any> = {
                title: editForm.title,
                category: editForm.category,
                display_width: editForm.display_width,
                show_hover_overlay: editForm.show_hover_overlay,
                case_study_id: editForm.case_study_id || null,
                sort_order: editForm.sort_order,
            };

            if (image_url) {
                updateData.image_url = image_url;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any).from('selected_works').update(updateData).eq('id', id);
            if (error) { alert('Save error: ' + error.message); setIsSaving(false); return; }

            setEditingId(null);
            setEditForm(null);
            fetchAll();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-ink">Selected Works</h1>
                    <p className="text-zinc-500 mt-1">Manage the homepage work slider.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-ink text-white px-5 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm"
                >
                    <Plus size={20} weight="bold" />
                    Add Work
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <form onSubmit={handleAdd} className="bg-white border border-zinc-200 rounded-3xl p-8 mb-8 space-y-6 shadow-sm">
                    <h2 className="text-xl font-bold text-ink">New Selected Work</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Title</label>
                            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Category</label>
                            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Display Width</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={newItem.display_width} onChange={e => setNewItem({ ...newItem, display_width: e.target.value })}>
                                <option value="full">Full Width</option>
                                <option value="narrow">Narrow</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Sort Order</label>
                            <input type="number" className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={newItem.sort_order} onChange={e => setNewItem({ ...newItem, sort_order: parseInt(e.target.value) || 0 })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">Link to Case Study (optional)</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink"
                                value={newItem.case_study_id || ''} onChange={e => setNewItem({ ...newItem, case_study_id: e.target.value || null })}>
                                <option value="">None (image only)</option>
                                {caseStudies.map(cs => (
                                    <option key={cs.id} value={cs.id}>{cs.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-zinc-300 text-ink focus:ring-ink"
                                    checked={newItem.show_hover_overlay} onChange={e => setNewItem({ ...newItem, show_hover_overlay: e.target.checked })} />
                                <span className="text-sm font-semibold text-zinc-700">Show Hover Overlay</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">Slider Media</label>
                        <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-6 text-center hover:bg-zinc-50 transition-colors">
                            <input type="file" id="sw-image" className="hidden" accept="image/*,video/*" required
                                onChange={e => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }} />
                            <label htmlFor="sw-image" className="cursor-pointer flex flex-col items-center">
                                <UploadSimple size={28} className="text-zinc-400 mb-2" />
                                <span className="text-ink font-semibold">{imageFile ? imageFile.name : 'Click to upload'}</span>
                                <span className="text-zinc-400 text-xs mt-1">Images or videos</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowForm(false)} disabled={isSubmitting}
                            className="px-6 py-3 rounded-xl border border-zinc-200 text-zinc-600 font-semibold hover:bg-zinc-50 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            className="bg-ink text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-50">
                            {isSubmitting ? 'Uploading...' : 'Add to Slider'}
                        </button>
                    </div>
                </form>
            )}

            {/* List */}
            {isLoading ? (
                <div className="py-20 text-center text-zinc-500">Loading...</div>
            ) : works.length === 0 ? (
                <div className="bg-white border text-center border-zinc-200 rounded-3xl p-16 text-zinc-400">
                    No selected works yet. Add one to populate the homepage slider.
                </div>
            ) : (
                <div className="space-y-4">
                    {works.map(work => {
                        const linkedStudy = caseStudies.find(cs => cs.id === work.case_study_id);
                        const isEditing = editingId === work.id;

                        if (isEditing && editForm) {
                            // ── Edit mode row ──
                            return (
                                <div key={work.id} className="bg-white border-2 border-ink/20 rounded-2xl p-6 shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Editing Work</h3>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button onClick={cancelEdit} disabled={isSaving}
                                                className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50 transition-colors disabled:opacity-50">
                                                Cancel
                                            </button>
                                            <button onClick={() => handleSave(work.id)} disabled={isSaving}
                                                className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-ink text-white font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                                <FloppyDisk size={18} />
                                                {isSaving ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-6">
                                        {/* Image preview & replacement */}
                                        <div className="shrink-0">
                                            {editForm.newImageFile && editForm.newImageFile.type.startsWith('video/') || (!editForm.newImageFile && isVideoUrl(work.image_url)) ? (
                                                <video src={editForm.newImageFile ? URL.createObjectURL(editForm.newImageFile) : work.image_url} autoPlay muted loop playsInline className="w-32 h-24 rounded-xl object-cover border border-zinc-200 mb-2" />
                                            ) : (
                                                <img src={editForm.newImageFile ? URL.createObjectURL(editForm.newImageFile) : work.image_url} alt={editForm.title} className="w-32 h-24 rounded-xl object-cover border border-zinc-200 mb-2" />
                                            )}
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    id={`edit-image-${work.id}`}
                                                    className="hidden"
                                                    accept="image/*,video/*"
                                                    onChange={e => {
                                                        if (e.target.files?.[0]) {
                                                            setEditForm({ ...editForm, newImageFile: e.target.files[0] });
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`edit-image-${work.id}`} className="cursor-pointer flex items-center gap-1.5 text-xs text-ink font-semibold hover:underline">
                                                    <UploadSimple size={14} />
                                                    {editForm.newImageFile ? editForm.newImageFile.name : 'Replace media'}
                                                </label>
                                            </div>
                                        </div>

                                        {/* Editable fields */}
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-zinc-500 mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                                                    value={editForm.title}
                                                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-zinc-500 mb-1">Category</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                                                    value={editForm.category}
                                                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-zinc-500 mb-1">Display Width</label>
                                                <select
                                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                                                    value={editForm.display_width}
                                                    onChange={e => setEditForm({ ...editForm, display_width: e.target.value })}
                                                >
                                                    <option value="full">Full Width</option>
                                                    <option value="narrow">Narrow</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-zinc-500 mb-1">Sort Order</label>
                                                <input
                                                    type="number"
                                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                                                    value={editForm.sort_order}
                                                    onChange={e => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-zinc-500 mb-1">Link to Case Study</label>
                                                <select
                                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-ink text-sm"
                                                    value={editForm.case_study_id || ''}
                                                    onChange={e => setEditForm({ ...editForm, case_study_id: e.target.value || null })}
                                                >
                                                    <option value="">None (image only)</option>
                                                    {caseStudies.map(cs => (
                                                        <option key={cs.id} value={cs.id}>{cs.title}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-zinc-300 text-ink focus:ring-ink"
                                                        checked={editForm.show_hover_overlay}
                                                        onChange={e => setEditForm({ ...editForm, show_hover_overlay: e.target.checked })}
                                                    />
                                                    <span className="text-sm font-semibold text-zinc-700">Show Hover Overlay</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // ── Normal display row ──
                        return (
                            <div key={work.id} className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center gap-6 shadow-sm">
                                {isVideoUrl(work.image_url) ? (
                                    <video src={work.image_url} autoPlay muted loop playsInline className="w-24 h-16 rounded-xl object-cover border border-zinc-100 shrink-0" />
                                ) : (
                                    <img src={work.image_url} alt={work.title} className="w-24 h-16 rounded-xl object-cover border border-zinc-100 shrink-0" />
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-ink truncate">{work.title}</p>
                                    <p className="text-xs text-zinc-400">{work.category} • {work.display_width === 'full' ? 'Full Width' : 'Narrow'}
                                        {linkedStudy && <span> • Linked to <strong>{linkedStudy.title}</strong></span>}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {/* Sort */}
                                    <div className="flex items-center gap-1 text-zinc-400">
                                        <ArrowsVertical size={14} />
                                        <input type="number" className="w-14 px-2 py-1 text-sm rounded-lg border border-zinc-200 text-center"
                                            value={work.sort_order} onChange={e => handleSortChange(work.id, parseInt(e.target.value) || 0)} />
                                    </div>

                                    {/* Width Toggle */}
                                    <select className="px-2 py-1 text-xs rounded-lg border border-zinc-200"
                                        value={work.display_width} onChange={e => handleWidthChange(work.id, e.target.value)}>
                                        <option value="full">Full</option>
                                        <option value="narrow">Narrow</option>
                                    </select>

                                    {/* Hover Toggle */}
                                    <button onClick={() => handleToggleOverlay(work.id, work.show_hover_overlay)}
                                        className={`p-2 rounded-lg transition-colors ${work.show_hover_overlay ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}
                                        title={work.show_hover_overlay ? 'Hover overlay ON' : 'Hover overlay OFF'}>
                                        {work.show_hover_overlay ? <Eye size={16} /> : <EyeSlash size={16} />}
                                    </button>

                                    {/* Edit */}
                                    <button onClick={() => startEdit(work)}
                                        className="p-2 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-lg transition-colors"
                                        title="Edit work">
                                        <Pencil size={16} />
                                    </button>

                                    {/* Delete */}
                                    <button onClick={() => handleDelete(work.id)}
                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
