import { parseStringPromise } from "xml2js";
import { rssSources } from "@/lib/config/rss-sources";
import { classifySeverity } from "@/lib/normalize/severity";
import type { HeadlineItem, SourceStatus } from "@/lib/types/signals";

type XmlNode =
  | string
  | {
      _?: string;
      $?: Record<string, string | undefined>;
    };

type RssItem = {
  title?: XmlNode[];
  link?: XmlNode[];
  pubDate?: XmlNode[];
  description?: XmlNode[];
  category?: XmlNode[];
};

type RssFeed = {
  rss?: {
    channel?: Array<{
      item?: RssItem[];
    }>;
  };
  feed?: {
    entry?: Array<{
      title?: XmlNode[];
      id?: XmlNode[];
      updated?: XmlNode[];
      summary?: XmlNode[];
      link?: Array<{ $?: { href?: string } }>;
    }>;
  };
};

function readXmlText(node: XmlNode | undefined): string | undefined {
  if (!node) {
    return undefined;
  }

  if (typeof node === "string") {
    const value = node.trim();
    return value || undefined;
  }

  if (typeof node._ === "string") {
    const value = node._.trim();
    return value || undefined;
  }

  return undefined;
}

function readXmlDate(node: XmlNode | undefined): string {
  const raw = readXmlText(node);

  if (!raw) {
    return new Date().toISOString();
  }

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

async function fetchRssSource(source: (typeof rssSources)[number]): Promise<HeadlineItem[]> {
  const response = await fetch(source.url, {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml"
    },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(`${source.label} failed with ${response.status}`);
  }

  const xml = await response.text();
  const parsed = (await parseStringPromise(xml)) as RssFeed;
  const channelItems = parsed.rss?.channel?.[0]?.item ?? [];
  const atomEntries = parsed.feed?.entry ?? [];

  if (channelItems.length > 0) {
    return channelItems
      .map((item, index) => {
        const title = readXmlText(item.title?.[0]);
        const url = readXmlText(item.link?.[0]);

        if (!title || !url) {
          return null;
        }

        const summary = readXmlText(item.description?.[0]);

        return {
          id: `${source.id}-${index}-${url}`,
          source: "rss",
          title,
          url,
          publishedAt: readXmlDate(item.pubDate?.[0]),
          severity: classifySeverity(`${title} ${summary ?? ""}`),
          summary,
          tags:
            item.category?.map((category) => readXmlText(category)).filter(Boolean) as string[] | undefined ??
            [source.category]
        } satisfies HeadlineItem;
      })
      .filter(Boolean) as HeadlineItem[];
  }

  return atomEntries
    .map((entry, index) => {
      const title = readXmlText(entry.title?.[0]);
      const url = entry.link?.[0]?.$?.href ?? readXmlText(entry.id?.[0]);

      if (!title || !url) {
        return null;
      }

      const summary = readXmlText(entry.summary?.[0]);

      return {
        id: `${source.id}-${index}-${url}`,
        source: "rss",
        title,
        url,
        publishedAt: readXmlDate(entry.updated?.[0]),
        severity: classifySeverity(`${title} ${summary ?? ""}`),
        summary,
        tags: [source.category]
      } satisfies HeadlineItem;
    })
    .filter(Boolean) as HeadlineItem[];
}

export async function fetchRssFeeds(): Promise<{
  items: HeadlineItem[];
  status: SourceStatus;
}> {
  const results = await Promise.allSettled(rssSources.map((source) => fetchRssSource(source)));
  const items = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  const rejected = results.filter((result) => result.status === "rejected");

  return {
    items,
    status: {
      source: "rss",
      ok: rejected.length !== results.length,
      stale: rejected.length > 0,
      lastUpdatedAt: items.length > 0 ? new Date().toISOString() : null,
      message:
        rejected.length > 0
          ? `${rejected.length} RSS feed${rejected.length === 1 ? "" : "s"} unavailable`
          : undefined
    }
  };
}
