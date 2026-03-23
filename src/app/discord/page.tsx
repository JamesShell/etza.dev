'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GA_TRACKING_ID } from '@/lib/gtag';

export default function DiscordRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
      window.gtag('event', 'referral_redirect', {
        event_category: 'traffic_source',
        event_label: 'discord',
        referral_source: 'discord',
      });
    }

    router.replace('/');
  }, [router]);

  return null;
}
