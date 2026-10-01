# SGC Tech AI — Full-Site Audit & Change Plan

**Repo:** `C:\website-sgc\website2.0-sgc` · **Branch:** `main` @ `eed245f`
**Date:** 2026-10-01 · **Scope:** all 17 routes, homepage 15 sections, assets, metadata, schema, copy
**Method:** source audit + built-output inspection (`.next/server/app/index.html`) + cross-check against `content/canonical-facts.ts`, `SEO AND EO PROMPT.md`, `docs/AEO-RECOVERY-REPORT-2026-09.md`

---

## Verdict

The foundations are strong: one canonical entity graph, AI-crawler allowlist, `llms.txt`/`ai.txt`, a real 13-route sitemap, IndexNow, and no fabricated Review markup. The gap is now **three-layer**:

> **Status 2026-10-01 — hardening pass implemented.** All P0 items and the high-value P1 defects below were fixed the same day; see "Hardening pass — implemented" at the end. Remaining items are parked in the enhancement plan.

1. **Performance debt** — three.js (~370 KB) is in the initial eager bundle despite the `next/dynamic` work, a 1.4 s minimum splash gates every page, 129 MB of `public/` (≈94 MB unused), and two unused Google fonts are preloaded.
2. **Trust/consistency defects** — the finale stats contradict the signed OSUS case study (4–6 mo payback vs 2.2 months; 10 hrs/wk vs ~248 hrs/wk), and `llms.txt`/`ai.txt` tell AI engines the office is open Saturday while `/contact`, schema and canonical facts say closed.
3. **Commercial/AEO gaps** — `/pricing` (highest-intent route) has zero structured data and is missing from the sitemap; homepage meta description is 230 chars; the reduced-motion homepage has no `<h1>`; H1s carry no target keywords.

Everything below is actionable with file:line evidence. Nothing in the repo was modified.

---

## P0 — fix before the next deploy

| # | Defect | Evidence | Fix |
|---|---|---|---|
| 1 | **Finale stats contradict the signed OSUS case study.** "4–6 mo Typical payback" and "10 hrs/wk Returned to the founder" vs canonical 2.2 months / ~248 hrs/wk released. The file comment says "the finale summarizes, it does not invent new claims" — it violates that. | `components/Finale/FinaleStats.tsx:13-15` vs `content/canonical-facts.ts:105,109` | Replace with `2.2 months` payback and `~248 hrs/wk released`; source or drop the unsourced "60% faster monthly close". |
| 2 | **Opening-hours contradiction fed to AI engines.** `llms.txt` says "Sat 09:00–13:00"; `ai.txt` says "Saturday 09:00–13:00"; `/contact` says "Saturday – Sunday: Closed"; canonical + schema list Mon–Fri only. | `app/llms.txt/route.ts:44`, `app/ai.txt/route.ts:40`, `app/contact/page.tsx:196-199`, `content/canonical-facts.ts:58-60`, `lib/schema.ts:95-100` | Derive hours strings from `ORG.hours` in both route files (single source), or delete the Saturday claim. |
| 3 | **Homepage meta description is 230 chars** (Google truncates ~155-160). Contradicts the AEO recovery report's claim that all routes were trimmed. | `app/page.tsx:4-5` | Rewrite ≤155: "Practitioner-led Odoo ERP and AI implementation for UAE mid-market firms. CPAs and CIAs, diagnosis-first, fixed price and timeline." (137) |
| 4 | **three.js (~370 KB raw) loads on first paint.** `page.tsx` statically imports `ShieldSection` → `shieldMotion.ts` → `import * as THREE` and module-scope `new THREE.Vector3(...)`. The `next/dynamic` canvas defers rendering, not the library. Built `index.html` ships a three-r184 chunk. | `app/page.tsx:59`, `components/Shield/ShieldSection.tsx:12`, `components/Shield/shieldMotion.ts:1,29+`, `components/Shield/StageProgress.tsx:4` | Move pure numbers (`FINALE_AT`, `SEQ_*`, `HEX_*`, `LABEL_*`) into a new `components/Shield/shieldConstants.ts` with no three import; import constants from there in `ShieldSection`/`StageProgress`. three stays in the lazy `ShieldCanvas` chunk. |
| 5 | **≈94 MB of unreferenced `public/` assets** — 119 `ezgif-frame-*.png` + webp copies (85 MB, only `/videos/video-frames/…` is used), `public/diamonds/` (1.44 MB), `bg-music/sgc-bg-music.mp3` (1.26 MB), root `diamond-0*.webp`, misc. | `public/images/ezgif-frame-*` vs `components/Hero/ReducedMotionFallback.tsx:23`; `scripts` scan §4 | Delete; keep `public/frames/`, `public/videos/`, `public/shield/`, `public/legal/` (referenced). |
| 6 | **Two unused Google fonts preloaded (~70 KB woff2)**: Outfit and Playfair Display are never referenced in any style or component. | `app/layout.tsx:33-45,150`; grep shows no `--font-outfit` / `--font-playfair-display` usage | Delete the two `next/font` defs and their variables. |
| 7 | **1.4 s minimum splash gates every route's first paint.** `MIN_VISIBLE_MS = 1400`; overlay `fixed z-[9999] bg-[#080B11]`; does not respect reduced motion for timing; replays on every refresh (stale `sessionStorage` comment). Brand intent = "visible on each entry". | `components/LoadingScreen.tsx:26,66-88`, rendered site-wide `app/layout.tsx:241` | Options: (a) cap min to ~400 ms and never wait on `window.load`; (b) session-scoped one-shot (implement the guard the comment promises); (c) skip entirely under `prefers-reduced-motion`; (d) homepage-only. Recommend a+b+c. |
| 8 | **Reduced-motion homepage has no `<h1>`.** The only homepage H1 lives in `HeroIntroOverlay`, which is not rendered when `prefers-reduced-motion` matches; the fallback’s top heading is an `<h2>`. | `components/Hero/DiamondScrollHero.tsx:150-152`, `components/Hero/ReducedMotionFallback.tsx:201` | Render the same H1 (or an `<h1>` variant) in the fallback. |
| 9 | **`/pricing` has zero structured data and is missing from the sitemap**, along with `/legal/subscription`. | `app/pricing/page.tsx` (no `JsonLd`/`BreadcrumbJsonLd`); `app/sitemap.ts` (13 URLs) | Add `Offer`/`PriceSpecification` (AED 875/mo, AED 14,000 foundation, AMC 20%) + `BreadcrumbList`; add both routes to the sitemap. |

