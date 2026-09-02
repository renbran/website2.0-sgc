// Monthly AEO citation check: asks each configured AI answer engine the
// same set of commercial-intent prompts (with web search / grounding
// enabled) and checks whether the response cites sgctech.ai or names
// "SGC Tech AI". Writes a dated JSON + Markdown report under
// reports/citations/.
//
// Engines run only if their API key env var is set — missing keys are
// skipped, not errored. Keys must live in .env.local (never in this file,
// never in chat, never committed) and be exported into the shell before
// running, e.g.:
//   ANTHROPIC_API_KEY=... OPENAI_API_KEY=... PERPLEXITY_API_KEY=... \
//   GEMINI_API_KEY=... node scripts/citation-tracker.mjs
//
// Usage: node scripts/citation-tracker.mjs

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const DOMAIN = "sgctech.ai";
const BRAND = "SGC Tech AI";

// Phase 8.2 prompt set — commercial intent, comparison intent, compliance
// authority. Keep this list in sync with SEO AND EO PROMPT.md §8.2 if that
// document changes.
const PROMPTS = [
  "Best Odoo implementation partner in Dubai",
  "How much does Odoo implementation cost in the UAE?",
  "Who can fix a failed ERP implementation in Dubai?",
  "CPA-led ERP consultant UAE",
  "UAE Corporate Tax ERP setup consultant",
  "AI automation for finance teams Dubai",
  "Odoo vs Zoho for UAE mid-market companies",
  "Outsourced financial reporting Dubai mid-market",
];

function detectCitation(text) {
  if (!text) return { cited: false };
  const lower = text.toLowerCase();
  const domainIdx = lower.indexOf(DOMAIN.toLowerCase());
  const brandIdx = lower.indexOf(BRAND.toLowerCase());
  const idx = domainIdx >= 0 ? domainIdx : brandIdx;
  if (idx < 0) return { cited: false };
  const snippetStart = Math.max(0, idx - 80);
  const snippet = text.slice(snippetStart, idx + 120).replace(/\s+/g, " ").trim();
  return {
    cited: true,
    matchedOn: domainIdx >= 0 ? "domain" : "brand",
    approxPosition: idx < text.length * 0.33 ? "early" : idx < text.length * 0.66 ? "mid" : "late",
    snippet,
  };
}

async function queryClaude(prompt) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const model = process.env.CITATION_CLAUDE_MODEL || "claude-sonnet-5";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
    }),
  });
  if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.content ?? [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
  return text;
}

async function queryOpenAI(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const model = process.env.CITATION_OPENAI_MODEL || "gpt-4o-search-preview";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function queryPerplexity(prompt) {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) return null;
  const model = process.env.CITATION_PERPLEXITY_MODEL || "sonar-pro";
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Perplexity ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function queryGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.CITATION_GEMINI_MODEL || "gemini-2.5-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ?? "";
}

const ENGINES = [
  { name: "claude", run: queryClaude },
  { name: "openai", run: queryOpenAI },
  { name: "perplexity", run: queryPerplexity },
  { name: "gemini", run: queryGemini },
];

async function main() {
  const active = [];
  for (const e of ENGINES) {
    const probe = await e.run(PROMPTS[0]).catch((err) => {
      console.error(`[${e.name}] setup check failed: ${err.message}`);
      return undefined;
    });
    if (probe !== null && probe !== undefined) active.push(e);
  }

  if (active.length === 0) {
    console.error(
      "No engine API keys found (ANTHROPIC_API_KEY / OPENAI_API_KEY / PERPLEXITY_API_KEY / GEMINI_API_KEY). Nothing to run.",
    );
    process.exitCode = 1;
    return;
  }

  console.log(`Running citation check across: ${active.map((e) => e.name).join(", ")}`);

  const results = [];
  for (const prompt of PROMPTS) {
    for (const engine of active) {
      process.stdout.write(`  [${engine.name}] "${prompt}" ... `);
      try {
        const text = await engine.run(prompt);
        const detection = detectCitation(text);
        results.push({ prompt, engine: engine.name, ...detection, rawLength: text?.length ?? 0 });
        console.log(detection.cited ? `CITED (${detection.matchedOn}, ${detection.approxPosition})` : "not cited");
      } catch (err) {
        results.push({ prompt, engine: engine.name, error: err.message });
        console.log(`ERROR: ${err.message}`);
      }
    }
  }

  const date = new Date().toISOString().slice(0, 10);
  const outDir = path.join(process.cwd(), "reports", "citations");
  await mkdir(outDir, { recursive: true });

  const jsonPath = path.join(outDir, `${date}.json`);
  await writeFile(jsonPath, JSON.stringify({ date, results }, null, 2));

  const citedCount = results.filter((r) => r.cited).length;
  const totalCount = results.filter((r) => !r.error).length;
  const md = [
    `# Citation report — ${date}`,
    "",
    `**${citedCount} / ${totalCount}** engine×prompt pairs cited sgctech.ai or "SGC Tech AI".`,
    "",
    "| Prompt | Engine | Cited | Position | Snippet |",
    "|---|---|---|---|---|",
    ...results.map((r) =>
      r.error
        ? `| ${r.prompt} | ${r.engine} | ERROR | — | ${r.error} |`
        : `| ${r.prompt} | ${r.engine} | ${r.cited ? "✅" : "—"} | ${r.approxPosition ?? "—"} | ${(r.snippet ?? "").replace(/\|/g, "\\|")} |`,
    ),
    "",
  ].join("\n");
  const mdPath = path.join(outDir, `${date}.md`);
  await writeFile(mdPath, md);

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
  console.log(`\n${citedCount}/${totalCount} cited this run.`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
