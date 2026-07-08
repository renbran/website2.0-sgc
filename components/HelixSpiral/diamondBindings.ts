export interface DiamondBinding {
  index: number;
  image: string;
  targetSection: string;
}

// SectionOne–Seven were removed (Phase 1 collapse), so the per-diamond anchors
// no longer exist. All diamonds now funnel to the quantified Problem section.
export const DIAMOND_BINDINGS: DiamondBinding[] = [
  { index: 0, image: "sgc-logo-beacon.png", targetSection: "#problem" },
  { index: 1, image: "excel.png",           targetSection: "#problem" },
  { index: 2, image: "manual.png",          targetSection: "#problem" },
  { index: 3, image: "6pm.png",             targetSection: "#problem" },
  { index: 4, image: "dispute.png",         targetSection: "#problem" },
  { index: 5, image: "month.png",           targetSection: "#problem" },
  { index: 6, image: "150k.png",            targetSection: "#problem" },
  { index: 7, image: "yourtime.png",        targetSection: "#problem" },
];

/** Quick lookup helper: get target section by diamond index */
export function getTargetSection(index: number): string {
  return DIAMOND_BINDINGS[index]?.targetSection ?? "#problem";
}
