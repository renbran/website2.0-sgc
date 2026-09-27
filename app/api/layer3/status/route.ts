import { NextRequest, NextResponse } from "next/server";
import { clientIp, orderStatus, rateLimited } from "@/lib/layer3";

export const runtime = "nodejs";

const REQUEST_ID_RE = /^[A-Za-z0-9_\-:.]{8,128}$/;

/** Polled by /subscribe/done. The request id is a random UUID only the visitor's browser knows. */
export async function GET(req: NextRequest) {
  const requestId = req.nextUrl.searchParams.get("r") || "";
  if (!REQUEST_ID_RE.test(requestId)) {
    return NextResponse.json({ found: false }, { status: 400 });
  }
  if (rateLimited(`status:${clientIp(req.headers)}`, 120)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  try {
    const status = await orderStatus(requestId);
    if (!status.found) return NextResponse.json({ found: false });
    return NextResponse.json({
      found: true,
      paid: status.paid,
      account_state: status.account_state,
      tenant_url: status.tenant_url || null,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[api/layer3/status]", (err as Error).message);
    return NextResponse.json({ error: "Status unavailable." }, { status: 502 });
  }
}
