// app/reportWebVitals.ts
// Next.js will automatically call this function in the browser
// for each Web Vitals metric. We forward to the shared monitoring
// utility so we keep logic in one place.

import { reportWebVitals as baseReportWebVitals } from "@/lib/monitoring";

export function reportWebVitals(metric: Parameters<typeof baseReportWebVitals>[0]) {
  baseReportWebVitals(metric);
}
