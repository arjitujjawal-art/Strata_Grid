import * as h3 from 'h3-js';

export interface GeoLocationPreset {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  zoom: number;
  description: string;
}

export const CITY_PRESETS: GeoLocationPreset[] = [
  {
    id: 'sf',
    name: 'San Francisco, CA',
    country: 'USA',
    lat: 37.7749,
    lng: -122.4194,
    zoom: 13,
    description: 'Market St Arterial, Bay Bridge Incline, SFO Freight Corridor & Port Logistics'
  },
  {
    id: 'nyc',
    name: 'New York City, NY',
    country: 'USA',
    lat: 40.7128,
    lng: -74.0060,
    zoom: 13,
    description: 'Manhattan Grid, FDR Drive, Brooklyn Bridge & Queens-Midtown Arterials'
  },
  {
    id: 'chicago',
    name: 'Chicago, IL',
    country: 'USA',
    lat: 41.8781,
    lng: -87.6298,
    zoom: 13,
    description: 'The Loop, Lake Shore Drive, I-90 Kennedy Expressway & Heavy Transit'
  },
  {
    id: 'austin',
    name: 'Austin, TX',
    country: 'USA',
    lat: 30.2672,
    lng: -97.7431,
    zoom: 13,
    description: 'I-35 Central Corridor, Congress Ave, Tech Ridge Logistics & Mopac'
  },
  {
    id: 'london',
    name: 'London, UK',
    country: 'UK',
    lat: 51.5074,
    lng: -0.1278,
    zoom: 13,
    description: 'Thames Corridor, Tower Bridge, Canary Wharf Freight & Blackwall Tunnel'
  },
  {
    id: 'tokyo',
    name: 'Tokyo, Japan',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    zoom: 13,
    description: 'Shuto Expressway Loop, Ginza Arterial, Rainbow Bridge & Port of Tokyo'
  }
];

export interface H3MapCell {
  h3Index: string;
  name: string;
  district: string;
  centroid: { lat: number; lng: number };
  boundary: { lat: number; lng: number }[];
  baseStress: number;
  trafficVolume: number;
  heavyVehiclePct: number;
  floodVulnerability: number;
  roadType: 'arterial' | 'highway' | 'bridge' | 'urban_corridor' | 'freight_spur';
  speedLimit: number;
  esalDaily: number;
  moistureSaturationPct: number;
  shearStrainMicrostrain: number;
  potholeProbabilityPct: number;
  potholeRisk: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical';
  isClosed?: boolean;
}

export interface MapRoutePath {
  id: string;
  name: string;
  type: 'conventional' | 'cooperative';
  color: string;
  durationMin: number;
  distanceKm: number;
  stressScore: number;
  fatiguePreventionPct?: number;
  points: { lat: number; lng: number }[];
  h3Path: string[];
}

export interface SensorStation {
  id: string;
  name: string;
  type: 'WIM' | 'ACOUSTIC_STRAIN' | 'PORE_PRESSURE' | 'WEATHER_RADAR';
  lat: number;
  lng: number;
  reading: string;
  status: 'nominal' | 'warning' | 'alert';
}

/**
 * Generates an H3 hexagonal digital twin grid around a central geographic coordinate.
 */
export function generateH3GridForLocation(
  centerLat: number,
  centerLng: number,
  resolution: number = 8,
  kRingRadius: number = 2,
  rainIntensityMm: number = 45,
  trafficMultiplier: number = 100
): H3MapCell[] {
  // Get center H3 index
  const centerHex = h3.latLngToCell(centerLat, centerLng, resolution);
  
  // Get surrounding hexagon indices within k-rings
  const hexIndices = h3.gridDisk(centerHex, kRingRadius);

  const districtNames = [
    'Civic Core', 'Logistics Arterial', 'Commercial District',
    'Port Terminal', 'North Skyway', 'West Industrial Spur',
    'Residential Park', 'Metro Transit Corridor', 'Riverfront Boulevard'
  ];

  const roadTypes: Array<'arterial' | 'highway' | 'bridge' | 'urban_corridor' | 'freight_spur'> = [
    'arterial', 'highway', 'bridge', 'urban_corridor', 'freight_spur'
  ];

  return hexIndices.map((hexId, idx) => {
    // Centroid of the cell
    const [cLat, cLng] = h3.cellToLatLng(hexId);

    // Get polygon boundary coordinates
    const rawBoundary = h3.cellToBoundary(hexId);
    const boundary = rawBoundary.map(([bLat, bLng]) => ({ lat: bLat, lng: bLng }));

    // Deterministic pseudo-random seed based on hexId characters
    const seed = hexId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pseudoRand = (seed % 100) / 100;
    const pseudoRand2 = ((seed * 17) % 100) / 100;

    const isCore = idx === 0 || idx <= 3;
    const isBridgeOrFlyover = idx === 4 || idx === 10 || idx === 12;

    const roadType = isBridgeOrFlyover ? 'bridge' : roadTypes[Math.floor(pseudoRand * roadTypes.length)];
    const district = districtNames[idx % districtNames.length];
    const name = isBridgeOrFlyover
      ? `Sector ${idx + 1} Viaduct & Expansion Joint`
      : `${district} Expressway Sec-${idx + 1}`;

    const baseStress = isBridgeOrFlyover 
      ? Math.round(78 + pseudoRand * 18) 
      : Math.round(25 + pseudoRand * 50);

    const trafficVolume = Math.round((800 + pseudoRand * 2400) * (trafficMultiplier / 100));
    const heavyVehiclePct = isBridgeOrFlyover || roadType === 'freight_spur'
      ? Math.round(35 + pseudoRand2 * 45)
      : Math.round(10 + pseudoRand2 * 25);

    const floodVulnerability = Math.round(20 + pseudoRand * 65);
    const moisture = Math.min(96, Math.max(15, Math.round(floodVulnerability * 0.45 + (rainIntensityMm / 100) * 45 + 15)));
    const esalDaily = Math.round(trafficVolume * (heavyVehiclePct / 100) * 3.4);

    const calculatedStress = Math.min(
      100,
      Math.max(10, Math.round(baseStress * (1 + rainIntensityMm / 200) * (trafficMultiplier / 100)))
    );

    const shearStrainMicrostrain = Math.round(calculatedStress * 7.8 + (moisture > 70 ? 240 : 50));
    const potholeProb = Math.min(99, Math.max(5, Math.round((calculatedStress * 0.55) + (moisture * 0.35) + (heavyVehiclePct * 0.2))));

    let potholeRisk: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical' = 'Low';
    if (calculatedStress >= 86 || potholeProb >= 85) potholeRisk = 'Critical';
    else if (calculatedStress >= 72 || potholeProb >= 70) potholeRisk = 'Severe';
    else if (calculatedStress >= 50 || potholeProb >= 50) potholeRisk = 'High';
    else if (calculatedStress >= 30) potholeRisk = 'Moderate';

    return {
      h3Index: hexId,
      name,
      district,
      centroid: { lat: cLat, lng: cLng },
      boundary,
      baseStress,
      trafficVolume,
      heavyVehiclePct,
      floodVulnerability,
      roadType,
      speedLimit: roadType === 'highway' ? 65 : roadType === 'bridge' ? 45 : 35,
      esalDaily,
      moistureSaturationPct: moisture,
      shearStrainMicrostrain,
      potholeProbabilityPct: potholeProb,
      potholeRisk,
      isClosed: false
    };
  });
}

