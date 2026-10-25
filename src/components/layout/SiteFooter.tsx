import React from 'react';
import Link from 'next/link';
import { profile } from '@/content/profile';

/** Small upper-case chrome, the same voice as the bar. */
const chrome = 'text-[11px] uppercase leading-[1.45] tracking-[0.06em]';

/**
 * The foot of a page, in the bar's voice and on its four columns: who, where
 * else to find him, the legal pages, the year. Deliberately as quiet as the
 * bar — it closes the page, it doesn't start a new section.
 */
export function SiteFooter() {
    return (
        <footer className={`grid grid-cols-2 gap-5 py-8 md:grid-cols-4 ${chrome}`}>
            <p className="text-chalk">
                {profile.name.split(' ').map((part) => (
                    <span key={part} className="block">
                        {part}
                    </span>
                ))}
            </p>

            <ul className="text-ash">
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

            <ul className="text-ash">
                {/* Not in the menu, but linked from every page here, so it's
                    found and crawled rather than left an orphan. */}
                <li>
                    <Link href="/reviews" className="transition-colors hover:text-chalk">
                        Reviews
                    </Link>
                </li>
                <li>
                    <Link href="/privacy" className="transition-colors hover:text-chalk">
                        Privacy
                    </Link>
                </li>
                <li>
                    <Link href="/cookies" className="transition-colors hover:text-chalk">
                        Cookies
                    </Link>
                </li>
            </ul>

            <p className="text-dust md:text-right">© {new Date().getFullYear()}</p>
        </footer>
    );
}
