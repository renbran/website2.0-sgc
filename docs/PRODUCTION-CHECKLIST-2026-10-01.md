# Production Checklist & Re-Audit Report — 2026-10-01

**Repo:** `C:\website-sgc\website2.0-sgc` · **Branch:** `main` → `origin/main` (Vercel project `website2-0-sgc` = production)
**Scope of this release:** (1) full-site hardening pass from `docs/SITE-AUDIT-2026-10-01.md`; (2) anonymous case-study showcase (`docs/CASE-STUDY-SHOWCASE-PLAN-2026-10.md`).

---

## 1. Global gates — pre-deploy verification

| # | Gate | Status | Evidence |
|---|---|---|---|
| 1 | TypeScript clean | ✅ | `npx tsc --noEmit` — no errors |
| 2 | Production build | ✅ | `npm run build` — 38 routes, 0 errors |
| 3 | Smoke tests (incl. new routes) | ✅ | 24/24 on isolated rerun; parallel-run flakes documented (use `--workers=1` for clean signal) |
| 4 | Client anonymity | ✅ | `grep` of `.next/static` + `.next/server` for any client name/legal entity → **0 matches** |
| 5 | three.js out of first load | ✅ | No initial chunk contains three; initial JS **1,409 → 1,038 KB** raw |
| 6 | Fonts trimmed | ✅ | 3 preloads (Inter, Fraunces, JetBrains Mono); Outfit/Playfair gone |
| 7 | Media weight | ✅ | `public/` **129 → 35 MB**; 259 unreferenced files deleted |
| 8 | Cache headers | ✅ | `/images|/videos|/frames|/shield|/diamonds|/legal|/bg-music` → 7-day + SWR |
| 9 | robots.txt | ✅ | All major AI crawlers allowed; `/api/` disallowed; sitemap declared |
| 10 | sitemap.xml | ✅ | 19 URLs, real per-route `lastModified` (no build-time churn) |
| 11 | llms surfaces | ✅ | `/llms.txt`, `/llms-full.txt` (new), `/ai.txt` — canonical facts, anonymized descriptors, "Last updated" |
| 12 | Titles / descriptions | ✅ | All ≤60 / ≤160 (per-page matrix below) |
| 13 | One `<h1>` per page | ✅ | 19/19 content routes |
| 14 | Canonical + OG + Twitter | ✅ | 19/19 routes carry canonical, `og:*` (incl. `og:url`) and `twitter:card` |
| 15 | Structured data | ✅ | Site graph (@id) + per-page: Service/Offer, FAQPage, Article, Quiz, WebPage, CollectionPage, BreadcrumbList |
| 16 | Security headers | ✅ | Existing CSP/HSTS etc. unchanged (no diff in that block) |
| 17 | Reduced motion | ✅ | Homepage `<h1>` rendered in fallback; credential strip removed; loading screen skips; three canvases already reduced-motion aware |
| 18 | Anchors | ✅ | Lenis offset −80; `#platform`, `#proof-by-numbers`, `#finale` scroll-mt; no broken in-page links |
| 19 | Claims consistency | ✅ | Stats/hours/fees/FAQs single-sourced from `canonical-facts`; OSUS 65-total/11-back-office correction applied |
| 20 | No secrets in diff | ✅ | `git status` scan — none |

---

## 2. Per-page matrix (all critical + new pages)

Legend: ✅ present/within limits · tLen = title length · dLen = description length (decoded). All pages: canonical ✅, OG ✅, Twitter ✅, H1 ×1 ✅, robots `index, follow` unless noted.

| Route | tLen | dLen | Structured data | In sitemap | Notes |
|---|---|---|---|---|---|
| `/` | 57 | 131 | FAQPage + site graph | ✅ | three.js removed from initial chunks; reduced-motion H1 |
| `/pricing` | 39 | 136 | **Service + 3×Offer/PriceSpec** + Crumb | ✅ (new) | AED 14,000 / 20% AMC / AED 875 — wired to canonical facts |
| `/case-studies` **(new)** | 54 | 155 | CollectionPage + ItemList + Crumb | ✅ (new) | Hub; anonymized cards |
| `/case-studies/dubai-brokerage-72m-recovered` **(new)** | 48 | 149 | Article + FAQPage + Crumb | ✅ (new) | AED 72M; 6-7 wk build; Bitrix↔Odoo |
| `/case-studies/uae-brokerage-445-roi` **(new)** | 46 | 151 | Article + FAQPage + Crumb | ✅ (new) | 445% ROI / 2.2 mo / ~248 hrs |
| `/case-studies/construction-erp-vat-readiness` **(new)** | 52 | 144 | Article + FAQPage + Crumb | ✅ (new) | VAT AED 10–12K; repeat event eliminated |
| `/services` | 59 | 158 | CollectionPage + Crumb | ✅ | service hub |
| `/services/odoo-implementation-uae` | 42 | 145 | Service + FAQPage + Article + Crumb | ✅ | links to brokerage case |
| `/services/odoo-implementation-rescue` | 46 | 144 | Service + FAQPage + Article + Crumb | ✅ | links to construction case |
| `/services/ai-automation-finance` | 39 | 151 | Service + FAQPage + Article + Crumb | ✅ | AI-credit rate from canonical facts |
| `/services/uae-corporate-tax-compliance` | 50 | 142 | Service + FAQPage + Article + Crumb | ✅ | |
| `/services/outsourced-financial-reporting` | 50 | 150 | Service + FAQPage + Article + Crumb | ✅ | links to brokerage case |
| `/about` | 57 | 140 | WebPage-adjacent + Crumb | ✅ | |
| `/contact` | 59 | 132 | LocalBusiness (global) + Crumb | ✅ | hours = Mon–Fri only (single source) |
| `/diagnostic` | 45 | 150 | Quiz + Crumb | ✅ | |
| `/platform` | 56 | 138 | WebPage + Crumb | ✅ | Organization by @id |
| `/privacy` | 28 | 123 | WebPage + Crumb | ✅ | |
| `/terms` | 30 | 141 | WebPage + Crumb | ✅ | |
| `/legal/subscription` | 32 | 128 | site graph only | ✅ (new) | own OG URL added |
| `/subscribe` | — | — | — | n/a | dynamic, `noindex, follow` — verify post-deploy |
| `/subscribe/done` | — | — | — | n/a | dynamic, `noindex, nofollow` — verify post-deploy |
| Machine surfaces | — | — | `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/ai.txt`, `/opengraph-image`, `/icon.png` | — | all static, verified in build |

