import { NextRequest, NextResponse } from "next/server";
import { createLead, OdooConfigError, OdooRequestError } from "@/lib/odoo";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LEN = 2000;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

type SystemScorePayload = {
  id: string;
  label: string;
  pct: number;
  band: string;
};

type DiagnosticPayload = {
  contact?: {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    jobTitle?: string;
    companySize?: string;
    industry?: string;
  };
  overallPct?: number;
  overallLabel?: string;
  systems?: SystemScorePayload[];
  website?: string; // honeypot
};

function clip(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, MAX_FIELD_LEN) : "";
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: DiagnosticPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (clip(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const contact = body.contact ?? {};
  const name = clip(contact.name);
  const email = clip(contact.email);
  const company = clip(contact.company);
  const phone = clip(contact.phone);
  const jobTitle = clip(contact.jobTitle);
  const companySize = clip(contact.companySize);
  const industry = clip(contact.industry);

  if (!name || name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Please provide your full name." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid email address." },
      { status: 400 },
    );
  }
  if (!company || company.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Please provide your company name." },
      { status: 400 },
    );
  }

  const overallPct = typeof body.overallPct === "number" ? body.overallPct : null;
  const overallLabel = clip(body.overallLabel);
  const systems = Array.isArray(body.systems) ? body.systems : [];

  const systemRows = systems
    .map((s) => {
      const label = clip(s?.label);
      const band = clip(s?.band);
      const pct = typeof s?.pct === "number" ? s.pct : null;
      if (!label || pct === null) return null;
      return `<li>${escapeHtml(label)}: ${pct}% (${escapeHtml(band || "")})</li>`;
    })
    .filter((row): row is string => Boolean(row));

  const descriptionParts = [
    jobTitle && `<p><strong>Job title:</strong> ${escapeHtml(jobTitle)}</p>`,
    companySize && `<p><strong>Company size:</strong> ${escapeHtml(companySize)} employees</p>`,
    industry && `<p><strong>Industry:</strong> ${escapeHtml(industry)}</p>`,
    overallPct !== null &&
      `<p><strong>Overall health score:</strong> ${overallPct}% (${escapeHtml(overallLabel || "")})</p>`,
    systemRows.length && `<p><strong>Per-system breakdown:</strong></p><ul>${systemRows.join("")}</ul>`,
    `<p><em>Submitted via sgctech.ai Operational Health Diagnostic.</em></p>`,
  ].filter(Boolean);

  try {
    const leadId = await createLead({
      name: `Diagnostic lead — ${name}${company ? ` (${company})` : ""}`,
      contactName: name,
      email,
      phone,
      companyName: company,
      jobTitle,
      description: descriptionParts.join("\n"),
      source: "diagnostic",
    });
    return NextResponse.json({ ok: true, leadId });
  } catch (err) {
    if (err instanceof OdooConfigError) {
      console.error("[api/diagnostic-lead] Odoo not configured:", err.message);
    } else if (err instanceof OdooRequestError) {
      console.error("[api/diagnostic-lead] Odoo request failed:", err.message);
    } else {
      console.error("[api/diagnostic-lead] Unexpected error:", err);
    }
    // Fail soft: the diagnostic result itself is computed client-side and
    // should still render even if the CRM write fails, so the user isn't
    // blocked from seeing their report. We just surface a quiet warning.
    return NextResponse.json(
      { ok: false, error: "We couldn't save your report to our CRM, but your results are shown below." },
      { status: 502 },
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
