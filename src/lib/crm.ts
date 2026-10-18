/**
 * Hands a lead to the CRM. Server-side only — the key never reaches the
 * browser. Supabase stays the record of what was sent; this is a copy, so a
 * missing config or a CRM that's down is logged and shrugged off rather than
 * shown to the person who filled in the form.
 */

export type Lead = {
    name: string;
    email: string;
    company?: string;
    message: string;
    kind?: 'website' | 'webapp' | 'role' | 'other';
    estimate?: { total: number; currency: 'USD'; summary: string };
    utmSource?: string;
    landingPath?: string;
};

export async function sendLead(lead: Lead): Promise<boolean> {
    const url = process.env.CREW_LEADS_URL;
    const key = process.env.CREW_LEADS_KEY;
    if (!url || !key) return false;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
            body: JSON.stringify(lead),
            // The estimate waits on this before moving on to the calendar, so a
            // slow CRM mustn't hold the visitor up.
            signal: AbortSignal.timeout(4000),
        });
        if (!response.ok) {
            console.error('crm lead rejected', response.status, await response.text().catch(() => ''));
            return false;
        }
        return true;
    } catch (error) {
        console.error('crm lead failed', error);
        return false;
    }
}
