import type { MetadataRoute } from "next";

const AI_AGENTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot", "Applebot-Extended",
  "bingbot", "Bingbot", "msnbot",
  "Amazonbot", "Bytespider", "CCBot", "cohere-ai",
  "Meta-ExternalAgent", "DuckAssistBot", "YouBot", "Diffbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /api/* is machine plumbing, not content — keep it out of every index.
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_AGENTS.map((ua) => ({ userAgent: ua, allow: "/", disallow: ["/api/"] })),
    ],
    sitemap: "https://sgctech.ai/sitemap.xml",
    host: "https://sgctech.ai",
  };
}