---

## P1 — next sprint

### Performance
| Finding | Evidence | Fix |
|---|---|---|
| 13 MB shield video with `preload="auto"` once near viewport | `components/Shield/ShieldSection.tsx:261-281` | `preload="metadata"`, add `poster`, re-encode target <2 MB. |
| 1.0 MB `sgc-logo.png` rendered at 5.5% opacity as watermark; 197 KB raw PNG navbar logo | `components/Hero/DiamondScrollHero.tsx:199`, `components/Navbar.tsx:78` | Ship tiny pre-scaled WebP/SVG; use `next/image` with `priority` for the navbar. |
| `Cache-Control` not set for `/public` media; assets not fingerprinted | `next.config.ts:63-70` | Add headers for `/images|/videos|/frames|/shield|/bg-music|/legal`: `public, max-age=604800, stale-while-revalidate=86400` (not `immutable` until filenames are hashed). |
| 61-frame scrub sequence = 8.9 MB; reduced-motion path preloads 40 frames it never shows | `components/sections/diagnosis-scrub-hero.tsx:8-10`, `components/ui/hero-scrub.tsx`, `components/Hero/ReducedMotionFallback.tsx:20-24,85-109` | Trim to ~30 frames @ lower quality; skip frame preload in the reduced-motion path. |
| `backdrop-blur-xl` on the always-visible fixed navbar repaints on every scroll frame | `components/Navbar.tsx:67` | Near-opaque solid background, or blur only while scrolled past hero. |
| Bundle analyzer installed but not wired | `package.json:51` | Wrap config with `withBundleAnalyzer` behind `ANALYZE=true`. |
| GTM raw inline script in `<head>` runs on every load by default | `app/layout.tsx:109,115-123`, `.env.example:12` | Move to `next/script` `afterInteractive`, or gate behind consent. |

