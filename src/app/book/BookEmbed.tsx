'use client';

import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';
import { clickEvent } from '@/lib/analytics';

/**
 * The Cal.com embed, kept apart from the page so the page can stay a server
 * component and export metadata. Everything client-side about /book lives here.
 */
export function BookEmbed() {
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
        <div
            data-cursor-native
            className="mt-12 overflow-hidden rounded-2xl bg-shell p-2 md:p-4"
        >
            <Cal
                calLink="ettouza/30min"
                style={{ width: '100%', minHeight: '700px', overflow: 'scroll' }}
                config={{ layout: 'month_view', theme: 'light' }}
            />
        </div>
    );
}
