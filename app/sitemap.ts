import type { MetadataRoute } from "next";

// Real per-route last-modified dates (git-verified), not build time. Bump the
// entry for a route when its content materially changes; untouched routes keep
// their true date instead of claiming every deploy changed them.
const UPDATED: Record<string, string> = {
  "/": "2026-10-01",
  "/pricing": "2026-10-01",
  "/case-studies": "2026-10-01",
  "/case-studies/dubai-brokerage-72m-recovered": "2026-10-01",
  "/case-studies/uae-brokerage-445-roi": "2026-10-01",
  "/case-studies/construction-erp-vat-readiness": "2026-10-01",
  "/about": "2026-09-29",
  "/contact": "2026-09-29",
  "/diagnostic": "2026-09-29",
  "/services": "2026-09-29",
  "/services/odoo-implementation-uae": "2026-09-29",
  "/services/odoo-implementation-rescue": "2026-09-29",
  "/services/ai-automation-finance": "2026-09-29",
  "/services/uae-corporate-tax-compliance": "2026-09-29",
  "/services/outsourced-financial-reporting": "2026-09-29",
  "/platform": "2026-09-29",
  "/privacy": "2026-09-29",
  "/terms": "2026-09-29",
  "/legal/subscription": "2026-09-29",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    priority: number,
    changeFrequency: "monthly" | "yearly",
  ): MetadataRoute.Sitemap[number] => ({
    url: `https://sgctech.ai${path === "/" ? "" : path}`,
    lastModified: new Date(UPDATED[path] ?? "2026-09-29"),
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "monthly"),
    entry("/pricing", 0.9, "monthly"),
    entry("/case-studies", 0.8, "monthly"),
    entry("/case-studies/dubai-brokerage-72m-recovered", 0.7, "monthly"),
    entry("/case-studies/uae-brokerage-445-roi", 0.7, "monthly"),
    entry("/case-studies/construction-erp-vat-readiness", 0.7, "monthly"),
    entry("/services", 0.8, "monthly"),
    entry("/services/odoo-implementation-uae", 0.9, "monthly"),
    entry("/services/odoo-implementation-rescue", 0.8, "monthly"),
    entry("/services/ai-automation-finance", 0.8, "monthly"),
    entry("/services/uae-corporate-tax-compliance", 0.8, "monthly"),
    entry("/services/outsourced-financial-reporting", 0.7, "monthly"),
    entry("/about", 0.8, "monthly"),
    entry("/contact", 0.8, "monthly"),
    entry("/diagnostic", 0.7, "monthly"),
    entry("/platform", 0.6, "monthly"),
    entry("/legal/subscription", 0.4, "yearly"),
    entry("/privacy", 0.4, "yearly"),
    entry("/terms", 0.4, "yearly"),
  ];
}
