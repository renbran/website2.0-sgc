"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import SectionEyebrow from "@/components/ui/SectionEyebrow";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import AwardTrophy from "@/components/ui/AwardTrophy";

interface Credential {
  level: string;
  headline: string;
  subtitle: string;
  recipient?: string;
  date: string;
}

// Each credential is rendered in the same canonical trophy frame
// (laurel wreath + GOLD pill + winner headline + hairline + subtitle
// + recipient + date). Content rotates; visual treatment stays locked
// so the brand carries one badge language across the page.
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
      className="relative scroll-mt-20 overflow-hidden bg-[var(--bg)] pt-12 pb-16 md:pt-16 md:pb-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(244,241,234,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <RevealOnScroll>
          <SectionEyebrow label="CREDENTIALS" />
          <h2
            id="awards-heading"
            style={{ fontFamily: "var(--font-fraunces)" }}
            className="max-w-4xl text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.1] text-[var(--text-primary)]"
          >
            Credentials &amp; track record.
            <span className="block text-[var(--text-secondary)]">Every claim verifiable on request.</span>
          </h2>
          <p
            style={{ fontFamily: "var(--font-inter)" }}
            className="mt-5 max-w-[42rem] text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.6] text-[var(--text-muted)]"
          >
            No borrowed logos and no purchased awards. What stands behind every engagement:
            named credentials, senior finance seats, and delivery numbers from live client
            operations.
          </p>
        </RevealOnScroll>
      </div>

      <div className="relative mt-12 overflow-hidden" ref={rowRef}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-r from-transparent to-[var(--bg)]"
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
