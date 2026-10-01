// Single source of truth for entity, metric, and pricing facts.
// Every component, schema block, and content page should import from here —
// no hardcoded legal name / license / metrics anywhere else.
//
// Provenance:
//   [LICENSE]  — DIEZ trade license (image supplied by founder, 2026-09-02)
//   [GOVERNED] — SGC_TECH_AI_BUSINESS_MODEL_FINAL package (README.md, PR-03 memo)
//   [CASE]     — signed case-study PDFs (marketing and lead generation/)
//
// Person schema (founder name / LinkedIn / individual credentials) is intentionally
// not represented here: per Phase 0 direction (2026-09-02), founder names are
// not surfaced on the public site and Person nodes are not emitted in JSON-LD.
// `knowsAbout` on the Organization node is the only public credential carrier.

export const ORG = {
  legalName: "Scholarix Global Consultants FZCO", // [LICENSE] license no. 45160
  tradingName: "SGC Tech AI",
  licenseNumber: "45160", // [LICENSE]
  licensingAuthority: "Dubai Integrated Economic Zones Authority (DIEZ)", // [LICENSE] — trades from IFZA Properties
  licenseIssued: "2024-05-07", // [LICENSE]
  licenseExpires: "2027-05-06", // [LICENSE]
  // Founding predates the 2024-05-07 license amendment; founder confirmed
  // the firm is ~4 years old as of 2026-09-02 → estimated incorporation date.
  foundingDate: "2022-09-02",
  url: "https://sgctech.ai",
  logo: "https://sgctech.ai/sgc-logo.png",
  email: "info@sgctech.ai",
  phone: "+971521985231",
  // Registered (free-zone) address differs from the operating office.
  // State both explicitly — never let them silently contradict (per SEO Phase 0 guidance).
  registeredAddress: {
    // [LICENSE]
    premises: "DSO-IFZA, IFZA Properties",
    locality: "Dubai Silicon Oasis",
    region: "Dubai",
    country: "AE",
  },
  // Operating office — physical address where clients are met. Distinct
  // from `registeredAddress` (DIEZ free-zone, license of record). Per
  // Google LocalBusiness guidance, a single PostalAddress is required on
  // the practice node; the registered address lives on the Organization node.
  //
  // This exact string must match Footer.tsx (frozen — do not edit to
  // "fix" a mismatch here instead) and privacy/page.tsx verbatim. NAP
  // (name/address/phone) consistency across every surface — including the
  // eventual Google Business Profile — is the whole mechanism by which
  // that profile reinforces entity resolution; a single wrong word here
  // undermines it everywhere at once.
  operatingAddress: {
    street: "Maseed Building Office No. 304, 119/12st, Al Rigga",
    locality: "Dubai",
    region: "Dubai",
    country: "AE",
    // Al Rigga office, provided by founder via Google Maps pin (2026-09-02).
    latitude: 25.266647311631466,
    longitude: 55.31027795271349,
  },
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
  ],
  // Verified social profiles at the time of Phase 7 readiness check (2026-09-02).
  // The Google Business Profile URL was deliberately excluded — populate when the
  // profile is live, then add the entry here AND keep `lib/schema.ts` sameAs filter
  // removed so it actually renders.
  sameAs: [
    "https://linkedin.com/company/sgctechai",
    "https://instagram.com/sgctech.ai",
    "https://x.com/sgctech_ai",
  ],
  serviceArea: [
    "United Arab Emirates", "Dubai", "Abu Dhabi", "Sharjah",
    "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain",
  ],
} as const;

// Pre-formatted opening-hours sentence for machine-readable surfaces
// (llms.txt, ai.txt). Derived from ORG.hours so published AI-facing hours can
// never drift from the schema/contact page again.
export const HOURS_TEXT = `${
  ORG.hours[0].days[0]
}–${ORG.hours[0].days[ORG.hours[0].days.length - 1]} ${
  ORG.hours[0].opens
}–${ORG.hours[0].closes} GST (UTC+4); Saturday–Sunday closed`;

// Freshness signal for AI caches on the .txt surfaces. Bump this single
// constant whenever entity, pricing, or outcome facts in this file change.
export const SITE_LAST_UPDATED = "2026-10-01";

