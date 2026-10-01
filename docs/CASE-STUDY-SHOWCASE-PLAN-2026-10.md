# Anonymous Case-Study Showcase — Enhancement Plan

**Repo:** `C:\website-sgc\website2.0-sgc` (main — current production source)
**Date:** 2026-10-01 · **Status:** IMPLEMENTED 2026-10-01
**Sources:** `case_studies_combined.pdf`, `case_study_ax_capital.pdf`, `case_study_osus_properties.pdf`, `case_study_traffexcel.pdf` (signed, in `C:\marketing and lead generation`)
**Constraint:** showcase the three engagements **anonymously**; every figure traces to the signed PDFs; `content/canonical-facts.ts` stays the single source of truth; no fabricated claims, no client names on new surfaces.

> **Implementation summary (2026-10-01):** Phase A sweep + hub + three pages + homepage/service-page wiring shipped.
> Client names and legal entities were removed from all bundled code (`content/canonical-facts.ts` carries stable
> ids only; the id → client mapping lives in `docs/CASE-STUDY-INTERNAL-RECORD.md`, never bundled or served).
> Verified: `tsc` clean · build green (38 routes) · zero client names in `.next/static` or `.next/server` ·
> smoke suite 24/24 on the affected tests · sitemap/llms/IndexNow surfaces updated.

**Client correction applied 2026-10-01:** OSUS is **65 employees total**, of which **11 are the back office** (the 247.5 hrs/week figure is the back-office admin load). The site previously said "11 staff" — corrected already in canonical-facts, homepage heading and two service pages.

---

## 1. Source inventory (verified against the signed PDFs)

### CS-1 — Real-estate brokerage at scale (AX Capital)
| Field | Value |
|---|---|
| Anonymous descriptor | **"A ~900-agent Dubai real-estate brokerage"** |
| Sector / scale | Real-estate brokerage, sales + rentals + property management · ~900 agents · Dubai |
| Challenge | Manual processes, unclear statements of account, frequent commission disputes, millions of dirhams in uncollected revenue on 2020+ deals |
| Solution | Bitrix↔Odoo 17 integration: automated commission engine, invoice automation + collections, financial controls, agent commission-status chatbot, management dashboards, property/listing management, historical data migration; delivered in 6–7 weeks (incl. Sundays) |
| Metrics | AED 72M recovered invoices (2020–2022 deals) · −80% reconciliation time · −90% commission disputes · +50% agent retention · 7-month recovery window |
| Quote | "The new reconciliation process cut our account-reconciliation time by approximately 80% … AED 72 million in previously uncollectable invoices was recovered in seven months." — *Real-estate brokerage · Finance & Operations Leadership* |

### CS-2 — 65-person UAE brokerage (OSUS)
| Field | Value |
|---|---|
| Anonymous descriptor | **"A 65-person UAE brokerage (11-person back office)"** |
| Sector / scale | Real-estate brokerage, multiple projects · 65 employees (11 back office) · UAE |
| Challenge | Spreadsheets, handwritten records, disconnected Bitrix CRM; **247.5 back-office hours/week** on repetitive admin (est. AED 2.47M annual operational burden); no standardized invoicing/reconciliation; recurring disputes |
| Solution | End-to-end Odoo ERP + Bitrix kept for lead capture: finance, invoicing workflows, brokerage lifecycle, AI-assisted customer classification, HR/payroll, e-learning, central reporting; one digital record per deal |
| Metrics | AED 39.89M revenue processed · AED 1.64M Year-1 net savings · 445% Year-1 ROI · 66% operating-cost reduction · 2.2-month payback · −75% manual work · −90% billing errors/leakage · ~248 hrs/week released · AED 897,419 annual billing losses prevented · AED 9.67M 5-year projected savings |
| Quote | "For every AED 1 we invested, we received approximately AED 5.45 in gross operational benefits. The ERP paid for itself in 2.2 months…" — *Real-estate brokerage · Management* |

### CS-3 — Government-infrastructure contractor (TraffeXcel)
| Field | Value |
|---|---|
| Anonymous descriptor | **"A UAE construction contractor delivering government infrastructure projects"** |
| Sector / scale | Construction · government infrastructure · UAE |
| Challenge | Zoho + spreadsheets; no project tracking or project management; legal/image/financial exposure; **AED 10,000–12,000 overpaid on the most recent VAT filing** |
| Solution | Integrated ERP tuned for construction + government contracts: multi-project management, VAT-compliant invoicing, audit-ready reporting, migration off Zoho/spreadsheets, controls preventing repeat filing errors |
| Metrics | Manual+Zoho stack replaced · controls & audit trail in place · repeat VAT filing event eliminated · project-level visibility across all active government projects |
| Quote | "Spreadsheets and Zoho could not give us the controls our government projects required…" — *Construction company · Project Leadership* |

