/**
 * Umami. Cookieless and self-contained: it tracks page views on its own, so
 * there is no pageview helper here and nothing to wire into the router.
 *
 * Every call is a no-op when the script hasn't loaded — blocked, offline, or
 * simply absent in development — so nothing needs to guard its own call site.
 */

type TrackedEvent = {
    action: string;
    category?: string;
    label?: string;
    value?: number;
};

export const clickEvent = ({ action, category, label, value }: TrackedEvent) => {
    if (typeof window === 'undefined' || !window.umami) return;

    // Umami takes a name plus flat properties, so the GA-shaped fields are
    // passed through as data rather than folded into the event name — that
    // keeps one row per action instead of one per action/label pair.
    window.umami.track(action, {
        ...(category ? { category } : {}),
        ...(label ? { label } : {}),
        ...(typeof value === 'number' ? { value } : {}),
    });
};

/** Where a lead came from, sent along with the form so the CRM can tell
 *  campaigns apart. Read from the page the form is on. */
export const attribution = () => {
    if (typeof window === 'undefined') return {};
    const utmSource = new URLSearchParams(window.location.search).get('utm_source');
    return { landingPath: window.location.pathname, ...(utmSource ? { utmSource } : {}) };
};

declare global {
    interface Window {
        umami?: {
            track: (
                event: string,
                data?: Record<string, string | number | boolean>
            ) => void;
        };
    }
}
