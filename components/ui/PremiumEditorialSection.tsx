"use client";

import NextImage from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import RevealOnScroll from "./RevealOnScroll";
import SectionEyebrow from "./SectionEyebrow";

/**
 * PremiumEditorialSection — Modern editorial/writing format with:
 * - Asymmetric image + text layout (magazine-style)
 * - Lumière editorial spread: large image on right, narrow text column on left
 * - Drop cap first letter (gold)
 * - Lead paragraph (slightly larger first paragraph)
 * - Centered pull quote in italic serif
 * - Gold decorative fleuron ornament
 * - "Discover the story" CTA link
 * - Light/cream background option for magazine-page feel
 * - Theme-aware (works in both dark and light)
 *
 * Layout variants:
 * - "image-left" (default): Image left, text right
 * - "image-right": Text left, image right
 * - "hero": Full-width image with text overlay
 * - "split": 50/50 side by side
 * - "lumiere": Editorial spread — image on right taking ~58%, text on left ~38%,
 *   with the image offset slightly higher than the text (intentional asymmetry).
 *   Designed to feel like a Lumière-style luxury magazine page.
 */

type LayoutVariant = "image-left" | "image-right" | "hero" | "split" | "lumiere";

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
  /** Background variant — "light" uses cream/off-white for magazine feel */
  background?: "dark" | "gradient" | "surface" | "light";
  /** Enable drop cap on first paragraph (default: true) */
  dropCap?: boolean;
  /** Enable lead paragraph styling (slightly larger first p, default: true) */
  leadParagraph?: boolean;
  /** Show gold decorative ornament between content groups (default: true for lumiere) */
  ornament?: boolean;
  /** When true, removes the section's own padding (pt/pb) so it blends with the parent section */
  nested?: boolean;
  /** CTA link text (e.g., "Discover the story") */
  ctaText?: string;
  /** CTA link href */
  ctaHref?: string;
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
  dropCap = true,
  leadParagraph = true,
  ornament,
  nested = false,
  ctaText,
  ctaHref,
  className = "",
}: PremiumEditorialSectionProps) {
  const reduced = useReducedMotion();

  // Lumière layout defaults the ornament on; other layouts default it off
  const showOrnament = ornament ?? layout === "lumiere";

  const isLightBg = background === "light";

  const bgClass = isLightBg
    ? "bg-[var(--sgc-cream)]"
    : background === "dark"
      ? "bg-[var(--bg)]"
      : background === "gradient"
        ? "bg-[var(--sgc-gradient-bg)]"
        : "bg-[var(--surface)]";

  // When using the Lumière light/cream background, text colors come from
  // cream-specific vars so contrast stays high regardless of site theme toggle.
  const textPrimaryClass = isLightBg
    ? "text-[var(--sgc-cream-text)]"
    : "text-[var(--sgc-text-primary)]";
  const textMutedClass = isLightBg
    ? "text-[var(--sgc-cream-muted)]"
    : "text-[var(--sgc-text-muted)]";
  // var(--accent) is tuned for dark backgrounds (~2:1 contrast on cream, fails WCAG AA).
  // Cream sections use antique-bronze instead — the same fix the site's light theme
  // already applies to --accent, but these sections bypass that toggle.
  const accentTextClass = isLightBg
    ? "text-[var(--antique-bronze)]"
    : "text-[var(--accent)]";

  const isHero = layout === "hero";
  const isLumiere = layout === "lumiere";
  const isImageLeft = layout === "image-left";
  const isSplit = layout === "split";

  return (
    <section
      id={id}
      className={`relative scroll-mt-20 ${nested ? "pt-0 pb-0" : "pt-10 pb-14 md:pt-14 md:pb-20"} ${bgClass} ${className}`}
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
        ) : isLumiere ? (
          /* Lumière Editorial Spread: Asymmetric image+text, magazine-style */
          <div className="relative mt-8 grid items-start gap-10 md:gap-8 lg:gap-10 md:grid-cols-[0.42fr_0.58fr]">
            {/* Text Column — narrower, sits to the left */}
            <RevealOnScroll delay={0.05} className="md:pt-12 lg:pt-16">
              {/* Heading */}
              <motion.h2
                initial={reduced ? {} : { opacity: 0, y: 16 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ fontFamily: headingFont }}
                className={`text-[clamp(2rem,4.2vw,3.4rem)] font-bold leading-[1.05] ${textPrimaryClass}`}
              >
                {heading}
              </motion.h2>

              {/* Subheading (kicker) */}
              {subheading && (
                <motion.p
                  initial={reduced ? {} : { opacity: 0, y: 16 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  className={`mt-5 text-[clamp(0.85rem,1vw,0.95rem)] font-semibold uppercase leading-[1.5] tracking-[0.18em] ${accentTextClass}`}
                >
                  {subheading}
                </motion.p>
              )}

              {/* Gold horizontal divider with fleuron */}
              <motion.div
                initial={reduced ? {} : { scaleX: 0 }}
                whileInView={reduced ? {} : { scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-7 flex items-center gap-3 origin-left"
                aria-hidden
              >
                <span className="block h-px flex-1 max-w-[60px] bg-gradient-to-r from-[var(--accent)] to-transparent" />
                <span
                  className="text-[0.9rem] text-[var(--accent)]"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  ❧
                </span>
                <span className="block h-px flex-1 max-w-[60px] bg-gradient-to-l from-[var(--accent)] to-transparent" />
              </motion.div>

              {/* Body content with drop cap & lead */}
              <div
                className={`mt-7 space-y-4 text-[1rem] leading-[1.75] md:text-[1.02rem] ${textPrimaryClass} ${
                  dropCap ? `${isLightBg ? "lumiere-dropcap" : "premium-dropcap"}` : ""
                } ${leadParagraph ? "premium-lead" : ""}`}
              >
                {children}
              </div>

              {/* Pull quote — centered italic serif */}
              {pullQuote && (
                <motion.blockquote
                  initial={reduced ? {} : { opacity: 0, y: 12 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="premium-editorial-blockquote mt-10 text-center"
                >
                  <span
                    aria-hidden
                    className="block text-[2.5rem] leading-none text-[var(--accent)]"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    &ldquo;
                  </span>
                  <p
                    style={{ fontFamily: "var(--font-fraunces)" }}
                    className={`mt-1 text-[clamp(1.1rem,1.5vw,1.3rem)] italic leading-[1.55] ${textPrimaryClass}`}
                  >
                    {pullQuote}
                  </p>
                  {pullQuoteAttribution && (
                    <cite
                      style={{ fontFamily: "var(--font-mono)" }}
                      className={`mt-3 block text-[0.7rem] not-italic tracking-[0.2em] uppercase ${accentTextClass}`}
                    >
                      — {pullQuoteAttribution}
                    </cite>
                  )}
                </motion.blockquote>
              )}

              {/* CTA link */}
              {ctaText && ctaHref && (
                <motion.div
                  initial={reduced ? {} : { opacity: 0 }}
                  whileInView={reduced ? {} : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-10"
                >
                  <Link
                    href={ctaHref}
                    className={`group inline-flex items-center gap-3 ${accentTextClass}`}
                  >
                    <span
                      style={{ fontFamily: "var(--font-mono)" }}
                      className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] underline underline-offset-[6px] decoration-1 group-hover:decoration-2 transition-all"
                    >
                      {ctaText}
                    </span>
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                    >
                      →
                    </span>
                  </Link>
                </motion.div>
              )}
            </RevealOnScroll>

            {/* Image Column — wider, sits to the right, intentionally offset higher */}
            <RevealOnScroll className="md:-mt-4 lg:-mt-8">
              <figure className="relative overflow-hidden rounded-sm">
                <div className="relative aspect-[4/5] md:aspect-[5/6]">
                  <NextImage
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="object-cover"
                  />
                </div>
                {imageCaption && (
                  <figcaption
                    style={{ fontFamily: "var(--font-mono)" }}
                    className={`mt-3 text-[0.62rem] uppercase tracking-[0.2em] ${textMutedClass}`}
                  >
                    {imageCaption}
                  </figcaption>
                )}
              </figure>
            </RevealOnScroll>
          </div>
        ) : (
          /* Asymmetric / Split Layout */
          <div
            className={`${nested ? "mt-6" : "mt-10"} grid items-start gap-8 lg:gap-10 ${
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
              <figure className="relative overflow-hidden rounded-2xl">
                <div className="relative aspect-[5/3]">
                  <NextImage
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {imageCaption && (
                  <figcaption
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="mt-2 px-1 text-[0.62rem] uppercase tracking-[0.18em] text-[var(--sgc-text-muted)]"
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
              <div
                className={`mt-6 space-y-5 text-[1rem] leading-[1.75] text-[var(--sgc-text-primary)] md:text-[1.05rem] ${
                  dropCap ? "premium-dropcap" : ""
                } ${leadParagraph ? "premium-lead" : ""}`}
              >
                {children}
              </div>

              {/* Decorative gold ornament */}
              {showOrnament && (
                <motion.div
                  initial={reduced ? {} : { opacity: 0, scale: 0.8 }}
                  whileInView={reduced ? {} : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-10 flex items-center justify-center gap-4"
                  aria-hidden
                >
                  <span className="block h-px w-12 bg-gradient-to-r from-transparent to-[var(--accent)]" />
                  <span className="text-[1.2rem] text-[var(--accent)]" style={{ fontFamily: "var(--font-fraunces)" }}>❧</span>
                  <span className="block h-px w-12 bg-gradient-to-r from-[var(--accent)] to-transparent" />
                </motion.div>
              )}

              {/* Pull quote */}
              {pullQuote && (
                <motion.blockquote
                  initial={reduced ? {} : { opacity: 0, x: -12 }}
                  whileInView={reduced ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="premium-editorial-blockquote mt-8 border-l-2 border-[var(--accent)] pl-6"
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
