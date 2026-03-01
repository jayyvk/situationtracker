"use client";

import { LiveRail } from "@/components/common/live-rail";
import { PolymarketFooterTicker } from "@/components/common/polymarket-footer-ticker";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { ChatPanel } from "@/components/panels/chat-panel";
import { MapPanel } from "@/components/panels/map-panel";
import { MarketsPanel } from "@/components/panels/markets-panel";
import { NewsFeedPanel } from "@/components/panels/news-feed-panel";
import { VideoPanel } from "@/components/panels/video-panel";

export function DashboardShell() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand-block">
          <p className="top-bar__summary">Situation Tracker</p>
        </div>
        <div className="top-bar__controls">
          <LiveRail />
          <a
            aria-label="Open X profile"
            className="header-link"
            href="https://x.com/jaynotai"
            rel="noreferrer"
            target="_blank"
          >
            X
          </a>
          <a
            aria-label="Open GitHub project"
            className="header-link header-link--wide"
            href="https://github.com/jayyvk/situationtracker"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </header>
      <main className="dashboard-grid" aria-label="Five panel dashboard">
        <MapPanel />
        <VideoPanel />
        <NewsFeedPanel />
        <MarketsPanel />
        <ChatPanel />
      </main>
      <PolymarketFooterTicker />
    </div>
  );
}
