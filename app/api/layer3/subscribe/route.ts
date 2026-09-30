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
const CYCLES = new Set(["monthly", "quarterly", "half_yearly", "annual"]);
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
  const isTrial = body.trial === true;
  // Trial signups don't pick a cycle or user count — they default to monthly / 5 users
  // (the only product is the 5-user, AED-875/month Layer 3 plan).
  if (!REQUEST_ID_RE.test(requestId) || !EMIRATES.has(emirate)) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }
  if (!isTrial && (!CYCLES.has(cycle) || !Number.isInteger(users))) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  const payload: Record<string, unknown> = {
    request_id: requestId,
    slug: text(body.slug, 30).toLowerCase(),
    company_name: text(body.company_name, 120),
    contact_name: text(body.contact_name, 80),
    email: text(body.email, 254).toLowerCase(),
    cycle: isTrial ? "monthly" : cycle,
    users: isTrial ? 5 : users,
    country_code: "AE",
    emirate,
  };
  if (isTrial) payload.trial = true;
  const mobile = text(body.mobile, 24);
  if (mobile) payload.mobile = mobile;
  const licence = text(body.trade_licence_no, 64);
  if (licence) payload.trade_licence_no = licence;

  try {
    const result = await createCheckout(payload);

    // For trial signups, immediately create a Stripe customer + subscription with
    // trial_period_days=14. Stripe handles day-14 auto-charge natively. The Odoo
    // webhook (POST /stripe/webhook) will receive customer.subscription.created and
    // use metadata.l3_request_id to link the Stripe IDs back to the Odoo order.
    if (isTrial) {
      const stripeSecret = process.env.STRIPE_SECRET_KEY;
      const stripePriceId = process.env.STRIPE_PRICE_ID_SGC_TRIAL;
      if (!stripeSecret || !stripePriceId) {
        return NextResponse.json(
          { ok: false, error: "Stripe is not configured. Please email info@sgctech.ai to enable the trial." },
          { status: 503 },
        );
      }
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeSecret);
      const customer = await stripe.customers.create({
        email: payload.email as string,
        name: payload.contact_name as string,
        metadata: { l3_request_id: requestId, l3_tenant_slug: payload.slug as string },
      });
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: stripePriceId }],
        trial_period_days: 14,
        metadata: { l3_request_id: requestId, l3_tenant_slug: payload.slug as string },
      });
      return NextResponse.json({
        ok: true,
        trial: true,
        checkout_url: text(body.checkout_url, 500) || "/subscribe/done?trial=1",
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        stripe_publishable_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
        trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        sale_order_name: result.sale_order_name,
      });
    }

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
