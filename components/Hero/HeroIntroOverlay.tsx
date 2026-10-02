"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroIntroOverlayProps {
  scrollProgressRef: { current: number };
}

const DOOR_END = 0.12;
const TYPE_SPEED_MS = 36; // ms per character — full headline in ~2.3 s

const EYEBROW = "PRACTITIONER-LED · DUBAI, UAE";
const HEADLINE = "Transform Operations. Improve Visibility. Scale with Confidence.";
const SUBHEAD =
  "ERP implementation, AI automation, financial reporting, and UAE compliance — we diagnose the real problem first, then build the fix.";

// Split points for the split-exit animation (matches original SVG line break)
const LINE1 = "Transform Operations. Improve";  // 29 chars
const LINE2 = "Visibility. Scale with Confidence."; // 34 chars

function gracefulImg(props: React.ComponentPropsWithRef<"img">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      {...props}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
      }}
    />
  );
}

// Single source of truth for the hero's <h1> markup. The reduced-motion and
// full-motion render paths below are mutually exclusive (only one is ever
// mounted, gated by `reduced`), so there is never more than one <h1> in the
// DOM at a time — but they previously duplicated the heading's base styles
// independently, risking visual drift if one copy was edited without the
// other. Both paths now render this shared component instead.
function HeroHeadlineH1({
  fontSize,
  letterSpacing,
  textAlign,
  children,
}: {
  fontSize: string;
  letterSpacing: string;
  textAlign?: React.CSSProperties["textAlign"];
  children: React.ReactNode;
}) {
  return (
    <h1
      style={{
        fontFamily: "var(--font-fraunces, serif)",
        fontSize,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing,
        color: "#D4A574",
        margin: 0,
        ...(textAlign ? { textAlign } : {}),
      }}
    >
      {children}
    </h1>
  );
}

/**
 * Hero intro overlay — the doors / logo / headline that clear on first scroll.
 *
 * The exit was driven by `motion` motion values + `useTransform` sampled in a
 * permanent rAF loop. It is now plain arithmetic written straight to the DOM
 * from the scroll event, which also removes that always-on frame loop:
 * `apply()` runs only when progress actually changes, and is fully reversible.
 */
