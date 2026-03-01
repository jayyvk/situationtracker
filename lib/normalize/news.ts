import { getRegionPreset } from "@/lib/config/regions";
import { classifySeverity } from "@/lib/normalize/severity";
import type { HeadlineItem, RegionPreset } from "@/lib/types/signals";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

export function dedupeHeadlines(items: HeadlineItem[]): HeadlineItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const bucket = Math.floor(new Date(item.publishedAt).getTime() / 1000 / 60 / 30);
    const key = `${normalizeText(item.title)}:${getDomain(item.url)}:${bucket}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function isRegionRelevant(item: HeadlineItem, region: RegionPreset) {
  const terms = getRegionPreset(region).queryTerms.map((term) => term.toLowerCase());
  const haystack = `${item.title} ${item.summary ?? ""} ${item.locationName ?? ""} ${item.tags.join(" ")}`
    .toLowerCase()
    .replace(/\s+/g, " ");

  return terms.some((term) => haystack.includes(term.toLowerCase()));
}

export function mergeNews(items: HeadlineItem[], limit: number, region: RegionPreset = "me"): HeadlineItem[] {
  return dedupeHeadlines(
    items
      .map((item) => ({
        ...item,
        severity: item.severity ?? classifySeverity(`${item.title} ${item.summary ?? ""}`)
      }))
      .sort((a, b) => {
        const leftRelevant = isRegionRelevant(a, region);
        const rightRelevant = isRegionRelevant(b, region);

        if (leftRelevant !== rightRelevant) {
          return rightRelevant ? 1 : -1;
        }

        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
  ).slice(0, limit);
}
