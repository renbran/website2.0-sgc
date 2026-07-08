C.2 — OriginStory
Eyebrow: OUR STORY
H2: The principle has a name, but not a tagline.
P1: We diagnose before we prescribe. That is the whole of it. A chartered accountant reads the numbers before recommending anything — training first, skepticism first, no opinion yet.
P2: The two of us have closed the books, run the audits, filed the UAE Corporate Tax returns, and rolled out Odoo for firms we would still recognize by name. We are practitioners, not content creators.
C.3 — TransformationCompare
Eyebrow: WHAT'S DIFFERENT
H2: Compliance, or transformation.
C.4 — TransformationFramework
Eyebrow: THE FRAMEWORK
H2: Three layers, built one at a time.
C.5 — RoadmapTimeline
Eyebrow: 90 DAYS, FOUR PHASES
H2: Diagnose, design, build, tune.
C.6 — LeadershipSection
Eyebrow: THE PARTNERS
H2: Founded by the two people still doing the work.
Founder bios and quotes below stay verbatim — only this surrounding line changes.

C.7 — IndustriesGrid
Eyebrow: WHERE WE WORK
H2: The work is the same. The sectors are not.
Sub: Real estate, construction, healthcare, manufacturing, retail, professional services — each runs on its own pressures. The bookkeeping still has to close.
C.8 — EngagementTiers
Eyebrow: HOW WE ENGAGE
H2: Start where you are.
Sub: Most clients begin at the smallest tier and grow with the work. Clients typically move up within their first year.
C.9 — AboutCTA
Eyebrow pill: WHERE THIS STARTS
H2: A first conversation. Nothing else, yet.
3 pillars (titles verbatim):
Strategic Growth — built around the numbers you already have
Financial Confidence — monthly close, audit-ready, no scrambling
Operational Excellence — systems your team can actually run
CTA button: "Schedule a Confidential First Conversation →"
Closing line: Then the work.
C.10 — ProblemSection
Eyebrow: WHAT WE FIND
H2: The software works. The operations don't.
Lede: Three patterns across real estate, construction, and trading firms in the UAE. The drag on a typical 25-person firm is AED 180K to 220K a year — most of it in lost hours and slipped deals, not in anything dramatic.
C.11 — SolutionSection
Eyebrow: HOW WE WORK
H2: Audit. Then design. Then build.
Lede: The audit comes first because no one — including us — knows your operation well enough to propose a system for it without reading the numbers. Implementation, maintenance, and compliance follow from what the audit finds.
C.12 — CaseStudySection
Eyebrow: WHAT THE WORK PRODUCES
H2: Conservative ranges. In writing.
Lede: These are the figures we commit to for a typical UAE mid-market firm on the Growth tier. Not the ceiling — the floor. Verification on request under NDA.
C.13 — FaqSection
Eyebrow: FREQUENT QUESTIONS
H2: What founders actually ask.
Lede: The same answers we give on a call.
C.14 — PricingSection
Eyebrow: FEES
H2: Priced up front. No surprises after.
Lede: Match your tier to your scale today. Upgrade when you outgrow it. The Growth tier fits roughly seven in ten mid-market firms we engage. All numbers in AED, before 5% VAT.
Payoff line: AED 52,000 in. AED 120,000 to 180,000 out — within a year.
Subline: Implementation plus one year of subscription, against recovered hours, faster invoicing, and a smaller audit adjustment. The range we underwrite, not the ceiling.
Retainer sub-headline: After implementation, ongoing support.
C.15 — FounderSection
H2: Two of us. One firm. No handoffs.
Italic line: Strategy on one side, the system that delivers it on the other — both of us speak finance, so the same person who advises you is the person who builds it.
Notes for the Implementer
Apply by editing the JSX text only — don't touch className, fontFamily, or Tailwind classes. The new copy is meant to fit the existing layout exactly.

Eyebrow labels (SectionEyebrow) that change from one word to a longer phrase may need a whitespace-nowrap check on the wrapper. None of the current replacements are long enough to wrap on desktop, but test on a 375px viewport, particularly "90 DAYS, FOUR PHASES" and "WHAT THE WORK PRODUCES," which are the two longest eyebrows in this set.

The closing italic line in FounderSection stays at font-Fraunces italic, rgba(212,165,116,0.8) — both colors stay as-is, just the text changes.

PricingSection's payoff line currently lives in a single <p> with font-bold; if "AED 52,000 in. AED 120,000 to 180,000 out — within a year." wraps awkwardly on mobile, break it into a font-bold lead phrase plus a text-[0.8rem] text-[var(--sgc-text-muted)] qualifier line, which is what the existing subline structure already supports.

Two lines in this copy make claims that need sign-off from whoever owns the client-engagement data before publishing, not just editorial approval: C.8's "Clients typically move up within their first year" is a measurable claim about client behavior, and C.12's "Verification on request under NDA" is an operational commitment someone needs to be ready to honor if a prospect actually asks. Confirm both against real data or real process before this ships; if either isn't accurate, the fallback for C.8 is to drop the second sentence entirely and let "Most clients begin at the smallest tier and grow with the work" stand alone, and the fallback for C.12 is to drop the NDA sentence and let the lede end at "Not the ceiling — the floor."