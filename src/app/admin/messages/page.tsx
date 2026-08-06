'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Message } from '@/types/database';
import {
    EnvelopeSimple,
    MagnifyingGlass,
    ArrowClockwise,
    Buildings,
    MapPin,
    CurrencyDollar,
    Trash,
    PaperPlaneTilt,
    CaretDown,
} from '@phosphor-icons/react';

const kindConfig: Record<string, { label: string; className: string }> = {
    project: { label: 'Project', className: 'bg-blue-50 text-blue-700' },
    role: { label: 'Role', className: 'bg-violet-50 text-violet-700' },
    other: { label: 'Other', className: 'bg-zinc-100 text-zinc-600' },
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

/** "3h ago" reads faster than a timestamp for anything sent today. */
function relativeTime(dateStr: string) {
    const seconds = Math.round((Date.now() - new Date(dateStr).getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(dateStr);
}

function initials(name: string) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'project' | 'role' | 'other'>('all');
    const [query, setQuery] = useState('');
    const [openId, setOpenId] = useState<string | null>(null);

    const fetchMessages = async () => {
        setIsLoading(true);

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            setError(error.message);
        } else {
            setError(null);
            setMessages(data ?? []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        // Loading on mount is the point of the page; same shape as the other
        // admin lists.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMessages();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this message? This cannot be undone.')) return;

        const { error } = await supabase.from('messages').delete().eq('id', id);
        if (error) {
            setError(error.message);
            return;
        }
        setMessages((current) => current.filter((message) => message.id !== id));
    };

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();

        return messages.filter((message) => {
            if (filter !== 'all' && message.kind !== filter) return false;
            if (!needle) return true;

            return [message.name, message.email, message.company, message.message]
                .filter(Boolean)
                .some((field) => field!.toLowerCase().includes(needle));
        });
    }, [messages, filter, query]);

    const counts = useMemo(
        () => ({
            all: messages.length,
            project: messages.filter((m) => m.kind === 'project').length,
            role: messages.filter((m) => m.kind === 'role').length,
            other: messages.filter((m) => m.kind === 'other').length,
        }),
        [messages]
    );

    return (
        <div className="font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-ink">Messages</h1>
                    <p className="text-zinc-500 mt-1">
                        {messages.length > 0
                            ? `${messages.length} enquir${messages.length > 1 ? 'ies' : 'y'} from the contact form.`
                            : 'Enquiries sent through the contact form.'}
                    </p>
                </div>
                <button
                    onClick={fetchMessages}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-ink text-white px-5 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm text-sm disabled:opacity-50"
                >
                    <ArrowClockwise size={18} weight="bold" />
                    Refresh
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
                <div className="flex gap-1 bg-zinc-100 rounded-xl p-1 w-fit">
                    {(['all', 'project', 'role', 'other'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                                filter === tab ? 'bg-white text-ink shadow-sm' : 'text-zinc-500 hover:text-ink'
                            }`}
                        >
                            {tab}
                            <span className="ml-1.5 text-xs text-zinc-400">{counts[tab]}</span>
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-72">
                    <MagnifyingGlass
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search name, email or text"
                        className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-zinc-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-200"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center text-zinc-500">Loading messages...</div>
            ) : error ? (
                <div className="bg-white border border-zinc-200 rounded-3xl p-16 text-center">
                    <p className="text-zinc-500 mb-2">{error}</p>
                    <p className="text-sm text-zinc-400">
                        Run{' '}
                        <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">
                            supabase/messages.sql
                        </code>{' '}
                        so the signed-in role can read the table.
                    </p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-3xl p-16 text-center">
                    <p className="text-zinc-500">
                        {messages.length === 0
                            ? 'No messages yet.'
                            : 'No messages match that search.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-zinc-200">
                    {filtered.map((message) => {
                        const kind = kindConfig[message.kind] ?? kindConfig.other;
                        const isOpen = openId === message.id;

                        return (
                            <div key={message.id} className="transition-colors">
                                <button
                                    onClick={() => setOpenId(isOpen ? null : message.id)}
                                    className={`w-full text-left px-6 py-4 flex items-start gap-4 transition-colors ${
                                        isOpen ? 'bg-zinc-50/70' : 'hover:bg-zinc-50/50'
                                    }`}
                                >
                                    <div className="w-9 h-9 shrink-0 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500">
                                        {initials(message.name) || <EnvelopeSimple size={16} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-medium text-ink text-sm">{message.name}</p>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${kind.className}`}
                                            >
                                                {kind.label}
                                            </span>
                                            <span className="text-xs text-zinc-400">{message.email}</span>
                                        </div>
                                        <p
                                            className={`text-sm text-zinc-500 mt-1 ${isOpen ? '' : 'truncate'}`}
                                        >
                                            {message.message}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                                        <span
                                            className="text-xs text-zinc-400"
                                            title={`${formatDate(message.created_at)} · ${formatTime(message.created_at)}`}
                                        >
                                            {relativeTime(message.created_at)}
                                        </span>
                                        <CaretDown
                                            size={14}
                                            className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="px-6 pb-6 pt-2 bg-zinc-50/70">
                                        <div className="pl-13 space-y-4">
                                            {(message.company || message.location || message.budget) && (
                                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600">
                                                    {message.company && (
                                                        <span className="flex items-center gap-2">
                                                            <Buildings size={15} className="text-zinc-400" />
                                                            {message.company}
                                                        </span>
                                                    )}
                                                    {message.location && (
                                                        <span className="flex items-center gap-2">
                                                            <MapPin size={15} className="text-zinc-400" />
                                                            {message.location}
                                                        </span>
                                                    )}
                                                    {message.budget && (
                                                        <span className="flex items-center gap-2">
                                                            <CurrencyDollar size={15} className="text-zinc-400" />
                                                            {message.budget}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="bg-white border border-zinc-200 rounded-xl p-4 text-sm text-zinc-700 whitespace-pre-wrap">
                                                {message.message}
                                            </div>

                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-xs text-zinc-400">
                                                    Received {formatDate(message.created_at)} at{' '}
                                                    {formatTime(message.created_at)}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={`mailto:${message.email}?subject=${encodeURIComponent('Re: your message to etza.dev')}`}
                                                        className="flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
                                                    >
                                                        <PaperPlaneTilt size={15} weight="bold" />
                                                        Reply
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(message.id)}
                                                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete message"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
