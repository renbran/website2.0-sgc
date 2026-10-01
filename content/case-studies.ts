import { CASE_STUDIES } from "@/content/canonical-facts";

// Anonymized case-study content. Every figure, scope line and quote below
// traces to the signed case-study PDFs (marketing and lead generation/);
// client names live only in canonical-facts internal record fields and are
// never rendered. Metrics are read from canonical-facts so page copy and
// homepage proof can't drift apart.

const ax = CASE_STUDIES.find((c) => c.id === "dubai-brokerage-900")!;
const osus = CASE_STUDIES.find((c) => c.id === "uae-brokerage-65")!;
const traffexcel = CASE_STUDIES.find((c) => c.id === "construction-government")!;

export interface CaseStudySection {
  question: string;
  answer: string;
  detail?: string;
}

export interface CaseStudyPageData {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  answerBlock: string;
  shortAnswer: string[];
  sections: CaseStudySection[];
  results: { label: string; value: string }[];
  quote: { text: string; attribution: string };
  faqs: { q: string; a: string }[];
  internalLinks: { label: string; href: string }[];
  keywords: string[];
  publishedDate: string;
  updatedDate: string;
  // Hub-card data
  publicLabel: string;
  sector: string;
  scale: string;
  headline: string;
  cardMetrics: { label: string; value: string }[];
}

const PUBLISHED = "2026-10-01";
const UPDATED = "2026-10-01";

