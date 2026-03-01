import { NextResponse } from "next/server";
import { withCache } from "@/lib/http/cache";
import { fetchOpenSky } from "@/lib/sources/opensky";
import type { AirResponse, RegionPreset } from "@/lib/types/signals";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const region = (url.searchParams.get("region") ?? "me") as RegionPreset;

  const payload = await withCache<AirResponse>(`air:${region}`, 15_000, async () => {
    const opensky = await fetchOpenSky(region);

    return {
      items: opensky.items,
      status: [opensky.status]
    };
  });

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=15, stale-while-revalidate=15"
    }
  });
}
