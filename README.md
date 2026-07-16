# SGC Tech AI — Marketing Site

Practitioner-led Odoo ERP and AI implementation marketing site for the UAE
mid-market, built with Next.js 16 (App Router) and Turbopack.

> **AI assistant instructions:** see `AGENTS.md` / `CLAUDE.md` for the
> full build spec, hard bans, and non-obvious architecture facts. This
> README is the human-facing quick start.

## Stack

| What | Detail |
|---|---|
| Framework | Next.js 16 (App Router), Turbopack |
| Language | TypeScript 6, strict mode |
| Styling | Tailwind CSS 3 + CSS custom properties |
| 3D | Three.js + React Three Fiber + drei |
| Scroll animation | GSAP + ScrollTrigger (pinned/scrubbed sections) |
| Micro-interactions | Motion (`motion/react`) |
| Smooth scroll | Lenis |
| Package manager | Bun (preferred) or npm |
| Deploy | Vercel |

## Getting started

```bash
# install (Bun is the primary package manager — bun.lock is the source of truth)
bun install
# or: npm install

# local dev (http://localhost:3000)
bun run dev

# production build — this is the definitive verification gate; a change
# is not "done" until this passes clean
bun run build

# production preview of the built app
bun run start
```

Node 22.x is required (see `engines` in `package.json`).

## Scripts

| Command | Purpose |
|---|---|
| `bun run dev` | Start the Turbopack dev server |
| `bun run build` | Production build — type-checks and prerenders all routes |
| `bun run start` | Serve the production build locally |
| `bun run lint` | `next lint` |
| `bun run test` | Full Playwright suite |
| `bun run test:smoke` | `tests/smoke.spec.ts` only |

## Environment variables

Copy `.env.example` to `.env.local` for local dev. All variables are
optional — the site ships fully functional with none set.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID (`G-XXXXXXXXXX`). When unset, no analytics code is injected. |

## Project structure

```
app/            Next.js App Router routes (/, /about, /contact, /diagnostic, /privacy, /terms)
components/     React components, grouped by section/feature
  Hero/         Scroll-pinned 3D helix hero
  Shield/       Scroll-pinned 3D "shield" compliance section
  Finale/       Scroll-pinned convergence finale
  sections/     Standard marketing sections (problem, solution, pricing, FAQ, etc.)
  ui/           Shared primitives (cards, reveal animations, editorial layout)
  seo/          Structured data helpers (BreadcrumbJsonLd, etc.)
lib/            Non-React utilities (Lenis init, theme, audio synth)
hooks/          Shared React hooks
public/         Static assets — see "Asset hygiene" below
docs/           Production checklist and internal design notes
```

## Asset hygiene

`public/images/` has previously accumulated unused source files (raw
exports later replaced by optimized `.webp` versions, discarded concept
art, etc.). Before adding new images:

1. Prefer `.webp` for photographic content; optimize before committing.
2. If an image feeds a Three.js/`useTexture()` material (hero diamonds,
   Shield logo hex), keep it as small as the visual quality allows —
   these bypass `next/image` optimization entirely and load raw.
3. Before deleting anything you *think* is unused, confirm with:
   ```bash
   grep -rn "your-file-name" --include="*.tsx" --include="*.ts" app components lib hooks styles
   ```

## Performance notes

- The hero (`DiamondScrollHero`), Shield (`ShieldSection`), and Finale
  (`FinaleConvergenceSection`) canvases are pinned-scroll 3D sequences
  (600vh / 750vh / 400vh respectively) and are the primary Core Web
  Vitals risk. They're lazy-loaded via `next/dynamic({ ssr: false })`
  and gated behind viewport-proximity checks — keep new heavy work
  behind the same pattern.
- Run `docs/PRODUCTION-CHECKLIST.md` before any release; it documents
  hard performance/SEO/a11y/security targets and how to verify them.

## Documentation index

- `AGENTS.md` — AI coding assistant context (stack conventions, hard bans)
- `CLAUDE.md` — full build spec and design tokens
- `ARCHITECTURE.md` — runtime architecture, component tree, camera math
- `docs/PRODUCTION-CHECKLIST.md` — release gate checklist
- `SECURITY.md` — vulnerability reporting
- `DEPLOY.md` — deployment steps
