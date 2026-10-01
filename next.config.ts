import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

// Allows: self-hosted assets, inline styles/scripts Next.js injects for
// hydration + the GA4/GTM snippets, Google Tag Manager (+ GA4 beacons it loads), Vercel Analytics
// beacon, and the Cloudinary image host already whitelisted in images.remotePatterns.
// unsafe-eval is dev-only (Turbopack HMR / RSC dev client need it) — never shipped to prod.
const isDev = process.env.NODE_ENV !== "production";
// Stripe Elements on /subscribe (14-day trial card step): js.stripe.com serves
// stripe.js and hosts the Payment Element frame, api.stripe.com is the browser's own
// call to confirm the SetupIntent, m.stripe.network is Stripe's fraud signal beacon.
// Everything else is the analytics/turnstile allowlist below.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://*.googletagmanager.com https://tagmanager.google.com https://va.vercel-scripts.com https://challenges.cloudflare.com https://js.stripe.com`,
  // GTM Preview / Tag Assistant debug UI pulls styles, fonts and icons from Google.
  "style-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://tagmanager.google.com https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net https://*.google.com https://*.google.ae https://ssl.gstatic.com https://www.gstatic.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  // GA4 beacons go to analytics.google.com (bare host — *.analytics.google.com
  // does not match it), www.google.com and *.g.doubleclick.net (Google Signals).
  // Allowlist per https://developers.google.com/tag-platform/security/guides/csp
  "connect-src 'self' https://*.googletagmanager.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.g.doubleclick.net https://www.google.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://challenges.cloudflare.com https://api.stripe.com https://m.stripe.network",
  // GTM noscript iframe + Tag Assistant preview mode
  // challenges.cloudflare.com: Turnstile bot check on /subscribe
  // js.stripe.com: Payment Element frame (+ 3DS challenge), hooks.stripe.com: redirects
  "frame-src https://*.googletagmanager.com https://tagassistant.google.com https://challenges.cloudflare.com https://js.stripe.com https://hooks.stripe.com https://m.stripe.network",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  // 'self' only: the trial card step never redirects the browser to Stripe (card
  // elements confirm in-page with redirect: "if_required").
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options",        value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    // Section imagery is self-hosted under /public/images/sections.
    // res.cloudinary.com is retained only for the founder avatar
    // placeholder in FounderSection.tsx; replace when final photos land.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    // AVIF first: smaller than WebP at equal quality on most photographic
    // content; Next.js content-negotiates via Accept header and falls back
    // to WebP automatically on browsers that don't support AVIF.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Media under /public is served with Next's default short cache; these
      // files never change in place (replaced with new names when they do),
      // so give browsers a week plus a revalidation window. Not `immutable`:
      // /public paths are not content-hashed.
      {
        source: "/:folder(images|videos|frames|shield|diamonds|legal|bg-music)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/sgc-logo.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

// Opt-in bundle analysis: `ANALYZE=true npm run build`.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
