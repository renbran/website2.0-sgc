import { NextRequest, NextResponse } from "next/server";
import {
  clientIp,
  createCheckout,
  Layer3UserError,
  rateLimited,
  turnstileOk,
} from "@/lib/layer3";

export const runtime = "nodejs";

const REQUEST_ID_RE = /^[A-Za-z0-9_\-:.]{8,128}$/;
const CYCLES = new Set(["quarterly", "half_yearly", "annual"]);
const EMIRATES = new Set(["DU", "AZ", "SH", "AJ", "UQ", "RK", "FU"]);

function text(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Creates (idempotently, keyed on request_id) the customer and the Order Form quotation in
 * Odoo and returns the hosted Sign & Pay link. No payment or customer data is stored here.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (rateLimited(`subscribe:${ip}`, 8)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  // Honeypot: pretend success so bots learn nothing, but never reach Odoo.
  if (text(body.website, 200)) {
    return NextResponse.json({ ok: true, checkout_url: "/subscribe/done" });
  }
  if (!(await turnstileOk(text(body.turnstile_token, 4096) || undefined, ip))) {
    return NextResponse.json({ ok: false, error: "Please complete the verification and try again." }, { status: 400 });
  }

  const requestId = text(body.request_id, 128);
  const cycle = text(body.cycle, 20);
  const users = Number(body.users);
  const emirate = text(body.emirate, 2).toUpperCase() || "DU";
  if (!REQUEST_ID_RE.test(requestId) || !CYCLES.has(cycle) || !Number.isInteger(users) || !EMIRATES.has(emirate)) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  const payload: Record<string, unknown> = {
    request_id: requestId,
    slug: text(body.slug, 30).toLowerCase(),
    company_name: text(body.company_name, 120),
    contact_name: text(body.contact_name, 80),
    email: text(body.email, 254).toLowerCase(),
    cycle,
    users,
    country_code: "AE",
    emirate,
  };
  const mobile = text(body.mobile, 24);
  if (mobile) payload.mobile = mobile;
  const licence = text(body.trade_licence_no, 64);
  if (licence) payload.trade_licence_no = licence;

  try {
    const result = await createCheckout(payload);
    return NextResponse.json({
      ok: true,
      checkout_url: result.checkout_url,
      sale_order_name: result.sale_order_name,
      amount_untaxed: result.amount_untaxed,
      amount_tax: result.amount_tax,
      amount_total: result.amount_total,
      currency: result.currency,
    });
  } catch (err) {
    if (err instanceof Layer3UserError) {
      return NextResponse.json({ ok: false, code: err.code, error: err.message }, { status: 409 });
    }
    console.error("[api/layer3/subscribe]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "We could not create your order right now. Please try again, or email info@sgctech.ai." },
      { status: 502 },
    );
  }
}
