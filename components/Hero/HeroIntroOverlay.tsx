"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "motion/react";

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

function gracefulImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
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

export default function HeroIntroOverlay({
  scrollProgressRef,
}: HeroIntroOverlayProps) {
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);

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

  // RAF loop: syncs progress motion value for scroll-driven exit animations
  useEffect(() => {
    let raf: number;
    const tick = () => {
      progress.set(scrollProgressRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress, scrollProgressRef]);

  // Door panels
  const leftX = useTransform(progress, [0, DOOR_END], ["0%", "-100%"]);
  const rightX = useTransform(progress, [0, DOOR_END], ["0%", "100%"]);

  // Logo exit
  const logoOpacity = useTransform(progress, [0, DOOR_END], [1, 0]);
  const logoRotate = useTransform(progress, [0, DOOR_END], [0, reduced ? 0 : 22]);
  const logoScale = useTransform(progress, [0, DOOR_END], [1, reduced ? 1 : 1.12]);

  const reducedFade = useTransform(progress, [0, DOOR_END], [1, 0]);
  const washOpacity = useTransform(progress, [0, DOOR_END], [1, 0]);

  // Headline split-exit: immediate on first scroll, viewport-relative so text always clears
  const line1X      = useTransform(progress, [0, DOOR_END], ["0vw", "-65vw"]);
  const line2X      = useTransform(progress, [0, DOOR_END], ["0vw",  "65vw"]);
  const line1Rotate = useTransform(progress, [0, DOOR_END], [0, -28]);
  const line2Rotate = useTransform(progress, [0, DOOR_END], [0,  28]);
  // Headline opacity also fades to 0 by DOOR_END — belt-and-suspenders against bleed
  const headlineOpacity = useTransform(progress, [0, DOOR_END], [1, 0]);

  // Subhead slides down + fades on exit
  const subY = useTransform(progress, [0, DOOR_END], [0, 56]);

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
      : " "; // non-breaking space holds line height

  /* ── Reduced-motion path ─────────────────────────────────────────── */
  if (reduced) {
    return (
      <div style={wrapStyle}>
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 90% 75% at 50% 50%, rgba(8,11,17,0.92) 0%, rgba(8,11,17,0.60) 65%, rgba(8,11,17,0.15) 100%)",
            opacity: washOpacity,
            pointerEvents: "none",
          }}
        />
        <motion.div
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
            opacity: reducedFade,
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
        </motion.div>
        <motion.img
          src="/sgc-logo.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "3rem",
            left: "50%",
            transform: "translateX(-50%)",
            height: "40px",
            width: "auto",
            display: "block",
            opacity: washOpacity,
          }}
        />
      </div>
    );
  }

  /* ── Full-motion path ────────────────────────────────────────────── */
  return (
    <div style={wrapStyle}>

      {/* Darkened wash — two layers for stronger legibility behind text */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(8,11,17,0.45)",
          opacity: washOpacity,
          pointerEvents: "none",
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 75% at 50% 50%, rgba(8,11,17,0.88) 0%, rgba(8,11,17,0.55) 60%, rgba(8,11,17,0.10) 100%)",
          opacity: washOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Left door */}
      <motion.div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "50%", height: "100%",
          x: leftX,
          borderRight: "1px solid rgba(199,162,58,0.1)",
        }}
      />

      {/* Right door */}
      <motion.div
        style={{
          position: "absolute",
          top: 0, right: 0,
          width: "50%", height: "100%",
          x: rightX,
          borderLeft: "1px solid rgba(199,162,58,0.1)",
        }}
      />

      {/* Logo + eyebrow */}
      <motion.div
        style={{
          position: "absolute",
          top: "10vh",
          left: "50%",
          translateX: "-50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          opacity: logoOpacity,
          rotate: logoRotate,
          scale: logoScale,
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
            whiteSpace: "nowrap",
          }}
        >
          {EYEBROW}
        </p>
      </motion.div>

      {/* Hero headline + subhead */}
      <motion.div
        style={{
          position: "absolute",
          top: "44vh",
          left: "50%",
          translateX: "-50%",
          width: "min(820px, 84vw)",
          textAlign: "center",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        {/* overflow:hidden clips each line; headlineOpacity hard-kills any bleed */}
        <motion.div style={{ overflow: "hidden", width: "100%", opacity: headlineOpacity }}>
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
            <motion.span aria-hidden="true" style={{ display: "block", x: line1X, rotate: line1Rotate, transformOrigin: "left center" }}>
              {line1Typed}
              {isCursorOnLine1 ? cursor : null}
            </motion.span>
            <motion.span aria-hidden="true" style={{ display: "block", x: line2X, rotate: line2Rotate, transformOrigin: "right center" }}>
              {line2Typed}
              {!isCursorOnLine1 ? cursor : null}
            </motion.span>
          </HeroHeadlineH1>
        </motion.div>

        <motion.p
          style={{
            fontFamily: "var(--font-inter, sans-serif)",
            fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
            lineHeight: 1.7,
            color: "#C8B89A",
            letterSpacing: "0.01em",
            margin: 0,
            maxWidth: "62ch",
            opacity: washOpacity,
            y: subY,
          }}
        >
          {SUBHEAD}
        </motion.p>
      </motion.div>

      {/* MARK */}
      <motion.img
        src="/sgc-logo.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          height: "40px",
          width: "auto",
          display: "block",
          zIndex: 5,
          opacity: washOpacity,
        }}
      />

      <style>{`
        @keyframes sgc-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
