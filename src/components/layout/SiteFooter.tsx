import React from 'react';
import Link from 'next/link';
import { profile } from '@/content/profile';

export function SiteFooter() {
    return (
        <footer className="py-8">
            <div className="flex flex-col gap-3 text-[11px] text-dust sm:flex-row sm:items-center sm:justify-between">
                <p>
                    © {new Date().getFullYear()} {profile.name}
                </p>
                <div className="flex items-center gap-6">
                    <Link href="/privacy" className="transition-colors hover:text-ash">
                        Privacy
                    </Link>
                    <Link href="/cookies" className="transition-colors hover:text-ash">
                        Cookies
                    </Link>
                </div>
            </div>
        </footer>
    );
}
