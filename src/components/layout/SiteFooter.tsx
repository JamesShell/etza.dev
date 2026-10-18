import React from 'react';
import Link from 'next/link';
import { profile } from '@/content/profile';

export function SiteFooter() {
    return (
        <footer className="py-8">
            <ul className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-ash">
                {profile.footerLinks.map((link) => (
                    <li key={link.label}>
                        {link.external ? (
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-chalk"
                            >
                                {link.label}
                            </a>
                        ) : (
                            <Link href={link.href} className="transition-colors hover:text-chalk">
                                {link.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
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
