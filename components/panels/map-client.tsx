"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GeoJSON,
  LayerGroup,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap
} from "react-leaflet";
import L from "leaflet";
import { getRegionPreset } from "@/lib/config/regions";
import type { HeadlineItem } from "@/lib/types/signals";

const region = getRegionPreset("me");

const hotspotLocationHints = [
  { name: "Tehran", lat: 35.6892, lon: 51.389, terms: ["tehran"] },
  { name: "Tel Aviv", lat: 32.0853, lon: 34.7818, terms: ["tel aviv"] },
  { name: "Jerusalem", lat: 31.7683, lon: 35.2137, terms: ["jerusalem"] },
  { name: "Doha", lat: 25.2854, lon: 51.531, terms: ["doha"] },
  { name: "Dubai", lat: 25.2048, lon: 55.2708, terms: ["dubai"] },
  { name: "Abu Dhabi", lat: 24.4539, lon: 54.3773, terms: ["abu dhabi"] },
  { name: "Riyadh", lat: 24.7136, lon: 46.6753, terms: ["riyadh"] },
  { name: "Manama", lat: 26.2235, lon: 50.5876, terms: ["manama", "bahrain"] },
  { name: "Muscat", lat: 23.588, lon: 58.3829, terms: ["muscat", "oman"] },
  { name: "Baghdad", lat: 33.3152, lon: 44.3661, terms: ["baghdad"] },
  { name: "Beirut", lat: 33.8938, lon: 35.5018, terms: ["beirut"] },
  { name: "Damascus", lat: 33.5138, lon: 36.2765, terms: ["damascus"] },
  { name: "Amman", lat: 31.9539, lon: 35.9106, terms: ["amman"] },
  { name: "Sanaa", lat: 15.3694, lon: 44.191, terms: ["sanaa"] },
  { name: "Israel", lat: 31.0461, lon: 34.8516, terms: ["israel", "tel aviv", "jerusalem"] },
  { name: "Gaza", lat: 31.3547, lon: 34.3088, terms: ["gaza", "rafah", "khan younis"] },
  { name: "Lebanon", lat: 33.8547, lon: 35.8623, terms: ["lebanon", "beirut", "hezbollah"] },
  { name: "Syria", lat: 34.8021, lon: 38.9968, terms: ["syria", "damascus", "aleppo"] },
  { name: "Jordan", lat: 30.5852, lon: 36.2384, terms: ["jordan", "amman"] },
  { name: "Iraq", lat: 33.2232, lon: 43.6793, terms: ["iraq", "baghdad", "basra"] },
  { name: "Iran", lat: 32.4279, lon: 53.688, terms: ["iran", "tehran", "natanz", "bushehr"] },
  { name: "Saudi Arabia", lat: 23.8859, lon: 45.0792, terms: ["saudi", "riyadh", "jeddah"] },
  { name: "Yemen", lat: 15.5527, lon: 48.5164, terms: ["yemen", "sanaa", "houthi", "aden"] },
  { name: "Red Sea", lat: 20.0, lon: 38.0, terms: ["red sea", "bab el-mandeb"] },
  { name: "Hormuz", lat: 26.566, lon: 56.25, terms: ["hormuz", "strait of hormuz"] },
  { name: "UAE", lat: 23.4241, lon: 53.8478, terms: ["uae", "abu dhabi", "dubai", "emirates"] },
  { name: "Qatar", lat: 25.3548, lon: 51.1839, terms: ["qatar", "doha"] },
  { name: "United States", lat: 38.9072, lon: -77.0369, terms: ["united states", "u.s.", "us ", "washington", "pentagon", "white house"] }
] as const;

function resolveHeadlinePoint(item: HeadlineItem) {
  if (item.lat != null && item.lon != null) {
    return {
      lat: item.lat,
      lon: item.lon,
      label: item.locationName ?? `${item.lat.toFixed(1)}, ${item.lon.toFixed(1)}`
    };
  }

  const searchableText = `${item.title} ${item.locationName ?? ""} ${item.tags.join(" ")}`
    .toLowerCase()
    .replace(/\s+/g, " ");

  const match = hotspotLocationHints.find((hint) =>
    hint.terms.some((term) => searchableText.includes(term))
  );

  if (!match) {
    return null;
  }

  return {
    lat: match.lat,
    lon: match.lon,
    label: match.name
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const LIVE_TOGGLES = [
  { key: "hotspots", label: "Hotspots", defaultOn: true },
  { key: "flights", label: "Flights", defaultOn: false }
] as const;

type LiveToggleKey = (typeof LIVE_TOGGLES)[number]["key"];

export type ToggleState = Record<LiveToggleKey, boolean>;

export const defaultToggleState = LIVE_TOGGLES.reduce<ToggleState>(
  (state, toggle) => {
    state[toggle.key] = toggle.defaultOn;
    return state;
  },
  {} as ToggleState
);

function MapViewport() {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(
      [region.bounds.south, region.bounds.west],
      [region.bounds.north, region.bounds.east]
    );

    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map]);

  return null;
}

