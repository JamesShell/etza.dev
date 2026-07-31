/**
 * One way to put structured data on a page.
 *
 * `id` matters: React needs a stable key for the script node, and having the
 * graph named in the DOM makes it obvious in devtools which page emitted what.
 * This stays a server component — the JSON is serialised at render time, so no
 * JavaScript ships for it.
 */
export function JsonLd({ id, data }: { id: string; data: object }) {
    return (
        <script
            type="application/ld+json"
            id={id}
            // The payload is built from our own content, never from request
            // input, so there is nothing here for a user to inject into.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
