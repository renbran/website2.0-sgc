import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import LivingCard from "@/components/ui/LivingCard";
import ScrollParallax from "@/components/ui/ScrollParallax";
import PremiumEditorialSection from "@/components/ui/PremiumEditorialSection";

const outcomePillars = [
  {
    icon: "◈",
    heading: "Financial Visibility",
    body: "Live dashboards instead of month-end reports. Cash position, pipeline, and project burn in real time — so decisions happen on facts, not on Thursday's close.",
  },
  {
    icon: "✓",
    heading: "Compliance Assurance",
    body: "VAT, Corporate Tax, RERA, PDPL, and goAML built into delivery from day one — not retrofitted under pressure when an audit arrives.",
  },
  {
    icon: "⏱",
    heading: "Operational Reclaim",
    body: "Hours spent on manual data entry, commission calculations, and document processing — returned to your team and redirected toward work that moves the business.",
  },
];

const stackLayers = [
  { label: "AI Operating Layer", detail: "Chat · Voice · Document · Finance · Compliance" },
  { label: "Central AI Brain · Routing & Reasoning", detail: null },
  { label: "Odoo v17–v19 Core", detail: "CRM · Sales · Accounting · HR · Inventory · Real Estate · Construction · Custom Modules" },
  { label: "Integration & Reporting", detail: "PostgreSQL · n8n · Make · Power BI" },
  { label: "Infrastructure", detail: "AWS / Azure Middle East · Security · Daily Backups" },
];

export default function SolutionSection() {
  return (
    <section
      id="solution"
      aria-label="THE SOLUTION"
      className="relative scroll-mt-20 bg-[var(--bg)] pt-10 pb-14 md:pt-14 md:pb-20"
    >
      <ScrollParallax amplitude={16} className="pointer-events-none absolute inset-0">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_100%,rgba(63,169,245,0.04)_0%,transparent_65%)]" />
      </ScrollParallax>
      <GoldDrawIn />

      <RevealOnScroll>
        <SectionEyebrow label="THE SOLUTION" />
      </RevealOnScroll>
      <PremiumEditorialSection
        nested
        id="solution-editorial"
        heading="The system that fits how you work."
        subheading="Diagnosis first · implementation second · maintenance always"
        imageSrc="/images/sections/solution-dashboard.jpg"
        imageAlt="SGC AI operations dashboard showing financial intelligence, compliance status, and workflow automation"
        imageCaption="AI-powered system · real-time dashboard · automated compliance"
        layout="lumiere"
        background="dark"
        pullQuote="Audit → implementation → ongoing maintenance: the diagnosis fixes what your numbers say is broken, not what a vendor says should be built."
        pullQuoteAttribution="SGC Tech AI · Diagnostic Framework"
        ctaText="Discover the story"
        ctaHref="#contact"
      >
        <p>
          Three outcomes — <span className="font-semibold text-[var(--accent)]">financial
          visibility, compliance assurance, operational reclaim</span> — delivered as one system,
          not a stack of demos.
        </p>
        <p>
          We audit your operations before we propose a solution. The result is a system that fits how
          you work — not how a vendor demo works. Implementation is just one outcome from the audit.
          Maintenance and compliance are the other two.
        </p>
        <p>
          The diagnosis fixes what your numbers say is broken, not what a vendor says should be built.
          This is the difference between a system that runs your business and a system that runs itself.
        </p>
      </PremiumEditorialSection>

      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        {/* Three outcome pillars */}
        <div className="mt-14 grid items-start gap-6 md:gap-8 md:grid-cols-3">
          {outcomePillars.map((pillar, index) => (
            <RevealOnScroll
              key={pillar.heading}
              delay={index * 0.1}
              focusPull
              className={index === 0 ? "md:mt-0" : index === 1 ? "md:mt-10 lg:mt-14" : "md:mt-4 lg:mt-6"}
            >
              <LivingCard>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 transition duration-300 ease-out hover:border-[var(--accent-border)]">
                <p
                  aria-hidden
                  className="text-[1.5rem] text-[var(--accent)] opacity-70"
                >
                  {pillar.icon}
                </p>
                <h3
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  className="mt-4 text-[1.25rem] font-bold leading-[1.25] text-[var(--sgc-text-primary)]"
                >
                  {pillar.heading}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-[1.7] text-[var(--sgc-text-muted)]">
                  {pillar.body}
                </p>
              </article>
              </LivingCard>
            </RevealOnScroll>
          ))}
        </div>

        {/* Optional tech-stack disclosure */}
        <RevealOnScroll delay={0.2}>
          <details className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <summary
              style={{ fontFamily: "var(--font-inter)" }}
              className="cursor-pointer select-none px-6 py-4 text-[0.9rem] font-semibold text-[var(--sgc-text-muted)] transition duration-200 hover:text-[var(--sgc-text-primary)]"
            >
              What we build on →
            </summary>
            <div className="border-t border-[var(--border)] px-6 pb-6 pt-4">
              <div className="mx-auto max-w-2xl space-y-3">
                {stackLayers.map((layer, i) => (
                  <div
                    key={layer.label}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface-high)] px-5 py-3"
                  >
                    <p
                      style={{ fontFamily: "var(--font-inter)" }}
                      className="text-[0.9rem] font-semibold text-[var(--sgc-text-primary)]"
                    >
                      {layer.label}
                    </p>
                    {layer.detail && (
                      <p className="mt-1 text-[0.8rem] text-[var(--sgc-text-muted)]">{layer.detail}</p>
                    )}
                    {i < stackLayers.length - 1 && (
                      <div aria-hidden className="mx-auto mt-3 h-4 w-px bg-gradient-to-b from-[var(--border)] to-transparent" />
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-center text-[0.78rem] text-[var(--sgc-text-muted)]">
                Vendor-neutral AI (OpenAI · Anthropic · Google) · Open-source ERP foundation · Contracted SLA
              </p>
            </div>
          </details>
        </RevealOnScroll>
      </div>
    </section>
  );
}
