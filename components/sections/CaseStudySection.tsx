import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import StatCounter from "@/components/ui/StatCounter";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import LivingCard from "@/components/ui/LivingCard";
import FlippingCard from "@/components/ui/FlippingCard";
import PremiumEditorialSection from "@/components/ui/PremiumEditorialSection";
import { CASE_STUDIES } from "@/content/canonical-facts";

const osus = CASE_STUDIES.find((c) => c.client === "OSUS Real Estate")!;
const axCapital = CASE_STUDIES.find((c) => c.client === "AX Capital")!;

type StatItem = {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  displayValue?: string;
  /** Shown on the back face of the flip card — methodology / source. */
  method?: string;
};

const stats: StatItem[] = [
  {
    value: 445,
    suffix: "%",
    label: "First-Year ROI",
    sublabel: "OSUS Real Estate, Year 1",
    method: "First-year net savings (AED 1.64M) against total investment. Sourced from the signed OSUS Real Estate case study.",
  },
  {
    value: 72,
    suffix: "M",
    prefix: "AED ",
    label: "Invoices Recovered",
    sublabel: "AX Capital, 7 months",
    method: "2020–2022 uncollected invoices recovered via the automated commission engine and reconciliation build. Sourced from the signed AX Capital case study.",
  },
  {
    value: 2.2,
    suffix: " mo",
    displayValue: "2.2",
    label: "Payback Period",
    sublabel: "OSUS Real Estate, Year 1",
    method: "Time for first-year net savings to exceed total investment. Sourced from the signed OSUS Real Estate case study.",
  },
  {
    value: 75,
    suffix: "%",
    label: "Manual Work Reduction",
    sublabel: "OSUS Real Estate",
    method: "Reduction in the 247.5 staff-hours/week previously spent on manual admin, measured post-go-live. Sourced from the signed OSUS Real Estate case study.",
  },
];

const comparisonRows = [
  {
    metric: "Monthly close",
    before: "8–12 working days",
    after: "3–5 working days",
  },
  {
    metric: "Commission / payroll cycle",
    before: "4–7 days, manual",
    after: "1–2 days, automated",
  },
  {
    metric: "Real-time business visibility",
    before: "Monthly close only",
    after: "Daily dashboard, live KPIs",
  },
  {
    metric: "Compliance reporting (RERA/VAT)",
    before: "Manual quarterly scramble",
    after: "One-click, audit-ready",
  },
  {
    metric: "Lead-to-deal traceability",
    before: "WhatsApp + memory",
    after: "Full CRM trail with AI scoring",
  },
];

