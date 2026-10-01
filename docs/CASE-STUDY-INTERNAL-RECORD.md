# Case Study Internal Record — NOT FOR PUBLICATION

**Purpose:** the id → client mapping behind the anonymized case studies on the website.
Client names and legal entities are deliberately kept out of all code (`content/canonical-facts.ts`
carries stable ids only) so nothing leaks into any bundle, page, or machine-readable surface.
This file lives in `docs/` and is never served or bundled.

| Site id | Client | Legal entity | Source PDF |
|---|---|---|---|
| `dubai-brokerage-900` | AX Capital | D A X Real Estate One Person Company LLC | `case_study_ax_capital.pdf` (+ combined) |
| `uae-brokerage-65` | OSUS Real Estate | OSUS Real Estate Brokerage LLC | `case_study_osus_properties.pdf` (+ combined) |
| `construction-government` | TraffeXcel | TraffeXcel | `case_study_traffexcel.pdf` (+ combined) |

Source PDFs: `C:\marketing and lead generation\`.

## Public surfaces (all anonymized)
- Homepage `#case-study` section — descriptors only
- `/case-studies` hub + three detail pages
- `/llms.txt`, `/llms-full.txt`, `/ai.txt`
- Service pages (`odoo-implementation-uae`, `odoo-implementation-rescue`, `outsourced-financial-reporting`)
- Hero proof stats (`heroScenes.ts`)

## Notes
- OSUS headcount correction (client-confirmed 2026-10-01): 65 employees total; 11 are the back
  office (the 247.5 hrs/week figure is the back-office admin load).
- The signed PDFs carry the older entity name "Scholarix Global Consultants FZE" and
  `hello@sgctech.ai`. The website keeps the current canonical facts: **FZCO** (DIEZ license
  45160) and **info@sgctech.ai**.
- Reference calls: arranged under NDA after Discovery; disclose the client identity at that stage
  only.
