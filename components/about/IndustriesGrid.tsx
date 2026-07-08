import Image from "next/image";
import { Building2, HardHat, Stethoscope, Factory, Store, Briefcase } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

const INDUSTRIES = [
  {
    icon: Building2,
    photo: "/images/about/industries/real-estate.jpg",
    name: "Real Estate",
    tags: ["Portfolio Management", "Cash Flow Optimization", "Project Costing"],
    description: "Financial visibility for property development and investment portfolios.",
  },
  {
    icon: HardHat,
    photo: "/images/about/industries/construction.jpg",
    name: "Construction",
    tags: ["Project Accounting", "Job Costing", "Revenue Recognition"],
    description: "Integrated financial control for complex construction projects.",
  },
  {
    icon: Stethoscope,
    photo: "/images/about/industries/healthcare.jpg",
    name: "Healthcare",
    tags: ["Compliance", "Revenue Cycle", "Cost Accounting"],
    description: "Financial operations aligned with healthcare regulatory requirements.",
  },
  {
    icon: Factory,
    photo: "/images/about/industries/manufacturing.jpg",
    name: "Manufacturing",
    tags: ["Cost Analysis", "Inventory Management", "Supply Chain"],
    description: "Operational efficiency and financial control for manufacturing excellence.",
  },
  {
    icon: Store,
    photo: "/images/about/industries/retail.jpg",
    name: "Retail",
    tags: ["Multi-Location", "POS Integration", "Margin Analysis"],
    description: "Unified financial management across retail operations and channels.",
  },
  {
    icon: Briefcase,
    photo: "/images/about/industries/professional-services.jpg",
    name: "Professional Services",
    tags: ["Project Billing", "Resource Planning", "Time Tracking"],
    description: "Financial intelligence for service-based business optimization.",
  },
];

export default function IndustriesGrid() {
  return (
    <section
      aria-labelledby="industries-heading"
      className="bg-[var(--sgc-black)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <RevealOnScroll>
          <div className="text-center">
            <SectionEyebrow label="BUILT FOR COMPLEX INDUSTRIES" className="justify-center" />
            <h2
              id="industries-heading"
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.15] text-[var(--text-primary)]"
            >
              One unified <span className="text-gold-gradient">ecosystem.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[0.95rem] leading-[1.6] text-[var(--text-secondary)]">
              All industries connected through integrated financial architecture.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <RevealOnScroll key={industry.name} delay={(i % 3) * 0.08}>
                <div className="group h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-colors duration-300 hover:border-[rgba(199,162,58,0.3)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={industry.photo}
                      alt={`${industry.name} — AI-generated representative photography`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[rgba(16,22,31,0.15)] to-transparent"
                    />
                    <div className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--sgc-black)] shadow-[0_4px_14px_rgba(0,0,0,0.4)]">
                      <Icon size={18} aria-hidden className="text-[var(--accent)]" />
                    </div>
                  </div>

                  <div className="p-6 pt-5">
                    <h3
                      style={{ fontFamily: "var(--font-fraunces)" }}
                      className="text-[1.1rem] font-bold text-[var(--text-primary)]"
                    >
                      {industry.name}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {industry.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{ fontFamily: "var(--font-mono)" }}
                          className="rounded px-2 py-0.5 text-[0.62rem] tracking-[0.04em] text-[var(--text-muted)] bg-[rgba(199,162,58,0.06)] border border-[rgba(199,162,58,0.15)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 text-[0.82rem] leading-[1.55] text-[var(--text-secondary)]">
                      {industry.description}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={0.3}>
          <p className="mt-6 text-center text-[0.68rem] text-[var(--text-muted)]">
            Representative photography, AI-generated for illustrative purposes.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
