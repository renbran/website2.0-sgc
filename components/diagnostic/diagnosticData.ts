// Operational Health Diagnostic — question bank, scoring, and
// recommendation engine. Content mirrors the original sgctech.ai/diagnostic
// tool: 12 questions across Finance, Sales, Operations, People, each scored
// 0–4, rolled up into per-system percentages and an overall health band.

export type ScoreOption = {
  score: number;
  label: string;
  description: string;
};

export type Question = {
  id: string;
  text: string;
  helper: string;
};

export type System = {
  id: "finance" | "sales" | "operations" | "people";
  label: string;
  short: string;
  description: string;
  questions: Question[];
};

export type Band = "thriving" | "stable" | "at_risk" | "critical";

export type SystemScore = {
  id: System["id"];
  label: string;
  raw: number;
  max: number;
  pct: number;
  band: Band;
};

export type Recommendation = {
  system: System["id"];
  title: string;
  description: string;
  priority: "immediate" | "short_term" | "ongoing";
};

export const SCORE_OPTIONS: ScoreOption[] = [
  { score: 0, label: "0", description: "No — blind spot" },
  { score: 1, label: "1", description: "Rarely — ad-hoc" },
  { score: 2, label: "2", description: "Sometimes — inconsistent" },
  { score: 3, label: "3", description: "Mostly — repeatable" },
  { score: 4, label: "4", description: "Yes — measured & tracked" },
];

