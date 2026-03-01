"use client";

import { memo, useEffect, useRef } from "react";

function TradingViewStockHeatmapComponent() {
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const widget = widgetRef.current;

    if (!widget) {
      return;
    }

    const existingScript = widget.querySelector(
      'script[src="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"]'
    );

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "dataSource": "SPX500",
        "blockSize": "market_cap_basic",
        "blockColor": "change",
        "grouping": "sector",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "dark",
        "exchanges": [],
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": true,
        "hasSymbolTooltip": true,
        "isMonoSize": false,
        "width": "100%",
        "height": "100%"
      }`;

    widget.appendChild(script);

    return () => {
      widget.replaceChildren();
    };
  }, []);

  return (
    <div className="tradingview-widget-container tradingview-widget-container--heatmap">
      <div className="tradingview-widget-container__widget" ref={widgetRef} />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/heatmap/stock/"
          rel="noopener nofollow"
          target="_blank"
        >
          Stock Heatmap
        </a>
        <span> by TradingView</span>
      </div>
    </div>
  );
}

export const TradingViewStockHeatmap = memo(TradingViewStockHeatmapComponent);