### SEO / GEO / AEO
| Finding | Evidence | Fix |
|---|---|---|
| Dead hreflang: `languages` declared only in layout, but every page replaces `alternates`, so no `hreflang` reaches any route | `app/layout.tsx:59-65` vs e.g. `app/about/page.tsx:18` | Add `languages` to each page's `alternates`, or delete the block. |
| Sitemap `lastModified: now` = build time on 8 routes; not real per-page dates | `app/sitemap.ts:4,8…` | Constant per-route date map (matches visible published/updated dates). |
| `/llms.txt` missing `/pricing` link and any "Last updated" date; `/llms-full.txt` not built (prompt DoD) | `app/llms.txt/route.ts:46-56` | Add `/pricing` link + dated line; add `app/llms-full.txt/route.ts`. |
| `articleSchema.author.url` is relative `"/about"`; Article has no `image` | `lib/schema.ts:200,192-207` | Absolute URL; add image. |
| Inline WebPage/Quiz blocks re-declare `Organization` without `@id` instead of referencing the site graph | `app/platform/page.tsx:60`, `app/diagnostic/page.tsx:60`, `app/privacy/page.tsx:81`, `app/terms/page.tsx:49` | Use `{"@id": IDS.org}`. |
| `priceRange: "AED 14,000 – AED 250,000+"` — 250k appears nowhere in canonical facts | `lib/schema.ts:94` | Add a sourced ceiling to canonical-facts or use `AED 14,000+`. |
| AI-credit prices (AED 0.018/1,000 tokens etc.) and a one-time AED 1,500 onboarding fee are published but not in canonical-facts | `app/services/ai-automation-finance/page.tsx:51,87-90,147-151`, `components/layer3/PricingPlans.tsx:120` | Add to canonical-facts (single source of truth rule), or remove. |
| Billing-cycle options inconsistent: canonical says monthly/quarterly/half-yearly/annual; one service page drops monthly | `content/canonical-facts.ts:153` vs `app/services/odoo-implementation-uae/page.tsx:156` | Align copy. |
| `Service.areaServed` is UAE-only, canonical lists 9 markets | `lib/schema.ts:136` vs `content/canonical-facts.ts:70-73` | Use canonical list. |
| Title format drift from the `Page — SGC Tech AI` standard; four titles >60 chars (`/pricing` 69, `odoo-implementation-uae` 64, `uae-corporate-tax-compliance` 61, `outsourced-financial-reporting` 69); service pages use `\|` instead of `—` | `app/pricing/page.tsx:14`, `app/services/*/page.tsx:14`, etc. | Restore standard; put price figures in descriptions: e.g. `Pricing — SGC Tech AI`, `Odoo Implementation Cost UAE — SGC Tech AI`. |
| `/subscribe`, `/subscribe/done`, `/legal/subscription` inherit root OG `url` (`https://sgctech.ai`), not their own path; `/pricing` OG≠Twitter titles | `app/layout.tsx:80-93`, `app/pricing/page.tsx:31,40` | Give each its own `openGraph.url`/titles. |
| `/contact` — no `ContactPage`; `/about` — no `AboutPage`; homepage — no `Service`/`Offer` nodes; `/diagnostic` — no `Service`; `/platform` — no `SoftwareApplication` | respective `page.tsx`; prompt §1.3 | Add per phase priorities (pricing/contact first). |
| robots: no `Disallow: /api/` | `app/robots.ts` | Add `Disallow: /api/`. Do **not** block `/_next/static/chunks/` for search engines (Google needs JS to render — the old prompt example is a footgun); if desired, scope that disallow to AI agents only. |
| Weak alt text publicly flags AI stock: `alt="Construction — AI-generated representative photography"` | `components/about/IndustriesGrid.tsx:83` | Rewrite as descriptive alt. |

