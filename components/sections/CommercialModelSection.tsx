"use client";

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import type { MotionValue } from "motion/react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import GoldDrawIn from "@/components/ui/GoldDrawIn";
import FlippingCard from "@/components/ui/FlippingCard";
import PremiumEditorialSection from "@/components/ui/PremiumEditorialSection";

const LAYERS = [
  {
    label: "IMPLEMENTATION",
    price: "AED 15,000 from",
    note: "Foundation",
    optional: false,
    alwaysOn: false,
    description: "Discovery, configuration, UAT, go-live, hypercare. Fixed price, fixed timeline.",
    includes: [
      "Discovery workshops · As-Is / To-Be mapping",
      "Odoo configuration + data migration",
      "UAT scripts · user training · cutover plan",
      "30-day hypercare post go-live",
    ],
    excludes: [
      "Module licenses (billed via subscription)",
      "Custom app development (quoted separately)",
      "Hardware, networking, on-prem hosting",
    ],
  },
  {
    label: "PLATFORM SUBSCRIPTION",
    price: "AED 1,500/mo from",
    note: "Always on",
    optional: false,
    alwaysOn: true,
    description: "Odoo hosting, security patches, AI feature updates, compliance upgrades.",
    includes: [
      "Odoo Online hosting (GDPR-resident)",
      "Security patches + backports",
      "Quarterly release upgrades",
      "9-to-5 platform support",
    ],
    excludes: [
      "End-user training hours (see retainer)",
      "On-call emergency response",
      "Custom module development",
    ],
  },
  {
    label: "OPERATIONS RETAINER",
    price: "AED 5,000/mo from",
    note: "Optional",
    optional: true,
    alwaysOn: false,
    description: "Named senior consultant, quarterly reviews, priority support.",
    includes: [
      "Named senior consultant (CFO-grade)",
      "Quarterly business review",
      "Priority same-day response",
      "Annual tax-position check",
    ],
    excludes: [
      "Transaction-level bookkeeping",
      "External audit representation",
      "Filing preparation (handled separately)",
    ],
  },
];

// Fixed positions — no Math.random() at render time avoids SSR/hydration mismatch
const PARTICLES = [
  { left: "15%", top: "28%", delay: 0.0, dur: 3.8 },
  { left: "28%", top: "55%", delay: 0.5, dur: 4.2 },
  { left: "42%", top: "18%", delay: 1.0, dur: 3.5 },
  { left: "58%", top: "72%", delay: 0.3, dur: 4.5 },
  { left: "71%", top: "40%", delay: 0.8, dur: 3.9 },
  { left: "83%", top: "22%", delay: 1.3, dur: 4.1 },
  { left: "22%", top: "82%", delay: 0.6, dur: 3.6 },
  { left: "65%", top: "60%", delay: 1.6, dur: 4.3 },
  { left: "50%", top: "33%", delay: 0.2, dur: 3.7 },
  { left: "36%", top: "66%", delay: 1.1, dur: 4.0 },
];

