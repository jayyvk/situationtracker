import { NextResponse } from "next/server";
import { withCache } from "@/lib/http/cache";
import { fetchEonet } from "@/lib/sources/eonet";
import type { FiresResponse, RegionPreset } from "@/lib/types/signals";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const region = (url.searchParams.get("region") ?? "me") as RegionPreset;

  const payload = await withCache<FiresResponse>(`fires:${region}`, 60_000, async () => {
    const eonet = await fetchEonet(region);

    return {
      items: eonet.items,
      status: [eonet.status]
    };
  });

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=60"
    }
  });
}
