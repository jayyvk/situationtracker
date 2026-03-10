"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useNewsData } from "@/components/dashboard/news-data-context";
import { PanelShell } from "@/components/panels/panel-shell";
import type { HeadlineItem, Severity } from "@/lib/types/signals";

const MAX_ITEMS = 100;
const timezoneEventName = "sitrep-timezone-change";

export function NewsFeedPanel() {
  const resource = useNewsData();
  const [feedItems, setFeedItems] = useState<HeadlineItem[]>([]);
  const [activeZone, setActiveZone] = useState("UTC");
  const [activeSeverity, setActiveSeverity] = useState<Severity | null>(null);

  useEffect(() => {
    const incomingItems = resource.items;

    if (incomingItems.length === 0) {
      return;
    }

    setFeedItems((current) => {
      const next = [...incomingItems, ...current];
      const deduped = next.filter((item, index, items) => {
        return items.findIndex((candidate) => candidate.id === item.id) === index;
      });
      return deduped.slice(0, MAX_ITEMS);
    });
  }, [resource.items]);

  useEffect(() => {
    setActiveZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");

    const handleTimezoneChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ zone?: string }>;
      const zone = customEvent.detail?.zone;

      if (zone) {
        setActiveZone(zone);
      }
    };

    window.addEventListener(timezoneEventName, handleTimezoneChange as EventListener);

    return () => {
      window.removeEventListener(timezoneEventName, handleTimezoneChange as EventListener);
    };
  }, []);

  const isStale = useMemo(() => {
    if (!resource.lastSuccessAt) {
      return false;
    }

    return Date.now() - resource.lastSuccessAt > 2 * 60_000;
  }, [resource.lastSuccessAt]);

  const visibleItems = useMemo(() => {
    if (!activeSeverity) {
      return feedItems;
    }

    return feedItems.filter((item) => item.severity === activeSeverity);
  }, [activeSeverity, feedItems]);

  const toggleSeverity = (severity: Severity) => {
    setActiveSeverity((current) => (current === severity ? null : severity));
  };

  return (
    <PanelShell
      title="News Feed"
      className="panel--feed"
      actions={
        <div className="panel__meta panel__meta--news-tools">
          <button
            className={clsx("panel-badge", "panel-badge--filter", {
              "panel-badge--low": true,
              "panel-badge--filter-active": activeSeverity === "low"
            })}
            type="button"
            onClick={() => toggleSeverity("low")}
          >
            Low
          </button>
          <button
            className={clsx("panel-badge", "panel-badge--filter", {
              "panel-badge--medium": true,
              "panel-badge--filter-active": activeSeverity === "medium"
            })}
            type="button"
            onClick={() => toggleSeverity("medium")}
          >
            Medium
          </button>
          <button
            className={clsx("panel-badge", "panel-badge--filter", {
              "panel-badge--high": true,
              "panel-badge--filter-active": activeSeverity === "high"
            })}
            type="button"
            onClick={() => toggleSeverity("high")}
          >
            High
          </button>
          <button
            aria-label="Refresh news feed"
            className="panel-utility panel-utility--button"
            type="button"
            onClick={() => {
              void resource.refresh();
            }}
          >
            <span className="panel-utility__icon">↻</span>
          </button>
        </div>
      }
    >
      <div className="terminal-feed">
        {resource.error ? <div className="panel-state">{resource.error}</div> : null}
        {isStale ? <div className="panel-state panel-state--stale">Feed is stale. Showing last good update.</div> : null}
        {feedItems.length === 0 && resource.loading ? (
          <div className="panel-state">Aggregating GDELT and RSS...</div>
        ) : null}
        {feedItems.length === 0 && !resource.loading && !resource.error ? (
          <div className="panel-state">No signals in the current window.</div>
        ) : null}
        {feedItems.length > 0 && visibleItems.length === 0 ? (
          <div className="panel-state">No headlines match the selected severity.</div>
        ) : null}
        {visibleItems.map((item) => (
          <a
            key={item.id}
            className="feed-row"
            href={item.url}
            rel="noreferrer"
            target="_blank"
          >
            <div className="feed-row__meta">
              <span className="feed-row__timestamp">
                {new Date(item.publishedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: activeZone
                })}
              </span>
              <span className="feed-row__source">{item.source}</span>
              <span
                className={clsx("feed-row__severity", {
                  "feed-row__severity--high": item.severity === "high",
                  "feed-row__severity--medium": item.severity === "medium",
                  "feed-row__severity--low": item.severity === "low"
                })}
              >
                {item.severity}
              </span>
              <span className="feed-row__tag">{item.locationName ?? item.tags[0] ?? "global"}</span>
            </div>
            <span className="feed-row__headline">{item.title}</span>
          </a>
        ))}
      </div>
    </PanelShell>
  );
}