interface SlabProps {
  layer: (typeof LAYERS)[number];
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

function CommercialSlab({ layer, index, mouseX, mouseY }: SlabProps) {
  const depth = (index + 1) * 5;
  const rawX = useTransform(mouseX, [0, 1], [-depth, depth]);
  const rawY = useTransform(mouseY, [0, 1], [-depth * 0.5, depth * 0.5]);
  const shiftX = useSpring(rawX, { stiffness: 150, damping: 22 });
  const shiftY = useSpring(rawY, { stiffness: 150, damping: 22 });

  const front = (
    <>
      <div className="flex items-center justify-between mb-2">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent-copper)]"
        >
          {layer.label}
        </span>
        <div className="flex items-center gap-2">
          {layer.optional && (
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[0.68rem] tracking-[0.12em] text-[var(--accent)] opacity-50"
            >
              OPTIONAL
            </span>
          )}
          {layer.alwaysOn && (
            <motion.span
              aria-label="Always on"
              className="block h-2 w-2 rounded-full bg-[var(--accent)]"
              animate={{ scale: [1, 1.4, 1], opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>

      <p
        style={{ fontFamily: "var(--font-fraunces)" }}
        className="text-gold-gradient mt-2 text-[clamp(1.5rem,2.5vw,2rem)] font-extrabold leading-none"
      >
        {layer.price}
      </p>

      <p
        style={{ fontFamily: "var(--font-inter)" }}
        className="mt-3 text-[0.9rem] leading-[1.65] text-[var(--sgc-text-muted)]"
      >
        {layer.description}
      </p>
    </>
  );

  const back = (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-auto">
      <p
        style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
        className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--accent)]"
      >
        {layer.label} · Scope
      </p>
      <div>
        <p
          style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
          className="text-[0.55rem] uppercase tracking-[0.18em] text-[var(--accent)]"
        >
          Includes
        </p>
        <ul className="mt-1 space-y-0.5 text-[0.78rem] leading-[1.4] text-[var(--text-primary)]">
          {layer.includes.map((line) => (
            <li key={line} className="flex gap-1.5 break-words">
              <span className="shrink-0 text-[var(--accent)]">✓</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p
          style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
          className="text-[0.55rem] uppercase tracking-[0.18em] text-[rgba(255,180,180,0.65)]"
        >
          Excludes
        </p>
        <ul className="mt-1 space-y-0.5 text-[0.75rem] leading-[1.4] text-[var(--text-muted)]">
          {layer.excludes.map((line) => (
            <li key={line} className="flex gap-1.5 break-words">
              <span className="shrink-0">✕</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <RevealOnScroll delay={index * 0.15}>
      <motion.div
        style={{ x: shiftX, y: shiftY }}
        className={`relative rounded-xl border-[1px] border-l-2 p-0 transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(199,162,58,0.1)] ${
          layer.optional
            ? "border-[var(--accent)] border-l-[var(--accent)] opacity-60 hover:opacity-75"
            : "border-[var(--border)] border-l-[var(--accent)]"
        }`}
      >
        <FlippingCard
          width={520}
          height={310}
          flipLabel={`${layer.label} scope`}
          frontContent={front}
          backContent={back}
        />
      </motion.div>
    </RevealOnScroll>
  );
}

export default function CommercialModelSection() {
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  function handlePointerMove(e: React.PointerEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <section
      id="commercial-model"
      aria-label="Commercial Model"
      className="scroll-mt-20 bg-[var(--sgc-cream)] pt-10 pb-14 md:pt-14 md:pb-20"
    >
      <GoldDrawIn />
      <PremiumEditorialSection
        nested
        eyebrow="HOW WE WORK"
        heading="The Three-Layer Commercial Model."
        subheading="Transparent pricing · fixed timelines · no hidden fees"
        imageSrc="/images/sections/human-business-meeting.jpg"
        imageAlt="Business professionals collaborating in a modern meeting room, representing transparent partnership"
        imageCaption="Transparent pricing · fixed timelines · no hidden fees"
        layout="lumiere"
        background="light"
        pullQuote="No hidden fees. No scope creep. Three clear layers that scale with you — and every price is published."
        pullQuoteAttribution="SGC Tech AI · Commercial Model"
        ctaText="Discover the story"
        ctaHref="#contact"
      >
        <p>
          We don&apos;t sell Implementation without Subscription, and we don&apos;t let unmaintained
          systems decay into the mess you came to us with. The three layers — Implementation,
          Platform Subscription, and Operations Retainer — work together so your system stays
          current, compliant, and actually used by your team.
        </p>
        <p>
          Every layer has a fixed price and a fixed timeline. Discovery, configuration, UAT,
          go-live, and hypercare are scoped in writing before we start. No scope creep, no
          surprise invoices. The subscription funds the AI tasks, hosting, security, and
          compliance updates that keep the system alive after go-live.
        </p>
      </PremiumEditorialSection>

      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div
          className="relative mt-16 max-w-3xl space-y-5"
          onPointerMove={reduced ? undefined : handlePointerMove}
          onPointerLeave={reduced ? undefined : handlePointerLeave}
        >
          {/* Floating gold particles — decorative only, reduced-motion skips */}
          {!reduced &&
            PARTICLES.map((p, i) => (
              <motion.div
                key={i}
                aria-hidden
                className="pointer-events-none absolute h-1 w-1 rounded-full bg-[var(--accent)]"
                style={{ left: p.left, top: p.top }}
                animate={{ y: [0, -40, -80], opacity: [0, 0.45, 0] }}
                transition={{
                  duration: p.dur,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeOut",
                }}
              />
            ))}

          {LAYERS.map((layer, i) => (
            <CommercialSlab
              key={layer.label}
              layer={layer}
              index={i}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          ))}
        </div>

        <RevealOnScroll delay={0.5}>
          <p
            style={{ fontFamily: "var(--font-inter)" }}
            className="mt-10 max-w-3xl border-t border-[#3A3220] pt-6 text-[1rem] font-semibold leading-[1.6] text-[var(--sgc-text-primary)]"
          >
            We don&apos;t sell Implementation without Subscription.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
