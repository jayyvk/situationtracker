export type MapCountry = {
  id: string;
  label: string;
  center: [number, number];
  bounds: {
    south: number;
    west: number;
    north: number;
    east: number;
  };
  polygon: [number, number][];
};

export const mapCountries: MapCountry[] = [
  {
    id: "israel",
    label: "Israel",
    center: [31.3, 34.9],
    bounds: { south: 29.5, west: 34.2, north: 33.4, east: 35.9 },
    polygon: [
      [29.5, 34.9],
      [30.7, 34.35],
      [31.8, 34.45],
      [33.15, 35.55],
      [32.1, 35.85],
      [30.9, 35.6],
      [29.5, 34.9]
    ]
  },
  {
    id: "jordan",
    label: "Jordan",
    center: [31.2, 36.4],
    bounds: { south: 29.1, west: 34.9, north: 33.4, east: 39.2 },
    polygon: [
      [29.2, 34.95],
      [31.3, 35.0],
      [32.1, 36.0],
      [33.3, 38.8],
      [31.9, 39.15],
      [29.4, 37.6],
      [29.2, 34.95]
    ]
  },
  {
    id: "lebanon",
    label: "Lebanon",
    center: [33.9, 35.8],
    bounds: { south: 33.0, west: 35.1, north: 34.7, east: 36.7 },
    polygon: [
      [33.05, 35.15],
      [34.65, 35.45],
      [34.6, 36.35],
      [33.15, 36.6],
      [33.05, 35.15]
    ]
  },
  {
    id: "syria",
    label: "Syria",
    center: [35.0, 38.5],
    bounds: { south: 32.3, west: 35.7, north: 37.3, east: 42.4 },
    polygon: [
      [32.35, 35.75],
      [37.25, 36.0],
      [37.2, 42.25],
      [34.9, 42.35],
      [32.35, 38.7],
      [32.35, 35.75]
    ]
  },
  {
    id: "iraq",
    label: "Iraq",
    center: [33.0, 43.5],
    bounds: { south: 29.0, west: 38.8, north: 37.4, east: 48.6 },
    polygon: [
      [29.05, 39.0],
      [31.0, 46.0],
      [33.0, 48.4],
      [37.25, 45.5],
      [37.25, 39.0],
      [29.05, 39.0]
    ]
  },
  {
    id: "saudi-arabia",
    label: "Saudi Arabia",
    center: [23.9, 45.1],
    bounds: { south: 16.2, west: 34.5, north: 32.2, east: 55.7 },
    polygon: [
      [16.3, 42.5],
      [18.0, 49.5],
      [22.5, 55.45],
      [28.0, 55.0],
      [31.9, 50.0],
      [32.1, 37.0],
      [28.0, 34.7],
      [16.3, 42.5]
    ]
  },
  {
    id: "iran",
    label: "Iran",
    center: [32.0, 53.0],
    bounds: { south: 25.0, west: 44.0, north: 39.8, east: 63.4 },
    polygon: [
      [25.1, 51.0],
      [26.6, 57.5],
      [29.0, 61.8],
      [37.5, 63.2],
      [39.6, 46.4],
      [34.8, 44.2],
      [28.0, 46.0],
      [25.1, 51.0]
    ]
  },
  {
    id: "yemen",
    label: "Yemen",
    center: [15.8, 47.7],
    bounds: { south: 12.1, west: 42.3, north: 19.1, east: 53.1 },
    polygon: [
      [12.2, 43.1],
      [14.5, 52.9],
      [16.9, 52.4],
      [18.95, 49.8],
      [18.8, 43.0],
      [12.2, 43.1]
    ]
  }
];

export function getMapCountry(countryId: string) {
  return mapCountries.find((country) => country.id === countryId) ?? null;
}