### Anchors & sections
| Finding | Evidence | Fix |
|---|---|---|
| Lenis diamond click scrolls target to `y=0`, hiding the section eyebrow under the 80 px nav (CSS `scroll-margin-top` is ignored by `lenis.scrollTo`) | `components/HelixSpiral/DiamondRing.tsx:95` | Pass `offset: -80`. |
| Sections with `id` but no `scroll-mt`: `#proof-by-numbers`, `#finale` (and `#helix-to-shield` zero-height) | `components/seo/MetricsFactBlock.tsx:33`, `components/Finale/FinaleConvergenceSection.tsx:165` | Add `scroll-mt-20`. |
| Shield act (750 vh) and both heroes have no `id` — unlinkable | `components/Shield/ShieldSection.tsx`, `components/Hero/*`, `components/sections/diagnosis-scrub-hero.tsx` | Give `ShieldSection` an `id="platform"` (or `#shield`) + `scroll-mt-20`; hero `id="hero"`. |
| Stale comment: "SectionEight … now sits immediately before ContactSection" — actual order is Finale → SectionEight → FAQ → Contact | `app/page.tsx:65` | Update comment. |
| Same CTA label/target 5× in a row ("Discover the story" → `#contact`) | `ProblemSection.tsx:74`, `SolutionSection.tsx:62`, `CaseStudySection.tsx:176`, `CommercialModelSection.tsx:250`, `SectionEight.tsx:35` | Vary labels by section intent; keep one primary label site-wide. |
| CTA copy drift: "Book Discovery Call" / "Book a Discovery Call" / "Book a Finance Operations Audit" / "Start Discovery" / "Book a Founder Call" / "Book a 20-min walkthrough" | Navbar, ShieldScene, ServiceArticle, Finale, SectionEight, ContactSection, DiagnosticWizard | Standardize primary CTA to **"Book a Discovery Call"**; secondary CTAs keep qualifiers. |
| Homepage has no form; every CTA funnels to a mailto/WhatsApp-only `#contact` | `components/sections/ContactSection.tsx` | Consider embedding the same `ContactForm` on the homepage, or route CTAs to `/contact`. |
| "Finale" is not final (position 11 of 15) | `app/page.tsx:88` | Either rename the beat ("Recap") or reorder to Finale → FAQ → Contact. Decide narrative intent. |
| Orphan anchors (nothing links to): `#solution`, `#commercial-model`, `#proof-by-numbers`, `#finale`, `#rescue-audit`, `#helix-to-shield` | section audit | Either link from nav/footer or accept as deep-link targets; no broken links today. |

### Wording, keywords & claims
| Finding | Evidence | Fix |
|---|---|---|
| Homepage H1 ("Transform Operations. Improve Visibility. Scale with Confidence.") contains no target keyword, no "Odoo", no "UAE/Dubai"; same for `/pricing` ("Your brokerage, run properly") and `/services` ("Answers, not brochures.") | `components/Hero/HeroIntroOverlay.tsx:19`, `app/pricing/page.tsx:66`, `app/services/page.tsx:100` | See keyword map below; fold primary keywords into H1s/H2s without stuffing. |
| Keyword gaps in headings: "Odoo ERP Dubai", "AI finance automation UAE", "UAE corporate tax compliance", "Odoo rescue", "CFO advisory" | keyword audit §3 | Add to H1/H2/eyebrow of the relevant page/section. |
| 8 helix captions render as `<h2>`s ("One missed UAE filing costs AED 150,000?" etc.) — 8 extra H2s before the first section H2, diluting hierarchy | `components/HelixSpiral/diamonds.config.ts:18-54` | Demote to `<p>`/`<h3>` unless they're genuine section headings. |
| Duplicate sentence in one section: "This is not a technology problem — it's an implementation that was never finished" | `components/sections/ProblemSection.tsx:17` and `:88-90` | Cut one. |
| Reduced-motion fallback still renders "CPA · CIA · CRMA · CIPFA · ACCA · M.Econ" credential strip, against the 2026-09-02 founder direction to remove credential strips; not in canonical-facts | `components/Hero/ReducedMotionFallback.tsx:222`, direction documented `app/page.tsx:63-70` | Remove or replace with the approved generic line. |
| `ai.txt` claims "25–200 employees" (unsourced; prompt example used 15–150) | `app/ai.txt/route.ts:37` | Source it into canonical-facts or drop. |
| US/UK spelling mix: "summarization" vs "summarisation", "stabilize" vs "stabilisation" | service pages | Pick UK spelling for a UAE audience; fix throughout. |
| "AED 14,000 from" / "AED 875/mo from" reads as a range start | `components/sections/CommercialModelSection.tsx:14,52` | "from AED 14,000" / "from AED 875/month". |
| `noscript` CTA says "Book a discovery call below" but only email/WhatsApp links follow | `app/layout.tsx:219-234` | Reword to "Email or WhatsApp us below". |
| /pricing positions exclusively to real estate ("Your brokerage") while the site sells mid-market across 6 sectors | `app/pricing/page.tsx:11,66` | Decide: broaden the pricing H1 or move the brokerage angle to a case section. |
| "Layer 3" internal term in nav description while public copy says Platform/Subscription | `lib/navigation.ts:12` | Align nav wording. |
| `README`/comment-level doc drift: `lib/navigation.ts:3-4` promises "no bare anchors", but Footer adds `/#faq` | `components/Footer.tsx:12` | Update comment. |

