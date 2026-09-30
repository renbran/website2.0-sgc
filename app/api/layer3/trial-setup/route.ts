import { NextRequest, NextResponse } from "next/server";
import {
  clientIp,
  Layer3ConfigError,
  Layer3UserError,
  rateLimited,
  trialSetup,
} from "@/lib/layer3";

export const runtime = "nodejs";

const REQUEST_ID_RE = /^[A-Za-z0-9_\-:.]{8,128}$/;

/**
 * Trial card step 1. Asks Odoo for the Stripe SetupIntent that saves the trial customer's
 * card (no charge). Carries no secret material: the client_secret is meant for the browser,
 * the publishable key identifies the account.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (rateLimited(`trial-setup:${ip}`, 8)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again in a few minutes." },
      { status: 429 },
    );
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const requestId = typeof body.request_id === "string" ? body.request_id.trim().slice(0, 128) : "";
  if (!REQUEST_ID_RE.test(requestId)) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  try {
    const setup = await trialSetup(requestId);
    return NextResponse.json(setup);
  } catch (err) {
    if (err instanceof Layer3UserError) {
      return NextResponse.json({ ok: false, code: err.code, error: err.message }, { status: 409 });
    }
    if (err instanceof Layer3ConfigError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 503 });
    }
    console.error("[api/layer3/trial-setup]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "We could not start the card step right now. Please try again." },
      { status: 502 },
    );
  }
}
