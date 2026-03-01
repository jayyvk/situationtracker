import { NextResponse } from "next/server";
import { withCache } from "@/lib/http/cache";
import { filterMapSignals } from "@/lib/normalize/map";
import { fetchGdelt } from "@/lib/sources/gdelt";
import { fetchUsgs } from "@/lib/sources/usgs";
import type { MapResponse, RegionPreset } from "@/lib/types/signals";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const region = (url.searchParams.get("region") ?? "me") as RegionPreset;

  const payload = await withCache<MapResponse>(`map:${region}`, 120_000, async () => {
    const [gdelt, usgs] = await Promise.all([fetchGdelt(region), fetchUsgs()]);

    return {
      items: filterMapSignals([...gdelt.signals, ...usgs.items], region),
      status: [gdelt.status, usgs.status]
    };
  });

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=120, stale-while-revalidate=120"
    }
  });
}
