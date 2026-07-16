import { NextRequest, NextResponse } from "next/server";
import { createLead, OdooConfigError, OdooRequestError } from "@/lib/odoo";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LEN = 2000;

// Minimal in-memory rate limit: 5 submissions / 10 min per IP. This resets on
// cold start / redeploy and isn't shared across serverless instances — it's a
// cheap first line of defense against basic spam bursts, not a substitute for
// a real WAF/rate-limit product. Good enough for a marketing site's volume.
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

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  // Honeypot field: real users never fill this in (hidden via CSS on the form).
  website?: string;
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

  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot: silently accept (so bots don't learn) but never write to Odoo.
  if (clip(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = clip(body.name);
  const email = clip(body.email);
  const message = clip(body.message);
  const phone = clip(body.phone);
  const company = clip(body.company);
  const service = clip(body.service);

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
  if (!message || message.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Please tell us a little about what you need." },
      { status: 400 },
    );
  }

  const descriptionLines = [
    service && `<p><strong>Service:</strong> ${escapeHtml(service)}</p>`,
    `<p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    `<p><em>Submitted via sgctech.ai contact form.</em></p>`,
  ].filter(Boolean);

  try {
    const leadId = await createLead({
      name: `Website enquiry — ${name}${service ? ` (${service})` : ""}`,
      contactName: name,
      email,
      phone,
      companyName: company,
      description: descriptionLines.join("\n"),
      source: "contact_form",
    });
    return NextResponse.json({ ok: true, leadId });
  } catch (err) {
    // Never leak Odoo error text / endpoint details to the client.
    if (err instanceof OdooConfigError) {
      console.error("[api/contact] Odoo not configured:", err.message);
    } else if (err instanceof OdooRequestError) {
      console.error("[api/contact] Odoo request failed:", err.message);
    } else {
      console.error("[api/contact] Unexpected error:", err);
    }
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't submit your message right now. Please email info@sgctech.ai directly or try WhatsApp.",
      },
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
