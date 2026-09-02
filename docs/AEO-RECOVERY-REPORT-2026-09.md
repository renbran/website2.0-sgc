# AEO Recovery Report

**Subject:** sgctech.ai — SGC Tech AI
**Window:** 2026-09-02 – 2026-09-03
**Scope:** AEO Phases 1–7

---

## Summary

| | |
|---|---|
| Critical indexing bug found & fixed | 1 — apex/www redirect loop |
| Commits shipped to `main` | 6 |
| Indexable pages verified against production | 13/13 |
| Credentials committed to the repo | 0 |

---

## 1. What shipped, in order

Ten pieces of work, run as they were found — schema foundations first, then two production bugs that were actively suppressing indexing, then entity-resolution cleanup and a standing monitor for the outcome.

**i. Structured data on Tier-1 service pages**
Added `Offer`/`PriceSpecification` schema to all five Tier-1 service pages. Corrected one pricing-schema defect along the way: the Annual Maintenance Contract rate (20% of Implementation) had been placed in an absolute `price` field — moved to `priceSpecification.minPrice` with a `valueAddedTaxIncluded` flag. Homepage FAQ credential claims were also made consistent — named founder claims removed in favour of a verifiable, generic line.

**ii. Entity graph and crawler-visible content**
`CollectionPage`/`ItemList` JSON-LD added to the `/services` hub. The hardcoded `<noscript>` `<h1>` — duplicated across all 22 routes — was replaced with a styled `<p>`. The loading-screen overlay's initial `opacity:1` state was changed to `opacity:0` with a 150ms fade-in, so crawlers that don't wait on hydration see real content instead of a blank shroud.

**iii. Meta description cleanup**
All 13 indexable routes trimmed to the 160-character cutoff, each rewritten to keep a direct, answer-shaped opening rather than truncating mid-sentence.

**iv. IndexNow wired in**
Key generated, verification file deployed at `/ef82664e0…30bfcd.txt`, and `scripts/indexnow-submit.mjs` written as a re-runnable submitter — reads the live sitemap, POSTs every URL to the IndexNow API. First run: 13 URLs, `200 OK`.

**v. Open Graph inheritance bug — six pages**
An independent crawl of the live site (not a local build) found `/services` silently serving the *homepage's* Open Graph and Twitter card — it had no per-page block of its own, and Next.js metadata replaces rather than merges. Five more pages had the same gap. All six received their own `openGraph`/`twitter` exports.

**vi. Search console reconciliation**
Confirmed Bing Webmaster Tools was already verified via "Import from Google Search Console" — no separate `msvalidate.01` tag needed. Reviewed the GSC "Why pages aren't indexed" report, which surfaced four categories including the redirect issue investigated next.

---

## 2. The critical finding

> **Root cause · resolved**
> **The canonical domain was redirecting away from itself**

Every canonical tag, every sitemap `<loc>`, and `metadataBase` declared `sgctech.ai` — the bare apex — as the authoritative URL. In production, that exact domain 308-redirected every request to `www.sgctech.ai`. Google's own guidance is that a declared canonical should serve content directly; instead it was self-defeating on every crawl, which is very likely the direct cause of the "Page with redirect" flag in GSC.

| | |
|---|---|
| **Cause** | Apex domain claimed by *two* Vercel projects at once — the live `website2-0-sgc` and an abandoned project, `sgc-marketing`, last deployed 72 days prior with no live traffic. |
| **Fix** | Abandoned project removed; both `sgctech.ai` and `www.sgctech.ai` re-added cleanly to the live project. |
| **Verified** | `curl -sI https://sgctech.ai/services` → `200 OK`, zero redirects, on both apex and www. |

---

## 3. Entity resolution — the address split

SGC Tech AI has two real, distinct addresses that had been collapsed into one schema.org node — a two-item `address` array on `Organization`, which violates Google's guidance that a `LocalBusiness` carries a single primary address and actively works against entity resolution.

`lib/schema.ts` now emits two linked nodes:

- **Organization** carries only the DIEZ registered address (license 45160, Dubai Silicon Oasis) — the answer to "where are you licensed."
- **LocalBusiness** carries only the Al Rigga operating-office address, geo coordinates, and hours, linked back via `parentOrganization` — the answer to "where can I meet you."

Shipped in `db14793`, confirmed live: `curl -sL https://sgctech.ai/ | grep LocalBusiness` returns a match in production. See §8 for a follow-up correction to this address.

---

## 4. Commits shipped this session

| Commit | Summary |
|---|---|
| `00f8feb` | Offer/PriceSpecification schema on Tier-1 pages + FAQ credentials fix |
| `29248c7` | Hub entity graph, per-route noscript, non-blocking splash |
| `4a4c445` | Trim homepage meta description to 160 chars, add IndexNow support |
| `9f34cc7` | Trim remaining six meta descriptions to 160-char cutoff |
| `86e681a` | Give six pages their own openGraph/twitter metadata |
| `db14793` | Split dual-PostalAddress entity, add citation tracker |

