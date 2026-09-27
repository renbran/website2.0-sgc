import { NextResponse } from "next/server";
import { getPricing } from "@/lib/layer3";

export const runtime = "nodejs";

// Prices come from Odoo so the page always matches the invoice. Cached briefly at the edge.
export async function GET() {
  try {
    const pricing = await getPricing();
    return NextResponse.json(pricing, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
  } catch (err) {
    console.error("[api/layer3/pricing]", (err as Error).message);
    return NextResponse.json({ error: "Pricing is unavailable right now." }, { status: 502 });
  }
}
