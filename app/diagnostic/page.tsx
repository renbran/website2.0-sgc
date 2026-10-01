import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import DiagnosticWizard from "@/components/diagnostic/DiagnosticWizard";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { IDS } from "@/lib/schema";

const DESCRIPTION =
  "Score your operations in 8 minutes. 12 questions across Finance, Sales, Operations, and People. Get a personalised report with prioritised next moves.";

export const metadata: Metadata = {
  title: "Free Operational Diagnostic UAE — SGC Tech AI",
  description: DESCRIPTION,
  alternates: { canonical: "/diagnostic" },
  robots: { index: true, follow: true },
  keywords: [
    "free operational diagnostic UAE",
    "ERP health check Dubai",
    "8-minute operations assessment",
    "Odoo readiness check UAE",
    "mid-market ops diagnostic",
    "free ERP audit checklist",
    "operations scorecard UAE",
    "finance sales operations people assessment",
    "SGC diagnostic",
    "Odoo suitability score UAE",
  ],
  openGraph: {
    title: "Operational Health Diagnostic — SGC Tech AI",
    description: DESCRIPTION,
    url: "https://sgctech.ai/diagnostic",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Operational Health Diagnostic — SGC Tech AI",
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  other: {
    datePublished: "2026-09-02",
    dateModified: "2026-09-06",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "Operational Health Diagnostic — SGC Tech AI",
  description:
    "A free 8-minute diagnostic that scores your business across Finance, Sales, Operations, and People, and produces a personalised report with prioritised next moves.",
  url: "https://sgctech.ai/diagnostic",
  isPartOf: { "@id": IDS.website },
  publisher: { "@id": IDS.org },
};

export default function DiagnosticPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <BreadcrumbJsonLd
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Operational Health Diagnostic", path: "/diagnostic" },
          ]}
        />

        <div className="mx-auto max-w-5xl px-6 md:px-10">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <SectionEyebrow label="DIAGNOSTIC" />
            <h1 className="mt-4 font-fraunces text-4xl font-semibold leading-[1.05] text-[var(--text-primary)] md:text-6xl">
              Operational Health Diagnostic
            </h1>
            <p className="mt-4 font-fraunces text-xl font-medium text-[var(--accent)] md:text-2xl">
              Score your operations in 8 minutes.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-[16px]">
              12 questions across Finance, Sales, Operations, and People. Answer
              honestly — your personalised report generates on submit.
            </p>
          </div>

          {/* Wizard */}
          <div className="mt-14">
            <DiagnosticWizard />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}