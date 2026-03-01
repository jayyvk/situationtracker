"use client";

import { useEffect, useState } from "react";

const eventName = "sitrep-timezone-change";

function getDeviceZone() {
  if (typeof window === "undefined") {
    return "UTC";
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function LiveRail() {
  const [timeLabel, setTimeLabel] = useState("");

  useEffect(() => {
    const zone = getDeviceZone();

    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: zone,
      timeZoneName: "short"
    });

    const updateClock = () => {
      setTimeLabel(formatter.format(new Date()));
    };

    updateClock();

    const clockTimer = window.setInterval(updateClock, 1_000);

    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {
          zone
        }
      })
    );

    return () => {
      window.clearInterval(clockTimer);
    };
  }, []);

  return <div className="live-rail">{timeLabel || "00:00:00"}</div>;
}
