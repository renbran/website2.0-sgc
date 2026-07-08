# Production Deployment Checklist — sgctech.ai

This is the gate every release must clear before it ships. Run the items in
order; each section has a single owner and a deterministic pass / fail.

---

## 1. Build & types

| # | Check | Owner | Pass criteria |
|---|---|---|---|
| 1.1 | `bun install --frozen-lockfile` | DevOps | exit 0 |
| 1.2 | `bun run build` | DevOps | 9 static routes generated, no warnings beyond `LF will be replaced by CRLF` |
| 1.3 | TypeScript strict | DevOps | `tsc --noEmit` clean (currently skipped via `ignoreBuildErrors: true` in `next.config.ts`) |
| 1.4 | Bundle size sanity | DevOps | `.next/` size delta < 20% vs previous release |
| 1.5 | Secrets scan | DevOps | `gitleaks detect --no-git` returns no findings |

## 2. SEO & crawl

| # | Check | Owner | Pass criteria |
|---|---|---|---|
| 2.1 | `metadataBase` set | SEO | `app/layout.tsx:38` points at `https://sgctech.ai` |
| 2.2 | Title + description per route | SEO | `/`, `/privacy`, `/terms` all have unique `title` + `description` |
| 2.3 | Canonical URL | SEO | `<link rel="canonical">` resolves to the absolute URL of the page |
| 2.4 | `robots.txt` | SEO | `https://sgctech.ai/robots.txt` allows `/`, points to sitemap |
| 2.5 | `sitemap.xml` | SEO | `https://sgctech.ai/sitemap.xml` includes `/`, `/privacy`, `/terms` |
| 2.6 | Open Graph image | SEO | `/opengraph-image` returns 200, image is 1200×630 PNG |
| 2.7 | Twitter card | SEO | `<meta name="twitter:card" content="summary_large_image">` present |
| 2.8 | JSON-LD (ProfessionalService) | SEO | Homepage has `@type: ProfessionalService` with `legalName`, `address`, `email`, `sameAs` |
| 2.9 | JSON-LD (FAQPage) | SEO | Homepage injects `@type: FAQPage` for the 6 FAQ entries |
| 2.10 | JSON-LD (WebPage on legal pages) | SEO | `/privacy` + `/terms` inject `@type: WebPage` |
| 2.11 | No `noindex` on public routes | SEO | None of `/`, `/privacy`, `/terms` set `robots: { index: false }` |
| 2.12 | Hreflang if multilingual | SEO | N/A — single-locale site. Verify nothing claims `en_AE` accidentally |

## 3. Legal & compliance

| # | Check | Owner | Pass criteria |
|---|---|---|---|
| 3.1 | `/privacy` reachable | Legal | Renders, PDPL-aligned, mentions UAE Federal Decree-Law No. 45 of 2021 |
| 3.2 | `/terms` reachable | Legal | Renders, governing law = UAE / Dubai |
| 3.3 | Footer Privacy / Terms | Legal | Both route via `<Link>` to real pages (no mailto) |
| 3.4 | Effective date stamped | Legal | `Effective 1 July 2026` (or current) shown on both legal pages |
| 3.5 | Data controller identified | Legal | "Scholarix Global Consultant FZE" + Maseed Building, Al Rigga address on `/privacy` |
| 3.6 | No fabricated claims | Editorial | No award claims; capability badges only (verified Feb 2026 audit) |

## 4. Accessibility (WCAG 2.2 AA)

