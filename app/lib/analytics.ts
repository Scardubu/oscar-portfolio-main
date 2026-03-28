export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;

  w.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}
