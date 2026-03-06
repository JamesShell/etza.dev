'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CaseStudy } from '@/types/database';
import Link from 'next/link';
import { Plus, Pencil, Trash, CaretUp, CaretDown } from '@phosphor-icons/react';

export default function AdminDashboard() {
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCaseStudies();
    }, []);

    const fetchCaseStudies = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('case_studies')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setCaseStudies(data);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this case study?')) {
            await supabase.from('case_studies').delete().eq('id', id);
            fetchCaseStudies();
        }
    };

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === caseStudies.length - 1)
        ) return;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const currentStudy = caseStudies[index];
        const targetStudy = caseStudies[targetIndex];

        // Swap their created_at values to change sorting order natively
        const currentCreatedAt = currentStudy.created_at;
        const targetCreatedAt = targetStudy.created_at;

        // Optimistic UI update
        const newCases = [...caseStudies];
        newCases[index] = { ...currentStudy, created_at: targetCreatedAt };
        newCases[targetIndex] = { ...targetStudy, created_at: currentCreatedAt };
        
        // Ensure array visually sorts by created_at DESC immediately
        newCases.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setCaseStudies(newCases);

        // Background sync
        await supabase
            .from('case_studies')
            .update({ created_at: targetCreatedAt })
            .eq('id', currentStudy.id);
        
        await supabase
            .from('case_studies')
            .update({ created_at: currentCreatedAt })
            .eq('id', targetStudy.id);
    };

    return (
        <div className="font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-ink">Case Studies</h1>
                    <p className="text-zinc-500 mt-1">Manage your portfolio projects globally.</p>
                </div>
                <Link
                    href="/admin/case-studies/new"
                    className="flex items-center gap-2 bg-ink text-white px-5 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm"
                >
                    <Plus size={20} weight="bold" />
                    New Project
                </Link>
            </div>

            {isLoading ? (
                <div className="py-20 text-center text-zinc-500">Loading cases...</div>
            ) : caseStudies.length === 0 ? (
                <div className="bg-white border text-center border-zinc-200 rounded-3xl p-16 flex flex-col items-center">
                    <p className="text-zinc-500 mb-4">You have no case studies published yet.</p>
                    <Link
                        href="/admin/case-studies/new"
                        className="text-ink font-bold hover:underline"
                    >
                        Create your first one &rarr;
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-sm text-zinc-600">Project</th>
                                <th className="px-6 py-4 font-semibold text-sm text-zinc-600">Category</th>
                                <th className="px-6 py-4 font-semibold text-sm text-zinc-600">Featured</th>
                                <th className="px-6 py-4 font-semibold text-sm text-zinc-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {caseStudies.map((study, index) => (
                                <tr key={study.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-0.5 mr-2">
                                                <button 
                                                    onClick={() => handleMove(index, 'up')}
                                                    disabled={index === 0}
                                                    className={`p-1 rounded transition-colors ${index === 0 ? 'text-zinc-200 cursor-not-allowed' : 'text-zinc-400 hover:text-ink hover:bg-zinc-100'}`}
                                                >
                                                    <CaretUp size={16} weight="bold" />
                                                </button>
                                                <button 
                                                    onClick={() => handleMove(index, 'down')}
                                                    disabled={index === caseStudies.length - 1}
                                                    className={`p-1 rounded transition-colors ${index === caseStudies.length - 1 ? 'text-zinc-200 cursor-not-allowed' : 'text-zinc-400 hover:text-ink hover:bg-zinc-100'}`}
                                                >
                                                    <CaretDown size={16} weight="bold" />
                                                </button>
                                            </div>
                                            <div className={`w-8 h-8 rounded-lg ${study.logo_bg} flex items-center justify-center text-white font-bold text-xs`}>
                                                {study.logo_text}
                                            </div>
                                            <div>
                                                <p className="font-bold text-ink">{study.title}</p>
                                                <p className="text-xs text-zinc-400">/{study.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-medium">
                                            {study.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`w-3 h-3 rounded-full ${study.is_featured ? 'bg-green-500' : 'bg-zinc-300'}`} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/case-studies/edit/${study.id}`}
                                                className="p-2 text-zinc-400 hover:text-ink hover:bg-zinc-100 rounded-lg transition-colors"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(study.id)}
                                                className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
