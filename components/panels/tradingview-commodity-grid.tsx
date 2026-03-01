"use client";

import { createElement, memo, useEffect } from "react";

const commodityWidgets = [
  {
    id: "gold",
    label: "Gold",
    symbol: "TVC:GOLD"
  },
  {
    id: "silver",
    label: "Silver",
    symbol: "TVC:SILVER"
  },
  {
    id: "brent",
    label: "Brent Crude",
    symbol: "TVC:UKOIL"
  },
  {
    id: "natgas",
    label: "Natural Gas",
    symbol: "FX_IDC:USDNTG"
  }
];

function TradingViewCommodityGridComponent() {
  useEffect(() => {
    const existingScript = document.head.querySelector(
      'script[src="https://widgets.tradingview-widget.com/w/en/tv-mini-chart.js"]'
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://widgets.tradingview-widget.com/w/en/tv-mini-chart.js";
    document.head.appendChild(script);
  }, []);

  return (
    <div className="mini-chart-grid">
      {commodityWidgets.map((item) => (
        <div className="mini-chart-card" key={item.id}>
          <div className="mini-chart-card__header">
            <span className="mini-chart-card__label">{item.label}</span>
          </div>
          <div className="mini-chart-card__body">
            {createElement("tv-mini-chart", {
              symbol: item.symbol
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export const TradingViewCommodityGrid = memo(TradingViewCommodityGridComponent);
