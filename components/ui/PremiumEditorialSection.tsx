"use client";

import NextImage from "next/image";
import { motion, useReducedMotion } from "motion/react";
import RevealOnScroll from "./RevealOnScroll";
import SectionEyebrow from "./SectionEyebrow";

/**
 * PremiumEditorialSection — Modern editorial/writing format with:
 * - Asymmetric image + text layout (magazine-style)
 * - Large hero image with overlay gradient
 * - Pull quotes with gold accent
 * - Drop cap first letter styling
 * - Generous whitespace and breathing room
 * - Responsive: stacks on mobile, asymmetric on desktop
 *
 * Layout variants:
 * - "image-left" (default): Image left, text right
 * - "image-right": Text left, image right
 * - "hero": Full-width image with text overlay
 * - "split": 50/50 side by side
 */

type LayoutVariant = "image-left" | "image-right" | "hero" | "split";

interface PremiumEditorialSectionProps {
  /** Section ID for anchor links */
  id?: string;
  /** Eyebrow label (e.g., "THE PROBLEM") */
  eyebrow?: string;
  /** Main heading */
  heading: string;
  /** Heading font family */
  headingFont?: string;
  /** Subheading / intro paragraph */
  subheading?: string;
  /** Image source (Unsplash URL or local path) */
  imageSrc: string;
  /** Image alt text */
  imageAlt: string;
  /** Image caption */
  imageCaption?: string;
  /** Main body content */
  children: React.ReactNode;
  /** Pull quote text */
  pullQuote?: string;
  /** Pull quote attribution */
  pullQuoteAttribution?: string;
  /** Layout variant */
  layout?: LayoutVariant;
  /** Background variant */
  background?: "dark" | "gradient" | "surface";
  /** Additional className */
  className?: string;
}

export default function PremiumEditorialSection({
  id,
  eyebrow,
  heading,
  headingFont = "var(--font-fraunces)",
  subheading,
  imageSrc,
  imageAlt,
  imageCaption,
  children,
  pullQuote,
  pullQuoteAttribution,
  layout = "image-left",
  background = "dark",
  className = "",
}: PremiumEditorialSectionProps) {
  const reduced = useReducedMotion();

  const bgClass =
    background === "dark"
      ? "bg-[var(--bg)]"
      : background === "gradient"
        ? "bg-[var(--sgc-gradient-bg)]"
        : "bg-[var(--surface)]";

  const isHero = layout === "hero";
  const isImageLeft = layout === "image-left";
  const isSplit = layout === "split";

  return (
    <section
      id={id}
      className={`relative scroll-mt-20 pt-10 pb-14 md:pt-14 md:pb-20 ${bgClass} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        {/* Eyebrow */}
        {eyebrow && (
          <RevealOnScroll>
            <SectionEyebrow label={eyebrow} />
          </RevealOnScroll>
        )}

        {/* Hero Layout: Full-width image with text overlay */}
        {isHero ? (
          <RevealOnScroll className="mt-8">
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)]">
              {/* Image */}
              <div className="relative aspect-[16/9] md:aspect-[21/9]">
                <NextImage
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                {/* Gradient overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(8,11,17,0.3) 0%, rgba(8,11,17,0.7) 50%, rgba(8,11,17,0.9) 100%)",
                  }}
                />
                {/* Text overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16">
                  <motion.h2
                    initial={reduced ? {} : { opacity: 0, y: 20 }}
                    whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ fontFamily: headingFont }}
                    className="max-w-3xl text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] text-white"
                  >
                    {heading}
                  </motion.h2>
                  {subheading && (
                    <motion.p
                      initial={reduced ? {} : { opacity: 0, y: 20 }}
                      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="mt-4 max-w-2xl text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.6] text-[rgba(255,255,255,0.85)]"
                    >
                      {subheading}
                    </motion.p>
                  )}
                </div>
              </div>
              {/* Caption */}
              {imageCaption && (
                <div className="border-t border-[var(--border)] bg-[var(--surface)] px-6 py-3">
                  <p
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--sgc-text-muted)]"
                  >
                    {imageCaption}
                  </p>
                </div>
              )}
            </div>
          </RevealOnScroll>
        ) : (
          /* Asymmetric / Split Layout */
          <div
            className={`mt-10 grid items-start gap-8 lg:gap-12 ${
              isSplit
                ? "md:grid-cols-2"
                : isImageLeft
                  ? "md:grid-cols-[1.1fr_0.9fr]"
                  : "md:grid-cols-[0.9fr_1.1fr]"
            }`}
          >
            {/* Image Column */}
            <RevealOnScroll
              className={isImageLeft || isSplit ? "" : "md:order-2"}
            >
              <figure className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                <div className="relative aspect-[4/3]">
                  <NextImage
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                  {/* Subtle vignette */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, transparent 50%, rgba(8,11,17,0.3) 100%)",
                    }}
                  />
                </div>
                {imageCaption && (
                  <figcaption
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-[0.62rem] uppercase tracking-[0.18em] text-[var(--sgc-text-muted)]"
                  >
                    {imageCaption}
                  </figcaption>
                )}
              </figure>
            </RevealOnScroll>

            {/* Text Column */}
            <RevealOnScroll
              className={`${isImageLeft || isSplit ? "" : "md:order-1"} ${
                !isSplit && !isImageLeft ? "md:col-start-1 md:row-start-1" : ""
              }`}
              delay={0.1}
            >
              {/* Heading */}
              <motion.h2
                initial={reduced ? {} : { opacity: 0, y: 16 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ fontFamily: headingFont }}
                className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[1.12] text-[var(--sgc-text-primary)]"
              >
                {heading}
              </motion.h2>

              {/* Subheading */}
              {subheading && (
                <motion.p
                  initial={reduced ? {} : { opacity: 0, y: 16 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mt-4 text-[clamp(1rem,1.3vw,1.15rem)] font-medium leading-[1.6] text-[var(--sgc-text-muted)]"
                >
                  {subheading}
                </motion.p>
              )}

              {/* Gold divider */}
              <motion.div
                initial={reduced ? {} : { scaleX: 0 }}
                whileInView={reduced ? {} : { scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 h-px w-16 origin-left bg-gradient-to-r from-[var(--accent)] to-transparent"
              />

              {/* Body content */}
              <div className="mt-6 space-y-5 text-[1rem] leading-[1.75] text-[var(--text-secondary)] md:text-[1.05rem]">
                {children}
              </div>

              {/* Pull quote */}
              {pullQuote && (
                <motion.blockquote
                  initial={reduced ? {} : { opacity: 0, x: -12 }}
                  whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-8 border-l-2 border-[var(--accent)] pl-6"
                >
                  <p
                    style={{ fontFamily: "var(--font-fraunces)" }}
                    className="text-[clamp(1.05rem,1.4vw,1.25rem)] italic leading-[1.6] text-[var(--accent)]"
                  >
                    &ldquo;{pullQuote}&rdquo;
                  </p>
                  {pullQuoteAttribution && (
                    <cite
                      style={{ fontFamily: "var(--font-mono)" }}
                      className="mt-2 block text-[0.75rem] not-italic tracking-[0.08em] text-[var(--sgc-text-muted)]"
                    >
                      — {pullQuoteAttribution}
                    </cite>
                  )}
                </motion.blockquote>
              )}
            </RevealOnScroll>
          </div>
        )}
      </div>
    </section>
  );
}