### Defects / cleanup
- Dead code with no importers: `components/transitions/TransitionCanvas.tsx`, `components/ui/TierCard.tsx`, `components/FounderSection.tsx`, `components/sections/AwardsCarousel.tsx`, `components/sections/CredentialRow.tsx`, `components/about/LeadershipSection.tsx`, `components/transitions/ReducedMotionTransitionFallback.tsx`.
- Unused dependency: `animejs` (only in comments) — remove from `package.json`.
- `public/screenshot-m1.png` (68 KB) + two empty verification `.txt` files — unreferenced.
- `@next/bundle-analyzer` devDependency not wired.
- LoadingScreen’s comment claims a `sessionStorage` one-shot guard that doesn’t exist.
- `/subscribe/done` has no canonical (it is `noindex,nofollow`; adding `canonical: /subscribe` is cleaner).

---

## Section-by-section — homepage recommendations

| # | Section (file) | Anchor | Current heading | Recommendation |
|---|---|---|---|---|
| 1 | DiamondScrollHero | none | H1 in intro overlay | Add `id="hero"`; keep H1 but add keyword support in the eyebrow/subline ("Odoo & AI implementation · UAE mid-market"). |
| 2 | DiagnosisScrubHero | none | CHAOS/CLARITY h2s | Add `id="diagnosis"`; consider an H2 that names the problem category. |
| 3 | HelixToShieldTransition | `#helix-to-shield` | — | Zero-height transition; fine, keep out of sitemaps. |
| 4 | ProblemSection | `#problem` | "The hidden cost of fragmented operations." | Dedupe sentence; CTA label change to "See how we fix it". |
| 5 | ShieldSection | **none** | overlay UI | Give it `id="platform"` + `scroll-mt-20` — today the biggest act is unlinkable. |
| 6 | SolutionSection | `#solution` | "The system that fits how you work." | Add pillar keywords (ERP, AI automation, compliance) into H3s. |
| 7 | CaseStudySection | `#case-study` | OSUS headline | Link a full case study page when ready; keep sources visible. |
| 8 | MetricsFactBlock | `#proof-by-numbers` | "Headline numbers, every one of them sourced." | Add `scroll-mt-20`; consider a source footnote per metric. |
| 9 | CommercialModelSection | `#commercial-model` | "The Three-Layer Commercial Model." | Fix "AED 14,000 from" wording; merge concept with PricingSection H2 to avoid near-duplicate headings. |
| 10 | PricingSection | `#pricing` | "Three layers. Fixed prices. No surprises." | Ensure AED 875/14,000/AMC 20% appear as text here (they do) and in Product/Offer schema site-wide. |
| 11 | FinaleConvergenceSection | `#finale` | sr-only h2 | Fix FinaleStats numbers (P0); rename/reorder per narrative decision. |
| 12 | SectionEight | `#rescue-audit` | "A letter from the founders." | CTA overlap with #11; keep one "Book" CTA in this stretch. |
| 13 | FaqSection | `#faq` | "What prospects actually ask." | Good; FAQPage matches visible text. Add 2–3 pricing/process questions if commercial intent. |
| 14 | ContactSection | `#contact` | "Three ways to start. Pick one today." | Add the real `ContactForm` here or route to `/contact`; standardize CTA labels. |
| 15 | Footer | none | — | Has `/#faq` — fine; consider App Portal link parity with Navbar. |

---

## Keyword map (suggested)

| Target query | Page | Where it should appear |
|---|---|---|
| Odoo implementation UAE | `/` + `/services/odoo-implementation-uae` | Homepage H1/subline or H2; service H1 already question-shaped |
| Odoo ERP Dubai | `/`, `/about` | Homepage H2 (solution pillar) + about copy |
| AI finance automation UAE | `/` + `/services/ai-automation-finance` | Homepage solution pillar H3 → rename to include "AI finance automation" |
| UAE corporate tax compliance | `/services/uae-corporate-tax-compliance` | H1/H2 already close; add "compliance" to H2 |
| Outsourced financial reporting Dubai | service page H1 | ✅ already |
| ERP implementation mid-market UAE | `/` + `/about` | Homepage subline + About H1 support |
| Odoo rescue / rescue audit | `/services/odoo-implementation-rescue` + homepage `#rescue-audit` | Use "rescue" explicitly in rescue page H1 (currently "fix a failed…") |
| CFO advisory UAE | `/about`, `/` | About section copy; one homepage H3 |

---

## Suggested execution order

