'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GA_TRACKING_ID } from '@/lib/gtag';

export default function ContraRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
      window.gtag('event', 'referral_redirect', {
        event_category: 'traffic_source',
        event_label: 'contra',
        referral_source: 'contra',
      });
    }

    router.replace('/');
  }, [router]);

  return null;
}