// Homepage FAQ — the single source for both the visible accordion and the
// FAQPage JSON-LD (components/sections/FaqSection.tsx) and the expanded
// machine-readable file (/llms-full.txt). Edit here once; every surface follows.
export const FAQS = [
  {
    question: "We already run Odoo and it isn't working. Can you fix an existing installation?",
    answer:
      "Yes — that is exactly what the Finance Operations Audit is for. We audit what you have, regardless of who built it, tell you what is salvageable, and give you a costed plan. 50% of the audit fee is credited to implementation if you proceed within 90 days.",
  },
  {
    question: "Who owns the system and our data?",
    answer:
      "You do. The platform is built on an open-source Odoo core running in your own instance, with daily backups and processing in line with UAE PDPL. Hosting and processor details are in our Privacy Policy.",
  },
  {
    question: "What happens if we stop the subscription?",
    answer:
      "Your Odoo core and your data remain yours — nothing is held hostage. The Subscription (Rent) layer covers the hosted platform, AML screening signal, and records-and-reports generation; when it ends, those services stop, but the system and its data stay with you. Compliance updates to your Implementation continue separately under the Annual Maintenance Contract (AMC).",
  },
  {
    question: "How disruptive is implementation?",
    answer:
      "Discovery defines the timeline in writing before work begins, based on the modules and integrations in scope. Go-live is staged so your team keeps working, and hypercare after launch is part of delivery.",
  },
  {
    question: "Why is the Annual Maintenance Contract mandatory?",
    answer:
      "Because an unmaintained ERP decays into exactly the mess you came to us with. The Annual Maintenance Contract — billed annually at 20% of the Implementation price — funds platform maintenance, security patches, compliance updates to the configured UAE layer, and priority support after go-live. The go-live guarantee goes in writing because we stay accountable after launch.",
  },
  {
    question: "How do we verify your credentials and case numbers?",
    answer:
      "Ask. Engagement leads are chartered accountants in active standing; CPA and CIA credentials are individually verifiable with the issuing bodies on request. Case figures come from live client systems; we share the audit trail and arrange reference calls under NDA after Discovery.",
  },
] as const;

// [CASE] — sourced from signed client case studies. Every figure below is
// attributable to a named client; do not blend these into an anonymous
// composite or invent an aggregate figure not present in the source PDF.
//
// ANONYMITY CONTRACT: this module is bundled into client components, so it
// carries NO client names or legal entities — only stable `id`s. The internal
// id → client mapping lives in docs/CASE-STUDY-INTERNAL-RECORD.md (never
// bundled, never rendered). Public surfaces render `publicLabel` / `scale` /
// `quoteAttribution` only.
export const CASE_STUDIES = [
  {
    id: "dubai-brokerage-900",
    publicLabel: "A ~900-agent Dubai real-estate brokerage",
    sector: "Real Estate Brokerage",
    scale: "~900 agents · Dubai",
    headline: "AED 72M in Recovered Invoices & an End to Commission Disputes",
    metrics: {
      invoicesRecovered: { value: "AED 72M", window: "7 months", basis: "Uncollected invoices, 2020–2022 deals, recovered via automated commission engine + reconciliation" },
      reconciliationTimeChange: "−80%",
      commissionDisputeChange: "−90%",
      agentRetentionChange: "+50%",
    },
    quote: "The new reconciliation process cut our account-reconciliation time by approximately 80% and gave the finance team real control over outstanding balances — AED 72 million in previously uncollectable invoices was recovered in seven months.",
    quoteAttribution: "Real-estate brokerage · Finance & Operations Leadership",
  },
  {
    id: "uae-brokerage-65",
    publicLabel: "A 65-person UAE brokerage",
    sector: "Real Estate Brokerage",
    scale: "65 employees · 11 back-office · UAE",
    headline: "445% First-Year ROI & 75% Less Manual Work in 2.2 Months",
    metrics: {
      revenueProcessed: "AED 39.89M",
      firstYearNetSavings: "AED 1.64M",
      firstYearRoi: "445%",
      paybackPeriod: "2.2 months",
      operatingCostReduction: "66%",
      manualWorkReduction: "75%",
      billingErrorChange: "−90%",
      hoursReleasedPerWeek: "~248",
      annualBillingLossesPrevented: "AED 897,419",
      fiveYearProjectedSavings: "AED 9.67M",
    },
    quote: "For every AED 1 we invested, we received approximately AED 5.45 in gross operational benefits. The ERP paid for itself in 2.2 months and released capacity we redirected straight into sales support and collections.",
    quoteAttribution: "Real-estate brokerage · Management",
  },
  {
    id: "construction-government",
    publicLabel: "A UAE construction contractor on government infrastructure projects",
    sector: "Construction · Government Contractor",
    scale: "Government infrastructure · UAE",
    headline: "From Spreadsheets & Zoho to a Government-Project-Ready ERP",
    metrics: {
      vatOverpaymentAvoided: "AED 10,000–12,000 per repeat filing",
      outcome: "Government-project audit trail and controls in place; repeat incorrect-filing event eliminated",
    },
    quote: "Spreadsheets and Zoho could not give us the controls our government projects required. SGC replaced the stack with one system that tracks projects end-to-end and removes the risk of another incorrect filing.",
    quoteAttribution: "Construction company · Project Leadership",
  },
] as const;

