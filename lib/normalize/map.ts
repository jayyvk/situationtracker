import { getRegionPreset } from "@/lib/config/regions";
import type { MapSignal, RegionPreset } from "@/lib/types/signals";

export function inRegion(
  lat: number,
  lon: number,
  regionId: RegionPreset = "me"
): boolean {
  const region = getRegionPreset(regionId);

  return (
    lon >= region.bounds.west &&
    lon <= region.bounds.east &&
    lat >= region.bounds.south &&
    lat <= region.bounds.north
  );
}

export function filterMapSignals(
  items: MapSignal[],
  regionId: RegionPreset = "me"
): MapSignal[] {
  return items.filter((item) => inRegion(item.lat, item.lon, regionId));
}