export default function CaseStudySection() {
  return (
    <section
      id="case-study"
      aria-label="PROOF"
      className="scroll-mt-20 bg-[var(--bg)] pt-10 pb-14 md:pt-14 md:pb-20"
    >
      <GoldDrawIn />
      <RevealOnScroll>
        <SectionEyebrow label="PROOF" />
      </RevealOnScroll>

      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div className="my-16 grid items-start gap-6 sm:gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <RevealOnScroll
              key={stat.label}
              delay={index * 0.08}
              focusPull
              className={
                index === 1
                  ? "sm:mt-8 xl:mt-12"
                  : index === 2
                    ? "sm:mt-2 xl:mt-6"
                    : index === 3
                      ? "sm:mt-10 xl:mt-4"
                      : ""
              }
            >
              <LivingCard>
                <FlippingCard
                  width={320}
                  height={210}
                  flipLabel={`How ${stat.label} is measured`}
                  frontContent={
                    <>
                      <p
                        style={{ fontFamily: "var(--font-inter)" }}
                        className="text-gold-gradient text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-none"
                      >
                        {stat.displayValue ? (
                          <>
                            {stat.prefix}
                            {stat.displayValue}
                            {stat.suffix}
                          </>
                        ) : (
                          <StatCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                        )}
                      </p>
                      <p className="mt-3 text-[0.85rem] font-medium uppercase tracking-[0.18em] text-[var(--sgc-text-muted)]">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-[0.78rem] text-[var(--sgc-text-muted)]">{stat.sublabel}</p>
                    </>
                  }
                  backContent={
                    <>
                      <p
                        style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
                        className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--accent)]"
                      >
                        Methodology
                      </p>
                      <p className="mt-3 text-[0.88rem] leading-[1.6] text-text-secondary">
                        {stat.method ?? "Verification details on request under NDA."}
                      </p>
                    </>
                  }
                />
              </LivingCard>
            </RevealOnScroll>
          ))}
        </div>

      </div>

      {/* Premium Editorial Layout — Case Study with image + narrative */}
      <PremiumEditorialSection
        nested
        id="case-study-editorial"
        heading={`${osus.client}: full ERP deployment for an 11-person brokerage.`}
        subheading="Verified outcome · named client, on record"
        imageSrc="/images/sections/human-tech-team.jpg"
        imageAlt="Technology team collaborating in a modern office, representing the real results of digital transformation"
        imageCaption="Illustrative image · figures below from the signed OSUS Real Estate case study"
        layout="lumiere"
        background="dark"
        pullQuote={osus.quote}
        pullQuoteAttribution={osus.quoteAttribution}
        ctaText="Discover the story"
        ctaHref="#contact"
      >
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent-teal)]">
          What&apos;s possible at scale · named client
        </p>
        <h3
          style={{ fontFamily: "var(--font-fraunces)" }}
          className="mt-3 text-[clamp(1.25rem,2vw,1.5rem)] font-bold text-[var(--accent)]"
        >
          {osus.client} · {osus.scale}
        </h3>
        <p className="mt-3">
          {osus.legalEntity} was running on spreadsheets, handwritten records, and a Bitrix CRM
          disconnected from accounting, invoicing, or deal management — an estimated 247.5
          staff-hours a week lost to manual admin. SGC implemented an end-to-end Odoo ERP,
          integrating Bitrix rather than replacing it.
        </p>
        <p>
          The numbers below are from year one of live operation — verified, not projected. Full
          audit trail and a reference call are available on request.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p
              style={{ fontFamily: "var(--font-inter)" }}
              className="text-[1.5rem] font-extrabold text-[var(--accent)]"
            >
              {osus.metrics.revenueProcessed}
            </p>
            <p className="mt-1 text-[0.78rem] text-[var(--sgc-text-muted)]">Brokerage revenue processed through ERP</p>
          </div>
          <div>
            <p
              style={{ fontFamily: "var(--font-inter)" }}
              className="text-[1.5rem] font-extrabold text-[var(--accent)]"
            >
              {osus.metrics.firstYearNetSavings}
            </p>
            <p className="mt-1 text-[0.78rem] text-[var(--sgc-text-muted)]">First-year net savings</p>
          </div>
          <div>
            <p
              style={{ fontFamily: "var(--font-inter)" }}
              className="text-[1.5rem] font-extrabold text-[var(--accent)]"
            >
              {osus.metrics.firstYearRoi}
            </p>
            <p className="mt-1 text-[0.78rem] text-[var(--sgc-text-muted)]">Year-1 ROI</p>
          </div>
          <div>
            <p
              style={{ fontFamily: "var(--font-inter)" }}
              className="text-[1.5rem] font-extrabold text-[var(--accent)]"
            >
              {osus.metrics.paybackPeriod}
            </p>
            <p className="mt-1 text-[0.78rem] text-[var(--sgc-text-muted)]">Payback</p>
          </div>
        </div>
        <p className="mt-4">
          Client named and quoted with consent. Full case study and reference call available on request.
        </p>
      </PremiumEditorialSection>

      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <RevealOnScroll focusPull>
          <p className="mb-4 text-[0.85rem] font-medium text-[var(--sgc-text-muted)]">
            What 90 days of operation looked like, before and after implementation.
          </p>
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="hidden md:block">
              <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-4 border-b border-[var(--border)] px-6 py-4">
                <p
                  style={{ fontFamily: "var(--font-inter)" }}
                  className="text-[0.85rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]"
                >
                  Metric
                </p>
                <p
                  style={{ fontFamily: "var(--font-inter)" }}
                  className="text-[0.85rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]"
                >
                  Before
                </p>
                <p
                  style={{ fontFamily: "var(--font-inter)" }}
                  className="text-[0.85rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]"
                >
                  After
                </p>
              </div>
              {comparisonRows.map((row) => (
                <div
                  key={row.metric}
                  className="grid grid-cols-[1.3fr_1fr_1fr] gap-4 border-b border-[var(--hairline-faint)] px-6 py-4 last:border-none"
                >
                  <p className="text-[0.95rem] text-[var(--sgc-text-primary)]">{row.metric}</p>
                  <p className="text-[0.95rem] text-[var(--sgc-text-muted)]">{row.before}</p>
                  <p className="text-[0.95rem] text-[var(--accent-sage)]">{row.after}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 p-5 md:hidden">
              {comparisonRows.map((row) => (
                <article
                  key={row.metric}
                  className="rounded-xl border border-[var(--hairline-faint)] bg-[var(--surface-glass)] p-4"
                >
                  <h3
                    style={{ fontFamily: "var(--font-fraunces)" }}
                    className="text-[1rem] font-semibold text-[var(--sgc-text-primary)]"
                  >
                    {row.metric}
                  </h3>
                  <p className="mt-3 text-[0.92rem] text-[var(--sgc-text-muted)]">Before: {row.before}</p>
                  <p className="mt-2 text-[0.92rem] text-[var(--accent-sage)]">After: {row.after}</p>
                </article>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <LivingCard>
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
            <p
              style={{ fontFamily: "var(--font-inter)" }}
              className="text-center text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent-copper)]"
            >
              {axCapital.client} · verified outcome
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p
                  style={{ fontFamily: "var(--font-inter)" }}
                  className="text-gold-gradient text-[1.5rem] font-bold"
                >
                  {axCapital.metrics.invoicesRecovered.value} recovered
                </p>
                <p className="mt-2 text-[0.9rem] text-[var(--sgc-text-muted)]">
                  {axCapital.metrics.invoicesRecovered.basis}
                </p>
              </div>
              <div>
                <p
                  style={{ fontFamily: "var(--font-inter)" }}
                  className="text-gold-gradient text-[1.5rem] font-bold"
                >
                  {axCapital.metrics.reconciliationTimeChange} reconciliation time
                </p>
                <p className="mt-2 text-[0.9rem] text-[var(--sgc-text-muted)]">
                  {axCapital.metrics.commissionDisputeChange} commission disputes ·{" "}
                  {axCapital.metrics.agentRetentionChange} agent retention
                </p>
              </div>
            </div>
            <p className="mt-8 text-center text-[0.85rem] font-medium text-[var(--sgc-text-muted)]">
              Recovery timeline:{" "}
              <span className="font-semibold text-[var(--sgc-text-primary)]">
                {axCapital.metrics.invoicesRecovered.window}
              </span>
              , {axCapital.scale}. Reference call available on request.
            </p>
          </div>
          </LivingCard>
        </RevealOnScroll>
      </div>
    </section>
  );
}
