import { NextResponse } from "next/server";
import { withCache } from "@/lib/http/cache";
import { fetchPolymarket } from "@/lib/sources/polymarket";
import type { MarketsResponse } from "@/lib/types/signals";

export const runtime = "nodejs";

export async function GET() {
  const payload = await withCache<MarketsResponse>("markets:me", 90_000, async () => {
    const polymarket = await fetchPolymarket();

    return {
      predictions: polymarket.predictions,
      status: [polymarket.status]
    };
  });

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=90, stale-while-revalidate=90"
    }
  });
}
