export type HeroIndustryTag = "real-estate" | "construction" | "trading" | "all";

export interface HeroStaticScene {
  sceneId: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  frameStart: number;
  frameEnd: number;
  frameStaticPeak: number;
  problemHeadline: string;
  problemSubtext: string | null;
  solutionHeadline: string;
  solutionSubtext: string;
  highlightNumber: string | null;
  industryTag: HeroIndustryTag;
}

export interface HeroFinaleScene {
  sceneId: 8;
  frameStart: number;
  frameEnd: number;
  frameStaticPeak: number;
  type: "finale";
  headline: string;
  proofStats: string[];
  tagline: string;
  cta: string;
  industryTag: HeroIndustryTag;
}

export type HeroScene = HeroStaticScene | HeroFinaleScene;

export const TOTAL_FRAMES = 119;

export const HERO_SCENES: HeroScene[] = [
  {
    sceneId: 1,
    frameStart: 18,
    frameEnd: 25,
    frameStaticPeak: 22,
    problemHeadline: "Excel, Tally, WhatsApp?",
    problemSubtext: "Work keeps breaking across too many tools.",
    solutionHeadline: "Unify operations in Odoo with AI.",
    solutionSubtext: "SGC Tech AI centralizes CRM, documents, and approvals.",
    highlightNumber: "AED 72M Recovered",
    industryTag: "all"
  },
  {
    sceneId: 2,
    frameStart: 33,
    frameEnd: 40,
    frameStaticPeak: 37,
    problemHeadline: "Lost after-hours leads?",
    problemSubtext: "Every missed call is silent revenue loss.",
    solutionHeadline: "Capture every inquiry with AI Voice.",
    solutionSubtext: "Route leads, qualify intent, and keep response time tight.",
    highlightNumber: "445% ROI",
    industryTag: "real-estate"
  },
  {
    sceneId: 3,
    frameStart: 48,
    frameEnd: 55,
    frameStaticPeak: 52,
    problemHeadline: "Commission disputes slowing cashflow?",
    problemSubtext: "Approvals stall when numbers do not match.",
    solutionHeadline: "Automate commissions and approvals.",
    solutionSubtext: "SGC Tech AI locks the rules before the payout stage.",
    highlightNumber: "−90% disputes",
    industryTag: "real-estate"
  },
  {
    sceneId: 4,
    frameStart: 63,
    frameEnd: 70,
    frameStaticPeak: 67,
    problemHeadline: "How many hours are manual?",
    problemSubtext: "Data entry still consumes the team.",
    solutionHeadline: "Remove data entry with document AI.",
    solutionSubtext: "Scan, classify, and push records into the right workflow.",
    highlightNumber: "2.2-month payback",
    industryTag: "construction"
  },
  {
    sceneId: 5,
    frameStart: 78,
    frameEnd: 85,
    frameStaticPeak: 82,
    problemHeadline: "Facing UAE compliance drift?",
    problemSubtext: "VAT, CT, PDPL, and goAML need structure.",
    solutionHeadline: "Lock in controls before risk grows.",
    solutionSubtext: "SGC Tech AI sets the compliance layer around your process.",
    highlightNumber: "Law 7-2025",
    industryTag: "all"
  },
  {
    sceneId: 6,
    frameStart: 93,
    frameEnd: 100,
    frameStaticPeak: 97,
    problemHeadline: "Can you trust the latest numbers?",
    problemSubtext: "Reports are stale before decisions are made.",
    solutionHeadline: "Track live KPIs in one command center.",
    solutionSubtext: "SGC Tech AI keeps finance and ops on the same view.",
    highlightNumber: "real time",
    industryTag: "trading"
  },
  {
    sceneId: 7,
    frameStart: 108,
    frameEnd: 112,
    frameStaticPeak: 110,
    problemHeadline: "Do consultants learn on your time?",
    problemSubtext: "Vendor ramp-up should not slow delivery.",
    solutionHeadline: "Deploy operator-led systems, not guesswork.",
    solutionSubtext: "Fixed scope, fixed timeline, and a team that knows the market.",
    highlightNumber: "fixed scope",
    industryTag: "all"
  },
  {
    sceneId: 8,
    frameStart: 113,
    frameEnd: 119,
    frameStaticPeak: 116,
    type: "finale",
    headline: "Operator-Led Proof",
    proofStats: ["AED 72M Recovered · AX Capital", "445% Year-1 ROI · OSUS Real Estate", "2.2-Month Payback"],
    tagline: "Fixed Price. Fixed Timeline. Operator-Led.",
    cta: "Book a 30-min scoping call - sgctech.ai",
    industryTag: "all"
  }
];

export function getFrameFromProgress(progress: number): number {
  const bounded = Math.max(0, Math.min(1, progress));
  return Math.max(1, Math.min(TOTAL_FRAMES, Math.ceil(bounded * TOTAL_FRAMES)));
}

export function getSceneForFrame(frame: number): HeroScene | null {
  return HERO_SCENES.find((scene) => frame >= scene.frameStart && frame <= scene.frameEnd) ?? null;
}
