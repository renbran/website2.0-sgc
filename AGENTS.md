# website-sgc — SGC Tech AI corporate site

## First thing

**Read `CLAUDE.md`** first — it is the authoritative build prompt with the full spec, hard bans, build sequence (M1→M6), design tokens, copy, and acceptance criteria. This AGENTS.md only covers hard-earned context that CLAUDE.md does not.

**Then read `ARCHITECTURE.md`** — it documents the live runtime architecture (component tree, data flow, camera math, lerp system, milestone completion status). Keep it in sync when you change architecture.

## Stack

| What | Detail |
|------|--------|
| Framework | Next.js 16 (App Router), Turbopack enabled |
| Language | TypeScript 6, strict mode |
| Styling | Tailwind CSS 3 + CSS custom properties (dual-defined) |
| 3D | Three.js r184 + R3F + drei + postprocessing |
| Scroll animation | **GSAP + ScrollTrigger** only (camera path, helix rotation) |
| Micro-interactions | **Motion** (formerly framer-motion) — AnimatePresence, gestures, layout |
| Smooth scroll | Lenis 1.3 (wired to GSAP via `lib/lenis.ts`) |
| Deploy | Vercel, static export (see `.vercel/project.json`) |

## Commands

```
npm run dev     # next dev (Turbopack) — local dev
npm run build   # next build          ← THE definitive verifier (pass before commit)
npm run lint    # next lint           ← BROKEN on Windows (Next 16 CLI bug), do not rely on it
npm run start   # next start          — production preview
```

**No tests exist.** Build output is the only verification gate. Ignore lint failures on Windows.

## Architecture that matters

- **`@/*` = `./*`** (no `src/` directory).
- **All components are `"use client"`** except `app/layout.tsx` and `app/page.tsx`.
- **No server components, no data fetching, no API routes.** Static marketing site only.
- **No `opencode.json`** — project config is in `.mcp.json` (MCP servers), `CLAUDE.md` (instructions), and `.omc/` (OpenCode memory).

### Lenis — initialize once, never re-init
`LenisProvider` in `app/layout.tsx` calls `initLenis()` on mount. Components that need smooth-scroll must use:
```ts
import { getLenis } from "@/lib/lenis";
const lenis = getLenis();
lenis.scrollTo(element, { duration: 1.5 });
```
Do NOT call `initLenis()` or `new Lenis()` anywhere else.

### GSAP boundary — scroll-scrubbing only
GSAP is **retained only** for scroll-scrubbing (ScrollTrigger driving camera Y/Z path and helix rotation in `Scene.tsx`). All diamond position/scale/opacity/light animations use **per-frame exponential lerp** in `useFrame` (factor `clamp(delta, 0, 0.05) × 8`). Never add GSAP tweens to diamond properties.

### DiamondRing must be sibling of RotatingSpine
`DiamondRing` is a **sibling** of `RotatingSpine` inside `outerGroup`, not a child. The `RotatingSpine` auto-rotation (0.08 rad/sec) would drift diamond positions if they were nested inside it. `DNAHelix` stays inside `RotatingSpine` for the rotation visual.

### Diamond active slot math
The active diamond renders at a world position `[-3.5, cameraY, 5]`. Since this is inside a rotating `outerGroup`, the local position is computed by inverse rotation:
```ts
local.x = -3.5 × cos(yAngle) - 5 × sin(yAngle);
local.y = cameraY;
local.z = -3.5 × sin(yAngle) + 5 × cos(yAngle);
```
Do not hard-code. Use the `worldToLocal` helper pattern in `DiamondRing.tsx`.

## Non-obvious facts

### 1. Font mismatch (open issue)
`layout.tsx` loads **Inter**, **Fraunces**, and **JetBrains Mono** only. Many existing components reference `--font-outfit` in inline styles — Outfit is **not loaded**. Do NOT add more Outfit references. Prefer loaded fonts: `font-fraunces` (headings), `font-inter` (body), `font-mono` (credentials).

### 2. Design tokens dual-defined
- `tailwind.config.js` — Tailwind classes (`bg-bg`, `text-accent`, `bg-surface`, etc.)
- `styles/hero.css` — CSS custom properties (`--bg`, `--accent`, `--helix-glow`) plus legacy `--sgc-*` aliases

Prefer Tailwind classes in new code. CSS vars exist because older sections use inline `var(--sgc-*)` or `var(--bg)`.

### 3. Diamond images at `/images/diamonds/` (not `/diamonds/`)
Path in `diamonds.config.ts` is source of truth:
```
/images/diamonds/{excel,manual,6pm,dispute,month-old,150k,your-time,empty-diamond}.png
```

### 4. Build state (May 2026)
- **M1 (scaffold)** ✅, **M2 (static helix)** ✅, **M3 (scroll behavior)** ✅, **M3.5 (diamond emphasis)** ✅
- **M4 (polish)**: 🚧 Particles, mouse parallax, gold hairline, reduced-motion fallback, mobile adaptations
- **M5 (all sections)**: 🚧 Sections 2, 3, 5-10 per CLAUDE.md spec
- **M6 (final QA)**: 🚧

### 5. MCP servers (`.mcp.json`)
Six servers: gsap-master, threejs-devtools, chrome-devtools, playwright, shadcn, context7.
(Note: no motion-dev MCP exists — use `.claude/skills/motion-react.md` + context7 for Motion API.)

### 6. Motion API guidance
The free `motion` library (12.x) is used. The package was renamed from `framer-motion` in 2024. Consult `.claude/skills/motion-react.md` and use context7 to fetch `motion.dev/docs/[topic]` before writing Motion code. Old framer-motion examples silently break.

### 7. Component sourcing order
1. Existing project component — don't duplicate
2. shadcn/ui via MCP — primitives
3. Aceternity UI — hero/showcase sections only (max 5 site-wide)
4. Origin UI — operational sections
5. Custom — only if nothing fits; ask before building

### 8. Diamond → Section binding
Source of truth: `components/HelixSpiral/diamondBindings.ts`. Each diamond clicks to `#section-diamond-{0..7}`. The `.claude/skills/diamond-section-binding.md` is a secondary reference but has different section IDs — trust `diamondBindings.ts`.

### 9. GitHub agents
`.github/agents/` has two custom agents: `next.js-frontend-designer.agent.md` and `next.js-frontend-architect.agent.md`.

## Hard bans (from CLAUDE.md)
- ❌ Purple accent of any shade
- ❌ Space Grotesk font
- ❌ Technology stack badges
- ❌ Rotating hexagon shields
- ❌ "Served 50+ instances" or unverifiable claims
- ❌ More than 5 Aceternity components site-wide
- ❌ Bullet-point dense sections (premium sites breathe)
- ❌ Motion for scroll-scrubbed animation / GSAP for micro-interactions
