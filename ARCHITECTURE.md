# SGC Tech AI — Architecture & Build Status

> **Last updated**: 30 May 2026
> **Authoritative build prompt**: `CLAUDE.md` (read first before any work)
> **Project root**: `D:\01_WORK_PROJECTS\website-sgc`

---

## 1. Project Identity

SGC Tech AI is a **UAE-based, finance-credentialed Odoo + AI implementation firm** — CPAs, CIAs, CRMAs who have personally sat in CFO chairs inside UAE mid-market companies.

**This is NOT a SaaS startup or developer portfolio.** Every design choice reinforces the practitioner-led, advisory identity.

---

## 2. Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Language | TypeScript 6.0.3 (strict mode) |
| Styling | Tailwind CSS 3 + CSS custom properties (dual-defined) |
| 3D Engine | Three.js r184 + R3F 9.6 + drei 10.7 + postprocessing 3.0 |
| Scroll Animation | GSAP 3.15 + ScrollTrigger |
| Micro-interactions | Motion 12.40 (formerly `framer-motion`) |
| Smooth Scroll | Lenis 1.3 (wired to GSAP via `lib/lenis.ts`) |
| Deploy Target | Vercel (static export) |

### Build Commands

```bash
npm run dev     # next dev (Turbopack)
npm run build   # next build ← THE definitive verifier (no ESLint config)
npm run lint    # next lint (blocked on Windows — Next 16 CLI bug)
npm run start   # next start
```

**No test suite exists.** Build + lint are the only verification gates.

---

## 3. File Layout

```
app/
├── layout.tsx              # Root: Inter, Fraunces, JetBrains Mono via next/font
├── page.tsx                # Homepage assembly: Navbar → Hero → 8 Sections → Legacy Sections → Footer
└── globals.css             # Tailwind directives + CSS custom properties

components/
├── LenisProvider.tsx        # Client wrapper that calls initLenis() on mount
├── Navbar.tsx
├── Footer.tsx
├── HelixSpiral/             # All 3D scene components
│   ├── Scene.tsx            # R3F scene: camera, lighting, outerGroup, Bloom, DiamondPositionProjector
│   ├── DiamondRing.tsx      # Orchestrates 8 diamonds: per-frame lerp, hover, click-to-scroll
│   ├── Diamond.tsx          # Single diamond: PlaneGeometry + texture + pointLight + Billboard
│   ├── DNAHelix.tsx         # Two parametric helix strands + rungs (CatmullRomCurve3)
│   ├── RotatingSpine.tsx    # Baseline Y auto-rotation (0.08 rad/sec)
│   ├── SideCaption.tsx      # Fixed HTML caption: Motion AnimatePresence, right side
│   ├── diamondBindings.ts   # DIAMOND_BINDINGS[8] — index → #section-diamond-{n} mapping
│   └── diamonds.config.ts   # DIAMONDS[8] — image, headline, subhead, isCTA
├── Hero/                    # Hero section wrappers
│   ├── DiamondScrollHero.tsx # 600vh pinned container, ScrollTrigger, activeIndex derivation
│   ├── HelixCanvas.tsx      # R3F Canvas wrapper (dpr=[1,2], camera init)
│   ├── ConnectionLine.tsx   # HTML SVG overlay — gold dashed line slot → screen bottom
│   ├── DiamondPositionProjector.tsx  # R3F: projects world [-3.5, camY, 5] → CSS coords
│   ├── HeroTextOverlays.tsx  # (legacy, not in current page.tsx)
│   ├── HeroCanvas.tsx        # (legacy fallback)
│   ├── HeroScroll.tsx        # (legacy)
│   └── heroScenes.ts         # (legacy)
├── sections/                # Page sections below the hero
│   ├── SectionOne.tsx ~ SectionEight.tsx   # Diamond-anchored placeholder sections
│   ├── ProblemSection.tsx, SolutionSection.tsx, CaseStudySection.tsx
│   ├── PricingSection.tsx, ContactSection.tsx
├── ui/                      # Reusable UI primitives
└── AudioToggle.tsx          # Ambient soundtrack (non-critical)

lib/
└── lenis.ts                 # Lenis singleton + gsap ticker integration

styles/
└── hero.css                 # Design tokens as CSS custom properties (legacy)

.claude/
└── skills/
    └── diamond-section-binding.md  # Locked reference table (source of truth)
```

---

## 4. Component Tree (Runtime)

