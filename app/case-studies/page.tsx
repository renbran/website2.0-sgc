import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import CtaButton from "@/components/ui/CtaButton";
import { JsonLd } from "@/components/JsonLd";
import { collectionPageSchema, graph } from "@/lib/schema";
import { CASE_STUDIES_HUB, CASE_STUDY_PAGES } from "@/content/case-studies";

export const metadata: Metadata = {
  title: CASE_STUDIES_HUB.title,
  description: CASE_STUDIES_HUB.description,
  alternates: { canonical: "/case-studies" },
  robots: { index: true, follow: true },
  keywords: [
    "Odoo case studies UAE",
    "ERP case study Dubai",
    "Odoo ROI case study",
    "real estate brokerage ERP case study",
    "construction ERP case study UAE",
    "anonymized client case studies",
  ],
  openGraph: {
    title: CASE_STUDIES_HUB.title,
    description: CASE_STUDIES_HUB.description,
    url: "https://sgctech.ai/case-studies",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: CASE_STUDIES_HUB.title,
    description: CASE_STUDIES_HUB.description,
    images: ["/opengraph-image"],
  },
  other: {
    datePublished: CASE_STUDIES_HUB.publishedDate,
    dateModified: CASE_STUDIES_HUB.updatedDate,
  },
};

export default function CaseStudiesHubPage() {
  return (
    <>
      <Navbar />
      <JsonLd
        data={graph([
          collectionPageSchema({
            name: "Case Studies — verified Odoo & AI outcomes",
            description: CASE_STUDIES_HUB.description,
            path: "/case-studies",
            items: CASE_STUDY_PAGES.map((p) => ({ name: p.publicLabel, slug: p.slug })),
            itemBase: "/case-studies",
            itemIdSuffix: "#article",
          }),
        ])}
      />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
        ]}
      />
      <main id="main" className="relative min-h-screen w-full bg-[var(--sgc-gradient-bg)] pt-28 pb-24 md:pt-36 md:pb-32">
        <GoldDrawIn />
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent-copper)]"
          >
            PROOF · CASE STUDIES
          </p>
          <h1
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="mt-3 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.1] text-[var(--sgc-text-primary)]"
          >
            {CASE_STUDIES_HUB.h1}
          </h1>
          <p className="mt-6 max-w-3xl text-[1.1rem] font-medium leading-[1.65] text-[var(--sgc-text-primary)]">
            {CASE_STUDIES_HUB.intro}
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {CASE_STUDY_PAGES.map((p) => (
              <article
                key={p.slug}
                className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition duration-300 ease-out hover:-translate-y-[3px] hover:border-[var(--accent-strong)]"
              >
                <p
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--accent)]"
                >
                  {p.sector}
                </p>
                <h2
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  className="mt-3 text-[1.15rem] font-bold leading-[1.3] text-[var(--sgc-text-primary)]"
                >
                  {p.publicLabel}
                </h2>
                <p className="mt-2 text-[0.88rem] leading-[1.6] text-[var(--sgc-text-muted)]">{p.headline}</p>
                <dl className="mt-5 space-y-2">
                  {p.cardMetrics.map((m) => (
                    <div key={m.label} className="flex items-baseline justify-between gap-3">
                      <dt className="text-[0.78rem] text-[var(--sgc-text-muted)]">{m.label}</dt>
                      <dd className="text-[0.95rem] font-bold text-[var(--accent)]">{m.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-auto pt-6">
                  <Link
                    href={`/case-studies/${p.slug}`}
                    className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)] underline underline-offset-[6px] decoration-1 transition-all hover:decoration-2"
                  >
                    Read the case study →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-10 max-w-3xl text-[0.88rem] leading-[1.7] text-[var(--sgc-text-muted)]">
            Clients are anonymized on request. The full audit trail behind every figure, and a
            reference call with the client, are arranged under NDA after Discovery.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <CtaButton href="/contact">Book a Discovery Call →</CtaButton>
            <Link
              href="/diagnostic"
              className="text-[0.85rem] font-semibold text-[var(--accent)] underline underline-offset-[6px] decoration-1 transition-all hover:decoration-2"
            >
              Start with the free diagnostic →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
