import { NextRequest, NextResponse } from "next/server";
import {
  clientIp,
  Layer3ConfigError,
  Layer3UserError,
  rateLimited,
  trialComplete,
} from "@/lib/layer3";

export const runtime = "nodejs";

const REQUEST_ID_RE = /^[A-Za-z0-9_\-:.]{8,128}$/;
const SETUP_INTENT_RE = /^seti_[A-Za-z0-9_]{6,200}$/;

/**
 * Trial card step 2. Odoo re-reads the SetupIntent at Stripe (the id here proves nothing on
 * its own) and, if the card really was collected, creates the 14-day subscription and hands
 * the tenant over to the receiver. Idempotent on the request_id.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (rateLimited(`trial-complete:${ip}`, 8)) {
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
  const intentId =
    typeof body.setup_intent_id === "string" ? body.setup_intent_id.trim().slice(0, 208) : "";
  if (!REQUEST_ID_RE.test(requestId) || !SETUP_INTENT_RE.test(intentId)) {
    return NextResponse.json({ ok: false, error: "Please check the form and try again." }, { status: 400 });
  }

  try {
    const result = await trialComplete(requestId, intentId);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Layer3UserError) {
      return NextResponse.json({ ok: false, code: err.code, error: err.message }, { status: 409 });
    }
    if (err instanceof Layer3ConfigError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 503 });
    }
    console.error("[api/layer3/trial-complete]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "We could not start your trial just now. Please try again." },
      { status: 502 },
    );
  }
}