```
<html>
  <body>
    <LenisProvider>
      <main>
        <Navbar />
        <DiamondScrollHero>                    ← 600vh pinned container
          <HelixCanvas>                        ← R3F Canvas
            <Scene>                            ← useFrame: camera Y/Z, outerGroup rotation
              <group ref={outerGroupRef}>
                <RotatingSpine>                ← useFrame: baseline Y auto-rotation
                  <DNAHelix />                 ← Two strands + rungs (static geometry)
                  <Suspense fallback={null}>
                    <DiamondRing>              ← useFrame: per-frame lerp for all 8 diamonds
                      <Diamond /> x8           ← Each: Billboard + mesh + pointLight
                    </DiamondRing>
                  </Suspense>
                </RotatingSpine>
              </group>
              <EffectComposer><Bloom /></EffectComposer>
              <DiamondPositionProjector />     ← useFrame: project [-3.5, camY, 5] → screen
            </Scene>
          </HelixCanvas>
          <ConnectionLine />                   ← HTML SVG: gold dashed line
          <SideCaption />                      ← Motion AnimatePresence caption
        </DiamondScrollHero>
        <SectionOne /> ... <SectionEight />    ← #section-diamond-0 through #section-diamond-7
        <ProblemSection />
        <SolutionSection />
        <CaseStudySection />
        <PricingSection />
        <ContactSection />
        <Footer />
      </main>
    </LenisProvider>
  </body>
</html>
```

---

## 5. Data Flow Architecture

### Scroll → Progress → Active Index

```
Lenis scroll event
  → gsap.ticker + ScrollTrigger.update
    → ScrollTrigger.onUpdate(self.progress)
      → scrollProgressRef.current = self.progress
      → activeIndex = Math.round(self.progress × 7)
        → React state setActiveIndex(nextIndex)
          → Re-renders DiamondRing (activeIndex prop) + SideCaption
```

### Scene Camera & Rotation (Scene.tsx useFrame, runs first)

```
scrollProgressRef → p (0→1)

camIndex = progressToCamIndex(p)           # helixMotion.ts — smoothstep dwell per diamond
camY     = diamondY(camIndex)              # helixMotion.ts — (3.5 - i) × 1.5 (i=0 → +5.25 TOP, i=7 → -5.25 BOTTOM)

camera.position = (0, camY + 0.5, 7.5)    # descends as p increases (top → bottom)
camera.lookAt(0, camY, 0)

outerGroup.rotation.y = p × 2π            # full rotation across scroll
```

### Diamond Positioning (DiamondRing.tsx — static ORBIT_POSITIONS, per-frame activeness)

```
ORBIT_POSITIONS[i]:
  y = diamondY(i)                          # helixMotion.ts — SAME mapping as camera (single source of truth)
  t = (i/7) × 2π + π/2                    # orbital angle: diamond i faces camera when progress = i/7
  x = ORBIT_RADIUS × cos(t),  z = ORBIT_RADIUS × sin(t)   # ORBIT_RADIUS = 4.0

For each diamond every frame (pure function of scroll progress):
  activeness = diamondActiveness(camIndex, i)   # helixMotion.ts smoothstep, peaks at 1 when centred
  scale   = lerp(0.68, 1.12, activeness) × (1.06 if hovered)
  opacity = lerp(0.65, 1.0,  activeness)
  light.intensity = 0.6 + (0.15 if hovered)

No per-frame lerp on position — diamonds are fixed at ORBIT_POSITIONS; group rotation
surfaces the active one facing forward.
```

### Connection Line (DiamondPositionProjector useFrame)

```
World slot position = [-3.5, cameraY, 5]
  → project(camera) → NDC → CSS screen coords
  → Write to shared lineDataRef
  → ConnectionLine reads lineDataRef → renders SVG <line>
```

### Click → Section Scroll

```
User clicks a diamond (any diamond, even background)
  → handleClick(index)
    → getTargetSection(index) → "#section-diamond-{n}"
    → getLenis().scrollTo(element, { duration: 1.5 })
      → Lenis smooth-scrolls to the anchored section
```

---

## 6. Milestone Completion Status

### Milestone 1 — Scaffold ✅ (pre-May 2026)
- [x] Next.js project with Tailwind + turbopack
- [x] Lenis + GSAP ScrollTrigger integration
- [x] Empty R3F Canvas logging scroll progress

### Milestone 2 — Static Helix + Diamonds ✅ (pre-May 2026)
- [x] DNA double helix visible (CatmullRomCurve3 strands + rungs)
- [x] 8 diamond planes orbiting, billboarded, textured
- [x] Lighting + Bloom postprocessing

