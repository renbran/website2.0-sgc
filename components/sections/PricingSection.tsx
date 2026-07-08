// Section: Imports
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import TierCard from "@/components/ui/TierCard";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import LivingCard from "@/components/ui/LivingCard";

const tiers = [
  {
    name: "Starter",
    payback: "6–9 mo payback",
    implementationPrice: "AED 15,000",
    monthlyPrice: "AED 1,500",
    features: [
      { label: "5-8 core Odoo modules", included: true },
      { label: "<= 10 users · 2-3 weeks", included: true },
      { label: "UAE VAT & Corporate Tax setup", included: true },
      { label: "Data migration (2 sources)", included: true },
      { label: "14-day hypercare", included: true },
      { label: "5K AI tasks/month", included: true },
      { label: "Advanced automations", included: false }
    ]
  },
  {
    name: "Growth",
    payback: "4–6 mo payback ★",
    implementationPrice: "AED 22,000",
    monthlyPrice: "AED 2,500",
    isPopular: true,
    features: [
      { label: "12-18 modules + integrations", included: true },
      { label: "<= 25 users · 4-6 weeks", included: true },
      { label: "Advanced automations", included: true },
      { label: "AI Chat & Voice layer", included: true },
      { label: "15K AI tasks/month", included: true },
      { label: "Multi-company ready", included: true },
      { label: "Custom architecture", included: false }
    ]
  },
  {
    name: "Professional",
    payback: "3–5 mo payback",
    implementationPrice: "AED 40,000",
    monthlyPrice: "AED 4,500",
    features: [
      { label: "20+ modules + custom extensions", included: true },
      { label: "<= 75 users · 6-10 weeks", included: true },
      { label: "AI analytics & reporting", included: true },
      { label: "50K AI tasks/month", included: true },
      { label: "Multi-company + multi-currency", included: true },
      { label: "API integrations", included: true },
      { label: "Staff training (6 sessions)", included: true }
    ]
  },
  {
    name: "Enterprise",
    payback: "Custom",
    implementationPrice: "From AED 75,000",
    monthlyPrice: "From AED 7,500",
    features: [
      { label: "Custom architecture, unlimited users", included: true },
      { label: "10-16 weeks delivery", included: true },
      { label: "Advanced AI & compliance", included: true },
      { label: "Custom AI caps", included: true },
      { label: "Regulated-entity readiness", included: true },
      { label: "White-glove installation", included: true },
      { label: "Dedicated account lead", included: true }
    ]
  }
];

const retainerTiers = [
  { name: "Bronze", amount: "AED 5,000/mo", hours: "8 hrs", note: "Occasional changes" },
  { name: "Silver", amount: "AED 9,000/mo", hours: "16 hrs", note: "Most growing clients", featured: true },
  { name: "Gold", amount: "AED 15,000/mo", hours: "30 hrs", note: "Continuous evolution" }
];

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
          <SectionEyebrow label="INVESTMENT" />
          <h2
            id="pricing-heading"
            style={{ fontFamily: "var(--font-outfit)" }}
            className="max-w-4xl text-[clamp(2rem,4.5vw,3.75rem)] font-extrabold leading-[1.1] text-[var(--sgc-text-primary)]"
          >
            Four tiers. One mandatory subscription. Zero hidden fees.
          </h2>
          <p
            style={{ fontFamily: "var(--font-outfit)" }}
            className="mt-5 max-w-[42rem] text-[clamp(1.05rem,1.4vw,1.35rem)] font-medium leading-[1.5] text-[var(--sgc-text-muted)]"
          >
            Pick the tier that matches your scale today. Upgrade when ready.{" "}
            <span className="font-semibold text-[var(--accent-teal)]">The Growth tier fits ~70% of UAE mid-market clients.</span>{" "}
            All prices in AED, exclusive of 5% VAT.
          </p>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="mb-12 text-center">
            <p
              style={{ fontFamily: "var(--font-outfit)" }}
              className="mx-auto max-w-2xl text-[clamp(1.1rem,1.5vw,1.35rem)] text-[var(--sgc-text-muted)]"
            >
              The average Growth-tier client recovers their full implementation cost within 4–6 months.
            </p>
            <p
              style={{ fontFamily: "var(--font-outfit)" }}
              className="mt-4 text-[clamp(1.4rem,2.5vw,2rem)] font-bold text-[var(--sgc-text-primary)]"
            >
              AED 52,000 invested → AED 120,000–180,000 recovered
            </p>
            <p className="mt-2 text-[0.8rem] text-[var(--sgc-text-muted)]">
              AED 22K implementation + AED 30K year-1 subscription vs. admin hours, faster cash cycle, recovered leads. Conservative range.
            </p>
          </div>
        </RevealOnScroll>

        <div className="my-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, index) => (
            <TierCard
              key={tier.name}
              name={tier.name}
              implementationPrice={tier.implementationPrice}
              monthlyPrice={tier.monthlyPrice}
              features={tier.features}
              isPopular={tier.isPopular}
              delay={index * 0.08}
              payback={tier.payback}
            />
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <RevealOnScroll>
            <h3
              style={{ fontFamily: "var(--font-outfit)" }}
              className="text-[1rem] font-semibold text-[var(--sgc-text-primary)]"
            >
              Optional Operations Retainer
            </h3>
          </RevealOnScroll>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {retainerTiers.map((tier, i) => (
              <RevealOnScroll key={tier.name} delay={i * 0.1}>
                <LivingCard>
                  <div
                    className={`relative overflow-hidden rounded-xl border p-4 transition duration-300 ease-out hover:-translate-y-[3px] hover:border-[rgba(199,162,58,0.35)] hover:shadow-[0_8px_32px_rgba(199,162,58,0.1)] ${
                      tier.featured
                        ? "border-[rgba(199,162,58,0.4)] bg-[rgba(199,162,58,0.04)]"
                        : "border-[var(--border)] bg-[var(--surface-high)]"
                    }`}
                  >
                    {tier.featured && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-3 left-0 w-[2px]"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 0%, rgba(199,162,58,0.85) 50%, transparent 100%)",
                          boxShadow: "0 0 12px rgba(199,162,58,0.55)",
                        }}
                      />
                    )}
                    <p
                      style={{ fontFamily: "var(--font-outfit)" }}
                      className="text-[1rem] font-semibold text-[var(--sgc-text-primary)]"
                    >
                      {tier.name}
                      {tier.featured ? <span className="ml-2 text-[var(--accent-copper)]">★</span> : null}
                    </p>
                    <p className="mt-1 text-[0.9rem] text-[var(--sgc-text-primary)]">{tier.amount}</p>
                    <p className="mt-1 text-[0.86rem] text-[var(--sgc-text-muted)]">{tier.hours}</p>
                    <p className="mt-1 text-[0.86rem] text-[var(--sgc-text-muted)]">{tier.note}</p>
                  </div>
                </LivingCard>
              </RevealOnScroll>
            ))}
          </div>
          <RevealOnScroll delay={0.35}>
            <p className="mt-5 text-center text-[0.8rem] text-[var(--sgc-text-muted)]">
              6-month minimum. All prices exclusive of 5% UAE VAT.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
