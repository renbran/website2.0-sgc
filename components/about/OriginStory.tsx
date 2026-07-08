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
            Diagnose before you prescribe.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="mt-8 space-y-5 text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.75] text-[var(--text-secondary)]">
            <p>
              SGC Tech AI was founded on a simple principle: diagnose before you prescribe.
              We are the <span className="text-[var(--accent)]">Operational Physician</span>{" "}
              of the UAE Mid-Market — we identify the condition before we sell the cure.
              Unlike consultants who arrive with pre-packaged solutions, we first understand
              how your business actually operates, then we build systems that fit your
              reality.
            </p>
            <p>
              Our founders are operators who have closed the books, run the audits, filed the
              FTA Corporate Tax returns, and implemented Odoo systems for companies across
              the UAE. We are practitioners, not content creators.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
