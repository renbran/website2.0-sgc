"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import ProximityCtaButton from "@/components/ui/ProximityCtaButton";
import CtaButton from "@/components/ui/CtaButton";

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
      aria-labelledby="rescue-audit-heading"
      className="relative w-full bg-[var(--surface)] px-6 pt-10 pb-14 md:pt-14 md:pb-20 scroll-mt-20"
    >
      <h2 id="rescue-audit-heading" className="sr-only">
        A letter from the founders
      </h2>
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(199,162,58,0.3)] to-transparent" />

      <div className="mx-auto max-w-5xl">
        <div className="grid items-start gap-10 md:grid-cols-[0.55fr_1fr]">
          <figure className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:max-h-[36rem]">
            <Image
              src="/images/sections/dubai-skyline.jpg"
              alt="Dubai skyline at dusk with Burj Khalifa silhouetted against a warm horizon."
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(8,11,17,0.05) 0%, rgba(8,11,17,0.65) 100%)",
              }}
            />
            <figcaption
              style={{ fontFamily: "var(--font-mono)" }}
              className="absolute bottom-3 left-4 right-4 text-[0.62rem] uppercase tracking-[0.18em] text-text-secondary"
            >
              Illustrative image · Dubai
            </figcaption>
          </figure>

          <div className="border-l-2 border-[rgba(199,162,58,0.5)] pl-6 sm:pl-8">
            <motion.p
              style={{ fontFamily: "var(--font-mono)" }}
              className="mb-8 text-[0.72rem] tracking-[0.22em] text-[rgba(199,162,58,0.6)]"
              initial={reduced ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
            >
              DUBAI, 2026
            </motion.p>

            <div
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="space-y-5 text-[clamp(1rem,1.3vw,1.15rem)] leading-[1.8] text-[var(--text-secondary)]"
            >
              {letterBody.map((para, i) => (
                <motion.p
                  key={i}
                  initial={reduced ? {} : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.85, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            <motion.p
              style={{ fontFamily: "var(--font-fraunces)" }}
              className="mt-8 text-[1rem] text-[var(--text-primary)]"
              initial={reduced ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: letterBody.length * 0.14 }}
            >
              — The SGC Tech AI Team
            </motion.p>
          </div>
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: letterBody.length * 0.14 + 0.1 }}
        >
          <ProximityCtaButton
            href="#contact"
            className="px-8 py-3.5 text-[0.95rem]"
          >
            Book a Finance Operations Audit →
          </ProximityCtaButton>
        </motion.div>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(199,162,58,0.3)] to-transparent" />
    </section>
  );
}