/**
 * Generates conventional vs cooperative routes across the generated H3 grid.
 */
export function generateRoutesForH3Grid(cells: H3MapCell[]): MapRoutePath[] {
  if (cells.length < 5) return [];

  // Pick endpoints
  const origin = cells[0];
  const dest = cells[cells.length - 1] || cells[cells.length - 2];

  // Conventional path: straight line / passes through highest stressed sector
  const highStressCell = cells.reduce((max, c) => c.baseStress > max.baseStress ? c : max, cells[0]);
  
  const conventionalPoints = [
    origin.centroid,
    { lat: (origin.centroid.lat + highStressCell.centroid.lat) / 2, lng: (origin.centroid.lng + highStressCell.centroid.lng) / 2 },
    highStressCell.centroid,
    { lat: (highStressCell.centroid.lat + dest.centroid.lat) / 2, lng: (highStressCell.centroid.lng + dest.centroid.lng) / 2 },
    dest.centroid
  ];

  // Cooperative path: bypasses high stress cell, routes through low stress cells
  const lowStressCells = cells.filter(c => c.h3Index !== highStressCell.h3Index && c.baseStress < 50);
  const bypassCell1 = lowStressCells[0] || cells[1];
  const bypassCell2 = lowStressCells[1] || cells[2];

  const cooperativePoints = [
    origin.centroid,
    bypassCell1.centroid,
    bypassCell2.centroid,
    dest.centroid
  ];

  return [
    {
      id: 'conventional',
      name: 'Conventional Shortest Path (Selfish GPS)',
      type: 'conventional',
      color: '#f43f5e', // Rose
      durationMin: 14,
      distanceKm: 8.2,
      stressScore: 89,
      points: conventionalPoints,
      h3Path: [origin.h3Index, highStressCell.h3Index, dest.h3Index]
    },
    {
      id: 'cooperative',
      name: 'StrataGrid Cooperative Pareto Route',
      type: 'cooperative',
      color: '#14b8a6', // Teal
      durationMin: 16,
      distanceKm: 9.4,
      stressScore: 28,
      fatiguePreventionPct: 42,
      points: cooperativePoints,
      h3Path: [origin.h3Index, bypassCell1.h3Index, bypassCell2.h3Index, dest.h3Index]
    }
  ];
}

/**
 * Generates sensor station coordinates from H3 cells.
 */
export function generateSensorStations(cells: H3MapCell[]): SensorStation[] {
  const stations: SensorStation[] = [];

  cells.slice(0, 4).forEach((cell, i) => {
    stations.push({
      id: `WIM-${i + 1}`,
      name: `WIM Sensor Stn #${i + 1} (${cell.district})`,
      type: 'WIM',
      lat: cell.centroid.lat + (i === 0 ? 0.0015 : -0.0015),
      lng: cell.centroid.lng + (i % 2 === 0 ? 0.002 : -0.002),
      reading: `${Math.round(cell.esalDaily * 0.85)} ESALs / 24h`,
      status: cell.baseStress > 70 ? 'alert' : 'nominal'
    });
  });

  if (cells[4]) {
    stations.push({
      id: 'STRAIN-01',
      name: 'Fiber-Optic Acoustic Strain Gauge',
      type: 'ACOUSTIC_STRAIN',
      lat: cells[4].centroid.lat,
      lng: cells[4].centroid.lng,
      reading: `${cells[4].shearStrainMicrostrain} µε Dynamic Peak`,
      status: cells[4].shearStrainMicrostrain > 500 ? 'warning' : 'nominal'
    });
  }

  return stations;
}
