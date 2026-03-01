import { prioritizedKeywords } from "@/lib/config/keywords";
import { getRegionPreset } from "@/lib/config/regions";
import { classifySeverity } from "@/lib/normalize/severity";
import { fetchJson } from "@/lib/http/fetch-json";
import type { HeadlineItem, MapSignal, RegionPreset, SourceStatus } from "@/lib/types/signals";

type GdeltApiResponse = {
  articles?: Array<{
    url?: string;
    title?: string;
    seendate?: string;
    socialimage?: string;
    sourcecountry?: string;
    domain?: string;
    language?: string;
    tone?: number;
    theme?: string;
    location?: string;
    locationname?: string;
    lat?: string | number;
    lon?: string | number;
  }>;
};

function buildGdeltUrl(region: RegionPreset) {
  const preset = getRegionPreset(region);
  const keywordQuery = prioritizedKeywords.slice(0, 10).join(" OR ");
  const geographyQuery = preset.queryTerms.slice(0, 24).join(" OR ");

  return `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(
    `(${keywordQuery}) AND (${geographyQuery})`
  )}&mode=ArtList&maxrecords=60&format=json&sort=HybridRel&timespan=1day`;
}

function parseCoordinate(value: string | number | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export async function fetchGdelt(region: RegionPreset = "me"): Promise<{
  headlines: HeadlineItem[];
  signals: MapSignal[];
  status: SourceStatus;
}> {
  try {
    const data = await fetchJson<GdeltApiResponse>(buildGdeltUrl(region));
    const now = new Date().toISOString();

    const mapped = (data.articles ?? [])
      .map((article, index) => {
        const title = article.title?.trim();
        const url = article.url?.trim();
        const lat = parseCoordinate(article.lat);
        const lon = parseCoordinate(article.lon);

        if (!title || !url) {
          return null;
        }

        const toneBoost = Math.abs(article.tone ?? 0) > 5 ? 1 : 0;
        const severity = classifySeverity(`${title} ${article.theme ?? ""}`, toneBoost);
        const publishedAt = article.seendate
          ? new Date(article.seendate.replace(" ", "T")).toISOString()
          : now;

        const headline: HeadlineItem = {
          id: `gdelt-${index}-${url}`,
          source: "gdelt",
          title,
          url,
          publishedAt,
          severity,
          summary: article.theme,
          locationName: article.locationname ?? article.location,
          lat,
          lon,
          tags: article.theme ? article.theme.split(";").filter(Boolean).slice(0, 5) : []
        };

        const signal =
          lat !== undefined && lon !== undefined
            ? ({
                id: headline.id,
                source: "gdelt",
                kind: "conflict",
                title,
                severity,
                occurredAt: publishedAt,
                lat,
                lon,
                locationName: headline.locationName,
                detailUrl: url
              } satisfies MapSignal)
            : null;

        return { headline, signal };
      })
      .filter(Boolean) as Array<{ headline: HeadlineItem; signal: MapSignal | null }>;

    return {
      headlines: mapped.map((item) => item.headline),
      signals: mapped
        .map((item) => item.signal)
        .filter((item): item is MapSignal => Boolean(item)),
      status: {
        source: "gdelt",
        ok: true,
        stale: false,
        lastUpdatedAt: now
      }
    };
  } catch (error) {
    return {
      headlines: [],
      signals: [],
      status: {
        source: "gdelt",
        ok: false,
        stale: true,
        lastUpdatedAt: null,
        message: error instanceof Error ? error.message : "Unable to fetch GDELT"
      }
    };
  }
}
