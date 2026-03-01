"use client";

import { memo, useEffect, useState } from "react";

const categories = [
  { label: "Breaking", query: "Breaking News" },
  { label: "Politics", query: "Politics" },
  { label: "Business", query: "Business" },
  { label: "Crypto", query: "Crypto" }
];

function getTheme() {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function PolymarketTickerStackComponent() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(getTheme());

    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="polymarket-stack">
      <div className="polymarket-stack__header" aria-hidden="true">
        {categories.map((category) => (
          <span className="polymarket-stack__chip" key={category.query}>
            {category.label}
          </span>
        ))}
      </div>
      {categories.map((category) => {
        const src = `https://ticker.polymarket.com/embed?category=${encodeURIComponent(category.query)}&theme=${theme}&speed=0.25&displayMode=price&height=64`;

        return (
          <div className="polymarket-row" key={category.query}>
            <iframe
              className="polymarket-row__frame"
              frameBorder="0"
              height="100%"
              loading="lazy"
              scrolling="no"
              src={src}
              title={`${category.label} prediction ticker`}
            />
          </div>
        );
      })}
    </div>
  );
}

export const PolymarketTickerStack = memo(PolymarketTickerStackComponent);