export const CASE_STUDY_PAGES: CaseStudyPageData[] = [
  {
    slug: "dubai-brokerage-72m-recovered",
    eyebrow: "CASE STUDY · REAL ESTATE BROKERAGE · DUBAI",
    title: "Odoo Case Study: AED 72M Recovered — SGC Tech AI",
    description:
      "How a ~900-agent Dubai brokerage recovered AED 72M in uncollected invoices, cut reconciliation time 80% and commission disputes 90% with Bitrix–Odoo.",
    h1: "How does a 900-agent brokerage recover AED 72M in uncollected invoices?",
    answerBlock:
      "A ~900-agent Dubai real-estate brokerage recovered AED 72 million in previously uncollected invoices — deals from 2020 to 2022 — within seven months of SGC deploying an integrated Bitrix–Odoo 17 system with an automated commission engine, invoice automation and management dashboards. The build was delivered in six to seven weeks.",
    shortAnswer: [
      "AED 72M recovered from 2020–2022 uncollected invoices, over a 7-month window",
      "Account-reconciliation time cut 80%; commission disputes down 90%",
      "Agent and talent retention improved 50%",
      "Delivered in 6–7 weeks — Bitrix kept for CRM, Odoo added for finance and commissions",
    ],
    sections: [
      {
        question: "What was the challenge?",
        answer:
          "The brokerage was operating at significant scale — around 900 agents across sales, rentals and property management — but without an integrated system for deals, invoices, commission payments, listings and financial follow-ups.",
        detail:
          "Processes depended on manual input and disconnected records. That produced unclear statements of account, slow reconciliations and frequent commission disputes, and made it difficult to follow up on unpaid invoices — contributing to millions of dirhams in uncollected revenue and damaging agent relationships.",
      },
      {
        question: "What did SGC build?",
        answer:
          "An integrated operational and financial management system, designed and delivered in an intensive six-to-seven-week period — including weekend work — to meet the company's urgent requirements.",
        detail:
          "Bitrix CRM integration for lead, client and deal management · Odoo 17 accounting connecting deals to invoicing and financial records · automated rule-based commission engine calculated on payment · automated invoice generation, tracking and collection follow-up · financial controls and supporting-document management · agent chatbot for commission-status checks · management and operational dashboards · property inventory, listings and end-to-end sales/rental/maintenance · historical data migration, validation and reconciliation.",
      },
      {
        question: "How were AED 72 million in invoices recovered?",
        answer:
          "The automated commission engine and reconciliation build gave the finance team control over outstanding balances on 2020–2022 deals. The client recovered AED 72 million in previously uncollectable invoices over a seven-month window.",
        detail:
          "Recovery is quoted directly from the signed case study and the client's finance leadership — it is a measured outcome, not a projection. The full audit trail and a reference call are available on request under NDA.",
      },
      {
        question: "What changed for the finance team?",
        answer:
          "Account-reconciliation time fell by approximately 80%, and commission-related disputes fell by 90%. Agent and talent retention improved by 50%.",
        detail:
          "The same system now carries the deal-to-invoice-to-commission trail, so statements of account and payment status are answerable in seconds instead of manual cross-checks.",
      },
    ],
    results: [
      { label: "Uncollected invoices recovered (2020–2022 deals)", value: ax.metrics.invoicesRecovered.value },
      { label: "Recovery timeline", value: ax.metrics.invoicesRecovered.window },
      { label: "Account-reconciliation time", value: ax.metrics.reconciliationTimeChange },
      { label: "Commission-related disputes", value: ax.metrics.commissionDisputeChange },
      { label: "Agent & talent retention", value: ax.metrics.agentRetentionChange },
    ],
    quote: { text: ax.quote, attribution: ax.quoteAttribution },
    faqs: [
      {
        q: "How long did this implementation take?",
        a: "Six to seven weeks, including extended hours and Sundays, because the client's situation was urgent. Timelines are always defined in Discovery and fixed in writing before work begins.",
      },
      {
        q: "Did you replace the client's CRM?",
        a: "No. Bitrix stayed as the CRM for lead capture, client and deal management; Odoo 17 was integrated alongside it for accounting, invoicing, commissions and reporting.",
      },
      {
        q: "What does “recovered” mean in this case study?",
        a: "Uncollected invoices from 2020–2022 deals were recovered through the automated commission engine, invoice automation and reconciliation controls — AED 72 million over seven months, per the signed case study.",
      },
      {
        q: "Can we speak to this client?",
        a: "Reference calls are arranged under NDA after Discovery. The client's identity is disclosed at that stage; it is withheld from public marketing at their request.",
      },
    ],
    internalLinks: [
      { label: "Odoo implementation in the UAE", href: "/services/odoo-implementation-uae" },
      { label: "Outsourced financial reporting", href: "/services/outsourced-financial-reporting" },
      { label: "The 65-person brokerage ROI case", href: "/case-studies/uae-brokerage-445-roi" },
      { label: "All case studies", href: "/case-studies" },
    ],
    keywords: [
      "Odoo for real estate brokerage Dubai",
      "real estate commission automation",
      "invoice recovery UAE",
      "Bitrix Odoo integration",
      "brokerage ERP case study Dubai",
      "Odoo implementation case study",
    ],
    publishedDate: PUBLISHED,
    updatedDate: UPDATED,
    publicLabel: ax.publicLabel,
    sector: ax.sector,
    scale: ax.scale,
    headline: ax.headline,
    cardMetrics: [
      { label: "Invoices recovered", value: "AED 72M" },
      { label: "Reconciliation time", value: "−80%" },
      { label: "Commission disputes", value: "−90%" },
    ],
  },
  {
    slug: "uae-brokerage-445-roi",
    eyebrow: "CASE STUDY · REAL ESTATE BROKERAGE · UAE",
    title: "Odoo Case Study: 445% Year-1 ROI — SGC Tech AI",
    description:
      "A 65-person UAE brokerage cut manual admin 75%, released ~248 back-office hrs/week and hit 445% Year-1 ROI with a 2.2-month payback on end-to-end Odoo.",
    h1: "What ROI can a brokerage expect from an Odoo ERP?",
    answerBlock:
      "A 65-person UAE brokerage achieved 445% first-year ROI with a 2.2-month payback after SGC deployed an end-to-end Odoo ERP integrated with its existing Bitrix CRM. Year one: AED 39.89 million in brokerage revenue processed, AED 1.64 million in net savings, 75% less manual work and roughly 248 back-office hours released per week.",
    shortAnswer: [
      "445% Year-1 ROI; the investment paid back in 2.2 months",
      "AED 1.64M Year-1 net savings; AED 9.67M projected over five years",
      "~248 back-office hours released per week; 75% less manual admin",
      "AED 897,419 in annual billing losses prevented; billing errors down 90%",
    ],
    sections: [
      {
        question: "What was the starting point?",
        answer:
          "The brokerage ran on spreadsheets, handwritten records, printed documents and manually assigned tasks. Bitrix handled CRM and lead distribution but was not connected to accounting, deal management or invoicing, and there was no standardized invoicing or structured follow-up process.",
        detail:
          "The back office — eleven people — was spending an estimated 247.5 hours per week on repetitive administrative work. The estimated annual operational burden was AED 2.47 million, with recurring disputes across deals, invoices and commissions.",
      },
      {
        question: "What did SGC build?",
        answer:
          "An end-to-end Odoo ERP covering finance, invoicing, brokerage, property, HR, reporting and administration — with the existing Bitrix CRM kept for lead capture rather than replaced.",
        detail:
          "Once an opportunity moved into an active transaction, the client, property, agent, agency, deal, supporting documents, invoicing, payment records, commission and follow-ups were connected into a single digital record — alongside standardized invoicing and approval workflows, automated payment tracking, AI-assisted customer classification, HR and payroll, e-learning, central calendars and management dashboards.",
      },
      {
        question: "Where did the 445% ROI come from?",
        answer:
          "From measurable operating gains in year one: AED 1.64 million in net savings against the total investment, a 66% operating-cost reduction, and a 90% reduction in billing errors and revenue leakage — including AED 897,419 in annual billing losses prevented.",
        detail:
          "The client's own summary: for every AED 1 invested, approximately AED 5.45 came back in gross operational benefits. The five-year projected net savings figure is AED 9.67 million.",
      },
      {
        question: "What happened to the released hours?",
        answer:
          "Roughly 248 back-office hours per week were released by automating repetitive admin. The client redirected that capacity into sales support and collections rather than headcount reduction.",
        detail:
          "Manual administrative work fell 75% from the pre-engagement baseline of 247.5 hours per week, re-measured after go-live.",
      },
    ],
    results: [
      { label: "Brokerage revenue processed through ERP", value: osus.metrics.revenueProcessed },
      { label: "First-year net savings", value: osus.metrics.firstYearNetSavings },
      { label: "First-year ROI", value: osus.metrics.firstYearRoi },
      { label: "Payback period", value: osus.metrics.paybackPeriod },
      { label: "Operating-cost reduction", value: osus.metrics.operatingCostReduction },
      { label: "Manual administrative work reduction", value: osus.metrics.manualWorkReduction },
      { label: "Billing errors & revenue leakage", value: osus.metrics.billingErrorChange },
      { label: "Employee hours released per week", value: osus.metrics.hoursReleasedPerWeek },
      { label: "Estimated annual billing losses prevented", value: osus.metrics.annualBillingLossesPrevented },
      { label: "5-year projected net savings", value: osus.metrics.fiveYearProjectedSavings },
    ],
    quote: { text: osus.quote, attribution: osus.quoteAttribution },
    faqs: [
      {
        q: "How is the 2.2-month payback calculated?",
        a: "It is the time for first-year net savings (AED 1.64 million) to exceed the total investment in the deployment, per the signed case study. It is measured from the client's live system, not projected.",
      },
      {
        q: "How were the ~248 hours per week measured?",
        a: "The pre-engagement baseline was an estimated 247.5 back-office hours per week spent on repetitive administrative tasks. The post-go-live measurement showed a 75% reduction, which is how the released-hours figure is derived.",
      },
      {
        q: "Did AI make decisions in this deployment?",
        a: "AI handled low-risk assistance — customer classification, reminders and notifications. Higher-stakes decisions keep human review, consistent with the verification tiers SGC publishes for AI automation.",
      },
      {
        q: "Was anyone made redundant?",
        a: "No. The engagement released capacity; the client redirected it into sales support and collections, as quoted in the signed case study.",
      },
    ],
    internalLinks: [
      { label: "AI automation for finance", href: "/services/ai-automation-finance" },
      { label: "Odoo implementation in the UAE", href: "/services/odoo-implementation-uae" },
      { label: "Pricing", href: "/pricing" },
      { label: "The 900-agent recovery case", href: "/case-studies/dubai-brokerage-72m-recovered" },
      { label: "All case studies", href: "/case-studies" },
    ],
    keywords: [
      "Odoo ROI UAE",
      "Odoo ERP cost benefit brokerage",
      "ERP payback period UAE",
      "reduce manual admin finance UAE",
      "Odoo case study UAE",
      "brokerage ERP UAE",
    ],
    publishedDate: PUBLISHED,
    updatedDate: UPDATED,
    publicLabel: osus.publicLabel,
    sector: osus.sector,
    scale: osus.scale,
    headline: osus.headline,
    cardMetrics: [
      { label: "First-year ROI", value: "445%" },
      { label: "Payback period", value: "2.2 months" },
      { label: "Hours released", value: "~248/wk" },
    ],
  },
  {
    slug: "construction-erp-vat-readiness",
    eyebrow: "CASE STUDY · CONSTRUCTION · GOVERNMENT CONTRACTOR · UAE",
    title: "Construction ERP Case Study: VAT-Ready — SGC Tech AI",
    description:
      "How a UAE government-infrastructure contractor replaced Zoho and spreadsheets with an audit-ready ERP after a AED 10–12K VAT filing overpayment.",
    h1: "How does a government contractor fix VAT filing errors with ERP?",
    answerBlock:
      "After an incorrect VAT filing cost AED 10,000–12,000 in overpaid tax, a UAE construction contractor delivering government infrastructure projects replaced Zoho plus manual spreadsheets with a construction-tuned ERP: multi-project tracking, VAT-compliant invoicing, an audit trail and statutory reporting workflows. The repeat filing event was eliminated.",
    shortAnswer: [
      "Zoho + spreadsheets replaced with one integrated, audit-ready ERP",
      "AED 10,000–12,000 overpaid on the most recent VAT filing before the rebuild",
      "Repeat incorrect-filing event eliminated",
      "Project-level visibility across all active government projects",
    ],
    sections: [
      {
        question: "What was the risk before the rebuild?",
        answer:
          "The company was invoicing on Zoho and running everything else on manual spreadsheets — no proper tracking, no project management, and no system capable of supporting large government-project requirements.",
        detail:
          "Four exposures compounded: legal risk (government contracts require documented controls, audit trails and statutory reporting the old stack could not produce) · image risk (inability to demonstrate compliance to a government client damages future contract eligibility) · financial risk (AED 10,000–12,000 overpaid on the most recent VAT submission due to incorrect filing) · operational risk (no project-level tracking across concurrent government engagements).",
      },
      {
        question: "What did SGC replace it with?",
        answer:
          "An integrated ERP tuned for UAE construction and government-contract requirements, delivering end-to-end tracking across projects, invoicing and statutory reporting — with the audit trail and controls the previous stack could not provide.",
        detail:
          "Construction-tuned project management (multi-project, government-spec) · VAT-compliant invoicing with proper supporting documentation · end-to-end financial tracking and reconciliation · audit-ready reporting and statutory filing workflows · migration from Zoho and spreadsheets into a single source of truth · process controls to prevent repeat incorrect-filing events.",
      },
      {
        question: "How was the repeat filing event eliminated?",
        answer:
          "VAT-compliant invoicing with supporting documentation, reconciliation across the project ledger, and filing workflows backed by an audit trail. The signed case study records the repeat incorrect-filing event as eliminated.",
        detail:
          "The controls are structural: every transaction carries its supporting document and traceable approval path, so the reconciliation that feeds a filing is produced by the system rather than assembled by hand.",
      },
      {
        question: "Does this help win future government work?",
        answer:
          "Audit-ready controls and traceable project records are what government clients require to demonstrate compliance. The engagement replaced an inability to show controls with a system that produces them.",
      },
    ],
    results: [
      { label: "Manual + Zoho operations", value: "Replaced with integrated ERP" },
      { label: "Government-project readiness", value: "Controls & audit trail in place" },
      { label: "VAT filing accuracy", value: "Repeat event eliminated" },
      { label: "Project-level visibility", value: "All active government projects" },
      { label: "VAT overpaid on last filing before rebuild", value: "AED 10,000–12,000" },
    ],
    quote: { text: traffexcel.quote, attribution: traffexcel.quoteAttribution },
    faqs: [
      {
        q: "What was the actual VAT cost in this case?",
        a: "AED 10,000–12,000 was overpaid on the most recent VAT submission before the rebuild, due to an incorrect filing, per the signed case study.",
      },
      {
        q: "Why couldn't Zoho and spreadsheets carry government projects?",
        a: "The stack had no project-level tracking, no audit trail and no statutory reporting controls — the things government contracts require. Invoicing sat in one tool while operations sat in spreadsheets, so nothing reconciled end to end.",
      },
      {
        q: "Is the past overpayment recovered?",
        a: "The signed case study records the overpayment and confirms the repeat event was eliminated. It does not claim recovery of the past amount, and neither do we — that depends on the client's filings with the authority.",
      },
      {
        q: "Can we verify the outcome?",
        a: "The audit trail and a reference call are available under NDA after Discovery. We do not publish client names on marketing surfaces.",
      },
    ],
    internalLinks: [
      { label: "UAE Corporate Tax compliance in Odoo", href: "/services/uae-corporate-tax-compliance" },
      { label: "Odoo implementation rescue", href: "/services/odoo-implementation-rescue" },
      { label: "The 445% ROI brokerage case", href: "/case-studies/uae-brokerage-445-roi" },
      { label: "All case studies", href: "/case-studies" },
    ],
    keywords: [
      "construction ERP UAE",
      "VAT compliance Odoo UAE",
      "government contractor ERP UAE",
      "Zoho migration ERP",
      "construction project management ERP UAE",
      "VAT filing error fix UAE",
    ],
    publishedDate: PUBLISHED,
    updatedDate: UPDATED,
    publicLabel: traffexcel.publicLabel,
    sector: traffexcel.sector,
    scale: traffexcel.scale,
    headline: traffexcel.headline,
    cardMetrics: [
      { label: "Stack replaced", value: "Zoho + Excel" },
      { label: "VAT filing", value: "Repeat event eliminated" },
      { label: "Project visibility", value: "All active projects" },
    ],
  },
];

export function getCaseStudyPage(slug: string): CaseStudyPageData | undefined {
  return CASE_STUDY_PAGES.find((p) => p.slug === slug);
}

// Hub copy
export const CASE_STUDIES_HUB = {
  title: "Case Studies — Odoo & AI Results UAE — SGC Tech AI",
  description:
    "Anonymized, signed case studies: AED 72M recovered for a Dubai brokerage, 445% Year-1 ROI in a 65-person firm, and a VAT-audit-ready government contractor.",
  h1: "Verified outcomes from live deployments.",
  intro:
    "Three signed engagements, published with clients anonymized at their request. Every figure below is measured from live systems and recorded in the signed case study — not projected. Reference calls are arranged under NDA after Discovery.",
  publishedDate: PUBLISHED,
  updatedDate: UPDATED,
} as const;
