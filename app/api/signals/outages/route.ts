import { NextResponse } from "next/server";
import { withCache } from "@/lib/http/cache";
import type { OutagesResponse } from "@/lib/types/signals";

export const runtime = "nodejs";

export async function GET() {
  const payload = await withCache<OutagesResponse>("outages:me", 120_000, async () => ({
    items: [
      {
        id: "out-iran",
        country: "Iran",
        color: "#ff9f1c",
        reason: "Throttled to roughly 30% of normal baseline."
      },
      {
        id: "out-sudan",
        country: "Sudan",
        color: "#ff4d5f",
        reason: "National connectivity collapse detected."
      },
      {
        id: "out-syria",
        country: "Syria",
        color: "#ff9f1c",
        reason: "Regional backbone instability and partial loss."
      }
    ],
    status: [
      {
        source: "radar",
        ok: true,
        stale: false,
        lastUpdatedAt: new Date().toISOString(),
        message: "Curated outage watchlist until Cloudflare Radar is wired."
      }
    ]
  }));

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=120, stale-while-revalidate=120"
    }
  });
}