### Milestone 3 — Scroll Behavior ✅ (26 May 2026)
- [x] Camera Y/Z path driven by scroll progress
- [x] Active diamond highlight (scale, light, opacity)
- [x] Side caption with Motion AnimatePresence
- [x] 600vh pinned container
- [x] `npm run build` passes

### Milestone 3.5 — Diamond Emphasis Fix ✅ (29 May 2026)
- [x] Active diamond at world position `[-3.5, cameraY, 5]` (presentation slot)
- [x] Per-frame lerp replaces GSAP transition tweens (fixed 3 bugs at root)
- [x] World→local coordinate conversion via inverse outerGroup rotation
- [x] Gold dashed connection line (slot → screen bottom center)
- [x] All 8 diamonds clickable → Lenis scroll to `#section-diamond-{n}`
- [x] Hover effects via lerp (no GSAP)
- [x] 8 anchored placeholder sections
- [x] `npm run build` passes (zero errors)

### Milestone 3.6 — Regression Fixes ✅ (29 May 2026)
- [x] **Fix 1 — ConnectionLine RAF loop**: Rewrote `ConnectionLine.tsx` with a `requestAnimationFrame` loop forcing re-render every frame; SVG now continuously reads `lineDataRef.current` (was stale between `activeIndex` changes, invisible on load)
- [x] **Fix 2 — Line endpoint**: Changed `endY: height * 0.88` → `endY: height` in `DiamondPositionProjector.tsx` so line terminates at true screen bottom
- [x] **Fix 3 — Lerp lag mitigation**: Added `prevActiveRef` in `DiamondRing.tsx`; on `activeIndex` change, new active diamond is snapped 70% toward the slot before the per-frame lerp continues — reduces visible transition window from ~280ms to ~3 frames
- [x] **Fix 4 — Section bleed**: Added `backgroundColor: "#0B0F14"` and `zIndex: 1` to the sticky 100vh container in `DiamondScrollHero.tsx` to prevent sections below bleeding into the hero viewport
- [x] **Fix 5 — Dead ref removal**: Removed `cameraYRef` (`useRef<number>`) from all 4 files it was threaded through (`DiamondScrollHero`, `HelixCanvas`, `Scene`, `DiamondRing`); it was written but never consumed anywhere
- [x] `npm run build` passes (zero errors)

### Milestone 4 — Polish 🚧 (Next)

- [ ] Particles (400 via drei `<Sparkles>`)
- [ ] Mouse parallax on helix
- [ ] Gold hairline interactive elements
- [ ] `prefers-reduced-motion` fallback
- [ ] Performance verification (55fps+)
- [ ] Mobile adaptations

### Milestone 5 — All Sections 🚧
- [ ] Nav + Hero
- [ ] Founder credibility row
- [ ] Why CFOs Hire Us (3 cards)
- [ ] Meet the Founders
- [ ] Three-Layer Commercial Model
- [ ] Year One narrative pricing
- [ ] Rescue Audit CTA
- [ ] Footer

### Milestone 6 — Final QA 🚧
- [ ] Lighthouse (≥85 desktop, ≥70 mobile)
- [ ] Accessibility (≥95)
- [ ] Cross-browser
- [ ] Copy review

---

## 7. Recent Findings — M3.5 Bug Root Cause Analysis

Three visual bugs were identified and fixed in a single architectural change:

### Bug #1: Connection line drawn to wrong position
- **Root cause**: `DiamondPositionProjector` projected world `[-3.5, cameraY, 5]` correctly, but the active diamond was inside the rotating `outerGroup` at a *world* position that didn't match. The old GSAP tween set `handle.group.position.set(-3.5, cameraY, 5)` directly — but this is in the group's local space, and the group rotates with scroll, so the diamond orbited away from the line endpoint.
- **Fix**: Convert the world slot position to local space using the inverse of `outerGroup.rotation.y`. Diamond renders at local `R_y(-angle) × [-3.5, camY, 5]`, which after the parent rotation becomes world `[-3.5, camY, 5]` — matching the projector.

### Bug #2: Diamond never reaches presentation slot
- **Root cause**: GSAP tweens targeted `diamondRefs.current[i]`, but R3F callback refs could be null on first render. A guard `if (!handle) continue;` caused 0–2 diamonds to be initialized. Subsequent tweens targeting null refs produced no-ops.
- **Fix**: Per-frame lerp has no initialization dependency. If a ref is null on frame N, frame N+1 picks it up. No state is lost.

