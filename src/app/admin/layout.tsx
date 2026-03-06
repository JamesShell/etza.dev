'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { SignOut, Briefcase, Plus, Images, CalendarBlank } from '@phosphor-icons/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [session, setSession] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsLoading(false);
            if (!session && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-zinc-50">Loading...</div>;
    }

    if (!session && pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen flex bg-zinc-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col h-screen sticky top-0">
                <div className="p-6 border-b border-zinc-200">
                    <h2 className="text-xl font-bold text-ink">Admin Panel</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/admin' ? 'bg-zinc-100 text-ink font-semibold' : 'text-zinc-500 hover:text-ink hover:bg-zinc-50'}`}
                    >
                        <Briefcase size={20} />
                        Case Studies
                    </Link>
                    <Link
                        href="/admin/case-studies/new"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/admin/case-studies/new' ? 'bg-zinc-100 text-ink font-semibold' : 'text-zinc-500 hover:text-ink hover:bg-zinc-50'}`}
                    >
                        <Plus size={20} />
                        New Case Study
                    </Link>
                    <Link
                        href="/admin/selected-works"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/admin/selected-works' ? 'bg-zinc-100 text-ink font-semibold' : 'text-zinc-500 hover:text-ink hover:bg-zinc-50'}`}
                    >
                        <Images size={20} />
                        Selected Works
                    </Link>
                    <Link
                        href="/admin/bookings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/admin/bookings' ? 'bg-zinc-100 text-ink font-semibold' : 'text-zinc-500 hover:text-ink hover:bg-zinc-50'}`}
                    >
                        <CalendarBlank size={20} />
                        Bookings
                    </Link>
                </nav>
                <div className="p-4 border-t border-zinc-200">
                    <button
                        onClick={() => supabase.auth.signOut()}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-colors text-zinc-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <SignOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 lg:p-12 h-screen overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
