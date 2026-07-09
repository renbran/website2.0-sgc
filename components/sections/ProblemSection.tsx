import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import LivingCard from "@/components/ui/LivingCard";
import ScrollParallax from "@/components/ui/ScrollParallax";
import PremiumEditorialSection from "@/components/ui/PremiumEditorialSection";

const problemCards = [
  {
    badge: "01",
    title: "Scattered systems",
    body: "On Monday morning, your finance lead is chasing four people for numbers that should live in one place. Sales tracked in WhatsApp threads. Invoices in email attachments. Commission calculations rebuilt in a new Excel sheet every cycle. When a founder asks ‘how are we tracking against budget?’ the honest answer is: we’ll know by Thursday.",
  },
  {
    badge: "02",
    title: "Manual work AI should handle",
    body: "In 2026, a UAE brokerage is still having someone manually key in sale details from a signed SPA. An accountant spends three days extracting figures from PDFs that a document scanner reads in eleven seconds. This is not a technology problem — it’s an implementation that was never finished, and the daily cost compounds quietly.",
  },
  {
    badge: "03",
    title: "Compliance exposure",
    body: "UAE regulatory obligations compound every quarter. Corporate Tax enforcement is live. PDPL penalties are real. goAML reporting has teeth. Most mid-market firms handle these obligations through manual processes designed for a simpler era. The risk isn’t ignorance — it’s that a manual process doesn’t scale, and an inspection doesn’t give advance warning.",
  },
];

const costItems = [
  {
    label: "Slow finance & commission cycle",
    amount: "AED 48,000",
    sublabel: "≈2 hrs/wk × 4 people × 50 wks",
  },
  {
    label: "Lost or cold leads",
    amount: "AED 90,000",
    sublabel: "≈3 deals/yr × AED 30K margin",
  },
  {
    label: "Manual reporting & reconciliation",
    amount: "AED 36,000",
    sublabel: "≈6 hrs/wk of mgmt + finance",
  },
  {
    label: "Document data entry & rework",
    amount: "AED 30,000",
    sublabel: "≈5 hrs/wk across the team",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" aria-label="THE PROBLEM" className="relative scroll-mt-20 bg-[var(--bg)] pt-10 pb-14 md:pt-14 md:pb-20">
      <ScrollParallax amplitude={20} className="pointer-events-none absolute inset-0">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(199,162,58,0.05)_0%,transparent_70%)]" />
      </ScrollParallax>
      <GoldDrawIn />

      {/* Premium Editorial Layout — replaces the old heading/subheading as the section intro */}
      <RevealOnScroll focusPull>
        <SectionEyebrow label="THE PROBLEM" />
      </RevealOnScroll>
      <PremiumEditorialSection
        nested
        id="problem-editorial"
        heading="The hidden cost of fragmented operations."
        subheading="Creating clarity in systems that have drifted"
        imageSrc="/images/sections/human-team-braining.jpg"
        imageAlt="Team collaborating around financial data on a whiteboard, representing the complexity of scattered systems"
        imageCaption="The hidden cost of fragmented operations · UAE mid-market"
        layout="lumiere"
        background="dark"
        pullQuote="Three problems compound quietly inside UAE mid-market firms. They look like busy weeks on the surface."
        pullQuoteAttribution="SGC Tech AI · Operations Audit"
        ctaText="Discover the story"
        ctaHref="#contact"
      >
        <p>
          Three problems — scattered systems, manual work AI should handle, compliance exposure —
          compound quietly inside UAE mid-market firms. They look like busy weeks on the surface.
          Underneath, they are <span className="font-semibold text-[var(--accent)]">AED 180K–220K of
          annual drag</span> on a 25-person team.
        </p>
        <p>
          The damage isn&apos;t dramatic. It&apos;s the slow bleed of a finance lead spending Monday morning
          chasing numbers that should live in one place. It&apos;s the accountant who spends three days
          extracting figures from PDFs that a document scanner reads in eleven seconds.
        </p>
        <p>
          This is not a technology problem — it&apos;s an implementation that was never finished,
          and the daily cost compounds quietly.
        </p>
      </PremiumEditorialSection>

      <div className="mx-auto w-full max-w-[1440px] 2xl:max-w-[1640px] px-6 md:px-10 lg:px-16">
        <div className="mt-14 grid items-start gap-6 md:gap-8 md:grid-cols-3">
          {problemCards.map((card, index) => (
            <RevealOnScroll
              key={card.title}
              delay={index * 0.1}
              className={index === 1 ? "md:mt-12 lg:mt-16" : index === 2 ? "md:mt-6 lg:mt-8" : ""}
            >
              <LivingCard>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 transition duration-300 ease-out hover:border-[var(--accent-border)]">
                <p
                  style={{ fontFamily: "var(--font-inter)" }}
                  className="text-[0.85rem] font-bold tracking-[0.18em] text-text-muted"
                >
                  {card.badge}
                </p>
                <h3
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  className="mt-4 text-[1.45rem] font-bold leading-[1.25] text-[var(--sgc-text-primary)]"
                >
                  {card.title}
                </h3>
                <p className="mt-4 text-[0.98rem] leading-[1.7] text-[var(--sgc-text-muted)]">{card.body}</p>
              </article>
              </LivingCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      <div className="my-16 border-y border-[var(--border)] bg-[var(--surface)] py-10">
        <div className="mx-auto w-full max-w-[1440px] 2xl:max-w-[1640px] px-6 md:px-10 lg:px-16">
          <div className="grid gap-6 md:grid-cols-4">
            {costItems.map((item, index) => (
              <RevealOnScroll key={item.label} delay={index * 0.08}>
                <div>
                  <p className="text-[0.9rem] font-medium text-[var(--sgc-text-muted)]">{item.label}</p>
                  <p
                    style={{ fontFamily: "var(--font-inter)" }}
                    className="mt-2 text-[clamp(1.5rem,2.5vw,2rem)] font-extrabold text-[var(--sgc-text-primary)]"
                  >
                    {item.amount}
                  </p>
                  <p className="mt-1 text-[0.75rem] text-[var(--sgc-text-muted)]">{item.sublabel}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll>
            <p
              style={{ fontFamily: "var(--font-inter)" }}
              className="mt-10 text-center text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-[var(--accent-teal)]"
            >
              Typical annual drag: AED 180,000 – 220,000
            </p>
            <p className="mt-3 text-center text-[0.85rem] text-[var(--sgc-text-muted)]">
              Conservative estimate for a 25-person UAE mid-market firm. Calculated from time, not from imagined
              revenue.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
