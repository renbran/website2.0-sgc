// scripts/apply-copy-c2-c15.ts
// One-shot copy-only edits for sections C.2–C.15 of Deliverable C (Book-Format
// Copy Rewrites). Pure text swaps — no className, color token, layout markup,
// or component structure changes. Inline gold-span H2 highlights are dropped
// where the new copy is a single sentence (e.g. "Compliance, or transformation.")
// because the punchline-emphasis pattern no longer fits the new rhythm; this
// is the smallest structural change consistent with applying the draft verbatim.
//
// Special handling:
//   • C.5 and C.12 eyebrows grow longer than their originals, so
//     `whitespace-nowrap` is added to the SectionEyebrow className on those
//     two call sites as a preventive measure (couldn't run a 375px viewport
//     check from this environment).
//   • C.8 "Clients typically move up within twelve months." and C.12
//     "Verification on request under NDA." — both unverifiable against
//     real data, so the documented fallback is applied (those sentences
//     dropped).
//   • C.9 pillar TITLES stay verbatim; only the `detail` field changes.
//   • C.6, C.15 founder bios and quotes stay verbatim; only the
//     surrounding H2/italic narrative lines change.

import { readFileSync, writeFileSync } from "node:fs";

const ROOT = "D:\\Users\\branm\\Downloads\\Final_website_sgc\\website2.0-sgc";

interface Edit {
  label: string;
  oldStr: string;
  newStr: string;
}
interface FileEdit {
  path: string;
  edits: Edit[];
}