| # | Check | Owner | Pass criteria |
|---|---|---|---|
| 4.1 | One `<h1>` per page | A11y | Each rendered page has exactly one `<h1>` (hero overlay + visible content agree) |
| 4.2 | Heading order | A11y | No skipped levels in document outline |
| 4.3 | `aria-labelledby` on sections | A11y | Every `<section>` has it where labelled |
| 4.4 | Focus rings | A11y | Visible on every interactive element via `:focus-visible` |
| 4.5 | Mobile drawer a11y | A11y | `aria-modal="true"`, `aria-expanded`, Escape closes, body scroll locked |
| 4.6 | `prefers-reduced-motion` | A11y | Loading screen, cursor, helix all respect it (verified by `useReducedMotion` usage) |
| 4.7 | Image alt text | A11y | Every `<img>` / `<Image>` has meaningful `alt` |
| 4.8 | Color contrast | A11y | Body text on `#080B11` bg ≥ 4.5:1 — gold accent (`#D4A574`) ≥ 3:1 on dark |
| 4.9 | Keyboard nav | A11y | Tab order reaches every CTA, drawer, modal |
| 4.10 | Skip link | A11y | "Skip to content" link as first focusable element |

## 5. Performance (Core Web Vitals)

Run on a production build deployed to a real host (Lighthouse desktop + mobile).

| # | Metric | Target | Hard fail |
|---|---|---|---|
| 5.1 | LCP (Largest Contentful Paint) | < 2.5s | > 4s |
| 5.2 | INP (Interaction to Next Paint) | < 200ms | > 500ms |
| 5.3 | CLS (Cumulative Layout Shift) | < 0.1 | > 0.25 |
| 5.4 | TBT (Total Blocking Time) | < 200ms | > 600ms |
| 5.5 | Speed Index | < 3.0s | > 5s |
| 5.6 | Total page weight (gzipped) | < 2MB | > 4MB |
| 5.7 | Hero WebGL cold-start | < 1.5s | > 3s |
| 5.8 | Mobile (Moto G4 emulated) LCP | < 4s | > 6s |

The pinned helix (600vh), shield (750vh), and finale (400vh) are the obvious
risk. Recent commits `8a1f8a8` and `9c6a6bf` already optimised warm-up and
MSAA. Confirm with a Lighthouse run after each release.

## 6. Browser & device compatibility

| # | Check | Owner | Pass criteria |
|---|---|---|---|
| 6.1 | Chrome (latest) | QA | Loads, all sections render, no console errors |
| 6.2 | Edge (latest) | QA | Same as Chrome |
| 6.3 | Safari (latest, macOS) | QA | WebGL paths run, fonts load, no FOIT |
| 6.4 | iOS Safari (iPhone 14+) | QA | Touch interactions work, cursor doesn't render (mobile fallback) |
| 6.5 | Android Chrome (Pixel 7 emulated) | QA | Same as iOS Safari |
| 6.6 | Reduced-motion users | QA | Loading screen fade-in only, no helix camera motion |
| 6.7 | Touch devices | QA | PremiumCursor component does not mount (only fine-pointer) |

## 7. Security

| # | Check | Owner | Pass criteria |
|---|---|---|---|
| 7.1 | Security headers | DevOps | `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()` |
| 7.2 | HTTPS-only | DevOps | All routes 301 → HTTPS, HSTS header present (host-dependent) |
| 7.3 | `.env*` ignored | DevOps | `.gitignore` excludes `.env`, `.env.local`, etc. |
| 7.4 | No remote image origins beyond founder placeholder | DevOps | `next.config.ts` `images.remotePatterns` limited to `res.cloudinary.com` only |
| 7.5 | `SECURITY.md` published | DevOps | Repo root, describes private vulnerability reporting |
| 7.6 | No `console.log` in production bundle | DevOps | grep returns nothing under `app/` / `components/` |
| 7.7 | Dependency audit | DevOps | `bun audit` (or `npm audit`) returns no `critical` findings |
| 7.8 | External links `rel="noreferrer"` | QA | All `target="_blank"` links set `rel="noreferrer noopener"` |

## 8. Conversion & analytics

| # | Check | Owner | Pass criteria |
|---|---|---|---|
| 8.1 | WhatsApp link | Marketing | `https://wa.me/971521985231` in Footer + 3× per-option prefill in Contact |
| 8.2 | Email links | Marketing | `mailto:info@sgctech.ai` working in Footer (no client mailto dead-ends) |
| 8.3 | All CTAs route to real destinations | Marketing | No remaining mailto on CTAs except the Compliance enquiry and the per-option email links |
| 8.4 | No third-party analytics | Privacy | No GA4, Plausible, Hotjar, etc. (site is intentionally analytics-free) |
| 8.5 | No tracking pixels | Privacy | No Meta / LinkedIn pixel |

