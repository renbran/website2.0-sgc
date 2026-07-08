export interface ComplianceModule {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
}

export const MODULES: ComplianceModule[] = [
  { id: "ubo",        label: "UBO",          shortLabel: "UBO",   color: "#D4A574" },
  { id: "vat",        label: "VAT",          shortLabel: "VAT",   color: "#6FA8C3" },
  { id: "corp-tax",   label: "Corporate Tax", shortLabel: "TAX",  color: "#6FA8C3" },
  { id: "pdpl",       label: "PDPL",         shortLabel: "PDPL",  color: "#6FA8C3" },
  { id: "esr",        label: "ESR",          shortLabel: "ESR",   color: "#6FA8C3" },
  { id: "goaml",      label: "goAML",        shortLabel: "AML",   color: "#6FA8C3" },
  { id: "rera",       label: "RERA",         shortLabel: "RERA",  color: "#6FA8C3" },
];

export const GOLD = "#D4A574";
export const NAVY = "#0D1520";
export const GLASS_BG = "rgba(13, 21, 32, 0.85)";

// ─── Narrative stage accents (callouts, dots, eyebrows) ────────────────
// PROBLEM = warm red (danger), SOLUTION = green (resolution), RESULT = gold.
// No purple (project hard-ban). Muted to sit in the warm navy/gold palette.
export type Stage = "problem" | "solution" | "result";
export const STAGE_COLORS: Record<Stage, string> = {
  problem: "#C7545A",  // muted danger red
  solution: "#5FA877", // muted resolution green
  result: GOLD,        // gold = the payoff
};
