import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimited, slugMessage, slugStatus } from "@/lib/layer3";

export const runtime = "nodejs";

const SLUG_RE = /^[a-z][a-z0-9-]{1,28}[a-z0-9]$/;

export async function GET(req: NextRequest) {
  const slug = (req.nextUrl.searchParams.get("slug") || "").trim().toLowerCase();
  if (!SLUG_RE.test(slug) || slug.includes("--")) {
    return NextResponse.json({ slug, available: false, message: slugMessage("invalid") });
  }
  if (rateLimited(`slug:${clientIp(req.headers)}`, 60)) {
    return NextResponse.json({ error: "Too many checks. Please wait a minute." }, { status: 429 });
  }
  try {
    const status = await slugStatus(slug);
    return NextResponse.json({
      slug: status.slug,
      available: status.available,
      message: status.available ? "" : slugMessage(status.reason),
    });
  } catch (err) {
    console.error("[api/layer3/slug]", (err as Error).message);
    return NextResponse.json({ error: "Could not check the address right now." }, { status: 502 });
  }
}
