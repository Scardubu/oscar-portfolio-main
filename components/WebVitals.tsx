'use client';

// CONVICTION ENGINE V1.0 — Web Vitals reporter
//
// App Router note: Next.js does NOT auto-invoke a file-level `reportWebVitals`
// export — that is the Pages Router convention (pages/_app). In the App Router
// the only supported entry point is the `useReportWebVitals` hook from
// `next/web-vitals`, called inside a Client Component. This component is that
// entry point; it forwards every metric to the shared monitoring layer
// (lib/monitoring.ts), which emits the `WebVital` Vercel Analytics custom event.
//
// Mounted only in production (alongside <Analytics />) — `track()` is a no-op
// unless the Analytics script is loaded, so emitting elsewhere is just noise.

import { useReportWebVitals } from 'next/web-vitals';

import { reportWebVitals } from '@/lib/monitoring';

export function WebVitals() {
  useReportWebVitals((metric) => {
    reportWebVitals(metric);
  });

  return null;
}
