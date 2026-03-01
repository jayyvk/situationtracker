import { fetchJson } from "@/lib/http/fetch-json";
import type { MapSignal, SourceStatus } from "@/lib/types/signals";

type UsgsResponse = {
  features?: Array<{
    id: string;
    properties?: {
      place?: string;
      mag?: number;
      time?: number;
      url?: string;
    };
    geometry?: {
      coordinates?: [number, number, number];
    };
  }>;
};

export async function fetchUsgs(): Promise<{
  items: MapSignal[];
  status: SourceStatus;
}> {
  try {
    const data = await fetchJson<UsgsResponse>(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    );
    const now = new Date().toISOString();

    return {
      items: (data.features ?? [])
        .map((feature) => {
          const coordinates = feature.geometry?.coordinates;
          const lat = coordinates?.[1];
          const lon = coordinates?.[0];

          if (lat === undefined || lon === undefined) {
            return null;
          }

          const magnitude = feature.properties?.mag;

          return {
            id: `usgs-${feature.id}`,
            source: "usgs",
            kind: "earthquake",
            title: feature.properties?.place ?? "Earthquake event",
            severity: magnitude && magnitude >= 5 ? "high" : magnitude && magnitude >= 3 ? "medium" : "low",
            occurredAt: feature.properties?.time
              ? new Date(feature.properties.time).toISOString()
              : now,
            lat,
            lon,
            locationName: feature.properties?.place,
            detailUrl: feature.properties?.url,
            magnitude
          } satisfies MapSignal;
        })
        .filter(Boolean) as MapSignal[],
      status: {
        source: "usgs",
        ok: true,
        stale: false,
        lastUpdatedAt: now
      }
    };
  } catch (error) {
    return {
      items: [],
      status: {
        source: "usgs",
        ok: false,
        stale: true,
        lastUpdatedAt: null,
        message: error instanceof Error ? error.message : "Unable to fetch USGS"
      }
    };
  }
}
