"use client";

import clsx from "clsx";
import { useState } from "react";
import { TradingViewCommodityGrid } from "@/components/panels/tradingview-commodity-grid";
import { TradingViewCryptoHeatmap } from "@/components/panels/tradingview-crypto-heatmap";
import { PanelShell } from "@/components/panels/panel-shell";
import { TradingViewStockHeatmap } from "@/components/panels/tradingview-stock-heatmap";

type MarketTab = "stocks" | "crypto" | "commodities";

export function MarketsPanel() {
  const [tab, setTab] = useState<MarketTab>("stocks");

  return (
    <PanelShell
      title="Market Feed"
      className="panel--markets"
      actions={
        <div className="panel__meta panel__meta--market-tabs">
          <button
            className={clsx("market-tab", { "market-tab--active": tab === "stocks" })}
            type="button"
            onClick={() => setTab("stocks")}
          >
            Stocks
          </button>
          <button
            className={clsx("market-tab", { "market-tab--active": tab === "crypto" })}
            type="button"
            onClick={() => setTab("crypto")}
          >
            Crypto
          </button>
          <button
            className={clsx("market-tab", { "market-tab--active": tab === "commodities" })}
            type="button"
            onClick={() => setTab("commodities")}
          >
            Commodities
          </button>
        </div>
      }
    >
      <div className="panel-stack">
        {tab === "stocks" ? (
          <TradingViewStockHeatmap />
        ) : tab === "crypto" ? (
          <TradingViewCryptoHeatmap />
        ) : tab === "commodities" ? (
          <TradingViewCommodityGrid />
        ) : null}
      </div>
    </PanelShell>
  );
}
