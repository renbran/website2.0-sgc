export interface DiamondData {
  image: string;
  headline: string;
  subhead: string;
  isCTA?: boolean;
}

export const DIAMONDS: DiamondData[] = [
  // Slot 0 — Logo intro: shown on plain black before scroll begins
  //
  // Note: these WebGL diamond textures load via useTexture() and bypass
  // next/image entirely, so they must be pre-optimized on disk — .webp at
  // 768x768 cuts each texture from ~100-125KB to ~50-65KB with no visible
  // quality loss on the rendered text/graphics. 768 is retina-safe under the
  // Canvas dpr cap of 1.75 (the largest active diamond renders ~400 CSS px,
  // so 768px covers 400 x 1.75 ≈ 700 device px).
  {
    image: "/images/diamonds/sgc-logo-beacon-tex.webp",
    headline: "The Odoo Firm Your CFO Would Have Founded.",
    subhead: "Practitioner-led. Fixed price. Fixed timeline.",
    isCTA: true,
  },
  {
    image: "/images/diamonds/excel-tex.webp",
    headline: "Running on Excel, Tally & WhatsApp?",
    subhead: "One unified Odoo ERP brings CRM, Sales, Accounting & HR into one system.",
  },
  {
    image: "/images/diamonds/manual-tex.webp",
    headline: "Manual workflow taking 20 hours a week?",
    subhead: "Our partners gain back wasted hours with AI Data Entry and AI Document Scanner.",
  },
  {
    image: "/images/diamonds/6pm-tex.webp",
    headline: "Losing leads to missed calls after 6 PM?",
    subhead: "Our AI Voice reception answers 24/7 — every call captured, every viewing booked.",
  },
  {
    image: "/images/diamonds/dispute-tex.webp",
    headline: "Agent commissions disputed every month?",
    subhead: "Our Automated Commission Engine delivers transparent splits and RERA-ready reports instantly.",
  },
  {
    image: "/images/diamonds/month-tex.webp",
    headline: "Still deciding on month-old reports?",
    subhead: "Our Central Brain dashboards show live pipeline, cash and project burn in real time.",
  },
  {
    image: "/images/diamonds/150k-tex.webp",
    headline: "One missed UAE filing costs AED 150,000?",
    subhead: "VAT, Corporate Tax, RERA, PDPL and goAML — built into delivery from day one.",
  },
  {
    image: "/images/diamonds/yourtime-tex.webp",
    headline: "Tired of consultants learning on your time?",
    subhead: "We've sat in your finance chair. Fixed price. Fixed timeline. Operator-led from day one.",
  },
];

export const DIAMOND_IMAGES = DIAMONDS.map((d) => d.image);