**Provenance notes**
- PDFs carry the old entity name "Scholarix Global Consultants FZE" and `hello@sgctech.ai`. The website must keep canonical facts: **FZCO** (DIEZ license 45160) and **info@sgctech.ai**.
- No new figures may be derived (e.g. don't turn "AED 897,419" into "~AED 900K"; don't average the three engagements).

---

## 2. Recommended structure (Option A — hub + 3 pages + homepage links)

```
/case-studies                    ← hub (CollectionPage + ItemList)
/case-studies/dubai-brokerage-72m-recovered
/case-studies/uae-brokerage-445-roi
/case-studies/construction-erp-vat-readiness
```

**Why:** the three engagements are the strongest verifiable proof the site owns, and they map to three commercial queries ("brokerage ERP Dubai", "Odoo ROI UAE", "construction ERP VAT UAE"). A hub plus three question-shaped pages gives search and AI answer engines indexable, citable proof, and gives sales a shareable link per segment. Homepage links funnel into them.

**Open decision (from the earlier question):** the site currently names AX Capital and OSUS on the homepage, in `heroScenes.ts`, service pages and the llms files. To be truly anonymous, Phase A below anonymizes those too (recommended). If you prefer to keep existing names, skip Phase A but accept mixed visibility.

---

## 3. Phase A — Anonymization sweep (recommended)

Split each entry in `content/canonical-facts.ts` into internal record vs public descriptor:

```ts
{
  client: "AX Capital",                    // internal only — never rendered
  legalEntity: "D A X Real Estate One Person Company LLC", // internal only
  publicLabel: "A ~900-agent Dubai real-estate brokerage",
  publicScale: "~900 agents · Dubai",
  sector: "Real Estate Brokerage",
  ...
}
```

