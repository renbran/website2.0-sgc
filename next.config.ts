import type { NextConfig } from "next";

// Allows: self-hosted assets, inline styles/scripts Next.js injects for
// hydration + the GA4/GTM snippets, Google Tag Manager (+ GA4 beacons it loads), Vercel Analytics
// beacon, and the Cloudinary image host already whitelisted in images.remotePatterns.
// unsafe-eval is dev-only (Turbopack HMR / RSC dev client need it) — never shipped to prod.
const isDev = process.env.NODE_ENV !== "production";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://tagmanager.google.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  // GTM noscript iframe + Tag Assistant preview mode
  "frame-src https://www.googletagmanager.com https://tagassistant.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
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
    ];
  },
};

export default nextConfig;
