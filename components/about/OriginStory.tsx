import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionEyebrow from "@/components/ui/SectionEyebrow";

export default function OriginStory() {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="scroll-mt-20 bg-[var(--bg)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <RevealOnScroll>
          <SectionEyebrow label="OUR STORY" />
          <h2
            id="story-heading"
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.15] text-[var(--text-primary)]"
          >
            The principle has a name, but not a tagline.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="mt-8 space-y-5 text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.75] text-[var(--text-secondary)]">
            <p>
              We diagnose before we prescribe. That is the whole of it. A chartered accountant
              looks at your financials the way a doctor looks at a chart — with training,
              with skepticism, and without an opinion yet.
            </p>
            <p>
              The two of us have closed the books, run the audits, filed the UAE Corporate
              Tax returns, and rolled out Odoo for firms we would still recognize by name.
              We are practitioners, not content creators.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
