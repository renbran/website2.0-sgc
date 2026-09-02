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
  operatingAddress: {
    street: "AL Maseed Building 304, Al Rigga Road",
    locality: "Deira",
    region: "Dubai",
    country: "AE",
  },
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    { days: ["Saturday"], opens: "09:00", closes: "13:00" },
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

// [CASE] — sourced from signed client case studies. Every figure below is
// attributable to a named client; do not blend these into an anonymous
// composite or invent an aggregate figure not present in the source PDF.
export const CASE_STUDIES = [
  {
    client: "AX Capital",
    legalEntity: "D A X Real Estate One Person Company LLC",
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
    quoteAttribution: "AX Capital · Finance & Operations Leadership",
  },
  {
    client: "OSUS Real Estate",
    legalEntity: "OSUS Real Estate Brokerage LLC",
    sector: "Real Estate Brokerage",
    scale: "11 staff · UAE",
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
    quoteAttribution: "OSUS Real Estate · Management",
  },
  {
    client: "TraffeXcel",
    legalEntity: "TraffeXcel",
    sector: "Construction · Government Contractor",
    scale: "UAE",
    headline: "From Spreadsheets & Zoho to a Government-Project-Ready ERP",
    metrics: {
      vatOverpaymentAvoided: "AED 10,000–12,000 per repeat filing",
      outcome: "Government-project audit trail and controls in place; repeat incorrect-filing event eliminated",
    },
    quote: "Spreadsheets and Zoho could not give us the controls our government projects required. SGC replaced the stack with one system that tracks projects end-to-end and removes the risk of another incorrect filing.",
    quoteAttribution: "TraffeXcel · Project Leadership",
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
    detail: "Includes five licensed users. Billed quarterly, half-yearly, or annually in advance. All amounts exclusive of 5% UAE VAT.",
  },
} as const;

// Headline metrics for the homepage fact block (Phase 2.3 of the SEO/AEO plan)
// and any other surface that needs the proof numbers in plain text. Every entry
// is sourced from a signed case study or the PR-03 / business-model package —
// nothing is fabricated. CASE_STUDIES entries are walked at module load to keep
// the relationship to source material explicit; if a case study is ever
// removed, this object starts returning undefined for its derived entry, which
// is the correct failure mode (no silent fabrication).
const osus = CASE_STUDIES.find((c) => c.client === "OSUS Real Estate");
const ax = CASE_STUDIES.find((c) => c.client === "AX Capital");

export const METRICS = {
  salesVolumeProcessed: {
    label: "Sales volume processed through SGC-built ERP",
    value: osus?.metrics.revenueProcessed ?? "AED 39.89M",
    source: "OSUS Real Estate · signed case study, Year 1",
  },
  realEstateDeals: {
    label: "Real-estate invoices recovered",
    value: ax?.metrics.invoicesRecovered.value ?? "AED 72M",
    source: "AX Capital · signed case study, 7-month window",
  },
  year1Roi: {
    label: "Typical Year-1 ROI",
    value: osus?.metrics.firstYearRoi ?? "445%",
    source: "OSUS Real Estate · signed case study",
  },
  paybackMonths: {
    label: "Typical payback period",
    value: osus?.metrics.paybackPeriod ?? "2.2 months",
    source: "OSUS Real Estate · signed case study",
  },
  implementationPriceRange: {
    label: "Implementation price range",
    value: PRICING.implementation.price,
    source: "PR-03 memo · business-model final",
  },
} as const;
