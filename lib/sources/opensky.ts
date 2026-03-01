import { getRegionPreset } from "@/lib/config/regions";
import type { FlightSignal, RegionPreset, SourceStatus } from "@/lib/types/signals";

type OpenSkyResponse = {
  states?: Array<
    [
      string | null,
      string | null,
      string | null,
      number | null,
      number | null,
      number | null,
      number | null,
      number | null,
      boolean | null,
      number | null,
      number | null,
      number | null,
      number | null,
      number | null,
      string | null,
      boolean | null,
      number | null
    ]
  >;
};

const MILITARY_PREFIXES = [
  "RCH",
  "MC",
  "QID",
  "IAF",
  "RRR",
  "HERKY",
  "NATO",
  "FORTE",
  "DUKE",
  "LAGR"
];

const MILITARY_COUNTRIES = new Set([
  "United States",
  "Israel",
  "Saudi Arabia",
  "Qatar",
  "United Arab Emirates",
  "United Kingdom",
  "Turkey"
]);

function isMilitaryLike(callsign: string, originCountry: string) {
  const trimmed = callsign.trim().toUpperCase();

  if (MILITARY_PREFIXES.some((prefix) => trimmed.startsWith(prefix))) {
    return true;
  }

  return MILITARY_COUNTRIES.has(originCountry);
}

export async function fetchOpenSky(regionId: RegionPreset): Promise<{
  items: FlightSignal[];
  status: SourceStatus;
}> {
  const region = getRegionPreset(regionId);
  const params = new URLSearchParams({
    lamin: String(region.bounds.south),
    lomin: String(region.bounds.west),
    lamax: String(region.bounds.north),
    lomax: String(region.bounds.east)
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6_000);

  try {
    const headers = new Headers();
    const username = process.env.OPENSKY_USERNAME;
    const password = process.env.OPENSKY_PASSWORD;

    if (username && password) {
      headers.set(
        "Authorization",
        `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`
      );
    }

    const response = await fetch(
      `https://opensky-network.org/api/states/all?${params.toString()}`,
      {
        headers,
        signal: controller.signal,
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(`OpenSky returned ${response.status}`);
    }

    const payload = (await response.json()) as OpenSkyResponse;
    const items =
      payload.states
        ?.map((state): FlightSignal | null => {
          const icao24 = state[0];
          const callsign = state[1]?.trim() ?? "";
          const originCountry = state[2] ?? "";
          const longitude = state[5];
          const latitude = state[6];
          const lastContact = state[4];

          if (!icao24 || !callsign || latitude == null || longitude == null) {
            return null;
          }

          if (!isMilitaryLike(callsign, originCountry)) {
            return null;
          }

          return {
            id: icao24,
            callsign,
            lat: latitude,
            lon: longitude,
            originCountry,
            observedAt: new Date((lastContact ?? Math.floor(Date.now() / 1_000)) * 1_000).toISOString(),
            note: originCountry ? `${originCountry} state aircraft heuristic` : "Military callsign heuristic"
          };
        })
        .filter((item): item is FlightSignal => item !== null)
        .slice(0, 25) ?? [];

    return {
      items,
      status: {
        source: "opensky",
        ok: true,
        stale: false,
        lastUpdatedAt: new Date().toISOString(),
        message: username && password ? "Authenticated OpenSky feed" : "OpenSky public feed"
      }
    };
  } catch (error) {
    return {
      items: [],
      status: {
        source: "opensky",
        ok: false,
        stale: true,
        lastUpdatedAt: null,
        message: error instanceof Error ? error.message : "OpenSky unavailable"
      }
    };
  } finally {
    clearTimeout(timeout);
  }
}