export default function HeroIntroOverlay({
  scrollProgressRef,
}: HeroIntroOverlayProps) {
  const reduced = useReducedMotion();

  // Typewriter: plays automatically on mount, not scroll-driven
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    if (reduced) {
      setTypedChars(HEADLINE.length);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTypedChars(i);
      if (i >= HEADLINE.length) clearInterval(id);
    }, TYPE_SPEED_MS);
    return () => clearInterval(id);
  }, [reduced]);

  const washRef = useRef<HTMLDivElement>(null);
  const wash2Ref = useRef<HTMLDivElement>(null);
  const reducedContentRef = useRef<HTMLDivElement>(null);
  const doorLeftRef = useRef<HTMLDivElement>(null);
  const doorRightRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const markRef = useRef<HTMLImageElement>(null);

  // Scroll-driven exit. Every value is a pure linear function of progress
  // (normalised to 0..1 across DOOR_END), so forward and reverse scroll render
  // identically. `sgc:helix-progress` is dispatched by DiamondScrollHero on
  // scroll updates; the native scroll listener is the fallback for
  // window.scrollTo (tests, deep links).
  useEffect(() => {
    const apply = (p: number) => {
      const t = Math.min(1, Math.max(0, p / DOOR_END));
      const inv = 1 - t;

      const setOpacity = (el: HTMLElement | null) => {
        if (el) el.style.opacity = String(inv);
      };
      setOpacity(washRef.current);
      setOpacity(wash2Ref.current);
      setOpacity(markRef.current);
      setOpacity(reducedContentRef.current);
      setOpacity(headlineWrapRef.current);
      setOpacity(subRef.current);

      if (logoRef.current) {
        const rot = reduced ? 0 : 22 * t;
        const scale = reduced ? 1 : 1 + 0.12 * t;
        logoRef.current.style.opacity = String(inv);
        logoRef.current.style.transform = `translateX(-50%) rotate(${rot}deg) scale(${scale})`;
      }
      if (doorLeftRef.current) {
        doorLeftRef.current.style.transform = `translateX(${-100 * t}%)`;
      }
      if (doorRightRef.current) {
        doorRightRef.current.style.transform = `translateX(${100 * t}%)`;
      }
      if (line1Ref.current) {
        line1Ref.current.style.transform = `translateX(${-65 * t}vw) rotate(${-28 * t}deg)`;
      }
      if (line2Ref.current) {
        line2Ref.current.style.transform = `translateX(${65 * t}vw) rotate(${28 * t}deg)`;
      }
      if (subRef.current) {
        subRef.current.style.transform = `translateY(${56 * t}px)`;
      }
    };

    apply(scrollProgressRef.current ?? 0);

    const onProgress = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      apply(typeof detail === "number" ? detail : scrollProgressRef.current ?? 0);
    };
    const onScroll = () => apply(scrollProgressRef.current ?? 0);

    window.addEventListener("sgc:helix-progress", onProgress);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("sgc:helix-progress", onProgress);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced, scrollProgressRef]);

  const wrapStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    zIndex: 20,
    pointerEvents: "none",
    overflow: "hidden",
  };

  // Cursor logic
  const isCursorOnLine1 = typedChars <= LINE1.length;
  const showCursor = typedChars > 0 && typedChars < HEADLINE.length;
  const cursor = showCursor ? (
    <span
      style={{
        display: "inline-block",
        width: "2px",
        marginLeft: "2px",
        animation: "sgc-blink 0.9s step-end infinite",
        color: "#D4A574",
      }}
    >
      |
    </span>
  ) : null;

  const line1Typed = HEADLINE.slice(0, Math.min(typedChars, LINE1.length));
  const line2Typed =
    typedChars > LINE1.length
      ? HEADLINE.slice(LINE1.length + 1, typedChars)
      : " "; // non-breaking space holds line height

  /* ── Reduced-motion path ─────────────────────────────────────────── */
  if (reduced) {
    return (
      <div style={wrapStyle}>
        <div
          ref={washRef}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 90% 75% at 50% 50%, rgba(8,11,17,0.92) 0%, rgba(8,11,17,0.60) 65%, rgba(8,11,17,0.15) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          ref={reducedContentRef}
          style={{
            position: "absolute",
            top: "12vh",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
            paddingInline: "2rem",
          }}
        >
          {gracefulImg({
            src: "/images/diamonds/final-logo-nav.png",
            alt: "SGC Tech AI",
            style: { width: "clamp(160px, 28vw, 280px)", height: "auto", display: "block" },
          })}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              color: "#F4F1E8",
              fontSize: "clamp(0.6rem, 1vw, 0.78rem)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              opacity: 0.65,
              textAlign: "center",
            }}
          >
            {EYEBROW}
          </p>
          <HeroHeadlineH1
            fontSize="clamp(1.5rem, 3vw, 2.6rem)"
            letterSpacing="-0.01em"
            textAlign="center"
          >
            {HEADLINE}
          </HeroHeadlineH1>
          <p
            style={{
              fontFamily: "var(--font-inter, sans-serif)",
              fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
              lineHeight: 1.7,
              color: "#C8B89A",
              letterSpacing: "0.01em",
              textAlign: "center",
              margin: 0,
              maxWidth: "58ch",
            }}
          >
            {SUBHEAD}
          </p>
        </div>
        {gracefulImg({
          ref: markRef,
          src: "/images/sgc-logo-mark.webp",
          width: 160,
          height: 160,
          alt: "",
          "aria-hidden": "true",
          style: {
            position: "absolute",
            bottom: "3rem",
            left: "50%",
            transform: "translateX(-50%)",
            height: "40px",
            width: "auto",
            display: "block",
          },
        })}
      </div>
    );
  }

  /* ── Full-motion path ────────────────────────────────────────────── */
  return (
    <div style={wrapStyle}>

      {/* Darkened wash — two layers for stronger legibility behind text */}
      <div
        ref={washRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(8,11,17,0.45)",
          pointerEvents: "none",
        }}
      />
      <div
        ref={wash2Ref}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 75% at 50% 50%, rgba(8,11,17,0.88) 0%, rgba(8,11,17,0.55) 60%, rgba(8,11,17,0.10) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Left door */}
      <div
        ref={doorLeftRef}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "50%", height: "100%",
          borderRight: "1px solid rgba(199,162,58,0.1)",
        }}
      />

      {/* Right door */}
      <div
        ref={doorRightRef}
        style={{
          position: "absolute",
          top: 0, right: 0,
          width: "50%", height: "100%",
          borderLeft: "1px solid rgba(199,162,58,0.1)",
        }}
      />

      {/* Logo + eyebrow */}
      <div
        ref={logoRef}
        style={{
          position: "absolute",
          top: "10vh",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {gracefulImg({
          src: "/images/diamonds/final-logo-nav.webp",
          alt: "SGC Tech AI",
          width: 560,
          height: 152,
          style: { width: "clamp(160px, 28vw, 280px)", height: "auto", display: "block" },
        })}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            color: "#F4F1E8",
            fontSize: "clamp(0.6rem, 1vw, 0.78rem)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.65,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {EYEBROW}
        </p>
      </div>

      {/* Hero headline + subhead */}
      <div
        style={{
          position: "absolute",
          top: "44vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(820px, 84vw)",
          textAlign: "center",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        {/* overflow:hidden clips each line; headline opacity hard-kills any bleed */}
        <div ref={headlineWrapRef} style={{ overflow: "hidden", width: "100%" }}>
          <HeroHeadlineH1
            fontSize="clamp(1.7rem, 3.8vw, 3.2rem)"
            letterSpacing="-0.015em"
          >
            {/* Full text always in DOM for SEO / screen readers */}
            <span
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              {HEADLINE}
            </span>
            {/* Visible: typewriter + split-exit */}
            <span ref={line1Ref} aria-hidden="true" style={{ display: "block", transformOrigin: "left center" }}>
              {line1Typed}
              {isCursorOnLine1 ? cursor : null}
            </span>
            <span ref={line2Ref} aria-hidden="true" style={{ display: "block", transformOrigin: "right center" }}>
              {line2Typed}
              {!isCursorOnLine1 ? cursor : null}
            </span>
          </HeroHeadlineH1>
        </div>

        <p
          ref={subRef}
          style={{
            fontFamily: "var(--font-inter, sans-serif)",
            fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
            lineHeight: 1.7,
            color: "#C8B89A",
            letterSpacing: "0.01em",
            margin: 0,
            maxWidth: "62ch",
          }}
        >
          {SUBHEAD}
        </p>
      </div>

      {/* MARK */}
      {gracefulImg({
        ref: markRef,
        src: "/images/sgc-logo-mark.webp",
        width: 160,
        height: 160,
        alt: "",
        "aria-hidden": "true",
        style: {
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          height: "40px",
          width: "auto",
          display: "block",
          zIndex: 5,
        },
      })}

      <style>{`
        @keyframes sgc-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
