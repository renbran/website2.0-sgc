import { NextRequest, NextResponse } from "next/server";
import { clientIp, createAccountingCheckout, Layer3UserError, rateLimited, turnstileOk } from "@/lib/layer3";
import { ONBOARDING_FEE, VAT_PERCENT, packageByCode } from "@/content/accounting-packages";

export const runtime = "nodejs";

const REQUEST_ID_RE = /^[A-Za-z0-9_\-:.]{8,128}$/;
const EMIRATES = new Set(["DU", "AZ", "SH", "AJ", "UQ", "RK", "FU"]);

function text(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Creates (idempotently, keyed on request_id) the customer and the accounting-package
 * quotation in Odoo and returns its Sign & Pay link. No trial: Odoo opens the client
 * portal only after the order is confirmed and paid. Odoo re-validates everything.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (rateLimited(`acc-subscribe:${ip}`, 8)) {
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
    return NextResponse.json({ ok: true, checkout_url: "/accounting" });
  }
  if (!(await turnstileOk(text(body.turnstile_token, 4096) || undefined, ip))) {
    return NextResponse.json({ ok: false, error: "Please complete the verification and try again." }, { status: 400 });
  }

  const requestId = text(body.request_id, 128);
  const pkg = packageByCode(text(body.package, 20));
  const cycle = text(body.cycle, 10);
  const emirate = text(body.emirate, 2).toUpperCase() || "DU";
  if (!REQUEST_ID_RE.test(requestId) || !pkg || !["monthly", "annual"].includes(cycle) || !EMIRATES.has(emirate)) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  const payload: Record<string, unknown> = {
    request_id: requestId,
    package: pkg.code,
    cycle,
    company_name: text(body.company_name, 120),
    contact_name: text(body.contact_name, 80),
    email: text(body.email, 254).toLowerCase(),
    emirate,
  };
  for (const [key, max] of [["mobile", 24], ["trn", 15], ["trade_licence_no", 64]] as const) {
    const value = text(body[key], max);
    if (value) payload[key] = value;
  }

  try {
    const result = await createAccountingCheckout(payload);
    // The page promised a price; never send a visitor to pay a different one.
    const untaxed = pkg.monthly * (cycle === "annual" ? 11 : 1) + ONBOARDING_FEE;
    const expected = Math.round(untaxed * (100 + VAT_PERCENT)) / 100;
    if (result.currency !== "AED" || Math.abs(result.amount_total - expected) > 0.05) {
      console.error("[api/accounting/subscribe] price drift", result.sale_order_name, result.amount_total, expected);
      return NextResponse.json(
        { ok: false, error: "Our prices are being updated. Please email info@sgctech.ai and we will set you up." },
        { status: 502 },
      );
    }
    return NextResponse.json({
      ok: true,
      checkout_url: result.checkout_url,
      sale_order_name: result.sale_order_name,
      amount_total: result.amount_total,
      currency: result.currency,
    });
  } catch (err) {
    if (err instanceof Layer3UserError) {
      return NextResponse.json({ ok: false, code: err.code, error: err.message }, { status: 409 });
    }
    console.error("[api/accounting/subscribe]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "We could not create your order right now. Please try again, or email info@sgctech.ai." },
      { status: 502 },
    );
  }
}