Surfaces to update (exact, from this session's greps):
| Surface | What changes |
|---|---|
| `components/sections/CaseStudySection.tsx` | heading, `sublabel`s, "named client" chip → "verified client · anonymized", image caption |
| `components/HelixSpiral/heroScenes.ts:125` | `"AED 72M Recovered · AX Capital"` → `"AED 72M recovered · 900-agent Dubai brokerage"` etc. |
| `app/services/odoo-implementation-uae/page.tsx:147` | name → descriptor |
| `app/services/outsourced-financial-reporting/page.tsx` (lines 11, 55, 113, 124, 143) | name → descriptor |
| `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts` | render `publicLabel`, not `client` |
| `docs/SITE-AUDIT…`, `AEO-RECOVERY…` | historical docs — leave as-is (not public) |
| `components/sections/AwardsCarousel.tsx` | dead code — leave or delete |

Quote attributions become generic ("Real-estate brokerage · Finance & Operations Leadership"). Quotes stay verbatim — they are in the signed PDFs.

---

## 4. Phase B — The three pages (content outlines, ready to write)

Shared template (follows the repo's AEO article pattern): question H1 → 40–60-word direct answer block → metrics band → Challenge → Solution → Scope delivered → Results table → quote → 3–4 FAQs → internal links → visible published/updated dates → Article + FAQPage + BreadcrumbList JSON-LD. No Review/aggregateRating markup.

### Page 1 — `/case-studies/dubai-brokerage-72m-recovered`
- **Title (≤60):** `AED 72M Recovered: Odoo for a 900-Agent Brokerage — SGC` → trim to `Odoo Case Study: AED 72M Recovered — SGC Tech AI` (51)
- **Description (≤155):** "How a ~900-agent Dubai brokerage recovered AED 72M in uncollected invoices, cut reconciliation time 80% and commission disputes 90% with Bitrix↔Odoo."
- **H1:** "How does a 900-agent brokerage recover AED 72M in uncollected invoices?"
- **Answer block:** one paragraph with the four headline metrics.
- **H2s:** The challenge · What we built (Bitrix↔Odoo 17, commission engine, invoice automation) · Results at a glance · Scope delivered · What this means for your brokerage.
- **FAQs:** timeline (6–7 weeks), what "recovered" means, what stayed in Bitrix, reference-call policy.
- **Internal links:** `/services/odoo-implementation-uae`, `/services/outsourced-financial-reporting`, hub.

### Page 2 — `/case-studies/uae-brokerage-445-roi`
- **Title:** `Odoo Case Study: 445% Year-1 ROI — SGC Tech AI` (46)
- **Description:** "A 65-person UAE brokerage cut manual admin by 75%, released ~248 hrs/week and hit 445% Year-1 ROI with a 2.2-month payback on end-to-end Odoo."
- **H1:** "What ROI can a 65-person brokerage expect from Odoo?"
- **H2s:** The challenge (247.5 back-office hrs/week, AED 2.47M burden) · The build · Results at a glance (full metric list) · Why Bitrix stayed · 5-year view (AED 9.67M projected).
- **FAQs:** payback definition, how hours released were measured, AI classification role, what happened to the back office.
- **Internal links:** `/services/ai-automation-finance`, `/services/odoo-implementation-uae`, `/pricing`, hub.

### Page 3 — `/case-studies/construction-erp-vat-readiness`
- **Title:** `Construction ERP Case Study: VAT-Ready — SGC Tech AI` (50)
- **Description:** "How a UAE government-infrastructure contractor replaced Zoho and spreadsheets with an audit-ready ERP after a AED 10–12K VAT filing overpayment."
- **H1:** "How does a government contractor fix VAT filing errors with ERP?"
- **H2s:** The exposure (legal/image/financial) · The AED 10–12K filing event · The build (construction-tuned PM, VAT invoicing, audit trail) · Outcomes · What changes for the next government contract.
- **FAQs:** how the repeat event was eliminated, evidence for government clients, migration from Zoho.
- **Internal links:** `/services/uae-corporate-tax-compliance`, `/services/odoo-implementation-rescue`, hub.

### Hub — `/case-studies`
- **Title:** `Case Studies — Odoo & AI Results UAE — SGC Tech AI` (52)
- **H1:** "Verified outcomes from live deployments."
- **Body:** 3 cards (descriptor + 3 metrics each), "reference calls under NDA after Discovery", link to `/services` and `/diagnostic`.
- **Schema:** `CollectionPage` + `ItemList` referencing each page's `#article` @id; BreadcrumbList.

---

## 5. Phase C — Homepage & site wiring

1. `CaseStudySection` becomes the anonymized proof section: keep the OSUS metric table (strongest numbers) but link to all three pages ("Read the full case study →" per card or a 3-tab selector).
2. `MetricsFactBlock` source lines become descriptors ("900-agent Dubai brokerage · signed case study").
3. `heroScenes.ts` proof stats use descriptors.
4. `sitemap.ts`: add four routes with real lastmod; `llms.txt` + `llms-full.txt`: add a `## Case studies` section with descriptors and links; re-run IndexNow after deploy.
5. Optional: link "proof" from the nav? Not recommended (menu is already 6 items); surface from homepage + service pages instead.

---

## 6. SEO / GEO / AEO targets

| Page | Primary queries | Support queries |
|---|---|---|
| CS-1 | Odoo for real estate brokerage Dubai · brokerage commission automation | invoice recovery UAE · Bitrix Odoo integration |
| CS-2 | Odoo ROI UAE · Odoo ERP for brokerage cost | ERP payback period · reduce manual admin |
| CS-3 | construction ERP UAE · VAT compliance Odoo | government contractor ERP · Zoho migration |

Answer-engine hooks: direct-answer block in the first 60 words; metric tables in raw HTML (server components); anonymized descriptors repeated in llms files; every page ends with "reference calls under NDA".

---

## 7. Guardrails

- Anonymity: no client names, brand names, logos, or unique-but-identifying details beyond signed-PDF facts (agent count, employee count, sector, emirate). Do not add client photos.
- Accuracy: figures verbatim from PDFs; correction 65/11 applied; entity FZCO + license 45160; contact info@sgctech.ai.
- Quotes: verbatim from PDFs, attributed generically.
- Compliance: VAT/Corporate Tax content stays factual; no fabricated regulatory citations.
- Schema: `Article` author = Organization "SGC Tech AI"; dates visible; no Review markup.

---

## 8. Open decisions

1. **Anonymization scope** — recommended: Phase A everywhere (homepage, hero stats, service pages, llms). Alternative: only the new pages. *This is the one blocking decision.*
2. Slugs — current proposal above; confirm or swap.
3. Keep or retire the live "named client" OSUS table on the homepage (Phase C assumes: keep metrics, anonymize label).
4. Visuals — use existing `/public/images/sections/*` illustrative imagery, or commission anonymized dashboard shots.

## 9. Execution order & estimate

| Step | Work | Est. |
|---|---|---|
| 1 | Phase A sweep + build + llms regen | 0.5 day |
| 2 | Case-study page template + 3 pages + hub | 1.5 days |
| 3 | Homepage integration + sitemap/llms + IndexNow | 0.5 day |
| 4 | Build/typecheck/smoke + schema validation + deploy | 0.5 day |

After approval, implementation follows the same pattern as the hardening pass: canonical-facts first, then pages, then verify with `tsc` + `next build` + smoke tests.
