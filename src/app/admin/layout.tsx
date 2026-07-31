import React from 'react';
import type { Metadata } from 'next';
import { AdminShell } from './AdminShell';

/**
 * A robots.txt `Disallow` stops a crawler fetching a URL — it does not stop the
 * URL being indexed when something links to it. The header below is the part
 * that actually keeps /admin out of results, which is why this layout is a
 * server component and the session logic lives in AdminShell.
 */
export const metadata: Metadata = {
    title: 'Admin',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false },
    },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminShell>{children}</AdminShell>;
}
