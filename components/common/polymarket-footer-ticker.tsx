"use client";

import { useEffect, useState } from "react";

function getTheme() {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function PolymarketFooterTicker() {
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

  const src = `https://ticker.polymarket.com/embed?category=Politics&theme=${theme}&speed=0.5&displayMode=percentage&height=36`;

  return (
    <div className="footer-ticker" aria-label="Politics probability ticker">
      <iframe
        className="footer-ticker__frame"
        frameBorder="0"
        height="36"
        loading="lazy"
        scrolling="no"
        src={src}
        title="Polymarket politics ticker"
      />
    </div>
  );
}