// [GOVERNED] SGC_TECH_AI_PR-03_Rent_Subscription_Layer_Memo.md +
// SGC_TECH_AI_BUSINESS_MODEL_FINAL/README.md, with the AMC rate corrected
// per founder direction (2026-09-02): AMC is always 20% of the Implementation
// (build) price, billed annually — not the flat base+per-module formula in
// the original PR-03 draft.
export const PRICING = {
  implementation: {
    label: "Implementation",
    tagline: "One-time, fixed",
    price: "AED 14,000 foundation",
    detail: "~25-hour base build, plus module blocks scoped in Discovery. Minimum qualifying deal AED 24,000.",
  },
  amc: {
    label: "Annual Maintenance Contract (AMC)",
    tagline: "Mandatory, recurring",
    price: "20% of Implementation price / year",
    detail: "Billed annually. No go-live proceeds without an executed AMC.",
  },
  subscription: {
    label: "Subscription (Rent)",
    tagline: "Hosted platform, ~0 founder hours",
    price: "AED 875/month minimum",
    detail: "Includes five licensed users. Billed monthly, quarterly, half-yearly or annually in advance; half-yearly saves 2.5% and annual saves 5%. All amounts exclusive of 5% UAE VAT.",
  },
  aiCredits: {
    label: "AI Credits",
    tagline: "Usage-based",
    price: "AED 0.018 per 1,000 tokens",
    detail: "Billed monthly in arrears against measured token usage; the AI automation service page carries the full per-task rate table.",
    examples: {
      invoiceDraft: "AED 0.027",
      documentOcrSummary: "AED 0.11",
    },
  },
  onboarding: {
    label: "One-time onboarding fee",
    price: "AED 1,500",
    detail: "Waived for founding clients while their subscription stays active.",
  },
} as const;

// Headline metrics for the homepage fact block (Phase 2.3 of the SEO/AEO plan)
// and any other surface that needs the proof numbers in plain text. Every entry
// is sourced from a signed case study or the PR-03 / business-model package —
// nothing is fabricated. CASE_STUDIES entries are walked at module load to keep
// the relationship to source material explicit; if a case study is ever
// removed, this object starts returning undefined for its derived entry, which
// is the correct failure mode (no silent fabrication).
const osus = CASE_STUDIES.find((c) => c.id === "uae-brokerage-65");
const ax = CASE_STUDIES.find((c) => c.id === "dubai-brokerage-900");

export const METRICS = {
  salesVolumeProcessed: {
    label: "Sales volume processed through SGC-built ERP",
    value: osus?.metrics.revenueProcessed ?? "AED 39.89M",
    source: `${osus?.publicLabel ?? "A 65-person UAE brokerage"} · signed case study, Year 1`,
  },
  realEstateDeals: {
    label: "Real-estate invoices recovered",
    value: ax?.metrics.invoicesRecovered.value ?? "AED 72M",
    source: `${ax?.publicLabel ?? "A ~900-agent Dubai real-estate brokerage"} · signed case study, 7-month window`,
  },
  year1Roi: {
    label: "Typical Year-1 ROI",
    value: osus?.metrics.firstYearRoi ?? "445%",
    source: `${osus?.publicLabel ?? "A 65-person UAE brokerage"} · signed case study`,
  },
  paybackMonths: {
    label: "Typical payback period",
    value: osus?.metrics.paybackPeriod ?? "2.2 months",
    source: `${osus?.publicLabel ?? "A 65-person UAE brokerage"} · signed case study`,
  },
  hoursReleasedPerWeek: {
    label: "Manual hours released",
    value: osus ? `${osus.metrics.hoursReleasedPerWeek} hrs/wk` : "~248 hrs/wk",
    source: `${osus?.publicLabel ?? "A 65-person UAE brokerage"} · signed case study`,
  },
  implementationPriceRange: {
    label: "Implementation price range",
    value: PRICING.implementation.price,
    source: "PR-03 memo · business-model final",
  },
} as const;
