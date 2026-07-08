import { TrendingUp, Sparkles, Target } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import CtaButton from "@/components/ui/CtaButton";

const PILLARS = [
  { icon: TrendingUp, title: "Strategic Growth", detail: "Built around the numbers you already have." },
  { icon: Sparkles, title: "Financial Confidence", detail: "Monthly close, audit-ready, no scrambling." },
  { icon: Target, title: "Operational Excellence", detail: "Systems your team can actually run." },
];

export default function AboutCTA() {
  return (
    <section
      id="about-cta"
      aria-labelledby="about-cta-heading"
      className="relative overflow-hidden bg-[var(--bg)] py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(199,162,58,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <RevealOnScroll>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="inline-block rounded-full border border-[rgba(199,162,58,0.3)] px-4 py-1.5 text-[0.68rem] font-semibold tracking-[0.18em] text-[var(--accent)]"
          >
            WHERE THIS STARTS
          </span>
          <h2
            id="about-cta-heading"
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] text-[var(--text-primary)]"
          >
            A first conversation. Nothing else, yet.
          </h2>
        </RevealOnScroll>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <RevealOnScroll key={pillar.title} delay={0.1 + i * 0.08}>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)]">
                    <Icon size={20} aria-hidden className="text-[var(--accent)]" />
                  </div>
                  <p className="text-[0.9rem] font-semibold text-[var(--text-primary)]">{pillar.title}</p>
                  <p className="text-[0.78rem] text-[var(--text-muted)]">{pillar.detail}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={0.3}>
          <div className="mt-12 flex justify-center">
            <CtaButton href="/contact" className="px-8">
              Schedule a First Conversation →
            </CtaButton>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.38}>
          <p
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="mt-14 text-[clamp(1.3rem,3vw,2rem)] font-bold text-[var(--text-primary)]"
          >
            Then the work.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
