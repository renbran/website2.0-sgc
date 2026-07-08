"use client";

import { useEffect, useState } from "react";
import { GOLD } from "./complianceData";

const HEADLINE = "Nothing slips through.";
const CHAR_MS = 55;                             // ms per character → ~1.2s total
const HEAD_DUR_MS = HEADLINE.length * CHAR_MS;
const SUB_DELAY_MS = HEAD_DUR_MS + 120;
const SUB_DUR_MS = 580;

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export default function FinaleTitle({
  start: startTrigger,
  reducedMotion,
}: {
  start: boolean;
  reducedMotion?: boolean;
}) {
  const reduced = reducedMotion ?? false;
  const [visChars, setVisChars] = useState(0);
  const [subProg, setSubProg] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    if (!startTrigger) {
      setVisChars(0);
      setSubProg(0);
      return;
    }
    if (reduced) {
      setVisChars(HEADLINE.length);
      setSubProg(1);
      return;
    }

    const t0 = performance.now();
    let raf: number;
    const tick = () => {
      const elapsed = performance.now() - t0;
      setVisChars(Math.min(HEADLINE.length, Math.floor(elapsed / CHAR_MS)));
      const se = elapsed - SUB_DELAY_MS;
      if (se > 0) setSubProg(easeOutQuart(Math.min(1, se / SUB_DUR_MS)));
      if (elapsed < SUB_DELAY_MS + SUB_DUR_MS + 40) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startTrigger, reduced]);

  // Cursor blinks while characters are still being typed
  useEffect(() => {
    const typing = startTrigger && !reduced && visChars < HEADLINE.length;
    if (!typing) return;
    const iv = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(iv);
  }, [startTrigger, reduced, visChars]);

  const showCursor = startTrigger && !reduced && visChars < HEADLINE.length;
  const subY = (1 - subProg) * 14;

  const cursorEl = showCursor ? (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: "2px",
        height: "0.78em",
        background: GOLD,
        marginLeft: "3px",
        verticalAlign: "text-bottom",
        opacity: cursorOn ? 1 : 0,
      }}
    />
  ) : null;

  const subtitleEl = (align: "left" | "center") => (
    <p
      style={{
        fontFamily: "var(--font-inter,sans-serif)",
        fontSize: "clamp(0.95rem,1.2vw,1.28rem)",
        fontWeight: 400,
        lineHeight: 1.65,
        color: "var(--text-primary)",
        textAlign: align,
        maxWidth: "44ch",
        margin: align === "center" ? "0 auto" : "0",
        opacity: subProg,
        transform: `translateY(${subY}px)`,
        willChange: "opacity, transform",
      }}
    >
      Hidden costs. Compliance gaps. Lost time. We{" "}
      <span style={{ color: GOLD, fontWeight: 600 }}>find the leaks</span>
      {" "}—{" "}
      <br />
      and{" "}
      <span style={{ color: GOLD, fontWeight: 600 }}>seal them.</span>
    </p>
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* ── Mobile (<lg): centered above shield ──────────────────── */}
      <div
        className="lg:hidden"
        style={{
          position: "absolute",
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          maxWidth: "92vw",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-fraunces,Georgia,serif)",
            fontSize: "clamp(2.6rem,10vw,4.2rem)",
            fontWeight: 800,
            color: GOLD,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            textAlign: "center",
          }}
        >
          <span>{HEADLINE.slice(0, visChars)}</span>
          {cursorEl}
        </div>
        <div style={{ height: "0.9rem" }} />
        {subtitleEl("center")}
      </div>

      {/* ── Desktop (≥lg): left half — shield has glided to the right ── */}
      <div
        className="hidden lg:flex"
        style={{
          position: "absolute",
          top: "50%",
          left: "3%",
          transform: "translateY(-50%)",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: "32vw",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-fraunces,Georgia,serif)",
            fontSize: "clamp(4.5rem,8vw,11rem)",
            fontWeight: 800,
            color: GOLD,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
          }}
        >
          <span>{HEADLINE.slice(0, visChars)}</span>
          {cursorEl}
        </div>
        {subtitleEl("left")}
      </div>
    </div>
  );
}
