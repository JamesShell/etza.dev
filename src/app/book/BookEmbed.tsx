'use client';

import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from '@phosphor-icons/react';
import { clickEvent } from '@/lib/analytics';

const shell = 'mt-12 overflow-hidden rounded-2xl bg-shell p-2 md:p-4';

/**
 * The embed as the pricing estimate hands it over: `/book?email=…&notes=…`
 * prefills the booking form, so the visitor isn't asked for the same email
 * twice and the estimate lands in the booking itself.
 */
export function PrefilledBookEmbed() {
    const params = useSearchParams();
    const email = params.get('email')?.slice(0, 200) ?? '';
    const notes = params.get('notes')?.slice(0, 2000) ?? '';

    return (
        <>
            {notes && (
                <p className="mt-8 flex items-center gap-2 text-[14px] text-chalk">
                    <CheckCircle size={18} weight="fill" aria-hidden="true" />
                    Your estimate is saved and already in the booking notes. Pick a time that works.
                </p>
            )}
            <BookEmbed email={email} notes={notes} />
        </>
    );
}

/** Holds the embed's space while the query string is read, so nothing jumps
 *  when the calendar arrives. The calendar is client-only either way. */
export function BookEmbedShell() {
    return <div className={shell} style={{ minHeight: 716 }} />;
}

/**
 * The Cal.com embed, kept apart from the page so the page can stay a server
 * component and export metadata. Everything client-side about /book lives here.
 */
export function BookEmbed({ email = '', notes = '' }: { email?: string; notes?: string }) {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({});
            cal('ui', {
                theme: 'light',
                styles: { branding: { brandColor: '#17171a' } },
                hideEventTypeDetails: false,
                layout: 'month_view',
            });

            // The one event on this site that is unambiguously a conversion.
            // It fires inside the embed's iframe, so nothing else can catch it.
            cal('on', {
                action: 'bookingSuccessful',
                callback: () => {
                    clickEvent({
                        action: 'booking_completed',
                        category: 'conversion',
                        label: 'Cal.com embed',
                    });
                },
            });
        })();
    }, []);

    return (
        // Marked so the blinking-face cursor stands down over the whole booking
        // widget, padding included, rather than only once the pointer is inside
        // the iframe itself.
        <div data-cursor-native className={shell}>
            <Cal
                calLink="ettouza/30min"
                style={{ width: '100%', minHeight: '700px', overflow: 'scroll' }}
                config={{
                    layout: 'month_view',
                    theme: 'light',
                    ...(email && { email }),
                    ...(notes && { notes }),
                }}
            />
        </div>
    );
}
