import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import DiagnosticWizard from "@/components/diagnostic/DiagnosticWizard";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Operational Health Diagnostic — SGC Tech AI",
  description:
    "Score your operations in 8 minutes. 12 questions across Finance, Sales, Operations, and People. Get a personalised report with prioritised next moves.",
  alternates: { canonical: "/diagnostic" },
  robots: { index: true, follow: true },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "Operational Health Diagnostic — SGC Tech AI",
  description:
    "A free 8-minute diagnostic that scores your business across Finance, Sales, Operations, and People, and produces a personalised report with prioritised next moves.",
  url: "https://sgctech.ai/diagnostic",
  isPartOf: {
    "@type": "WebSite",
    name: "SGC Tech AI",
    url: "https://sgctech.ai",
  },
  publisher: {
    "@type": "Organization",
    name: "SGC Tech AI",
    legalName: "Scholarix Global Consultant FZE",
    url: "https://sgctech.ai",
  },
};

export default function DiagnosticPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
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