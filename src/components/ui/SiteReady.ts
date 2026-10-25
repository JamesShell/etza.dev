'use client';

import { useSyncExternalStore } from 'react';

/**
 * Whether the page is showing yet: false while the first-visit loader covers
 * it, true from the moment the loader starts to lift. Entrances (titles
 * rising, the home cards opening, the bar coming in) wait on this, so they
 * play where they can be seen rather than behind the loader.
 *
 * A visit that skips the loader — later in the same session — is ready at
 * once: the inline script in the root layout marks <html> before first paint.
 */
let ready = false;
const listeners = new Set<() => void>();

function current() {
    if (!ready && typeof document !== 'undefined' && 'loaded' in document.documentElement.dataset) {
        ready = true;
    }
    return ready;
}

export function markSiteReady() {
    if (ready) return;
    ready = true;
    listeners.forEach((l) => l());
}

export function useSiteReady() {
    return useSyncExternalStore(
        (onChange) => {
            listeners.add(onChange);
            return () => listeners.delete(onChange);
        },
        current,
        // The server always renders the page as if the loader were up, so
        // entrances start from their hidden state either way.
        () => false
    );
}