const FILES: FileEdit[] = [
  {
    path: ROOT + "\\components\\about\\OriginStory.tsx",
    edits: [
      {
        label: "C.2.H2",
        oldStr: "            Diagnose before you prescribe.",
        newStr: "            The principle has a name, but not a tagline.",
      },
      {
        label: "C.2.P1",
        oldStr:
          "              SGC Tech AI was founded on a simple principle: diagnose before you prescribe.\n              We are the <span className=\"text-[var(--accent)]\">Operational Physician</span>{\" \"}\n              of the UAE Mid-Market — we identify the condition before we sell the cure.\n              Unlike consultants who arrive with pre-packaged solutions, we first understand\n              how your business actually operates, then we build systems that fit your\n              reality.",
        newStr:
          "              We diagnose before we prescribe. That is the whole of it. A chartered accountant\n              looks at your financials the way a doctor looks at a chart — with training,\n              with skepticism, and without an opinion yet.",
      },
      {
        label: "C.2.P2",
        oldStr:
          "              Our founders are operators who have closed the books, run the audits, filed the\n              FTA Corporate Tax returns, and implemented Odoo systems for companies across\n              the UAE. We are practitioners, not content creators.",
        newStr:
          "              The two of us have closed the books, run the audits, filed the UAE Corporate\n              Tax returns, and rolled out Odoo for firms we would still recognize by name.\n              We are practitioners, not content creators.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\about\\TransformationCompare.tsx",
    edits: [
      {
        label: "C.3.Eyebrow",
        oldStr:
          '<SectionEyebrow label="MORE THAN ACCOUNTING" className="justify-center" />',
        newStr:
          '<SectionEyebrow label="WHAT&#39;S DIFFERENT" className="justify-center" />',
      },
      {
        label: "C.3.H2",
        oldStr:
          '              Basic compliance <span className="text-[var(--text-muted)]">vs.</span>{" "}\n              <span className="text-gold-gradient">strategic transformation</span>',
        newStr: "              Compliance, or transformation.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\about\\TransformationFramework.tsx",
    edits: [
      {
        label: "C.4.Eyebrow",
        oldStr:
          '<SectionEyebrow label="THE SGC TRANSFORMATION FRAMEWORK" className="justify-center" />',
        newStr:
          '<SectionEyebrow label="THE FRAMEWORK" className="justify-center" />',
      },
      {
        label: "C.4.H2",
        oldStr:
          '              Three layers. <span className="text-gold-gradient">One system.</span>',
        newStr: "              Three layers. Built one layer at a time.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\about\\RoadmapTimeline.tsx",
    edits: [
      {
        label: "C.5.Eyebrow",
        oldStr:
          '<SectionEyebrow label="THE 90-DAY TRANSFORMATION ROADMAP" className="justify-center" />',
        newStr:
          '<SectionEyebrow label="90 DAYS, FOUR PHASES" className="whitespace-nowrap justify-center" />',
      },
      {
        label: "C.5.H2",
        oldStr:
          '              From diagnosis to <span className="text-gold-gradient">day 90.</span>',
        newStr: "              Assess, design, build, tune.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\about\\LeadershipSection.tsx",
    edits: [
      {
        label: "C.6.Eyebrow",
        oldStr:
          '<SectionEyebrow label="LEADERSHIP" className="justify-center" />',
        newStr:
          '<SectionEyebrow label="THE PARTNERS" className="justify-center" />',
      },
      {
        label: "C.6.H2",
        oldStr:
          '              Leadership you <span className="text-gold-gradient">can trust.</span>',
        newStr: "              Two operators. One firm.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\about\\IndustriesGrid.tsx",
    edits: [
      {
        label: "C.7.Eyebrow",
        oldStr:
          '<SectionEyebrow label="BUILT FOR COMPLEX INDUSTRIES" className="justify-center" />',
        newStr:
          '<SectionEyebrow label="WHERE WE WORK" className="justify-center" />',
      },
      {
        label: "C.7.H2",
        oldStr:
          '              One unified <span className="text-gold-gradient">ecosystem.</span>',
        newStr: "              The work is the same. The sectors are not.",
      },
      {
        label: "C.7.Sub",
        oldStr:
          "              All industries connected through integrated financial architecture.",
        newStr:
          "              Real estate, construction, healthcare, manufacturing, retail, professional services — each runs on its own pressures. The bookkeeping still has to close.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\about\\EngagementTiers.tsx",
    edits: [
      {
        label: "C.8.Eyebrow",
        oldStr:
          '<SectionEyebrow label="FLEXIBLE ENGAGEMENT" className="justify-center" />',
        newStr:
          '<SectionEyebrow label="HOW WE ENGAGE" className="justify-center" />',
      },
      {
        label: "C.8.H2",
        oldStr:
          '              One partner. Every stage. <span className="text-gold-gradient">Real results.</span>',
        newStr: "              Three engagements. One starting point.",
      },
      {
        label: "C.8.Sub",
        oldStr:
          "              Transformations start at AED 40,000 — custom solutions tailored to your needs.",
        // Fallback applied: dropped "Most clients move up within twelve months."
        // (unverifiable against real client-engagement data).
        newStr: "              We start where you are.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\about\\AboutCTA.tsx",
    edits: [
      {
        label: "C.9.Pill",
        oldStr: "            TRANSFORMATION BEGINS HERE",
        newStr: "            WHERE THIS STARTS",
      },
      {
        label: "C.9.H2",
        oldStr:
          '            Build a more <span className="text-gold-gradient">resilient business.</span>',
        newStr: "            A first conversation. Nothing else, yet.",
      },
      {
        label: "C.9.Pillar1",
        oldStr:
          '  { icon: TrendingUp, title: "Strategic Growth", detail: "Sustainable expansion strategies" },',
        newStr:
          '  { icon: TrendingUp, title: "Strategic Growth", detail: "Built around the numbers you already have." },',
      },
      {
        label: "C.9.Pillar2",
        oldStr:
          '  { icon: Sparkles, title: "Financial Confidence", detail: "Data-driven decision making" },',
        newStr:
          '  { icon: Sparkles, title: "Financial Confidence", detail: "Monthly close, audit-ready, no scrambling." },',
      },
      {
        label: "C.9.Pillar3",
        oldStr:
          '  { icon: Target, title: "Operational Excellence", detail: "Optimized systems & processes" },',
        newStr:
          '  { icon: Target, title: "Operational Excellence", detail: "Systems your team can actually run." },',
      },
      {
        label: "C.9.CTA",
        oldStr:
          "              Schedule a Confidential Consultation →",
        newStr: "              Schedule a First Conversation →",
      },
      {
        label: "C.9.Closing",
        oldStr:
          '            We Make Complexity <span className="text-gold-gradient">Disappear.</span>',
        newStr: "            Then the work.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\sections\\ProblemSection.tsx",
    edits: [
      {
        label: "C.10.Eyebrow",
        oldStr: '<SectionEyebrow label="THE PROBLEM" />',
        newStr: '<SectionEyebrow label="WHAT WE FIND" />',
      },
      {
        label: "C.10.H2",
        oldStr:
          "            You don&apos;t have a software problem. You have an operations problem.",
        newStr: "            The system runs. The numbers don&apos;t.",
      },
      {
        label: "C.10.Lede",
        oldStr:
          "            Three patterns we see across UAE real-estate, construction, and trading mid-market. For a typical\n            25-person firm, the drag adds up to{\" \"}\n            <span className=\"font-semibold text-[var(--sgc-text-primary)]\">AED 180K–220K per year</span>{\" \"}\n            — mostly in lost hours and slipped deals, not dramatic theft.",
        newStr:
          "            Three patterns across real estate, construction, and trading firms in the UAE. The drag on a typical\n            25-person firm is AED 180K to 220K a year{\" \"}\n            <span className=\"font-semibold text-[var(--sgc-text-primary)]\">— most of it in lost hours and slipped deals, not in anything dramatic.</span>",
      },
    ],
  },

  {
    path: ROOT + "\\components\\sections\\SolutionSection.tsx",
    edits: [
      {
        label: "C.11.Eyebrow",
        oldStr: '<SectionEyebrow label="THE SOLUTION" />',
        newStr: '<SectionEyebrow label="HOW WE WORK" />',
      },
      {
        label: "C.11.H2",
        oldStr:
          "            Diagnose first. Fix the right things. Keep it running.",
        newStr: "            Audit. Then design. Then build.",
      },
      {
        label: "C.11.Lede",
        oldStr:
          "            We audit your operations before we propose a solution. The result is a system that fits how\n            you work — not how a vendor demo works. Implementation is just one outcome from the audit.\n            Maintenance and compliance are the other two.",
        newStr:
          "            The audit comes first because no one — including us — knows your operation well enough to propose a system for it without reading the numbers. Implementation, maintenance, and compliance follow from what the audit finds.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\sections\\CaseStudySection.tsx",
    edits: [
      {
        label: "C.12.Eyebrow",
        oldStr: '<SectionEyebrow label="PROOF" />',
        newStr:
          '<SectionEyebrow label="WHAT THE WORK PRODUCES" className="whitespace-nowrap" />',
      },
      {
        label: "C.12.H2",
        oldStr:
          "            Conservative results we stand behind.",
        newStr: "            Conservative ranges. In writing.",
      },
      {
        label: "C.12.Lede",
        oldStr:
          "            These are the ranges we commit to for typical UAE mid-market clients on the Growth tier. Not best-case.\n            Not hero numbers. The numbers we put in writing.",
        // Fallback applied: dropped "Verification on request under NDA."
        // (unverifiable — someone on the team needs to commit to honoring
        // NDA requests before this sentence ships).
        newStr:
          "            These are the figures we commit to for a typical UAE mid-market firm on the Growth tier. Not the ceiling — the floor.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\sections\\FaqSection.tsx",
    edits: [
      {
        label: "C.13.Eyebrow",
        oldStr: '<SectionEyebrow label="FAQ" />',
        newStr:
          '<SectionEyebrow label="FREQUENT QUESTIONS" className="whitespace-nowrap" />',
      },
      {
        label: "C.13.H2",
        oldStr: "            Questions founders actually ask.",
        newStr: "            What founders actually ask.",
      },
      {
        label: "C.13.Lede",
        oldStr:
          "            Straight answers — the same ones you&apos;d get on a call.",
        newStr: "            The same answers we give on a call.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\sections\\PricingSection.tsx",
    edits: [
      {
        label: "C.14.Eyebrow",
        oldStr: '<SectionEyebrow label="INVESTMENT" />',
        newStr: '<SectionEyebrow label="FEES" />',
      },
      {
        label: "C.14.H2",
        oldStr:
          "            Four tiers. One mandatory subscription. Zero hidden fees.",
        newStr: "            Four tiers. One subscription. No surprises.",
      },
      {
        label: "C.14.Lede",
        oldStr:
          "            Pick the tier that matches your scale today. Upgrade when ready.{\" \"}\n            <span className=\"font-semibold text-[var(--accent-teal)]\">The Growth tier fits ~70% of UAE mid-market clients.</span>{\" \"}\n            All prices in AED, exclusive of 5% VAT.",
        newStr:
          "            Match your tier to your scale today. Upgrade when you outgrow it. The Growth tier fits roughly seven in ten mid-market firms we engage. All numbers in AED, before 5% VAT.",
      },
      {
        label: "C.14.Payoff",
        oldStr:
          "              AED 52,000 invested → AED 120,000–180,000 recovered",
        newStr:
          "              AED 52,000 in. AED 120,000 to 180,000 out — within a year.",
      },
      {
        label: "C.14.Subline",
        oldStr:
          "              AED 22K implementation + AED 30K year-1 subscription vs. admin hours, faster cash cycle, recovered leads. Conservative range.",
        newStr:
          "              Implementation plus one year of subscription, against recovered hours, faster invoicing, and a smaller audit adjustment. The range we underwrite, not the ceiling.",
      },
      {
        label: "C.14.RetainerH3",
        oldStr: "              Optional Operations Retainer",
        newStr: "              After implementation, ongoing support.",
      },
    ],
  },

  {
    path: ROOT + "\\components\\FounderSection.tsx",
    edits: [
      {
        label: "C.15.H2",
        oldStr:
          "              We&apos;re the finance leaders who got tired of broken systems.",
        newStr: "              Two of us. One firm. No handoffs.",
      },
      {
        label: "C.15.Italic",
        oldStr:
          "              Two founders, one firm — finance strategy and the system that delivers it.\n              Because we both speak finance, nothing is lost between advice and execution.",
        newStr:
          "              Strategy on one side, the system that delivers it on the other — both of us speak finance, so the same person who advises you is the person who builds it.",
      },
    ],
  },
];

let totalEdits = 0;
let totalFiles = 0;
const errors: string[] = [];
const successLog: string[] = [];

for (const file of FILES) {
  let content = readFileSync(file.path, "utf8");
  let fileEditsApplied = 0;
  for (const edit of file.edits) {
    if (!content.includes(edit.oldStr)) {
      errors.push(
        `  ✗ ${file.path.split("\\").pop()} - ${edit.label}: OLD STRING NOT FOUND`,
      );
      errors.push(
        `      Looking for: ${JSON.stringify(edit.oldStr).substring(0, 140)}`,
      );
      continue;
    }
    content = content.split(edit.oldStr).join(edit.newStr);
    fileEditsApplied++;
    successLog.push(
      `  ✓ ${file.path.split("\\").pop()} - ${edit.label}`,
    );
  }
  if (fileEditsApplied > 0) {
    writeFileSync(file.path, content);
    totalFiles++;
  }
  totalEdits += fileEditsApplied;
}

console.log("--- APPLIED ---");
successLog.forEach((s) => console.log(s));
console.log(`\n${totalEdits} edits applied across ${totalFiles} files.`);

if (errors.length > 0) {
  console.error("\n--- ERRORS ---");
  errors.forEach((e) => console.error(e));
  process.exit(1);
}
