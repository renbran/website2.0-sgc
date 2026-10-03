// Thin dataLayer shim — this deliberately does NOT load any tag itself.
//
// Google Tag Manager (app/layout.tsx, env-driven) owns every actual tag; the
// GA4 Configuration tag lives inside the GTM container. This module only
// records that a conversion happened. The container listens for these as
// Custom Event triggers and forwards them to GA4, so there is exactly one
// analytics script in the browser (gtm.js) and pageviews cannot double-count.
//
// If NEXT_PUBLIC_GTM_ID is unset the pushes below are harmless no-ops: the
// dataLayer array simply never gets consumed.
type DataLayerEvent = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export const GTM_ID = (process.env.NEXT_PUBLIC_GTM_ID ?? "").trim();

export const GTM_ENABLED = GTM_ID !== "" && GTM_ID.toLowerCase() !== "off";

export function trackEvent(name: string, params: DataLayerEvent = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
}
