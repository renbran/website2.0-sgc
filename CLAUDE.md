# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Full architecture, milestone status, data flow, and known issues**: read `ARCHITECTURE.md` before starting any non-trivial task.

---

## Commands

```bash
bun run dev      # next dev (Turbopack, port 3000)
bun run build    # next build — the ONLY verification gate (no test suite)
bun run start    # next start
bun run lint     # broken on Windows (Next 16 CLI bug) — skip, use build instead
```

**Always use Bun.** Never npm/yarn. `bun run build` must pass before any commit.

---

## Branch & Working Rules

**Check your branch first**: `git branch --show-current`. The active staging branch is `staging/3d-storytelling`. The main feature branch is `feature/homepage-content-v1`.

On the staging branch: **ADDITIVE ONLY**. Create new files; do not edit frozen files.

---

## Project Identity (Non-negotiable)

SGC Tech AI is a UAE-based, finance-credentialed Odoo + AI implementation firm led by CPAs and CIAs. Every design decision must reinforce a practitioner-led, advisory identity — not a SaaS startup or developer portfolio.

Hard bans: ❌ Purple accent of any shade · ❌ Space Grotesk font · ❌ Technology stack badges · ❌ Rotating hexagon shields · ❌ "Served 50+ instances" claims · ❌ More than 5 Aceternity components · ❌ Bullet-point-dense sections

---

## Frozen Files — Never Modify

```
components/HelixSpiral/Scene.tsx
components/HelixSpiral/DNAHelix.tsx
components/HelixSpiral/RotatingSpine.tsx
components/HelixSpiral/DiamondRing.tsx
components/HelixSpiral/helixMotion.ts
components/Hero/DiamondScrollHero.tsx
components/Hero/HeroIntroOverlay.tsx
lib/scrubPlayer.ts
lib/swooshPlayer.ts
lib/cinematicSynth.ts
hooks/useHelixScrub.ts
components/AudioToggle.tsx
Navbar.tsx, Footer.tsx — all copy, color palette, fonts, committed section spacing
```

Also do not change:
- `Diamond.tsx`'s `DiamondHandle` interface (`group`, `material`, `light` fields)
- The camera/rotation `useFrame` logic in `Scene.tsx`

---

## Architecture Overview

**Single-page Next.js 16 App Router site** (no server components, no data fetching, no API routes). All components are `"use client"` except `layout.tsx` and `page.tsx`.

**Page assembly** (`app/page.tsx`): `Navbar → CredentialRow → DiamondScrollHero → ProblemSection → SolutionSection → CaseStudySection → FounderSection → CommercialModelSection → PricingSection → SectionEight → ContactSection → Footer`

**Path alias**: `@/*` resolves to `./` (root of `website-sgc/`).

### The Helix System (showpiece)

`DiamondScrollHero` is a `600vh` pinned container. Inside it:
- `HelixCanvas` wraps the R3F `<Canvas>` (dpr capped at 2)
- `Scene.tsx` drives camera Y/Z via `useFrame` reading `scrollProgressRef` — **not GSAP**
- `RotatingSpine` applies 0.08 rad/sec baseline Y auto-rotation to `DNAHelix` only
- `DiamondRing` is a **sibling** of `RotatingSpine` (not nested inside it — critical for world→local math)
- Diamond positions use per-frame exponential lerp (`delta × 8`, clamped at 0.05), not GSAP tweens
- `helixMotion.ts` is the single source of truth for all scroll→position math (`diamondY`, `progressToCamIndex`, `diamondActiveness`)

**Scroll pipeline**: Lenis → GSAP ticker → `ScrollTrigger.update` → `scrollProgressRef.current` → R3F `useFrame` reads ref directly (no React state in the hot path).

**Active diamond index** (React state, drives caption): `Math.round(progress × 7)` → `setActiveIndex` in `DiamondScrollHero`.

### Lenis (smooth scroll singleton)

Always access via `getLenis()` from `@/lib/lenis`. Never re-initialize in components — `LenisProvider` owns the singleton.

```typescript
import { getLenis } from "@/lib/lenis";
getLenis()?.scrollTo(element, { duration: 1.5 });
```

### Animation Tool Split (strict)

| What | Tool |
|------|------|
| Scroll-scrubbed camera/rotation | GSAP ScrollTrigger |
| Diamond position/scale/opacity | R3F `useFrame` per-frame lerp |
| Caption fade in/out | Motion `<AnimatePresence>` |
| Button hover / tap | Motion gestures |
| Page transitions | Motion `<AnimatePresence>` |

**Never** use Motion for scroll-scrubbed work. **Never** use GSAP for component micro-interactions.

When writing Motion code, consult `.claude/skills/motion-react.md` and use context7 to fetch current docs — the package was renamed from `framer-motion` in 2024 and old examples silently break. When writing GSAP, use the gsap-master MCP.

---

## Design Tokens

All tokens are Tailwind classes (defined in `tailwind.config.js`) and CSS custom properties (defined in `styles/hero.css` / `app/globals.css`).

| Token | Value | Use |
|-------|-------|-----|
| `bg-bg` | `#0B0F14` | Page background |
| `bg-surface` / `bg-surface-high` | — | Cards, panels |
| `text-text-primary` | `#F4F1EA` | Body text (warm off-white, never cold gray) |
| `text-accent` / `bg-accent` | `#D4A574` | Gold primary accent |
| `text-accent-cool` | `#6FA8C3` | Muted cyan-blue secondary |
| `text-helix-glow` | `#3FA9F5` | Cyan glow — helix 3D scene only |

Fonts (loaded in `layout.tsx` via `next/font/google`):
- `font-fraunces` — headings (editorial, serious)
- `font-inter` — body
- `font-mono` (JetBrains Mono) — credentials, mono text only

**Signature interaction**: every interactive element gets a 1px gold hairline drawing left-to-right on hover, 200ms ease-out (`<GoldHairline>` wrapper in `components/ui/GoldHairline.tsx`).

---

## UI Component Sourcing Priority

1. Existing project component (don't duplicate)
2. shadcn/ui via shadcn MCP
3. Aceternity UI — hero/showcase only (max 5 site-wide)
4. Origin UI — operational sections (pricing, forms, footer)
5. Magic UI — accent effects only
6. Custom — ask before building

---

## Diamond → Section Bindings (locked)

8 diamonds map to `#section-diamond-{0..7}`. Source of truth: `components/HelixSpiral/diamondBindings.ts` and `.claude/skills/diamond-section-binding.md`. Image files live at `/images/diamonds/` (not `/diamonds/`).

---

## Known Gotchas

- `npm run lint` crashes on Windows — use `bun run build` as the sole verification gate.
- Do not use `--font-outfit` CSS var in new components — Outfit is not loaded in `layout.tsx`.
- `DiamondPositionProjector` + `ConnectionLine` share a `lineDataRef` (stable ref, no re-renders). The line is an SVG overlay driven by a `requestAnimationFrame` loop in `ConnectionLine.tsx` — do not replace this with React state.
- `prefers-reduced-motion`: `DiamondScrollHero` renders `<ReducedMotionFallback />` in place of the entire helix. Mobile (<768px): `particleCount=120`, `diamondSize=2.0`, `strandSegments=300`.

---

## Reporting Format (for staged changes)

branch confirmation → files created/changed (named) → `bun run build` result → git status → screenshot list → STOP for approval.
