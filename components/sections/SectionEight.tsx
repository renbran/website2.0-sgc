"use client";
import { useReducedMotion } from "motion/react";
import PremiumEditorialSection from "@/components/ui/PremiumEditorialSection";
import ProximityCtaButton from "@/components/ui/ProximityCtaButton";

const letterBody = [
  "Most of the businesses we work with weren't failing. They were winning — just slower than they should have been.",
  "Commission cycles taking a week. A missed VAT deadline discovered too late. Finance closing on day eleven when it should close on day three. Good people spending Fridays on work that 2026 technology handles in minutes.",
  "We built this firm because we spent years inside UAE finance teams — as CPAs, CIAs, and operators — and grew tired of watching these problems repeat themselves across every mid-market company in the region.",
  "We diagnose before we sell. The Finance Operations Audit is that diagnosis: your systems, your compliance posture, your operational drag — audited honestly, by a finance-credentialed team. If we can help, we'll show you exactly how. If we can't, we'll tell you that too.",
  "That's what we'd want from an advisor. It's what we offer.",
];

export default function SectionEight() {
  const reduced = useReducedMotion();

  return (
    <section
      id="rescue-audit"
      aria-label="A letter from the founders"
      className="relative scroll-mt-20 bg-[var(--sgc-cream)] pb-10 md:pb-14"
    >
      <PremiumEditorialSection
        nested
        heading="A letter from the founders."
        subheading="Diagnose before we sell · Dubai 2026"
        imageSrc="/images/sections/human-team-collaboration.jpg"
        imageAlt="Team collaborating around a table in a modern office, representing hands-on finance partnership"
        imageCaption="DUBAI, 2026 · SGC Tech AI"
        layout="lumiere"
        background="light"
        pullQuote="We diagnose before we sell. If we can help, we'll show you exactly how. If we can't, we'll tell you that too."
        pullQuoteAttribution="SGC Tech AI · Finance Operations Audit"
        ctaText="Discover the story"
        ctaHref="#contact"
      >
        {letterBody.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <p className="!mt-8 font-semibold text-[var(--sgc-text-primary)]">
          — The SGC Tech AI Team
        </p>
      </PremiumEditorialSection>

      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div className="flex justify-center">
          <ProximityCtaButton
            href="#contact"
            className="px-8 py-3.5 text-[0.95rem]"
          >
            Book a Finance Operations Audit →
          </ProximityCtaButton>
        </div>
      </div>
    </section>
  );
}
