"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AwardTrophy from "@/components/ui/AwardTrophy";
import PremiumEditorialSection from "@/components/ui/PremiumEditorialSection";

interface Credential {
  level: string;
  headline: string;
  subtitle: string;
  recipient?: string;
  date: string;
}

const CREDENTIALS: Credential[] = [
  {
    level: "GOLD",
    headline: "25+ Years",
    subtitle: "Combined senior finance leadership",
    recipient: "CFO · Group CFO · Financial Controller",
    date: "UAE & International Groups",
  },
  {
    level: "GOLD",
    headline: "Dubai, Hands-On",
    subtitle: "Delivery inside UAE mid-market",
    recipient: "Real-Estate · Construction · Trading",
    date: "UAE Onshore",
  },
  {
    level: "GOLD",
    headline: "CPA · CIA · CRMA",
    subtitle: "Public accountancy, internal audit, risk assurance",
    recipient: "Founders · verifiable with issuers",
    date: "Active Standing",
  },
  {
    level: "GOLD",
    headline: "ACCA · CIPFA",
    subtitle: "Chartered & public-finance accountancy",
    recipient: "Founders · verifiable with issuers",
    date: "Active Standing",
  },
  {
    level: "GOLD",
    headline: "AED 1.15B",
    subtitle: "Sales volume processed in year one of full deployment",
    recipient: "UAE real-estate client · anonymised",
    date: "Verified · NDA on Request",
  },
  {
    level: "GOLD",
    headline: "UAE Compliance",
    subtitle: "Built into delivery from day one",
    recipient: "VAT · CIT · PDPL · goAML · RERA",
    date: "Current Scope",
  },
];

/**
 * AwardsCarousel — auto-scrolling row of AwardTrophy instances.
 * One canonical laurel-wreath frame; content rotates through six
 * independent credentials. All trophies visible in a seamless
 * horizontal marquee that scrolls end-to-end. Honors reduced-motion.
 */
export default function AwardsCarousel() {
  const reduced = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);

  const items = [...CREDENTIALS, ...CREDENTIALS];
  const DURATION = 45;

  return (
    <section
      id="awards"
      aria-labelledby="awards-heading"
      className="relative scroll-mt-20 overflow-hidden bg-[var(--sgc-cream)] pb-16 md:pb-24"
    >
      <PremiumEditorialSection
        nested
        eyebrow="CREDENTIALS"
        heading="We are the people behind the credentials."
        subheading="Verifiable track record · senior finance seats held"
        imageSrc="/images/sections/human-office-team.jpg"
        imageAlt="Professional team collaborating in a modern office environment"
        imageCaption="Every engagement backed by real people · verifiable credentials"
        layout="lumiere"
        background="light"
        pullQuote="Every claim is verifiable because every engagement was real — no borrowed logos, no purchased awards."
        pullQuoteAttribution="SGC Tech AI · Track Record"
        ctaText="Discover the story"
        ctaHref="#contact"
      >
        <p>
          Behind every engagement stand real people who have been in your seat — CPAs, CIAs, and
          finance operators who led the teams they now build for. We don&apos;t borrow logos or buy
          awards. What we offer is a track record you can verify, from senior finance seats held
          across UAE &amp; international groups.
        </p>
        <p>
          The numbers below aren&apos;t projections — they&apos;re what came out of live client systems.
          AED 1.15 billion in sales volume processed through a single deployment. Compliance built
          into delivery, not retrofitted under pressure. Five credentials held personally by the
          founders, each one current and verifiable with the issuing body.
        </p>
      </PremiumEditorialSection>

      <div className="relative overflow-hidden" ref={rowRef}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--sgc-black)] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-r from-transparent to-[var(--sgc-black)]"
        />

        {reduced ? (
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-6 px-6 md:px-10 lg:px-16">
            {CREDENTIALS.map((a, i) => (
              <div key={i} className="w-full max-w-[360px] shrink-0">
                <AwardTrophy
                  level={a.level}
                  headline={a.headline}
                  subtitle={a.subtitle}
                  recipient={a.recipient}
                  date={a.date}
                />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex items-center gap-6 px-4"
            style={{ width: "max-content" }}
            animate={{
              x: [`0px`, `-${50}%`],
            }}
            transition={{
              duration: DURATION,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {items.map((a, i) => (
              <div
                key={i}
                className="w-[clamp(280px,32vw,360px)] shrink-0"
              >
                <AwardTrophy
                  level={a.level}
                  headline={a.headline}
                  subtitle={a.subtitle}
                  recipient={a.recipient}
                  date={a.date}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <RevealOnScroll delay={0.2}>
          <p
            style={{ fontFamily: "var(--font-inter)" }}
            className="mt-12 max-w-3xl text-[0.78rem] leading-[1.65] text-[var(--text-muted)]"
          >
            Credentials are held personally by the named founders and remain in current standing;
            delivery figures come from live client systems and are verified under NDA on request.
            If we can&apos;t prove a claim, it doesn&apos;t appear on this page.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
