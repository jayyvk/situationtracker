"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { PanelShell } from "@/components/panels/panel-shell";
import type { VideoSource } from "@/lib/types/signals";

type VideoConfigResponse = {
  items: VideoSource[];
};

const pinnedStorageKey = "sitrep-video-pinned";

const regionLabels: Record<VideoSource["region"], string> = {
  "north-america": "North America",
  europe: "Europe",
  "middle-east": "Middle East",
  asia: "Asia",
  africa: "Africa"
};

export function VideoPanel() {
  const [sources, setSources] = useState<VideoSource[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState<VideoSource["region"]>("north-america");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const response = await fetch("/api/signals/video-config", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = (await response.json()) as VideoConfigResponse;

        if (!mounted) {
          return;
        }

        setSources(payload.items);
        const storedPinned = window.localStorage.getItem(pinnedStorageKey);
        const parsedPinned = storedPinned ? (JSON.parse(storedPinned) as string[]) : [];
        const validPinned = parsedPinned.filter((id) =>
          payload.items.some((item) => item.id === id)
        );
        const defaultPinned =
          validPinned.length > 0 ? validPinned : payload.items.slice(0, 4).map((item) => item.id);

        setPinnedIds(defaultPinned);
        setActiveId(defaultPinned[0] ?? payload.items[0]?.id ?? "");
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load video config");
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (pinnedIds.length === 0) {
      return;
    }

    window.localStorage.setItem(pinnedStorageKey, JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  const pinnedSources = useMemo(() => {
    const byId = new Map(sources.map((source) => [source.id, source]));
    return pinnedIds
      .map((id) => byId.get(id))
      .filter((item): item is VideoSource => Boolean(item));
  }, [pinnedIds, sources]);

  const availableSources = useMemo(() => {
    const pinned = new Set(pinnedIds);
    return sources.filter(
      (source) => source.region === activeRegion && !pinned.has(source.id)
    );
  }, [activeRegion, pinnedIds, sources]);

  const active =
    pinnedSources.find((source) => source.id === activeId) ??
    sources.find((source) => source.id === activeId) ??
    pinnedSources[0] ??
    sources[0];

  const addPinned = (sourceId: string) => {
    setPinnedIds((current) => {
      if (current.includes(sourceId)) {
        return current;
      }

      return [...current, sourceId];
    });
    setActiveId(sourceId);
  };

  const promotePinned = (sourceId: string) => {
    setPinnedIds((current) => {
      const next = current.filter((id) => id !== sourceId);
      return [sourceId, ...next];
    });
    setActiveId(sourceId);
  };

  const removePinned = (sourceId: string) => {
    setPinnedIds((current) => {
      const next = current.filter((id) => id !== sourceId);

      if (activeId === sourceId) {
        setActiveId(next[0] ?? sources[0]?.id ?? "");
      }

      return next;
    });
  };

  return (
    <PanelShell
      title="Watch The News"
      className="panel--video"
      actions={
        <div className="panel__meta">
          <button
            aria-label="Manage channels"
            className="panel-utility panel-utility--button"
            type="button"
            onClick={() => setModalOpen(true)}
          >
            ⚙
          </button>
        </div>
      }
    >
      <div className="panel-stack panel-stack--video">
        {error ? <div className="panel-state">{error}</div> : null}
        <div className="channel-grid">
          {pinnedSources.map((source) => (
            <button
              key={source.id}
              className={clsx("channel-pill", {
                "channel-pill--active": source.id === active?.id
              })}
              type="button"
              onClick={() => setActiveId(source.id)}
            >
              {source.label}
            </button>
          ))}
        </div>
        {active ? (
          <iframe
            className="media-frame"
            src={active.embedUrl}
            title={active.label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="panel-state">Loading video sources...</div>
        )}
      </div>
      {modalOpen ? (
        <div className="channel-modal" role="dialog" aria-modal="true">
          <div className="channel-modal__backdrop" onClick={() => setModalOpen(false)} />
          <div className="channel-modal__panel">
            <div className="channel-modal__header">
              <h3>Manage Channels</h3>
              <button
                aria-label="Close channel manager"
                className="channel-modal__close"
                type="button"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="channel-modal__section">
              <p className="channel-modal__label">Pinned Channels</p>
              <div className="channel-modal__chips">
                {pinnedSources.map((source) => (
                  <div key={source.id} className="channel-chip">
                    <button type="button" onClick={() => promotePinned(source.id)}>
                      {source.label}
                    </button>
                    <button
                      aria-label={`Remove ${source.label}`}
                      className="channel-chip__remove"
                      type="button"
                      onClick={() => removePinned(source.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="channel-modal__section">
              <p className="channel-modal__label">Available Channels</p>
              <div className="channel-region-tabs">
                {(Object.keys(regionLabels) as VideoSource["region"][]).map((region) => (
                  <button
                    key={region}
                    className={clsx("channel-region-tab", {
                      "channel-region-tab--active": region === activeRegion
                    })}
                    type="button"
                    onClick={() => setActiveRegion(region)}
                  >
                    {regionLabels[region]}
                  </button>
                ))}
              </div>
              <div className="channel-source-grid">
                {availableSources.map((source) => (
                  <div key={source.id} className="channel-source-card">
                    <div className="channel-source-card__avatar">
                      {source.label
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div className="channel-source-card__text">
                      <strong>{source.label}</strong>
                      <span>{source.handle ?? source.region}</span>
                    </div>
                    <button
                      aria-label={`Add ${source.label}`}
                      className="channel-source-card__add"
                      type="button"
                      onClick={() => addPinned(source.id)}
                    >
                      +
                    </button>
                  </div>
                ))}
                {availableSources.length === 0 ? (
                  <div className="panel-state">All channels in this region are already pinned.</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PanelShell>
  );
}
