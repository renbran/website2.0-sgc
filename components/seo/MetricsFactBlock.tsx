// Visible machine-readable fact block (SEO Phase 2.3).
//
// Renders a semantic <dl> with every headline number the public site wants
// answer engines to be able to quote: sales volume processed through the ERP,
// real-estate invoices recovered, typical Year-1 ROI, typical payback
// period, and the implementation price range. Each metric is paired with its
// source citation so a human reader can verify the claim without leaving the
// page.
//
// Critical SEO rules:
//   • Visible, NOT hidden. Hidden text violates guidelines and the SEO
//     prompt's "no-fabrication" rule — the block must be genuinely seen by
//     a human visitor.
//   • Values are sourced from METRICS in canonical-facts.ts (CASE_STUDIES +
//     PRICING), so every number on the page still traces back to a signed
//     case study or the business-model package. No fabrication.
//   • Server-renders the final value (no client-side count-up wrapping),
//     so crawlers and AI answer engines read the real numbers in raw HTML.

import { METRICS } from "@/content/canonical-facts";

const ITEMS = [
  METRICS.salesVolumeProcessed,
  METRICS.realEstateDeals,
  METRICS.year1Roi,
  METRICS.paybackMonths,
  METRICS.implementationPriceRange,
];

export default function MetricsFactBlock() {
  return (
    <section
      id="proof-by-numbers"
      aria-labelledby="proof-by-numbers-heading"
      className="bg-[var(--bg)] py-14 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]"
          >
            Verified outcomes
          </p>
          <h2
            id="proof-by-numbers-heading"
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="mt-3 text-[clamp(1.65rem,3.5vw,2.5rem)] font-bold leading-[1.15] text-[var(--text-primary)]"
          >
            Headline numbers, every one of them sourced.
          </h2>
          <p
            style={{ fontFamily: "var(--font-inter)" }}
            className="mt-4 text-[1rem] leading-[1.7] text-[var(--text-secondary)]"
          >
            Every metric below is sourced from a signed client case study or
            the business-model package — and stays anchored there. We do not
            publish aggregate figures that aren&apos;t traceable to a single
            named engagement.
          </p>
        </div>

        {/* Semantic <dl>: each value is genuinely visible AND machine-readable
            in pre-hydration HTML — answer engines and crawlers can quote
            these directly. */}
        <dl className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ITEMS.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition duration-300 hover:border-[var(--accent-strong)]"
            >
              <dt
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]"
              >
                {item.label}
              </dt>
              <dd
                style={{ fontFamily: "var(--font-fraunces)" }}
                className="mt-3 text-gold-gradient text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-none"
              >
                {item.value}
              </dd>
              <p
                style={{ fontFamily: "var(--font-mono)" }}
                className="mt-3 text-[0.7rem] leading-[1.55] text-[var(--text-muted)]"
              >
                {item.source}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
