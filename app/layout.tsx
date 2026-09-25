import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Fraunces, JetBrains_Mono, Outfit, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import LenisProvider from "@/components/LenisProvider";
import LoadingScreen from "@/components/LoadingScreen";
import TidalCursor from "@/components/ui/tidal-cursor";
import ThemeProvider from "@/components/ThemeProvider";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, localBusinessSchema, websiteSchema, graph } from "@/lib/schema";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
  weight: ["700", "800"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#080B11",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sgctech.ai"),
  title: "SGC Tech AI — Odoo & AI for UAE Mid-Market in Dubai",
  description:
    "Practitioner-led Odoo ERP and AI implementation for UAE mid-market firms in Dubai. CPAs and CIAs, diagnosis-first, fixed price and timeline.",
  alternates: {
    canonical: "/",
    languages: {
      "en-AE": "/",
      "x-default": "/",
    },
  },
  appleWebApp: {
    title: "SGC Tech AI",
    statusBarStyle: "black-translucent",
  },
  keywords: [
    "Odoo implementation UAE",
    "ERP consultants Dubai",
    "AI finance automation",
    "CFO advisory UAE",
    "Odoo partner Dubai",
    "UAE mid-market ERP",
    "corporate tax compliance UAE",
    "Odoo rescue audit",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "SGC Tech AI — The Odoo Firm Your CFO Would Have Founded",
    description:
      "Practitioner-led Odoo ERP and AI implementation. CPAs and CIAs who have sat in UAE finance chairs. Fixed price. Fixed timeline.",
    type: "website",
    locale: "en_AE",
    url: "https://sgctech.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "SGC Tech AI",
    description:
      "UAE-based, finance-credentialed Odoo + AI implementation firm. We've sat in your finance chair.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // GA4 — wired only when NEXT_PUBLIC_GA_ID is set at build/deploy time so the
  // site ships clean if the env var isn't configured yet. Single page-view
  // event; configure events in GA4 directly rather than adding custom code.
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  // Google Tag Manager container. Override with NEXT_PUBLIC_GTM_ID ("off"
  // disables). Validated before interpolation into the inline snippet. Put
  // GA4 inside the container rather than also setting NEXT_PUBLIC_GA_ID, or
  // page views are counted twice.
  const gtmIdRaw = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-MHQW73V4";
  const gtmId = /^GTM-[A-Z0-9]+$/.test(gtmIdRaw) ? gtmIdRaw : null;

  return (
    <html lang="en-AE" id="top" suppressHydrationWarning>
      <head>
        {gtmId && (
          // Raw <script> high in <head> (not next/script) so the snippet is in
          // the server HTML, which GTM's install check and Tag Assistant read.
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        {/* Site-wide entity graph — Organization (legal entity, DIEZ
            registered address, trade license) + LocalBusiness/ProfessionalService
            (operating office, Al Rigga address, hours, parentOrganization →
            org) + WebSite. Stable @id values (lib/schema.ts) let per-page
            nodes (Service, BreadcrumbList, FAQPage) reference these via
            @id only. Two nodes exist because Google LocalBusiness requires
            a single PostalAddress — registering and operating addresses
            therefore must live on separate entities, linked by
            parentOrganization. */}
        <JsonLd data={graph([organizationSchema(), localBusinessSchema(), websiteSchema()])} />
        {/* Pre-hydration theme sync — runs before first paint so there is no
            flash of the wrong theme while React hydrates. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {(gaId || gtmId) && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          </>
        )}
      </head>
      <body
        className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {/* Skip-to-content: a11y win for keyboard/screen-reader users past the
            fixed nav. Sits as the first focusable element in <body>. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[10000] focus:rounded-md focus:bg-[var(--bg)] focus:px-4 focus:py-2 focus:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        >
          Skip to content
        </a>

        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: true });`}
            </Script>
          </>
        )}

        {/* No-JS fallback: hero bails to client-side rendering, so without JS
            the visitor would see only the splash. Show the brand and the
            discovery CTA so no-JS visitors can still reach contact. This
            markup is identical on every route, so it deliberately carries no
            <h1> — each page's real <h1> stays the only one in the document. */}
        <noscript>
          <div
            style={{
              padding: "6rem 1.5rem 4rem",
              maxWidth: "640px",
              margin: "0 auto",
              color: "#F4F1EA",
              fontFamily: "var(--font-fraunces, Georgia, serif)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
                fontSize: "0.7rem",
                letterSpacing: "0.32em",
                color: "#D4A574",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              SGC Tech AI
            </p>
            <p style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", lineHeight: 1.1, margin: "0 0 1rem", fontWeight: 700 }}>
              Practitioner-Led Odoo &amp; AI for UAE Mid-Market
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>
              CPAs and CIAs implementing Odoo ERP and AI for finance, ops, and
              compliance in Dubai-based mid-market firms. Fixed price. Fixed
              timeline. Book a discovery call below.
            </p>
            <p style={{ marginTop: "1.5rem" }}>
              <a
                href="mailto:info@sgctech.ai"
                style={{ color: "#D4A574", textDecoration: "underline" }}
              >
                Email info@sgctech.ai
              </a>
              {" · "}
              <a
                href="https://wa.me/971521985231"
                style={{ color: "#D4A574", textDecoration: "underline" }}
              >
                WhatsApp +971 52 198 5231
              </a>
            </p>
          </div>
        </noscript>

        <ThemeProvider>
          <LenisProvider>
            <LoadingScreen />
            <TidalCursor goldTone="champagne" />
            {children}
          </LenisProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
