import type { RegionPreset } from "@/lib/types/signals";

export type RegionConfig = {
  id: RegionPreset;
  label: string;
  queryTerms: string[];
  center: [number, number];
  zoom: number;
  bounds: {
    west: number;
    south: number;
    east: number;
    north: number;
  };
};

export const regionPresets: Record<RegionPreset, RegionConfig> = {
  me: {
    id: "me",
    label: "Middle East",
    queryTerms: [
      "Israel",
      "Tel Aviv",
      "Jerusalem",
      "Gaza",
      "West Bank",
      "Lebanon",
      "Beirut",
      "Syria",
      "Damascus",
      "Jordan",
      "Amman",
      "Iraq",
      "Baghdad",
      "Iran",
      "Tehran",
      "Saudi Arabia",
      "Riyadh",
      "Jeddah",
      "Qatar",
      "Doha",
      "United Arab Emirates",
      "UAE",
      "Abu Dhabi",
      "Dubai",
      "Bahrain",
      "Manama",
      "Oman",
      "Muscat",
      "Kuwait",
      "Kuwait City",
      "Yemen",
      "Sanaa",
      "Red Sea",
      "Hormuz"
    ],
    center: [29.5, 44],
    zoom: 4,
    bounds: {
      west: 24,
      south: 12,
      east: 64,
      north: 42
    }
  }
};

export function getRegionPreset(region: string | null | undefined): RegionConfig {
  if (region && region in regionPresets) {
    return regionPresets[region as RegionPreset];
  }

  return regionPresets.me;
}
