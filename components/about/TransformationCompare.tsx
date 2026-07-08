import { CheckCircle2, X } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import LivingCard from "@/components/ui/LivingCard";

const TRADITIONAL = [
  { label: "Historical Reporting", detail: "Focus on past performance only" },
  { label: "Compliance-Only", detail: "Minimal strategic advisory" },
  { label: "Manual Processes", detail: "Limited automation capabilities" },
  { label: "Siloed Systems", detail: "Disconnected financial data" },
  { label: "Reactive Approach", detail: "Address problems after they arise" },
];

const SGC = [
  { label: "Predictive Intelligence", detail: "Forward-looking strategic insights" },
  { label: "CFO-Level Advisory", detail: "Strategic financial leadership & guidance" },
  { label: "AI-Powered Automation", detail: "Intelligent systems driving efficiency" },
  { label: "Integrated Ecosystem", detail: "Unified business intelligence platform" },
  { label: "Proactive Strategy", detail: "Anticipate challenges & opportunities" },
];

export default function TransformationCompare() {
  return (
    <section
      aria-labelledby="compare-heading"
      className="relative bg-[var(--sgc-black)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <RevealOnScroll>
          <div className="text-center">
            <SectionEyebrow label="WHAT&#39;S DIFFERENT" className="justify-center" />
            <h2
              id="compare-heading"
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.15] text-[var(--text-primary)]"
            >
              Compliance, or transformation.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <RevealOnScroll delay={0.05}>
            <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
              <p
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]"
              >
                Traditional Accounting Firm
              </p>
              <ul className="mt-5 space-y-4">
                {TRADITIONAL.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <X size={16} aria-hidden className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
                    <span>
                      <span className="block text-[0.92rem] font-medium text-[var(--text-secondary)]">
                        {item.label}
                      </span>
                      <span className="block text-[0.8rem] text-[var(--text-muted)]">
                        {item.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <LivingCard className="h-full">
              <div className="h-full rounded-2xl border border-[rgba(199,162,58,0.3)] bg-[var(--surface)] p-6 shadow-[0_6px_28px_rgba(199,162,58,0.06)] md:p-8">
                <p
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]"
                >
                  SGC — Transformation Partner
                </p>
                <ul className="mt-5 space-y-4">
                  {SGC.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <CheckCircle2
                        size={16}
                        aria-hidden
                        className="mt-0.5 shrink-0 text-[var(--accent)]"
                      />
                      <span>
                        <span className="block text-[0.92rem] font-medium text-[var(--text-primary)]">
                          {item.label}
                        </span>
                        <span className="block text-[0.8rem] text-[var(--text-secondary)]">
                          {item.detail}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </LivingCard>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
