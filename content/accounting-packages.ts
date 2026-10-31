// Accounting packages — production copy from "Vol 2 Commercial Packages, Pricing Page"
// (SGC TECH AI Complete Business System v3.1, 22 Oct 2026). Prices exclude 5% VAT.
// The charge itself comes from the Odoo products (sgc_accounting_checkout): change a
// price there and here together.

export type PackageCode = "start" | "essential" | "compliance" | "business" | "growth_cfo";

export type AccountingPackage = {
  code: PackageCode;
  name: string;
  monthly: number;
  forWho: string;
  transactions: string;
  banks: string;
  seats: string;
  close: string;
  featured?: boolean;
};

export const ONBOARDING_FEE = 500;
export const VAT_PERCENT = 5;

export const PACKAGES: AccountingPackage[] = [
  {
    code: "start",
    name: "START",
    monthly: 399,
    forWho: "Freelancers, new startups and very low-volume businesses.",
    transactions: "30",
    banks: "1",
    seats: "1",
    close: "Day 20",
  },
  {
    code: "essential",
    name: "ESSENTIAL",
    monthly: 599,
    forWho: "Small companies that are VAT-registered or about to be.",
    transactions: "75",
    banks: "2 + 1",
    seats: "2",
    close: "Day 15",
  },
  {
    code: "compliance",
    name: "COMPLIANCE",
    monthly: 799,
    forWho: "Businesses that want tax deadlines handled on a calendar, not by memory.",
    transactions: "150",
    banks: "3 + 1",
    seats: "3",
    close: "Day 15",
    featured: true,
  },
  {
    code: "business",
    name: "BUSINESS",
    monthly: 1299,
    forWho: "Growing SMEs with employees and more financial moving parts.",
    transactions: "300",
    banks: "5 + 2",
    seats: "5",
    close: "Day 10",
  },
  {
    code: "growth_cfo",
    name: "GROWTH CFO",
    monthly: 1999,
    forWho: "Companies that need finance leadership without a full-time finance department.",
    transactions: "500",
    banks: "Reasonable",
    seats: "8",
    close: "Day 7",
  },
];

/** Comparison rows: one value per package, in PACKAGES order. "✓" / "—" render as marks. */
export const MATRIX: [string, string[]][] = [
  ["P&L", ["Cash summary", "✓", "✓", "✓", "✓"]],
  ["Balance Sheet", ["—", "✓", "✓", "✓", "✓"]],
  ["Cash flow", ["—", "—", "Annual", "Monthly", "13-week view"]],
  ["VAT return preparation", ["—", "Quarterly", "Quarterly", "Quarterly", "Quarterly"]],
  ["VAT filing coordination", ["—", "—", "✓", "✓", "✓"]],
  ["Corporate Tax registration + return", ["—", "—", "✓", "✓", "✓"]],
  ["Annual financial statements (IFRS)", ["—", "—", "✓", "✓", "✓"]],
  ["Management pack", ["—", "—", "—", "✓", "✓"]],
  ["Payroll + WPS support", ["—", "—", "—", "5 employees", "15 employees"]],
  ["KPI dashboard, budget, forecast", ["—", "—", "—", "—", "✓"]],
  ["Quarterly CFO review", ["—", "—", "—", "—", "✓"]],
  ["Client portal + document vault", ["✓", "✓", "✓", "✓", "✓"]],
  ["Accounting system included", ["✓", "✓", "✓", "✓", "✓"]],
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Is there a free trial?",
    a: "No. You pay the first month (or the annual prepayment) plus the one-time AED 500 onboarding, and your client portal opens as soon as the payment clears.",
  },
  {
    q: "What counts as a transaction?",
    a: "One financial line item from your documents: an invoice, a bill, a bank payment, a receipt, or a payroll journal. Documents that match (invoice + payment) are processed together as one.",
  },
  {
    q: "Is the software really included?",
    a: "Yes. Every package includes the cloud accounting system with the seats listed, plus your portal and document vault. Extra users are USD 7 per user per month, stated openly.",
  },
  {
    q: "Do you file my VAT return?",
    a: "We prepare it, you approve it, and we coordinate filing through your EmaraTax authorisation from the COMPLIANCE package. You remain responsible for the accuracy of information you provide.",
  },
  {
    q: "Can you do my audit?",
    a: "We prepare audit-ready records and manage the process with a licensed independent audit firm that issues the opinion. This separation protects you.",
  },
  {
    q: "What if I am behind on my books?",
    a: "Catch-up bookkeeping is quoted separately based on months of backlog and complexity; your onboarding quote will state it explicitly.",
  },
  {
    q: "What happens if I go over my transactions?",
    a: "Your dashboard shows usage. At three months above 90% we recommend an upgrade in writing. Within-package overages are AED 4.50 per transaction and always come after an upgrade recommendation.",
  },
  {
    q: "Is there a contract?",
    a: "Monthly packages run month to month with 30 days' notice; annual prepayment (12 for 11) suits clients who want the best rate.",
  },
  {
    q: "Do you guarantee no penalties?",
    a: "No honest firm can. We guarantee process: cutoffs, review gates, filing before deadlines. Outcomes depend on the accuracy and timeliness of information you provide.",
  },
];

export function aed(amount: number): string {
  return `AED ${amount.toLocaleString("en-AE")}`;
}

export function packageByCode(code: string | undefined): AccountingPackage | undefined {
  return PACKAGES.find((p) => p.code === code);
}
