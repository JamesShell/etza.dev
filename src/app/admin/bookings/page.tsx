'use client';

import React, { useEffect, useState } from 'react';
import { CalendarBlank, Clock, User, VideoCamera, CheckCircle, XCircle, HourglassSimple, CaretLeft, CaretRight, List } from '@phosphor-icons/react';

interface Booking {
    id: number;
    title: string;
    status: string;
    startTime: string;
    endTime: string;
    attendees: { name: string; email: string }[];
    location?: string;
    description?: string;
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    ACCEPTED: { label: 'Confirmed', className: 'bg-emerald-50 text-emerald-700', icon: <CheckCircle size={14} weight="fill" /> },
    PENDING: { label: 'Pending', className: 'bg-amber-50 text-amber-700', icon: <HourglassSimple size={14} weight="fill" /> },
    CANCELLED: { label: 'Cancelled', className: 'bg-red-50 text-red-600', icon: <XCircle size={14} weight="fill" /> },
    REJECTED: { label: 'Rejected', className: 'bg-red-50 text-red-600', icon: <XCircle size={14} weight="fill" /> },
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
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

function toLocalDateString(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function CalendarView({ bookings }: { bookings: Booking[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToday = () => setCurrentDate(new Date());

    const bookingsByDate = bookings.reduce((acc, booking) => {
        const dateStr = toLocalDateString(new Date(booking.startTime));
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(booking);
        return acc;
    }, {} as Record<string, Booking[]>);

    const todayStr = toLocalDateString(new Date());

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 bg-zinc-50/50">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-ink w-40">{monthNames[month]} {year}</h2>
                    <div className="flex gap-1 border border-zinc-200 bg-white rounded-lg p-0.5 shadow-sm">
                        <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 transition-colors">
                            <CaretLeft size={16} weight="bold" />
                        </button>
                        <button onClick={goToday} className="px-3 py-1.5 text-xs font-semibold rounded-md hover:bg-zinc-100 text-zinc-600 transition-colors">
                            Today
                        </button>
                        <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 transition-colors">
                            <CaretRight size={16} weight="bold" />
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-3 text-center text-xs font-bold text-zinc-500 uppercase tracking-wider border-r border-zinc-200 last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 auto-rows-fr bg-zinc-50">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[120px] bg-zinc-50/30 border-b border-r border-zinc-200"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const date = i + 1;
                    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    const dayBookings = bookingsByDate[dateKey] || [];
                    const isToday = todayStr === dateKey;

                    return (
                        <div key={date} className={`min-h-[120px] p-2 border-b border-r border-zinc-200 bg-white transition-colors hover:bg-zinc-50/50 flex flex-col group ${isToday ? 'bg-blue-50/10' : ''}`}>
                            <div className="flex justify-end mb-1">
                                <div className={`text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-ink text-white shadow-sm' : 'text-zinc-500 group-hover:text-ink'}`}>
                                    {date}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                                {dayBookings.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map(b => {
                                    const isAccepted = b.status === 'ACCEPTED';
                                    const isCancelled = b.status === 'CANCELLED' || b.status === 'REJECTED';
                                    return (
                                        <div 
                                            key={b.id} 
                                            className={`text-xs p-1.5 rounded-md border truncate ${
                                                isCancelled ? 'bg-red-50 text-red-700 border-red-100/50 line-through opacity-70' :
                                                isAccepted ? 'bg-emerald-50 text-emerald-800 border-emerald-100/50' : 
                                                'bg-zinc-50 text-zinc-700 border-zinc-200/50'
                                            }`} 
                                            title={b.title}
                                        >
                                            <span className="font-semibold mix-blend-multiply opacity-70 mr-1">{formatTime(b.startTime)}</span>
                                            {b.attendees?.[0]?.name?.split(' ')[0] || 'Booking'}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    );
                })}
                {/* Fill remaining cells to complete the grid */}
                {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, i) => (
                    <div key={`empty-end-${i}`} className="min-h-[120px] bg-zinc-50/30 border-b border-r border-zinc-200 last:border-r-0"></div>
                ))}
            </div>
        </div>
    );
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/bookings');
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to fetch bookings');
            }
            const data = await res.json();
            setBookings(data.bookings || []);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load bookings');
        } finally {
            setIsLoading(false);
        }
    };

    const now = new Date();
    const filtered = bookings.filter((b) => {
        if (filter === 'upcoming') return new Date(b.startTime) >= now;
        if (filter === 'past') return new Date(b.startTime) < now;
        return true;
    });

    const sorted = [...filtered].sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

    const upcoming = bookings.filter((b) => new Date(b.startTime) >= now && b.status === 'ACCEPTED').length;

    return (
        <div className="font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-ink">Bookings</h1>
                    <p className="text-zinc-500 mt-1">
                        {upcoming > 0
                            ? `You have ${upcoming} upcoming booking${upcoming > 1 ? 's' : ''}.`
                            : 'View your Cal.com bookings.'}
                    </p>
                </div>
                <a
                    href="https://app.cal.com/bookings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-ink text-white px-5 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-sm text-sm"
                >
                    <CalendarBlank size={18} weight="bold" />
                    Open Cal.com
                </a>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
                <div className="flex gap-1 bg-zinc-100 rounded-xl p-1 w-fit">
                    {(['all', 'upcoming', 'past'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                                filter === tab
                                    ? 'bg-white text-ink shadow-sm'
                                    : 'text-zinc-500 hover:text-ink'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex gap-1 bg-zinc-100 rounded-xl p-1 w-fit">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            viewMode === 'list'
                                ? 'bg-white text-ink shadow-sm'
                                : 'text-zinc-500 hover:text-ink'
                        }`}
                        title="List View"
                    >
                        <List size={18} /> List
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            viewMode === 'calendar'
                                ? 'bg-white text-ink shadow-sm'
                                : 'text-zinc-500 hover:text-ink'
                        }`}
                        title="Calendar View"
                    >
                        <CalendarBlank size={18} /> Calendar
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center text-zinc-500">Loading bookings...</div>
            ) : error ? (
                <div className="bg-white border border-zinc-200 rounded-3xl p-16 text-center">
                    <p className="text-zinc-500 mb-2">{error}</p>
                    <p className="text-sm text-zinc-400">
                        Make sure the <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-xs">CAL_API_KEY</code> environment variable is set.
                    </p>
                </div>
            ) : sorted.length === 0 ? (
                <div className="bg-white border border-zinc-200 rounded-3xl p-16 text-center">
                    <p className="text-zinc-500">No {filter !== 'all' ? filter : ''} bookings found.</p>
                </div>
            ) : viewMode === 'calendar' ? (
                <CalendarView bookings={sorted} />
            ) : (
                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 border-b border-zinc-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-sm text-zinc-600">Guest</th>
                                <th className="px-6 py-4 font-semibold text-sm text-zinc-600">Date</th>
                                <th className="px-6 py-4 font-semibold text-sm text-zinc-600">Time</th>
                                <th className="px-6 py-4 font-semibold text-sm text-zinc-600">Status</th>
                                <th className="px-6 py-4 font-semibold text-sm text-zinc-600">Meeting</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {sorted.map((booking) => {
                                const status = statusConfig[booking.status] || statusConfig.PENDING;
                                const attendee = booking.attendees?.[0];
                                const isPast = new Date(booking.startTime) < now;

                                return (
                                    <tr key={booking.id} className={`transition-colors ${isPast ? 'opacity-60' : 'hover:bg-zinc-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center">
                                                    <User size={16} className="text-zinc-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-ink text-sm">{attendee?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-zinc-400">{attendee?.email || ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-zinc-700">
                                                <CalendarBlank size={15} className="text-zinc-400" />
                                                {formatDate(booking.startTime)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-zinc-700">
                                                <Clock size={15} className="text-zinc-400" />
                                                {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
                                                {status.icon}
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {booking.location ? (
                                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                    <VideoCamera size={15} />
                                                    <span className="truncate max-w-30">{booking.title}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-zinc-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
