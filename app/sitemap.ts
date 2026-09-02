import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: "https://sgctech.ai",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://sgctech.ai/about",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://sgctech.ai/contact",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://sgctech.ai/diagnostic",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://sgctech.ai/services",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://sgctech.ai/services/odoo-implementation-uae",
      lastModified: new Date("2026-09-02"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://sgctech.ai/services/odoo-implementation-rescue",
      lastModified: new Date("2026-09-02"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://sgctech.ai/services/ai-automation-finance",
      lastModified: new Date("2026-09-02"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://sgctech.ai/services/uae-corporate-tax-compliance",
      lastModified: new Date("2026-09-02"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://sgctech.ai/services/outsourced-financial-reporting",
      lastModified: new Date("2026-09-02"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://sgctech.ai/platform",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://sgctech.ai/privacy",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: "https://sgctech.ai/terms",
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
