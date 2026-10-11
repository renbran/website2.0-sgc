"use client";

import { Volume2, VolumeX } from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";

/**
 * Hero overlay — eyebrow, headline, subhead, audio affordance.
 *
 * Copy is carried over verbatim from HeroIntroOverlay (the helix hero it
 * replaces), because that component owned the page's only <h1>. Dropping the
 * helix without carrying the heading forward would leave the homepage with no
 * <h1> at all.
 *
 * The split-line typewriter and scroll-driven "doors" exit are intentionally
 * NOT reproduced: they were bound to the 600vh helix scroll progress, which no
 * longer exists. This is a static, centred treatment over the video.
 */

const EYEBROW = "PRACTITIONER-LED · DUBAI, UAE";
const HEADLINE = "Transform Operations. Improve Visibility. Scale with Confidence.";
const SUBHEAD =
  "ERP implementation, AI automation, financial reporting, and UAE compliance — we diagnose the real problem first, then build the fix.";

export default function VideoHeroContent({
  soundOn,
  onToggleSound,
}: {
  soundOn: boolean;
  /** Omitted when the hero source has no audio track — the button is then not rendered. */
  onToggleSound?: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "0 1.5rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-inter, sans-serif)",
          fontSize: "0.65rem",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "#C7A23A",
          margin: 0,
          opacity: 0.9,
        }}
      >
        {EYEBROW}
      </p>

      {/* Full text is real DOM text (not an image, not background-clip), so it
          is indexable and readable by assistive tech. */}
      <h1
        style={{
          fontFamily: "var(--font-fraunces, serif)",
          fontSize: "clamp(1.7rem, 3.8vw, 3.2rem)",
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: "-0.015em",
          color: "#D4A574",
          margin: 0,
          maxWidth: "18ch",
          textWrap: "balance",
          // Sits over moving footage; a soft shadow keeps the gold legible
          // against the lighter passes of the video without a scrim.
          textShadow: "0 2px 24px rgba(8,11,17,0.85)",
        }}
      >
        {HEADLINE}
      </h1>

      <p
        style={{
          fontFamily: "var(--font-inter, sans-serif)",
          fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
          lineHeight: 1.7,
          color: "#C8B89A",
          margin: 0,
          maxWidth: "58ch",
          textShadow: "0 2px 18px rgba(8,11,17,0.8)",
        }}
      >
        {SUBHEAD}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
        <a
          href="/diagnostic"
          className="inline-flex items-center rounded-full border border-[rgba(199,162,58,0.45)] px-6 py-3 text-sm font-medium tracking-wide text-[#E8D5B0] transition hover:border-[#C7A23A] hover:bg-[rgba(199,162,58,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7A23A]"
        >
          Book a diagnostic
        </a>

        {/* Sound affordance. The shipped hero MP4s are silent, so this is
            rendered only when the caller supplies an audible source; the
            control stays in the DOM contract so wiring one up is a prop away. */}
        {onToggleSound ? (
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundOn ? "Mute hero audio" : "Play hero audio"}
            aria-pressed={soundOn}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(199,162,58,0.3)] bg-[rgba(8,11,17,0.45)] text-[var(--sgc-cyan)] transition duration-300 ease-out hover:scale-105 hover:border-[var(--sgc-cyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sgc-cyan)]"
          >
            <AnimatedIcon deps={[soundOn]}>
              {soundOn ? (
                <Volume2 size={18} className="text-[var(--sgc-cyan)]" />
              ) : (
                <VolumeX size={18} className="text-text-muted" />
              )}
            </AnimatedIcon>
          </button>
        ) : null}
      </div>
    </div>
  );
}
