"use client";

import { PanelShell } from "@/components/panels/panel-shell";

type ResourceItem = {
  title: string;
  detail: string;
  url: string;
  source: string;
};

const resources: ResourceItem[] = [
  {
    title: "Qatar Ministry of Foreign Affairs",
    detail: "Consular updates, travel notices, and support channels for Qatar-based travelers.",
    url: "https://www.mofa.gov.qa/en",
    source: "Qatar"
  },
  {
    title: "UAE Twajudi",
    detail: "UAE traveler registration and emergency contact support during overseas disruptions.",
    url: "https://www.mofa.gov.ae/Services/Twajudi",
    source: "UAE"
  },
  {
    title: "US State Department",
    detail: "Travel advisories, security alerts, and crisis updates for affected regions.",
    url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html",
    source: "Official"
  },
  {
    title: "UK FCDO",
    detail: "Foreign travel advice and emergency guidance, updated during fast-moving crises.",
    url: "https://www.gov.uk/foreign-travel-advice",
    source: "Official"
  },
  {
    title: "FAA NOTAM Search",
    detail: "Active airspace closures, restrictions, and flight operations notices.",
    url: "https://notams.aim.faa.gov/notamSearch/",
    source: "Aviation"
  },
  {
    title: "IAEA News Center",
    detail: "Nuclear facility monitoring updates and official incident statements.",
    url: "https://www.iaea.org/newscenter",
    source: "Official"
  },
  {
    title: "Flightradar24",
    detail: "Live global flight tracking, useful for diversions and route pressure.",
    url: "https://www.flightradar24.com/28,45/4",
    source: "Aviation"
  },
  {
    title: "MarineTraffic",
    detail: "Shipping and naval movements, especially around the Gulf and Hormuz.",
    url: "https://www.marinetraffic.com/",
    source: "Maritime"
  },
  {
    title: "Liveuamap",
    detail: "Real-time conflict map with rapid geolocated incident reporting.",
    url: "https://liveuamap.com/",
    source: "OSINT"
  },
  {
    title: "NASA FIRMS",
    detail: "Near real-time satellite fire and heat detections for strikes or explosions.",
    url: "https://firms.modaps.eosdis.nasa.gov/map/",
    source: "Satellite"
  },
  {
    title: "GDACS",
    detail: "Global disaster alerts and coordination data for major disruptions.",
    url: "https://www.gdacs.org/",
    source: "Relief"
  }
];

export function ChatPanel() {
  return (
    <PanelShell title="Important Resources" className="panel--chat">
      <div className="resource-shell">
        <div className="resource-list">
          {resources.map((resource) => (
            <a
              key={resource.title}
              className="resource-row"
              href={resource.url}
              rel="noreferrer"
              target="_blank"
            >
              <div className="resource-row__meta">
                <span className="resource-row__source">{resource.source}</span>
                <span className="resource-row__action">Open</span>
              </div>
              <p className="resource-row__title">{resource.title}</p>
              <p className="resource-row__detail">{resource.detail}</p>
            </a>
          ))}
        </div>
      </div>
    </PanelShell>
  );
}
