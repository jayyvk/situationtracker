import { NextResponse } from "next/server";
import { withCache } from "@/lib/http/cache";
import { mergeNews } from "@/lib/normalize/news";
import { fetchGdelt } from "@/lib/sources/gdelt";
import { fetchRssFeeds } from "@/lib/sources/rss";
import type { NewsResponse, RegionPreset } from "@/lib/types/signals";

export const runtime = "nodejs";

const GDELT_TTL_MS = 30_000;
const RSS_TTL_MS = 15 * 60_000;
const RESPONSE_TTL_SECONDS = 30;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const region = (url.searchParams.get("region") ?? "me") as RegionPreset;
  const limit = Math.min(Number.parseInt(url.searchParams.get("limit") ?? "50", 10) || 50, 100);
  const forceRefresh = url.searchParams.has("refresh");

  const producer = async () => {
    const [gdelt, rss] = await Promise.all([
      forceRefresh
        ? fetchGdelt(region)
        : withCache(`news:gdelt:${region}`, GDELT_TTL_MS, () => fetchGdelt(region)),
      forceRefresh
        ? fetchRssFeeds()
        : withCache("news:rss", RSS_TTL_MS, () => fetchRssFeeds())
    ]);

    return {
      items: mergeNews([...gdelt.headlines, ...rss.items], limit, region),
      status: [gdelt.status, rss.status]
    };
  };

  const payload = forceRefresh
    ? await producer()
    : await withCache<NewsResponse>(`news:${region}:${limit}`, GDELT_TTL_MS, producer);

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": `public, s-maxage=${RESPONSE_TTL_SECONDS}, stale-while-revalidate=300`
    }
  });
}