type MapClientProps = {
  headlines: HeadlineItem[];
  toggles: ToggleState;
};

export function MapClient({ headlines, toggles }: MapClientProps) {
  const [countryData, setCountryData] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCountryBoundaries() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
          { cache: "force-cache" }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch country boundaries");
        }

        const payload = await response.json();

        if (mounted) {
          setCountryData(payload);
        }
      } catch {
        if (mounted) {
          setCountryData(null);
        }
      }
    }

    void loadCountryBoundaries();

    return () => {
      mounted = false;
    };
  }, []);

  const hotspotItems = useMemo(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1_000;
    const clusters = new Map<
      string,
      {
        id: string;
        lat: number;
        lon: number;
        locationName: string;
        count: number;
        severity: "high" | "medium" | "low";
        headlines: Array<{
          id: string;
          title: string;
          url: string;
          publishedAt: string;
        }>;
      }
    >();

    for (const item of headlines) {
      const publishedAt = Date.parse(item.publishedAt);

      if (Number.isNaN(publishedAt) || publishedAt < cutoff) {
        continue;
      }

      const point = resolveHeadlinePoint(item);

      if (!point) {
        continue;
      }

      const roundedLat = point.lat.toFixed(1);
      const roundedLon = point.lon.toFixed(1);
      const key = point.label.toLowerCase();
      const existing = clusters.get(key);

      if (!existing) {
        clusters.set(key, {
          id: key,
          lat: point.lat,
          lon: point.lon,
          locationName: point.label,
          count: 1,
          severity: item.severity,
          headlines: [
            {
              id: item.id,
              title: item.title,
              url: item.url,
              publishedAt: item.publishedAt
            }
          ]
        });
        continue;
      }

      existing.count += 1;
      existing.lat = (existing.lat + point.lat) / 2;
      existing.lon = (existing.lon + point.lon) / 2;

      if (!existing.headlines.some((headline) => headline.id === item.id)) {
        existing.headlines.push({
          id: item.id,
          title: item.title,
          url: item.url,
          publishedAt: item.publishedAt
        });
      }

      if (
        item.severity === "high" ||
        (item.severity === "medium" && existing.severity === "low")
      ) {
        existing.severity = item.severity;
      }
    }

    return Array.from(clusters.values())
      .map((cluster) => ({
        ...cluster,
        headlines: cluster.headlines
          .sort(
            (left, right) =>
              new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
          )
          .slice(0, 6)
      }))
      .sort((left, right) => right.count - left.count);
  }, [headlines]);
  const countryStyle = () => {
    return {
      fillOpacity: 0,
      weight: 0.8,
      color: "rgba(145, 154, 190, 0.32)",
      opacity: 0.5
    };
  };

  return (
    <div className="map-panel__canvas">
      <MapContainer
        center={region.center}
        zoom={region.zoom}
        scrollWheelZoom={false}
      >
        <MapViewport />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {countryData ? <GeoJSON data={countryData} style={countryStyle} /> : null}

        {toggles.hotspots ? (
          <LayerGroup>
            {hotspotItems.map((item) => (
              <Marker
                key={item.id}
                position={[item.lat, item.lon]}
                icon={L.divIcon({
                  className: "map-hotspot-marker",
                  html: `<span class="map-hotspot-marker__inner">
                    <span class="map-hotspot-dot map-hotspot-dot--${
                      item.severity === "high"
                        ? "critical"
                        : item.severity === "medium"
                          ? "high"
                          : "medium"
                    }"></span>
                    <span class="map-hotspot-marker__label">${escapeHtml(item.locationName)}</span>
                  </span>`,
                  iconSize: [132, 22],
                  iconAnchor: [8, 8]
                })}
              >
                <Tooltip
                  className="map-hotspot-count"
                  direction="top"
                  offset={[0, -8]}
                  opacity={1}
                  sticky
                >
                  <span>{item.count} {item.count === 1 ? "article" : "articles"}</span>
                </Tooltip>
              </Marker>
            ))}
          </LayerGroup>
        ) : null}

      </MapContainer>
    </div>
  );
}