1. **P0 correctness (half day):** FinaleStats numbers, hours single-sourcing, homepage description, reduced-motion H1, sitemap + `/pricing` schema.
2. **P0 performance (half day):** split `shieldMotion` constants, remove 2 fonts, delete unused assets, LoadingScreen policy.
3. **P1 metadata/graph (1 day):** titles, hreflang, llms/ai freshness, schema references, OG per page, canonical-facts additions (250k ceiling decision, AI credit pricing).
4. **P1 anchors & copy (1 day):** lenis offset, ids/scroll-mt, CTA unification, wording fixes, keyword H1/H2 pass.
5. **P2 (backlog):** media re-encode, cache headers, dead-code purge, `/llms-full.txt`, Tier 2/3 content pages per prompt, homepage form.

---

## Hardening pass — implemented 2026-10-01

Verified: `npx tsc --noEmit` clean · `npm run build` green (34 routes) · Playwright smoke 31/32, then 6/6 h1 tests on isolated retry (single contention flake) · homepage initial JS **1,409 KB → 1,038 KB raw** · `public/` **129 MB → 35 MB**.

### Correctness & trust
- `FinaleStats` now reads `METRICS` — 2.2-month payback, ~248 hrs/wk, 445% ROI replace the invented 4–6 mo / 10 hrs/wk / 60% (`components/Finale/FinaleStats.tsx`, `content/canonical-facts.ts`).
- `HOURS_TEXT` single-sourced from `ORG.hours`; the Saturday claim is gone from `llms.txt` and `ai.txt`.
- AI-credit and onboarding fees added to canonical `PRICING`; service page and `PricingPlans` interpolate them.
- Homepage `FAQS` moved to canonical-facts — one source for the accordion, FAQPage JSON-LD and `llms-full.txt`.
- `Service.areaServed` now uses the 9-market canonical list; `priceRange` → `AED 14,000+`; `articleSchema` author URL absolute + `image` added.
- Billing-cycle copy aligned (monthly … annual) on the Odoo UAE page.
- **OSUS headcount corrected** (client-confirmed 2026-10-01): 65 employees total, of which 11 are the back office — previously published as an "11-person brokerage". Fixed in canonical-facts, the homepage case-study heading, and two service-page references.

### Performance
- **three.js removed from the initial bundle**: new three-free `shieldConstants.ts` (eager ShieldSection/StageProgress) and `finaleConstants.ts` (eager Finale caption/fallback), re-exported from the motion modules for the lazy canvases. No chunk referenced by the homepage HTML contains three anymore.
- Unused Outfit + Playfair fonts removed (5 → 3 preloads).
- `LoadingScreen`: minimum 1400 → 900 ms, skips entirely under `prefers-reduced-motion`, stale sessionStorage comment corrected.
- 259 unreferenced files deleted from `public/` (ezgif originals, root diamonds, 12.8 MB stray assets).
- Navbar logo and the 1 MB hero watermark now go through `next/image`; shield video `preload="auto"` → `metadata`.
- `Cache-Control` headers for `/public` media; bundle analyzer wired behind `ANALYZE=true`.

### SEO / GEO / AEO
- Homepage description 230 → 131 chars.
- Six titles shortened to ≤60 chars in the `Page — SGC Tech AI` pattern.
- `/pricing` now emits `Offer`/`UnitPriceSpecification` + `BreadcrumbList`; sitemap includes `/pricing` and `/legal/subscription` with real per-route `lastmod` dates.
- Dead hreflang block removed; robots disallows `/api/`; subscribe + legal pages get their own OG URLs.
- New `/llms-full.txt`; `llms.txt` gains the `/pricing` link and a "Last updated" line.
- Inline `Organization` duplicates replaced with `@id` references (platform, diagnostic, privacy, terms).

### Sections, anchors & copy
- Lenis diamond click now offsets −80 px for the fixed nav; `#platform` id + `scroll-mt` added to the Shield act; `#proof-by-numbers` and `#finale` get `scroll-mt`.
- Five identical "Discover the story" CTAs replaced with intent-specific labels.
- ProblemSection duplicate sentence removed; "from AED 14,000" ordering fixed; noscript CTA wording corrected; reduced-motion homepage gains its `<h1>`; credential strip removed from the fallback; alt text de-flagged as AI imagery.

### Parked for the enhancement plan
- Homepage H1 keyword pass, helix caption H2 hierarchy, "Finale" naming/order, homepage contact form, media re-encode (shield video, scrub frames), GTM loading strategy, intentional dead-code purge (comments say keep).

---

*Audit performed read-only on the pre-fix tree; hardening pass implemented and verified the same day.*
