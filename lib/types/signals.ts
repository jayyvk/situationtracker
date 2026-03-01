export type RegionPreset = "me";

export type Severity = "high" | "medium" | "low";

export type SourceKind =
  | "gdelt"
  | "rss"
  | "usgs"
  | "opensky"
  | "eonet"
  | "radar"
  | "polymarket"
  | "tradingview"
  | "youtube"
  | "chat";

export type SourceStatus = {
  source: SourceKind;
  ok: boolean;
  lastUpdatedAt: string | null;
  stale: boolean;
  message?: string;
};

export type HeadlineItem = {
  id: string;
  source: "gdelt" | "rss";
  title: string;
  url: string;
  publishedAt: string;
  severity: Severity;
  summary?: string;
  locationName?: string;
  lat?: number;
  lon?: number;
  tags: string[];
};

export type MapSignal = {
  id: string;
  source: "gdelt" | "usgs";
  kind: "conflict" | "earthquake";
  title: string;
  severity: Severity;
  occurredAt: string;
  lat: number;
  lon: number;
  locationName?: string;
  detailUrl?: string;
  magnitude?: number;
};

export type PredictionCard = {
  id: string;
  question: string;
  probability: number;
  change24h?: number;
  updatedAt: string;
  url: string;
};

export type FlightSignal = {
  id: string;
  callsign: string;
  lat: number;
  lon: number;
  originCountry?: string;
  observedAt: string;
  note?: string;
};

export type FireSignal = {
  id: string;
  lat: number;
  lon: number;
  title: string;
  observedAt: string;
  sourceUrl?: string;
};

export type OutageSignal = {
  id: string;
  country: string;
  color: string;
  reason: string;
};

export type NewsResponse = {
  items: HeadlineItem[];
  status: SourceStatus[];
};

export type MapResponse = {
  items: MapSignal[];
  status: SourceStatus[];
};

export type MarketsResponse = {
  predictions: PredictionCard[];
  status: SourceStatus[];
};

export type AirResponse = {
  items: FlightSignal[];
  status: SourceStatus[];
};

export type FiresResponse = {
  items: FireSignal[];
  status: SourceStatus[];
};

export type OutagesResponse = {
  items: OutageSignal[];
  status: SourceStatus[];
};

export type VideoSource = {
  id: string;
  label: string;
  embedUrl: string;
  watchUrl: string;
  region: "north-america" | "europe" | "middle-east" | "asia" | "africa";
  handle?: string;
};

export type ChatSource = {
  id: string;
  label: string;
  embedUrl?: string;
  launchUrl: string;
  note: string;
};
