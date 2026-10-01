import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

export const metadata: Metadata = {
  title: "Subscription terms — SGC Tech AI",
  description: "The agreements that apply to an SGC subscription: Master Subscription Agreement, Service Description and Rate Card, SLA and DPA.",
  alternates: { canonical: "/legal/subscription" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Subscription terms — SGC Tech AI",
    description: "Master Subscription Agreement, Service Description and Rate Card, SLA and DPA — the agreements that apply to an SGC subscription.",
    url: "/legal/subscription",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subscription terms — SGC Tech AI",
    description: "Master Subscription Agreement, Service Description and Rate Card, SLA and DPA — the agreements that apply to an SGC subscription.",
  },
};

// Linked from every Order Form (sgc_layer3_bridge.terms_url).
const DOCUMENTS = [
  {
    title: "Master Subscription Agreement",
    ref: "SGC-MSA-2026-02",
    href: "/legal/SGC-MSA-2026-02-Rev3.pdf",
    summary: "The main terms: the service, fees and billing, payment and account states, term, notice and exit.",
  },
  {
    title: "Service Description and Rate Card",
    ref: "SGC-SD-2026-01",
    href: "/legal/SGC-SD-2026-01.pdf",
    summary: "What the service includes, fair use, account states, and the rate card: prices, billing cycles and rebates.",
  },
  {
    title: "Service Level Agreement",
    ref: "SGC-SLA-2026-02",
    href: "/legal/SGC-SLA-2026-02.pdf",
    summary: "Availability, support hours and response times, and service credits.",
  },
  {
    title: "Data Processing Agreement",
    ref: "SGC-DPA-2026-01",
    href: "/legal/SGC-DPA-2026-01-Rev2.pdf",
    summary: "How we process and protect the data you keep in your workspace.",
  },
];

export default function SubscriptionTermsPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="relative mx-auto max-w-3xl px-6 md:px-10">
          <div className="text-center">
            <SectionEyebrow label="LEGAL" />
            <h1 className="mt-4 font-fraunces text-4xl font-semibold leading-[1.05] text-[var(--text-primary)] md:text-5xl">
              Subscription <span className="text-gold-gradient">terms</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Your Order Form incorporates these agreements. They become binding when the Order Form is signed.
            </p>
          </div>
          <ul className="mt-12 space-y-4">
            {DOCUMENTS.map((doc) => (
              <li key={doc.ref} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <a href={doc.href} className="group block" target="_blank" rel="noopener">
                  <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    {doc.ref}
                  </span>
                  <span className="mt-1 block text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)]">
                    {doc.title} (PDF)
                  </span>
                  <span className="mt-1 block text-[0.9rem] text-[var(--text-secondary)]">{doc.summary}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
