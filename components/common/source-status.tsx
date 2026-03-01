"use client";

import clsx from "clsx";
import type { SourceStatus } from "@/lib/types/signals";

type SourceStatusProps = {
  items: SourceStatus[];
};

export function SourceStatusBar({ items }: SourceStatusProps) {
  return (
    <div className="source-status">
      {items.map((item) => (
        <span
          key={item.source}
          className={clsx("source-pill", {
            "source-pill--ok": item.ok && !item.stale,
            "source-pill--warn": item.ok && item.stale,
            "source-pill--error": !item.ok
          })}
          title={item.message ?? `${item.source} status`}
        >
          {item.source}
        </span>
      ))}
    </div>
  );
}