export const SYSTEMS: System[] = [
  {
    id: "finance",
    label: "Finance",
    short: "Cash, reporting, and budget control",
    description:
      "Visibility into cash flow, accurate reporting, and disciplined budget ownership.",
    questions: [
      {
        id: "finance.cashflow_visibility",
        text: "Do you have a real-time view of cash flow across accounts, receivables, and payables?",
        helper: "Not a spreadsheet — a live dashboard updated at least weekly.",
      },
      {
        id: "finance.monthly_close",
        text: "Can you close your books and produce accurate P&L within 5 business days of month-end?",
        helper: "A predictable, repeatable close cycle.",
      },
      {
        id: "finance.budget_variance",
        text: "Do you track actual vs. budget variance and review it monthly with department owners?",
        helper: "Variance ≥ 10% triggers a corrective conversation.",
      },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    short: "Pipeline, follow-up, and conversion",
    description:
      "Predictable pipeline, disciplined follow-up, and clear conversion benchmarks.",
    questions: [
      {
        id: "sales.pipeline_hygiene",
        text: "Is every open opportunity in your CRM with a value, close date, and next action?",
        helper: "No zombie deals. No missing fields.",
      },
      {
        id: "sales.followup_cadence",
        text: "Do reps follow a documented cadence (touch sequence) for new leads and stalled deals?",
        helper: "Cadence = scheduled calls, emails, and tasks per stage.",
      },
      {
        id: "sales.winrate_tracked",
        text: "Do you track win rate by source, segment, and rep — and review it monthly?",
        helper: 'You can answer "what changed last month and why" in 5 minutes.',
      },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    short: "Orders, inventory, and delivery",
    description:
      "Reliable fulfilment, accurate inventory, and on-time delivery you can promise.",
    questions: [
      {
        id: "ops.order_to_cash_cycle",
        text: "Is your order-to-cash cycle mapped end-to-end with documented SLAs at each step?",
        helper:
          "From order receipt to cash collection — every step has an owner and a clock.",
      },
      {
        id: "ops.inventory_accuracy",
        text: "Is your inventory accuracy above 95% and verified by cycle counts (not just annual)?",
        helper: "You can trust the system, not just the spreadsheet.",
      },
      {
        id: "ops.otif",
        text: "Do you measure On-Time-In-Full delivery and review it weekly with the operations team?",
        helper: "OTIF ≥ 95% is the operational standard for mid-market.",
      },
    ],
  },
  {
    id: "people",
    label: "People",
    short: "Roles, accountability, and capacity",
    description:
      "Clear ownership, defined capacity, and a system for performance conversations.",
    questions: [
      {
        id: "people.role_clarity",
        text: "Does every person in the company have a written role with 3–5 measurable outcomes?",
        helper: "Not a job description — outcomes that can be checked quarterly.",
      },
      {
        id: "people.weekly_rhythm",
        text: "Do teams run a documented weekly meeting (L10 / staff meeting) with scorecards and rocks?",
        helper: "Same agenda, same scorecard, every week. Issues surface fast.",
      },
      {
        id: "people.capacity_planning",
        text: "Do managers plan capacity 4 weeks ahead and escalate overload before it becomes attrition?",
        helper: "You see burnout signals before people quit.",
      },
    ],
  },
];

export const TOTAL_QUESTIONS = SYSTEMS.reduce(
  (n, s) => n + s.questions.length,
  0,
);

export function bandFor(pct: number): Band {
  if (pct >= 85) return "thriving";
  if (pct >= 65) return "stable";
  if (pct >= 40) return "at_risk";
  return "critical";
}

export const BAND_LABELS: Record<Band, string> = {
  thriving: "THRIVING",
  stable: "STABLE",
  at_risk: "AT RISK",
  critical: "CRITICAL",
};

export const BAND_COLORS: Record<Band, string> = {
  thriving: "var(--accent-sage)",
  stable: "var(--accent-teal)",
  at_risk: "var(--accent)",
  critical: "var(--accent-copper)",
};

export function scoreSystems(answers: Record<string, number>): SystemScore[] {
  return SYSTEMS.map((sys) => {
    const raw = sys.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    const max = 4 * sys.questions.length;
    const pct = max > 0 ? Math.round((raw / max) * 100) : 0;
    return { id: sys.id, label: sys.label, raw, max, pct, band: bandFor(pct) };
  });
}

export function scoreOverall(systems: SystemScore[]) {
  const raw = systems.reduce((sum, s) => sum + s.raw, 0);
  const max = systems.reduce((sum, s) => sum + s.max, 0);
  const pct = max > 0 ? Math.round((raw / max) * 100) : 0;
  const band = bandFor(pct);
  return { raw, max, pct, band, label: BAND_LABELS[band], color: BAND_COLORS[band] };
}

const SYSTEM_PLAYBOOK: Record<
  System["id"],
  (band: Band) => { title: string; description: string }
> = {
  finance: (band) => ({
    title: "Rebuild the month-end close and reporting cadence",
    description:
      band === "critical"
        ? "Your close is unreliable. Implement a 5-day close process: daily reconciliation, owner-per-account, and a published close calendar. Without trustworthy numbers, every other decision is a guess."
        : "Tighten your close to 5 business days and introduce a monthly variance review with department owners. Make variance ≥ 10% a triggering event for corrective action.",
  }),
  sales: (band) => ({
    title: "Fix pipeline discipline before adding more leads",
    description:
      band === "critical"
        ? "You have no reliable view of where deals stand. Mandate CRM discipline (next action, close date) and a documented lead follow-up cadence before spending another dirham on demand gen."
        : "Tighten CRM hygiene rules and run a weekly pipeline review. Track win-rate by source and rep — without it, you cannot diagnose revenue problems.",
  }),
  operations: (band) => ({
    title: "Map and instrument the order-to-cash cycle",
    description:
      band === "critical"
        ? "You cannot promise delivery dates with confidence. Map the full O2C cycle, assign owners per step, and start measuring OTIF weekly. Until you do, every customer commitment is a risk."
        : "Introduce weekly OTIF reporting and cycle counts for inventory. Trust in the operational data is a prerequisite for scaling.",
  }),
  people: (band) => ({
    title: "Install a weekly leadership rhythm",
    description:
      band === "critical"
        ? "Accountability is missing. Run a weekly L10 with a scorecard, rocks, and issues list. Until ownership is visible weekly, execution will slip."
        : "Document role outcomes for every person and review them quarterly. Without measurable outcomes, performance conversations become opinion.",
  }),
};

export function buildRecommendations(
  answers: Record<string, number>,
  systems: SystemScore[],
): Recommendation[] {
  const recs: Recommendation[] = [];

  for (const sys of [...systems].sort((a, b) => a.pct - b.pct).slice(0, 2)) {
    if (sys.band === "critical" || sys.band === "at_risk") {
      const play = SYSTEM_PLAYBOOK[sys.id](sys.band);
      recs.push({
        system: sys.id,
        title: play.title,
        description: play.description,
        priority: sys.band === "critical" ? "immediate" : "short_term",
      });
    }
  }

  const weakAnswers = SYSTEMS.flatMap((sys) =>
    sys.questions.map((q) => ({
      sys: sys.id,
      q,
      score: answers[q.id] ?? 0,
    })),
  )
    .filter((e) => e.score <= 1)
    .slice(0, 3);

  for (const { sys, q, score } of weakAnswers) {
    recs.push({
      system: sys,
      title: q.text,
      description:
        score === 0
          ? "This is a blind spot. Establish a baseline measurement in the next 30 days before optimising anything else."
          : "You have ad-hoc visibility only. Codify this process into a documented workflow with a clear owner.",
      priority: "immediate",
    });
  }

  recs.push({
    system: "operations",
    title: "Run a quarterly operational health check",
    description:
      "Block a half-day with leadership every quarter to re-score the diagnostic and track movement. Operational health decays without measurement.",
    priority: "ongoing",
  });

  return recs;
}

export const PRIORITY_LABELS: Record<Recommendation["priority"], string> = {
  immediate: "Immediate",
  short_term: "Short-term",
  ongoing: "Ongoing",
};

export const PRIORITY_COLORS: Record<Recommendation["priority"], string> = {
  immediate: "var(--accent-copper)",
  short_term: "var(--accent)",
  ongoing: "var(--accent-sage)",
};

export const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

export const INDUSTRIES = [
  "Real Estate",
  "Construction",
  "Trading/Distribution",
  "Manufacturing",
  "Professional Services",
  "Retail",
  "Hospitality",
  "Other",
];