## 9. Operational

| # | Check | Owner | Pass criteria |
|---|---|---|---|
| 9.1 | Release tag | DevOps | `git tag vX.Y.Z` created and pushed |
| 9.2 | CI workflow | DevOps | `.github/workflows/ci.yml` runs `bun install` + `bun run build` on push / PR |
| 9.3 | Deploy documented | DevOps | `DEPLOY.md` describes steps for chosen host |
| 9.4 | Rollback plan | DevOps | Previous tag known, `git revert` or redeploy documented |
| 9.5 | Uptime monitor | DevOps | Pingdom / UptimeRobot / host-native monitor on `https://sgctech.ai` |
| 9.6 | Error tracking | DevOps | Sentry (or host equivalent) wired — note: not yet configured |
| 9.7 | Analytics | DevOps | Plausible or host-native (note: site ships with no analytics by design) |

## 10. Repository hygiene

| # | Check | Owner | Pass criteria |
|---|---|---|---|
| 10.1 | Working tree clean | Dev | No untracked / modified files (modulo screenshots and `image_001.jpg`) |
| 10.2 | Branch up to date | Dev | `git fetch` clean, ahead only by intentional commits |
| 10.3 | Lockfile committed | Dev | `bun.lock` (or `bun.lockb`) tracked |
| 10.4 | `.gitignore` complete | Dev | `.next`, `node_modules`, `.env*`, IDE, OS junk |
| 10.5 | Memory persisted | Dev | `.claude/memory.md` (or equivalent) checked in |
| 10.6 | No orphan components | Dev | `grep` for default exports vs. import graph — every export has ≥ 1 caller |

---

## Scorecard

Compute the score by counting `✅` / `❌` in each row above. Targets per section:

| Section | Target | Hard floor |
|---|---|---|
| 1. Build & types | 5/5 | 4/5 |
| 2. SEO & crawl | 12/12 | 11/12 |
| 3. Legal & compliance | 6/6 | 6/6 |
| 4. Accessibility | 10/10 | 9/10 |
| 5. Performance | 8/8 | 6/8 |
| 6. Browser compat | 7/7 | 6/7 |
| 7. Security | 8/8 | 7/8 |
| 8. Conversion | 5/5 | 5/5 |
| 9. Operational | 7/7 | 5/7 |
| 10. Repo hygiene | 6/6 | 6/6 |

**Aggregate:** 74/74 = production ready.

---

## Pre-deploy checklist (run in order)

```bash
# 1. Build & types
bun install --frozen-lockfile
bun run build
gitleaks detect --no-git

# 2. Smoke routes
bun run start &
sleep 5
curl -fsSL https://sgctech.ai/ | head -50
curl -fsSL https://sgctech.ai/robots.txt
curl -fsSL https://sgctech.ai/sitemap.xml
curl -fsSL https://sgctech.ai/privacy
curl -fsSL https://sgctech.ai/terms

# 3. Headless smoke (Playwright)
node scripts/shoot.mjs

# 4. Lighthouse (requires Chrome on host)
npx lighthouse https://sgctech.ai --preset=desktop --output=json --output-path=./lh-desktop.json
npx lighthouse https://sgctech.ai --preset=mobile --output=json --output-path=./lh-mobile.json

# 5. Tag & push
git tag v1.0.0
git push origin feature/act3-convergence-finale --tags
```

## Post-deploy

- [ ] Smoke the live URL in a real browser
- [ ] Confirm the WhatsApp link opens with a real number
- [ ] Confirm `mailto:info@sgctech.ai` opens the system mail client
- [ ] Check the sitemap.xml submission in Google Search Console
- [ ] File the lighthouse-desktop + lighthouse-mobile JSON artifacts under `docs/lighthouse/<date>/`