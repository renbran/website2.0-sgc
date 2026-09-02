import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { JsonLd } from "@/components/JsonLd";
import { collectionPageSchema, graph } from "@/lib/schema";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import LivingCard from "@/components/ui/LivingCard";

const DESCRIPTION =
  "Odoo implementation and rescue, AI automation for finance, UAE Corporate Tax configuration, and financial reporting — fixed prices, published, no hidden fees.";

export const metadata: Metadata = {
  title: "Services — SGC Tech AI",
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Services — SGC Tech AI",
    description: DESCRIPTION,
    url: "https://sgctech.ai/services",
    type: "website",
    // Route-level `openGraph` replaces (not merges with) the root layout's
    // openGraph object, so the shared /opengraph-image must be re-declared
    // here — otherwise this page silently ships with no social preview image.
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — SGC Tech AI",
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

const SERVICES = [
  {
    slug: "odoo-implementation-uae",
    question: "How much does Odoo implementation cost in the UAE?",
    summary: "Fixed pricing: AED 14,000 foundation, mandatory 20%/year AMC, and an AED 875/month subscription tier.",
  },
  {
    slug: "odoo-implementation-rescue",
    question: "How do you fix a failed Odoo implementation?",
    summary: "A 6-stage recovery methodology: Stabilize, Audit, Recovery Plan, Rescue/Rebuild, Validate, Handover.",
  },
  {
    slug: "ai-automation-finance",
    question: "Which finance tasks can AI automate in 2026?",
    summary: "Invoice extraction, document summarization, and decision routing — each with a defined human-review tier.",
  },
  {
    slug: "uae-corporate-tax-compliance",
    question: "How do you configure UAE Corporate Tax in Odoo?",
    summary: "0% to AED 375,000, 9% above it, Small Business Relief, and QFZP income segregation — built in, not bolted on.",
  },
  {
    slug: "outsourced-financial-reporting",
    question: "What does outsourced financial reporting cost in Dubai?",
    summary: "No standalone retainer — reporting is built into Implementation and kept current under the AMC.",
  },
];

export default function ServicesIndexPage() {
  return (
    <>
      <Navbar />
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]} />
      <JsonLd
        data={graph([
          collectionPageSchema({
            name: "Services",
            description: DESCRIPTION,
            path: "/services",
            items: SERVICES.map((s) => ({ name: s.question, slug: s.slug })),
          }),
        ])}
      />
      <main className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
        <GoldDrawIn />
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <SectionEyebrow label="SERVICES" />
          <h1
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.1] text-[var(--sgc-text-primary)]"
          >
            Answers, not brochures.
          </h1>
          <p className="mt-4 max-w-2xl text-[1.05rem] leading-[1.7] text-[var(--sgc-text-muted)]">
            The questions we actually get asked in Discovery, answered in full — with published prices
            and figures sourced from real client engagements.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <LivingCard key={s.slug}>
                <a
                  href={`/services/${s.slug}`}
                  className="block h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition duration-300 ease-out hover:-translate-y-[3px] hover:border-[var(--accent-strong)]"
                >
                  <h2
                    style={{ fontFamily: "var(--font-fraunces)" }}
                    className="text-[1.15rem] font-bold text-[var(--sgc-text-primary)]"
                  >
                    {s.question}
                  </h2>
                  <p className="mt-2 text-[0.9rem] leading-[1.6] text-[var(--sgc-text-muted)]">{s.summary}</p>
                  <span className="mt-4 inline-block text-[0.85rem] font-semibold text-[var(--accent)]">
                    Read the answer →
                  </span>
                </a>
              </LivingCard>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
