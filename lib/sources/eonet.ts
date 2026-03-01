import { getRegionPreset } from "@/lib/config/regions";
import type { FireSignal, RegionPreset, SourceStatus } from "@/lib/types/signals";

type EonetEvent = {
  id: string;
  title: string;
  link?: string;
  geometry?: Array<{
    date: string;
    coordinates: [number, number];
  }>;
};

type EonetResponse = {
  events?: EonetEvent[];
};

export async function fetchEonet(regionId: RegionPreset): Promise<{
  items: FireSignal[];
  status: SourceStatus;
}> {
  const region = getRegionPreset(regionId);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6_000);

  try {
    const response = await fetch(
      "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&category=wildfires",
      {
        signal: controller.signal,
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(`EONET returned ${response.status}`);
    }

    const payload = (await response.json()) as EonetResponse;
    const items =
      payload.events
        ?.map((event): FireSignal | null => {
          const latestGeometry = event.geometry?.at(-1);

          if (!latestGeometry) {
            return null;
          }

          const [lon, lat] = latestGeometry.coordinates;

          if (
            lat < region.bounds.south ||
            lat > region.bounds.north ||
            lon < region.bounds.west ||
            lon > region.bounds.east
          ) {
            return null;
          }

          return {
            id: event.id,
            lat,
            lon,
            title: event.title,
            observedAt: latestGeometry.date,
            sourceUrl: event.link
          };
        })
        .filter((item): item is FireSignal => item !== null)
        .slice(0, 30) ?? [];

    return {
      items,
      status: {
        source: "eonet",
        ok: true,
        stale: false,
        lastUpdatedAt: new Date().toISOString(),
        message: "NASA EONET wildfire events"
      }
    };
  } catch (error) {
    return {
      items: [],
      status: {
        source: "eonet",
        ok: false,
        stale: true,
        lastUpdatedAt: null,
        message: error instanceof Error ? error.message : "EONET unavailable"
      }
    };
  } finally {
    clearTimeout(timeout);
  }
}
