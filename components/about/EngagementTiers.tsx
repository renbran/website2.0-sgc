import { Layers, TrendingUp, Building2, Check } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import LivingCard from "@/components/ui/LivingCard";

const TIERS = [
  {
    icon: Layers,
    name: "Starter",
    description: "For businesses establishing financial foundations",
    items: [
      { title: "Financial Visibility Setup", detail: "Clear reporting & dashboards" },
      { title: "Basic Compliance Framework", detail: "Essential regulatory alignment" },
      { title: "Process Documentation", detail: "Standard operating procedures" },
    ],
    period: "90 Days",
    recommended: false,
  },
  {
    icon: TrendingUp,
    name: "Growth",
    description: "For businesses ready to scale operations",
    items: [
      { title: "Full CFO Advisory", detail: "Strategic financial leadership" },
      { title: "ERP Implementation", detail: "Integrated systems architecture" },
      { title: "Advanced Automation", detail: "AI-powered business intelligence" },
      { title: "Operational Optimization", detail: "Process efficiency & scalability" },
    ],
    period: "6–12 Months",
    recommended: true,
  },
  {
    icon: Building2,
    name: "Enterprise",
    description: "For complex, multi-entity organizations",
    items: [
      { title: "Transformative CFO Partnership", detail: "Executive-level strategic advisory" },
      { title: "Full Digital Transformation", detail: "Complete technology ecosystem" },
      { title: "AI Intelligence Platform", detail: "Predictive analytics & automation" },
      { title: "Governance & Compliance Suite", detail: "Enterprise risk management" },
    ],
    period: "12–24 Months",
    recommended: false,
  },
];

export default function EngagementTiers() {
  return (
    <section
      aria-labelledby="tiers-heading"
      className="bg-[var(--bg)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <RevealOnScroll>
          <div className="text-center">
            <SectionEyebrow label="HOW WE ENGAGE" className="justify-center" />
            <h2
              id="tiers-heading"
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.15] text-[var(--text-primary)]"
            >
              Three engagements. One starting point.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[0.9rem] text-[var(--text-muted)]">
              We start where you are.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            const card = (
              <div
                className={`relative h-full rounded-2xl border p-6 md:p-7 ${
                  tier.recommended
                    ? "border-[var(--accent-strong)] bg-[var(--surface)] shadow-[0_10px_40px_var(--accent-faint)]"
                    : "border-[var(--border)] bg-[var(--surface)]"
                }`}
              >
                {tier.recommended && (
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="absolute -top-3 right-6 rounded-full bg-gold-gradient px-3 py-1 text-[0.62rem] font-bold tracking-[0.1em] text-[var(--bg)]"
                  >
                    RECOMMENDED
                  </span>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--sgc-black)]">
                  <Icon size={20} aria-hidden className="text-[var(--accent)]" />
                </div>
                <h3
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  className="mt-4 text-[1.3rem] font-bold text-[var(--text-primary)]"
                >
                  {tier.name}
                </h3>
                <p className="mt-1 text-[0.82rem] text-[var(--text-secondary)]">{tier.description}</p>

                <p
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]"
                >
                  Core Value Delivered
                </p>
                <ul className="mt-3 space-y-3 border-t border-[var(--border)] pt-4">
                  {tier.items.map((item) => (
                    <li key={item.title} className="flex items-start gap-2.5">
                      <Check size={14} aria-hidden className="mt-0.5 shrink-0 text-[var(--accent)]" />
                      <span>
                        <span className="block text-[0.85rem] font-medium text-[var(--text-primary)]">
                          {item.title}
                        </span>
                        <span className="block text-[0.72rem] text-[var(--text-muted)]">
                          {item.detail}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <span className="text-[0.75rem] text-[var(--text-muted)]">Engagement Period</span>
                  <span className="text-[0.85rem] font-semibold text-[var(--accent)]">{tier.period}</span>
                </div>
              </div>
            );

            return (
              <RevealOnScroll key={tier.name} delay={i * 0.1}>
                {tier.recommended ? <LivingCard className="h-full">{card}</LivingCard> : card}
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