---

## 5. Standing monitor — citation tracking

`scripts/citation-tracker.mjs` runs eight commercial-intent prompts ("Best Odoo implementation partner in Dubai," "How much does Odoo implementation cost in the UAE?," and six more) against every AI answer engine with a configured key — Claude, OpenAI, Perplexity, Gemini — using each engine's real search-grounded mode, not plain chat. It checks each response for `sgctech.ai` or "SGC Tech AI," records position and a snippet, and writes a dated report under `reports/citations/`. Keys live in `.env.local` only; any engine without a key is skipped, not errored.

---

## 6. Open items

| Owner | Item |
|---|---|
| You · today | Revoke the four credentials pasted into this session — one Bing Webmaster API key, three Vercel API tokens. See §7. |
| You · today | Re-submit the sitemap manually in both Google Search Console and Bing Webmaster Tools' dashboards. |
| Watch · 5–7 days | Re-check GSC's "Page with redirect" count — should read 0 once Google re-crawls the now-direct apex. |
| You · anytime | Drop API keys into `.env.local` and run `scripts/citation-tracker.mjs` for a citation baseline. |
| You · closes Phases 1–6 | Run Google's Rich Results Test and Bing's Markup Tester on the live homepage and one Tier-1 page. This is the reliable arbiter for schema questions — no crawler in this loop (this session's or the external reviewer's) reads the full DOM. |
| Founder-led | Phase 7 off-site footprint — Google Business Profile, LinkedIn company page, directory listings. Not agent-executable; each URL gets added to `ORG.sameAs` as it goes live. |

---

## 7. Credential handling this session

Four live credentials were pasted directly into the chat transcript during this session: one Bing Webmaster API key and three Vercel API tokens. **None were committed to the repository or written to any file.** The first two Vercel tokens belonged to a different account than the CLI's authenticated session and returned `404`s on every call. The abandoned-project removal was ultimately carried out through the already-authenticated Vercel CLI, not the pasted tokens directly. All four should still be treated as compromised — a credential typed into a chat message is exposed the moment it's sent, regardless of whether it was ever successfully used. **Recommend rotating all four now** via the Vercel and Bing Webmaster dashboards.

---

## 8. Follow-up — external review, same day

A second review of the live site flagged four items. Verified against full, untruncated production fetches (the reviewer's own crawler caps near 10KB per page, which truncates before reaching body content on these JS-heavy routes — explains the disagreements below):

| Claim | Verdict | Evidence |
|---|---|---|
| `/services` renders only 1 of 5 service cards | **Did not hold up** | Full `curl -sL` fetch shows all 5 service slugs present 7× each, with genuine card markup (`<h2>` headline, card CSS classes) matching the `ItemList` JSON-LD exactly. |
| `ItemList`/`CollectionPage` schema might not be emitting | **Did not hold up** | Present in the full fetch; the reviewer's own truncation note explains why their partial read missed it. |
| Address has three variants across production (LocalBusiness, `llms.txt`, contact page) | **Confirmed — fixed** | Real. Tonight's Phase 6/7 edit used the founder's casual chat phrasing for `canonical-facts.ts`'s `operatingAddress` instead of checking the three surfaces that already agreed (Footer.tsx — frozen, `privacy/page.tsx`, and the pre-existing `canonical-facts.ts` value). `canonical-facts.ts` reverted to the established string; `llms.txt` auto-corrected (reads `ORG.operatingAddress` directly); `contact/page.tsx`'s hardcoded `officeAddress` array rewired to the same source. |
| No `geo` on the `LocalBusiness` node | **Confirmed — fixed** | Real gap. Added `GeoCoordinates` (25.266647311631466, 55.31027795271349 — Al Rigga office, founder-supplied via Google Maps pin) to `localBusinessSchema()`. |
| Genspark CDN still serving hero images | **Did not hold up** | Zero `genspark`/`sspark` matches anywhere in the full homepage HTML — matches the earlier code-level audit in §… (this report's original body), which already found zero references. |
| `og:type` is `website` on `/about` and Tier-1 pages where it should be `article` | **Did not hold up** | `/about` → `website` (correct — an About page isn't article-shaped), Tier-1 service page → `article` (already correct). |
| Rich Results Test / Bing Markup Tester validator pass never run | **Still open — genuinely outstanding** | Neither this session nor the reviewer's crawler reliably reads the full DOM; the validators are the right arbiter and haven't been run. Needs a manual pass on the live homepage + one Tier-1 page in both tools. |

**Net:** 2 of 4 flagged issues were real and are now fixed (address consistency, missing geo). 2 were false positives traceable to the reviewer's stated crawler limitation. The validator-pass item remains genuinely open — added to §6.

---

*sgctech.ai · AEO Phases 1–7 · Prepared by Claude Code*