---

## 3. Post-deploy verification — results (live 2026-10-01, commit `1a7537d`)

| Check | Status | Result |
|---|---|---|
| Vercel production deploy | ✅ | `/case-studies` live within ~90 s of push |
| 4 new routes respond 200 | ✅ | hub + 3 case-study pages all 200 |
| Anonymity on live HTML | ✅ | grep for client names across homepage + 2 case pages → 0 matches |
| `/llms.txt` live | ✅ | "clients anonymized on request" + case-studies link + Last updated |
| `/llms-full.txt` live | ✅ | 200, includes case-study URLs |
| `/sitemap.xml` live | ✅ | 4 case-studies URLs present |
| `/robots.txt` live | ✅ | `Disallow: /api/` active |
| Homepage meta live | ✅ | new 131-char description serving |
| `/pricing` live | ✅ | new title + `Offer` schema present |
| 404 handling | ✅ | `/case-studies/does-not-exist` → 404 |
| IndexNow resubmission | ✅ | 19 URLs submitted, `200 OK` |

**Remaining manual checks (need browser/external tools):**

- [x] Lighthouse mobile spot-check: `/`, `/pricing`, one case page, `/contact` — run 2026-10-01; SEO 100 / BP 100 / A11y 100 everywhere. Absolute performance values unreliable on this audit machine (100% CPU); see `docs/SEO-AEO-GEO-SCORECARD-2026-10-01.md` for numbers, caveats and the homepage follow-up recommendation.
- [x] Structured-data validation: custom required-field validator on 7 pages — all pass; no Review/AggregateRating; no client-name leakage.
- [x] AI crawler access: GPTBot / ClaudeBot / PerplexityBot / Google-Extended / CCBot / Bytespider all return 200; robots allowlist verified.
- [x] OG/social server-side: `og:image` serves 200 `image/png` 96 KB; per-page `og:url`, Twitter card present.
- [x] A11y fixes shipped: `<dl>` valid on homepage; `/pricing` contrast 4.5:1 (`4e2de5e`) — both re-verified at 100 live.
- [x] Hero three.js deferral shipped (`4fd2187`): splash-done signal (`lib/splash.ts`), canvas mounts after the splash clears; live probe shows the 233 KB three chunk starting at ~1.5 s instead of ~0.4 s during hydration; canvas renders, scroll works, 0 errors.
- [ ] Google Rich Results test UI (optional — structured data already passes the required-field validator; the UI test needs a browser session)
- [ ] GA4 Realtime / GTM Preview: `page_view` fires for a new route (account login required)
- [ ] WhatsApp + contact CTA click-through on homepage and a case page (send test; links/prefills smoke-verified)
- [ ] Social card debugger (Facebook/X — login required; server-side OG verified)
- [ ] Google Search Console: confirm sitemap; request indexing for the 4 new URLs (account login required)
- [ ] Reliable performance numbers: PageSpeed Insights with API key (or idle machine) + CrUX field data

## 4. Rollback

- Code: `git revert <merge-sha>` and push, or redeploy the previous Vercel deployment (instant, no rebuild).

## 5. Notes

- **Smoke suite flakes:** run `npx playwright test tests/smoke.spec.ts --workers=1` against a local production server for a deterministic signal; the parallel full-repo run is contention-bound on the homepage.
- **Internal record:** client names → `docs/CASE-STUDY-INTERNAL-RECORD.md` (never bundled, never served). No client name exists anywhere in this release's build output.
- **Worktree note:** `website2.0-sgc-l3` is a fully-merged feature-branch worktree and is behind `main`; all changes here target `website2.0-sgc` (`main`) only.
- **`tsconfig.tsbuildinfo`** is a tracked build artifact and churns with every build — harmless.
