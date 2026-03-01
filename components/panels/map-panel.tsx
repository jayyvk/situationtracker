"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { PanelShell } from "@/components/panels/panel-shell";
import { usePollingResource } from "@/components/panels/use-polling-resource";
import type { NewsResponse } from "@/lib/types/signals";

const LIVE_TOGGLES = [
  { key: "hotspots", label: "Hotspots", defaultOn: true },
  { key: "flights", label: "Flights", defaultOn: false }
] as const;
type ToggleKey = (typeof LIVE_TOGGLES)[number]["key"];

type ToggleState = Record<ToggleKey, boolean>;

const defaultToggleState = LIVE_TOGGLES.reduce<ToggleState>(
  (state, toggle) => {
    state[toggle.key] = toggle.defaultOn;
    return state;
  },
  {} as ToggleState
);

const DynamicMap = dynamic(
  () => import("@/components/panels/map-client").then((module) => module.MapClient),
  {
    ssr: false,
    loading: () => <div className="panel-state">Loading live map...</div>
  }
);

export function MapPanel() {
  const resource = usePollingResource<NewsResponse>("/api/signals/news?region=me&limit=100", 60_000);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toggles, setToggles] = useState<ToggleState>(defaultToggleState);
  const flightMode = toggles.flights;

  const toggleLayer = (key: keyof ToggleState) => {
    setToggles((current) => {
      if (key === "flights") {
        if (current.flights) {
          return {
            ...defaultToggleState
          };
        }

        return {
          hotspots: false,
          flights: true
        };
      }

      if (current.flights) {
        return current;
      }

      return {
        ...current,
        [key]: !current[key]
      };
    });
  };

  return (
    <PanelShell
      title="Map"
      className="panel--map"
      actions={
        <div className="panel__meta map-header-tools">
          <div className="map-filter">
            <button
              aria-expanded={filterOpen}
              aria-label="Map filters"
              className="panel-utility panel-utility--button"
              type="button"
              onClick={() => setFilterOpen((current) => !current)}
            >
              Filter
            </button>
            {filterOpen ? (
              <div className="map-filter__menu">
                <div className="map-filter__group">
                  <span className="map-filter__title">Live Intelligence</span>
                  {LIVE_TOGGLES.map((item) => (
                    <button
                      key={item.key}
                      className={`map-filter__item ${toggles[item.key] ? "map-filter__item--active" : ""} ${
                        flightMode && item.key !== "flights" ? "map-filter__item--disabled" : ""
                      }`}
                      type="button"
                      disabled={flightMode && item.key !== "flights"}
                      onClick={() => toggleLayer(item.key)}
                    >
                      <span>{item.label}</span>
                      <span>{toggles[item.key] ? "On" : "Off"}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      }
    >
      {resource.error && !resource.data ? <div className="panel-state">{resource.error}</div> : null}
      {flightMode ? (
        <div className="map-iframe-shell">
          <div className="map-iframe-shell__fallback">
            <strong>Flight view is best opened externally</strong>
            <span>Open the live flight view in Flightradar24 focused on the Middle East.</span>
            <div className="map-iframe-shell__actions">
              <a
                className="map-iframe-shell__link"
                href="https://www.flightradar24.com/28,45/4"
                rel="noreferrer"
                target="_blank"
              >
                Open Flightradar24
              </a>
            </div>
          </div>
        </div>
      ) : resource.data ? (
        <DynamicMap
          headlines={resource.data.items}
          toggles={toggles}
        />
      ) : null}
      {!resource.data && resource.loading ? <div className="panel-state">Initializing map feeds...</div> : null}
    </PanelShell>
  );
}