### Bug #3: Non-target diamonds stranded at wrong positions
- **Root cause**: GSAP enables `tl.kill()` on activeIndex change, which immediately stops tweens mid-flight. Non-target diamonds were never corrected back to orbit positions — they remained wherever the killed tween left them.
- **Fix**: Every diamond computes its correct target every frame. When activeIndex changes, old active starts lerping back to orbit instantly, new active starts lerping to slot. No killed tweens, no stranded diamonds.

### Architectural Decision

> **GSAP → per-frame lerp in `useFrame`**

The fix was to replace all GSAP position/scale/opacity/light tweens with a continuous per-frame exponential lerp (factor `delta × 8`, clamped at `0.05`). GSAP is **retained only** for scroll-scrubbing (ScrollTrigger driving camera path in `Scene.tsx` — an entirely different concern).

This eliminated all three bugs at the root cause:
1. No more killed-tweens-stranding (every diamond corrects every frame)
2. No more ref-timing race (null ref on frame N → populated on frame N+1)
3. World→local conversion via inverse rotation (active diamond spatially matches the projector)

### Bug #4 (Found 30 May 2026): RotatingSpine nesting — ALL bugs persisted at runtime

- **Root cause**: Even though the per-frame lerp + world→local conversion was correct for the `outerGroup` rotation, `DiamondRing` was nested **inside** `RotatingSpine` (`Scene.tsx:60-68`), which applies an independent 0.08 rad/sec auto-rotation. The transform chain became:
  ```
  world = R_y(outerAngle) × R_y(spineAngle) × slotLocal
       = R_y(spineAngle) × [-3.5, camY, 5]
  ```
  After 1 second the diamond drifted 4.6° off the slot; after 10 seconds it was 46° off. This caused connection line misalignment (Bug #1), diamond not at slot (Bug #2), and hover raycaster misses (Bug #3) — **all three bugs were still broken at runtime** even though the code was correct for the `outerGroup` transform alone.
- **Fix**: Move `DiamondRing` **outside** `RotatingSpine`, making it a direct child of `outerGroup` (sibling to `RotatingSpine`). `DNAHelix` stays inside `RotatingSpine` for its auto-rotation visual. This is a 3-line structural change in `Scene.tsx`.
- **Lesson**: Always account for ALL ancestor transforms when doing world↔local conversion. Nested rotating groups that appear "independent" still affect descendant positions.

---

## 8. Key Implementation Details

### LERP Factor
```
lerp_factor = clamp(delta, 0, 0.05) × 8
```
At 60fps (delta ≈ 0.016s): factor ≈ 0.128 per frame → ~7–8 frames (~130ms) to converge.
Delta is clamped to 0.05 to prevent teleportation on tab-away or frame spike.

### World → Local Slot Conversion
```
World point P = [-3.5, cameraY, 5]
outerGroup rotation = yAngle (set by scroll)

Local = R_y(-yAngle) × P
Local.x = -3.5 × cos(yAngle) - 5 × sin(yAngle)
Local.y = cameraY
Local.z = -3.5 × sin(yAngle) + 5 × cos(yAngle)
```

Verify: when `yAngle = 0`, `Local = [-3.5, cameraY, 5]` ✓
When rendered through outerGroup, `World = R_y(yAngle) × Local = [-3.5, cameraY, 5]` ✓

### Connection Line Composition
- `DiamondPositionProjector` (R3F, inside Canvas): projects world `[-3.5, camY, 5]` to CSS pixel coords on every frame → writes to shared `lineDataRef`
- `ConnectionLine` (HTML, overlaid SVG): reads `lineDataRef`, renders `<line>` from `(startX, startY)` → `(endX, endY)` (screen bottom center) with gold `#D4A574`, `stroke-dasharray="4 4"`, opacity 0.7
- `lineDataRef` is a React `RefObject` (stable, no re-render) shared via DiamondScrollHero → HelixCanvas → Scene → DiamondPositionProjector

### Diamond → Section Bindings (LOCKED)
```
Index  Image File        Section ID
─────  ─────────────     ─────────────────
0      excel.png         #section-diamond-0
1      manual.png        #section-diamond-1
2      6pm.png           #section-diamond-2
3      dispute.png       #section-diamond-3
4      month-old.png     #section-diamond-4
5      150k.png          #section-diamond-5
6      your-time.png     #section-diamond-6
7      empty-diamond.png #section-diamond-7
```

Source of truth: `components/HelixSpiral/diamondBindings.ts` + `.claude/skills/diamond-section-binding.md`

---

## 9. Known Issues & Caveats

| Issue | Status | Notes |
|-------|--------|-------|
| Font mismatch — `--font-outfit` used in legacy section CSS vars but Outfit is not loaded in `layout.tsx` | **Open** | Prefer Inter/Fraunces/Mono to avoid invisible text |
| No `.eslintrc` — `npm run lint` crashes on Windows (Next.js 16 CLI bug) | **Won't fix** | Build is the definitive check |
| `DiamondPositionProjector` passed unused `cameraYRef` and `activeIndex` props | **Fixed** | Cleaned up 30 May 2026 — interface simplified, unused destructure removed |
| RotatingSpine auto-rotation (0.08 rad/sec) conflicting with diamond position transforms | **Fixed** | Moved `DiamondRing` outside `RotatingSpine` (30 May 2026). `DNAHelix` retains auto-rotation visual; diamonds are unaffected |
| Camera ascended on scroll-down; `DiamondRing` had its own hardcoded Y formula duplicating `diamondY` | **Fixed** | `DiamondRing.tsx` now imports and uses `diamondY(i)` from `helixMotion.ts` (1 Jun 2026). `helixMotion.ts` `diamondY` sign re-applied so both camera and diamonds share one source of truth and descend together. `DiamondRing.tsx` protection rule still applies — only the Y source changed |
| Diamond images stored at `/images/diamonds/` (not `/diamonds/` as CLAUDE.md says — `diamonds.config.ts` is source of truth) | **Doc mismatch** | Config is correct |
| Lenis already initialized globally via `LenisProvider` — do NOT re-init in components | **Rule** | Use `getLenis()` from `@/lib/lenis` |
| No ESLint config exists | **Won't fix** | Build is sole verification; TypeScript 6.0.3 strict catches everything |

---

## 10. Next Actions

### Immediate (Milestone 4 — Polish)

1. **Particles**: Add 400 `<Sparkles>` from drei — cyan `#3FA9F5`, size 0.04, opacity 0.6, distributed in cylindrical volume (radius 6, height 14), slow upward drift
2. **Mouse parallax**: Subtle helix tilt following mouse position — onPointerMove on the Canvas container
3. **Gold hairline**: Build reusable `<GoldHairline>` wrapper — 1px gold line drawing left→right on hover, 200ms ease-out
4. **Reduced motion**: `prefers-reduced-motion` media query — render diamonds in static vertical grid, no rotation, no particles
5. **Mobile adaptations**: diamond size → 1.8, particles → 120, tube segments → 300 below 768px
6. **Performance verification**: chrome-devtools MCP — 55fps+ target, zero CLS

### After M4 Approval

7. **Milestone 5** — Build all 10 sections per CLAUDE.md spec:
   - Section 2: Hero (headline + subhead + dual CTA)
   - Section 3: Founder credibility row
   - Section 5: Why CFOs Hire Us (3 scenario cards)
   - Section 6: Meet the Founders
   - Section 7: Three-Layer Commercial Model
   - Section 8: Year One narrative pricing
   - Section 9: Rescue Audit CTA
   - Section 10: Footer
8. **Milestone 6** — Final QA: Lighthouse, cross-browser, a11y, copy review

---

## 11. Protection Rules

### Files — DO NOT TOUCH
```
components/HelixSpiral/RotatingSpine.tsx   ← Baseline auto-rotation (0.08 rad/sec) — final
components/HelixSpiral/DNAHelix.tsx         ← Helix geometry — final
```

### Props — DO NOT CHANGE
- `Diamond.tsx`: must export `DiamondHandle` interface with `group`, `material`, `light`
- `Scene.tsx`: camera/rotation logic in `useFrame` is final

### Hard Bans (from CLAUDE.md)
- ❌ Purple accent of any shade
- ❌ Space Grotesk font
- ❌ Technology stack badges
- ❌ Rotating hexagon shields
- ❌ "Served 50+ instances" claims
- ❌ More than 5 Aceternity components
- ❌ Bullet-point dense sections
- ❌ Motion for scroll-scrubbed / GSAP for micro-interactions

---

## 12. Quick Reference

```typescript
// Get Lenis: always use the accessor, never re-init
import { getLenis } from "@/lib/lenis";
const lenis = getLenis();
lenis.scrollTo(element, { duration: 1.5 });

// Path alias: @/* → ./*
import Scene from "@/components/HelixSpiral/Scene";  // OK
// NOT: import Scene from "./components/HelixSpiral/Scene";

// All components are "use client" except layout.tsx and page.tsx
// No server components, no data fetching, no API routes

// Build verification
npm run build  // ← must pass before any commit
```

---

*End of ARCHITECTURE.md — update this document when milestones complete or architecture changes.*
