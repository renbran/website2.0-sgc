// Section: Imports
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import LivingCard from "@/components/ui/LivingCard";
import { PRICING, CASE_STUDIES } from "@/content/canonical-facts";

const osus = CASE_STUDIES.find((c) => c.client === "OSUS Real Estate")!;

const layers = [Object.values(PRICING)[0], Object.values(PRICING)[1], Object.values(PRICING)[2]];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="scroll-mt-20 bg-[var(--sgc-gradient-bg)] pt-10 pb-14 md:pt-14 md:pb-20"
    >
      <GoldDrawIn />
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <RevealOnScroll>
          <SectionEyebrow label="FEES" />
          <h2
            id="pricing-heading"
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="max-w-4xl text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-[1.1] text-[var(--sgc-text-primary)]"
          >
            Three layers. Fixed prices. No surprises.
          </h2>
          <p
            style={{ fontFamily: "var(--font-inter)" }}
            className="mt-5 max-w-[42rem] text-[clamp(1.05rem,1.4vw,1.35rem)] font-medium leading-[1.5] text-[var(--sgc-text-muted)]"
          >
            Implementation is the one-time build. The AMC and Subscription are the recurring
            layers that keep the system maintained, compliant, and supported.{" "}
            All prices in AED, exclusive of 5% VAT.
          </p>
        </RevealOnScroll>

        <div className="my-16 grid gap-6 md:grid-cols-3">
          {layers.map((layer, index) => (
            <RevealOnScroll key={layer.label} delay={index * 0.08}>
              <LivingCard>
                <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition duration-300 ease-out hover:-translate-y-[3px] hover:border-[var(--accent-strong)] hover:shadow-[0_8px_32px_var(--accent-glow)]">
                  <p
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent-copper)]"
                  >
                    {layer.tagline}
                  </p>
                  <h3
                    style={{ fontFamily: "var(--font-fraunces)" }}
                    className="mt-2 text-[1.15rem] font-bold text-[var(--sgc-text-primary)]"
                  >
                    {layer.label}
                  </h3>
                  <p
                    style={{ fontFamily: "var(--font-inter)" }}
                    className="text-gold-gradient mt-4 text-[clamp(1.5rem,2.5vw,2rem)] font-extrabold leading-none"
                  >
                    {layer.price}
                  </p>
                  <p className="mt-4 flex-1 text-[0.88rem] leading-[1.6] text-[var(--sgc-text-muted)]">
                    {layer.detail}
                  </p>
                  <a
                    href="#contact"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-[var(--accent-border)] bg-transparent px-4 py-3 text-[0.9rem] font-semibold text-[var(--accent)] transition duration-300 ease-out hover:border-[var(--accent)] hover:bg-[var(--accent-faint)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    Get Started
                  </a>
                </div>
              </LivingCard>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.35}>
          <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
            <p
              style={{ fontFamily: "var(--font-inter)" }}
              className="text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent-teal)]"
            >
              {osus.client} · verified outcome
            </p>
            <p
              style={{ fontFamily: "var(--font-inter)" }}
              className="mt-3 text-[clamp(1.4rem,2.5vw,2rem)] font-bold text-[var(--sgc-text-primary)]"
            >
              {osus.metrics.firstYearRoi} first-year ROI, paid back in {osus.metrics.paybackPeriod}
            </p>
            <p className="mt-2 text-[0.85rem] text-[var(--sgc-text-muted)]">
              {osus.metrics.firstYearNetSavings} in first-year net savings on {osus.scale}. Full case
              study and reference call available on request.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
