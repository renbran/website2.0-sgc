# SEO / AEO / GEO Scorecard — 2026-10-01 (post-launch)

**Site:** https://sgctech.ai · **Commits:** `9cd445c` (perf/a11y) + `4e2de5e` (contrast) · **Method:** live Lighthouse 13.5 (mobile emulation, headless Chromium 1243), custom structured-data/anonymity validator, crawler-UA probes, IndexNow submission.

---

## 1. Lighthouse scores (live, mobile)

| Page | Performance* | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` Homepage | 29 | **100** | **100** | **100** |
| `/pricing` | 45 | **100** | **100** | **100** |
| `/case-studies/dubai-brokerage-72m-recovered` | 55 | **100** | **100** | **100** |
| `/contact` | — | **100** | **100** | **100** |

\* This audit machine is at **100% CPU** (user's dev environment: VS Code, terminals, browsers, multiple CLIs). Absolute performance values are unreliable here — the same homepage scored 27–39 across runs and TBT swung 1.6s → 18s. **Load-independent measurements are reliable:** transfer sizes Home **2,313 KB** (was 3,354 KB), Pricing 869 KB, Case study 852 KB; LCP element/order, error counts (0), a11y, BP, SEO.

**Fixes verified this session:** homepage transfer −1 MB (1,046 KB watermark PNG → 7 KB WebP; 194 KB logo → 30 KB WebP); Lighthouse a11y 97 → **100** (valid `<dl>` markup; pricing cycle-label contrast 4.5:1); BP 96 → **100** (no console errors, three.js out of the initial bundle); SEO held at **100** with all per-page checks still passing.

**To get trustworthy performance numbers:** run PageSpeed Insights with an API key (or Lighthouse on an idle machine) and read CrUX field data. Structural finding for the homepage remains: the three.js hero chunk executes on load and the hero sequence is animation-heavy — the highest-leverage next step is deferring the hero canvas mount until after the splash.

---

## 2. AEO checklist — machine-verified against production

| Item | Result |
|---|---|
| FAQPage schema (home + 3 case studies + 4 service pages) | ✅ required fields present |
| Answer-first blocks (question H1 → 40–60-word answer → short-answer box) | ✅ on 9 pages |
| `/llms.txt` | ✅ 200 · 3,305 chars · "Last updated" present |
| `/llms-full.txt` | ✅ 200 · 8,935 chars · full entity/service/pricing/outcome/FAQ context |
| `/ai.txt` | ✅ 200 · 1,605 chars |
| AI crawler probes: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider | ✅ all return 200 on `/` |
| robots.txt AI allowlist + `/api/` disallow + sitemap | ✅ verified |
| IndexNow | ✅ 19 URLs submitted, `200 OK` |
| Structured-data validator (required fields, forbidden Review/AggregateRating) | ✅ 7/7 pages pass |
| Client-name leakage on any checked page | ✅ 0 matches |

---

## 3. GEO scorecard (internal rubric — evidence-based, 1–5 per axis)

| # | Axis | Score | Evidence / gap |
|---|---|---|---|
| 1 | AI crawler accessibility | **5/5** | All 6 major AI agents get 200; robots explicitly allows them; only `/api/` blocked |
| 2 | Machine-readable summaries | **5/5** | llms.txt + llms-full.txt + ai.txt, all canonical-facts-sourced with freshness dates |
| 3 | Entity graph & structured data | **5/5** | Organization/WebSite/ProfessionalService with `@id` cross-refs; Article/FAQPage/Service/Offer/CollectionPage validated; no fabricated Review markup |
| 4 | Answer-first content design | **4/5** | Question H1s + direct answers + at-a-glance boxes on case/service pages; homepage H1 is still brand-led (keyword support in sub-line only) |
| 5 | Verifiable claims & citations | **5/5** | Every metric traces to a signed case study; trade license + source lines published |
| 6 | Freshness signals | **4/5** | Real per-route `lastModified`, visible published/updated dates, llms "Last updated"; Search Console submission pending (human) |
| 7 | Third-party corroboration | **3/5** | LinkedIn, Facebook, Instagram, YouTube indexed; no Wikidata/industry-directory listings yet |
| 8 | Index coverage of new pages | **3/5** | Homepage + platform indexed; the 4 new case-study URLs deployed < 1 h ago — IndexNow submitted (Bing/Yandex), Google recrawl pending |
| | **Total** | **34/40** | Strong machine layer; the remaining points are recrawl time + off-site entity corroboration |

---

## 4. Remaining items — genuinely human-only

| Item | Why it needs a human |
|---|---|
| Google Search Console: confirm sitemap + "Request indexing" for the 4 new URLs | Requires login to the verified GSC account |
| GA4 Realtime / GTM Preview: confirm `page_view` on new routes | Requires the Google Analytics + Tag Manager accounts |
| Facebook Sharing Debugger / X Card validator | Both require a logged-in session; server-side equivalent already verified (og:image 200, `image/png`, 96 KB; og:url correct) |
| PageSpeed Insights **with API key** / idle-machine Lighthouse / CrUX field data | This machine is at 100% CPU; reliable absolute perf numbers need a clean environment |
| Real-device spot check + an actual WhatsApp send on the contact CTAs | Subjective UX + messaging channel; links and prefills are smoke-test verified |
| (Optional) Wikidata + UAE directory listings, review-site profiles | Needs account creation + editorial review; improves axis 7 |
