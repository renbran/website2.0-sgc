// Pushes a conversion event to the GTM dataLayer (loaded in the root
// layout). GTM maps these to GA4 events via Custom Event triggers. Never pass
// personal data (names, emails, messages) — GA4 terms forbid PII.
type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export function trackEvent(
  event: string,
  params: Record<string, string | number | boolean> = {},
): void {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}
