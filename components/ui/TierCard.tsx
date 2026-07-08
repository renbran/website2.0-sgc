// Section: Imports
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import GlassCard from "@/components/ui/GlassCard";

interface TierFeature {
  label: string;
  included: boolean;
}

interface TierCardProps {
  name: string;
  implementationPrice: string;
  monthlyPrice: string;
  features: TierFeature[];
  isPopular?: boolean;
  delay?: number;
  payback?: string;
}

export default function TierCard({
  name,
  implementationPrice,
  monthlyPrice,
  features,
  isPopular = false,
  delay = 0,
  payback,
}: TierCardProps) {
  return (
    <RevealOnScroll delay={delay} className="relative h-full">
      {isPopular ? (
        <span
          style={{ fontFamily: "var(--font-outfit)" }}
          className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-sm bg-[image:var(--sgc-gradient-brand)] px-4 py-1 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-[var(--sgc-black)] shadow-[0_0_18px_rgba(199,162,58,0.4)]"
        >
          Most Popular
        </span>
      ) : null}
      <GlassCard as="article" featured={isPopular} className="h-full">
      <div
        className={`relative flex h-full min-h-[36rem] flex-col rounded-2xl border bg-[var(--surface)] p-6 transition duration-300 ease-out hover:-translate-y-[3px] hover:border-[rgba(199,162,58,0.35)] hover:shadow-[0_8px_32px_rgba(199,162,58,0.12)] ${
          isPopular
            ? "border-[var(--accent)] shadow-[0_0_30px_rgba(199,162,58,0.25)]"
            : "border-[var(--border)]"
        }`}
      >

        <h3
          style={{ fontFamily: "var(--font-outfit)" }}
          className="text-[1.25rem] font-bold text-[var(--sgc-text-primary)]"
        >
          {name}
        </h3>
        {payback && (
          <p style={{ fontFamily: "var(--font-outfit)" }} className="mt-1 text-[0.72rem] text-[rgba(199,162,58,0.7)]">
            {payback}
          </p>
        )}

        <p
          style={{ fontFamily: "var(--font-outfit)" }}
          className="mt-4 text-gold-gradient text-[clamp(2rem,3vw,2.5rem)] font-extrabold"
        >
          {implementationPrice}
        </p>
        <p className="mt-1 text-[0.85rem] text-[var(--sgc-text-muted)]">one-time implementation</p>
        <p className="mt-0.5 font-mono text-[0.72rem] tracking-[0.12em] text-[rgba(199,162,58,0.5)]">
          + platform subscription · always paired
        </p>

        <div className="my-4 h-px w-full bg-[rgba(255,255,255,0.08)]" />

        <p
          style={{ fontFamily: "var(--font-outfit)" }}
          className="text-[1rem] font-bold text-[var(--sgc-text-primary)]"
        >
          {monthlyPrice}
          <span className="ml-2 text-[0.85rem] font-normal text-[var(--sgc-text-muted)]">
            /mo platform subscription
          </span>
        </p>

        <div className="my-4 h-px w-full bg-[rgba(255,255,255,0.08)]" />

        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature.label} className="flex items-start gap-2 text-[0.9rem] font-medium">
              <span className={feature.included ? "text-[var(--accent-sage)]" : "text-[rgba(255,120,120,0.7)]"}>
                {feature.included ? "✓" : "✕"}
              </span>
              <span className={feature.included ? "text-[var(--sgc-text-primary)]" : "text-[var(--sgc-text-muted)]"}>
                {feature.label}
              </span>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="mt-auto inline-flex w-full items-center justify-center rounded-full border border-[rgba(199,162,58,0.28)] bg-transparent px-4 py-3 text-[0.9rem] font-semibold text-[var(--sgc-cyan)] transition duration-300 ease-out hover:border-[var(--sgc-cyan)] hover:bg-[rgba(199,162,58,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sgc-cyan)]"
        >
          Get Started
        </a>
      </div>
      </GlassCard>
    </RevealOnScroll>
  );
}
