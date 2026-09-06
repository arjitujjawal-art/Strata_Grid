import * as h3 from 'h3-js';
import { PuneHexCell } from '../types';

export interface PuneDistrictAnchor {
  name: string;
  district: string;
  lat: number;
  lng: number;
  roadType: 'arterial' | 'highway' | 'bridge' | 'urban_corridor' | 'freight_spur';
  baseStress: number;
  trafficVolume: number;
  heavyVehiclePct: number;
  floodVulnerability: number;
  speedLimit: number;
  asphaltAgeYears: number;
  description: string;
}

// Key known geographic hubs across Pune & Pimpri-Chinchwad
export const PUNE_ANCHORS: PuneDistrictAnchor[] = [
  // PCMC & PCCOE Industrial / Educational Belt
  {
    name: 'PCCOE Akurdi / Sector 26 Corridor',
    district: 'Pimpri-Chinchwad (PCMC)',
    lat: 18.6517,
    lng: 73.7615,
    roadType: 'urban_corridor',
    baseStress: 76,
    trafficVolume: 3400,
    heavyVehiclePct: 28,
    floodVulnerability: 35,
    speedLimit: 45,
    asphaltAgeYears: 5,
    description: 'Akurdi Railway Station road & PCCOE campus arterial experiencing mixed transit'
  },
  {
    name: 'Nigdi Pradhikaran Spine',
    district: 'Pimpri-Chinchwad (PCMC)',
    lat: 18.6570,
    lng: 73.7740,
    roadType: 'arterial',
    baseStress: 64,
    trafficVolume: 2900,
    heavyVehiclePct: 22,
    floodVulnerability: 30,
    speedLimit: 50,
    asphaltAgeYears: 4,
    description: 'Spine Road connecting Nigdi authority to Old Pune-Mumbai Highway'
  },
  {
    name: 'Chinchwad MIDC Industrial Arterial',
    district: 'Chinchwad',
    lat: 18.6280,
    lng: 73.7997,
    roadType: 'freight_spur',
    baseStress: 88,
    trafficVolume: 4200,
    heavyVehiclePct: 62, // Very heavy freight
    floodVulnerability: 40,
    speedLimit: 40,
    asphaltAgeYears: 7,
    description: 'Heavy industrial logistics feeder with high Class 8 multi-axle truck volume'
  },
  {
    name: 'Pimpri Finolex Flyover',
    district: 'Pimpri',
    lat: 18.6250,
    lng: 73.8070,
    roadType: 'bridge',
    baseStress: 82,
    trafficVolume: 4800,
    heavyVehiclePct: 38,
    floodVulnerability: 25,
    speedLimit: 50,
    asphaltAgeYears: 6,
    description: 'Elevated viaduct subject to cyclic dynamic shear strain under heavy axle loads'
  },
  // Hinjewadi IT Park Corridors
  {
    name: 'Hinjewadi Phase 1 Wipro Circle',
    district: 'Hinjewadi IT Park',
    lat: 18.5913,
    lng: 73.7389,
    roadType: 'arterial',
    baseStress: 89,
    trafficVolume: 5600,
    heavyVehiclePct: 18,
    floodVulnerability: 58,
    speedLimit: 45,
    asphaltAgeYears: 6,
    description: 'Core IT corridor with extreme peak-hour commuter choke point and micro-fissuring'
  },
  {
    name: 'Hinjewadi Phase 2 Infosys Junction',
    district: 'Hinjewadi IT Park',
    lat: 18.5820,
    lng: 73.7150,
    roadType: 'urban_corridor',
    baseStress: 72,
    trafficVolume: 3800,
    heavyVehiclePct: 14,
    floodVulnerability: 45,
    speedLimit: 50,
    asphaltAgeYears: 4,
    description: 'Secondary IT spur connecting tech campuses to Marunji road'
  },
  {
    name: 'Wakad Bridge / Bhujbal Chowk',
    district: 'Wakad',
    lat: 18.5987,
    lng: 73.7663,
    roadType: 'bridge',
    baseStress: 85,
    trafficVolume: 5100,
    heavyVehiclePct: 32,
    floodVulnerability: 50,
    speedLimit: 45,
    asphaltAgeYears: 5,
    description: 'Bottleneck bridge connecting Hinjewadi tech workers to Mumbai-Bangalore Highway'
  },
  // Suburbs & Highways
  {
    name: 'Baner High Street Corridor',
    district: 'Baner',
    lat: 18.5590,
    lng: 73.7868,
    roadType: 'arterial',
    baseStress: 58,
    trafficVolume: 3100,
    heavyVehiclePct: 12,
    floodVulnerability: 35,
    speedLimit: 45,
    asphaltAgeYears: 3,
    description: 'Well-paved commercial arterial with stable sub-base'
  },
  {
    name: 'Pashan-Sus Highway Bypass',
    district: 'Pashan',
    lat: 18.5420,
    lng: 73.7820,
    roadType: 'highway',
    baseStress: 42,
    trafficVolume: 2400,
    heavyVehiclePct: 20,
    floodVulnerability: 20,
    speedLimit: 70,
    asphaltAgeYears: 2,
    description: 'Reinforced 6-lane asphalt bypass with superior drainage, ideal for cooperative rerouting'
  },
  {
    name: 'Aundh Rajiv Gandhi Bridge',
    district: 'Aundh',
    lat: 18.5580,
    lng: 73.8077,
    roadType: 'bridge',
    baseStress: 74,
    trafficVolume: 3900,
    heavyVehiclePct: 15,
    floodVulnerability: 62,
    speedLimit: 40,
    asphaltAgeYears: 6,
    description: 'Mula river crossing with elevated moisture infiltration along embankment'
  },
  // Old City & Central Pune
  {
    name: 'Shivajinagar Sancheti Flyover',
    district: 'Shivajinagar',
    lat: 18.5314,
    lng: 73.8446,
    roadType: 'bridge',
    baseStress: 86,
    trafficVolume: 5900,
    heavyVehiclePct: 26,
    floodVulnerability: 48,
    speedLimit: 45,
    asphaltAgeYears: 7,
    description: 'Massive multi-level grade separator experiencing continuous axle oscillation'
  },
  {
    name: 'JM Road / Deccan Arterial',
    district: 'Deccan',
    lat: 18.5170,
    lng: 73.8400,
    roadType: 'urban_corridor',
    baseStress: 68,
    trafficVolume: 4100,
    heavyVehiclePct: 10,
    floodVulnerability: 40,
    speedLimit: 35,
    asphaltAgeYears: 4,
    description: 'Central urban corridor with frequent stop-and-go bus braking strain'
  },
  {
    name: 'Kothrud Paud Road Arterial',
    district: 'Kothrud',
    lat: 18.5074,
    lng: 73.8077,
    roadType: 'arterial',
    baseStress: 62,
    trafficVolume: 3600,
    heavyVehiclePct: 16,
    floodVulnerability: 30,
    speedLimit: 45,
    asphaltAgeYears: 4,
    description: 'Western commuter conduit into central city'
  },
  {
    name: 'Chandni Chowk Multilevel Interchange',
    district: 'Bavdhan',
    lat: 18.5020,
    lng: 73.7780,
    roadType: 'highway',
    baseStress: 54,
    trafficVolume: 4900,
    heavyVehiclePct: 44,
    floodVulnerability: 25,
    speedLimit: 65,
    asphaltAgeYears: 2,
    description: 'Recently upgraded NH48 junction with thick SMA asphalt grade'
  },
  // Flood Vulnerable South & Logistics East
  {
    name: 'Sinhagad Road / Ambil Odha Basin',
    district: 'Parvati / Sinhagad Rd',
    lat: 18.4900,
    lng: 73.8340,
    roadType: 'arterial',
    baseStress: 92, // Severe flood risk
    trafficVolume: 4400,
    heavyVehiclePct: 22,
    floodVulnerability: 94, // Chronic waterlogging
    speedLimit: 35,
    asphaltAgeYears: 8,
    description: 'High-risk low-lying drainage basin prone to severe subgrade hydraulic pumping'
  },
  {
    name: 'Swargate Multimodal Hub',
    district: 'Swargate',
    lat: 18.5018,
    lng: 73.8580,
    roadType: 'urban_corridor',
    baseStress: 78,
    trafficVolume: 4900,
    heavyVehiclePct: 35,
    floodVulnerability: 52,
    speedLimit: 35,
    asphaltAgeYears: 5,
    description: 'High bus transit frequency with localized rutting at station bays'
  },
  {
    name: 'Hadapsar Gadital Freight Junction',
    district: 'Hadapsar',
    lat: 18.5089,
    lng: 73.9260,
    roadType: 'freight_spur',
    baseStress: 84,
    trafficVolume: 4700,
    heavyVehiclePct: 58,
    floodVulnerability: 45,
    speedLimit: 45,
    asphaltAgeYears: 6,
    description: 'Solapur Highway interchange with severe heavy container truck wear'
  },
  {
    name: 'Kharadi World Trade Center Spine',
    district: 'Kharadi',
    lat: 18.5520,
    lng: 73.9450,
    roadType: 'arterial',
    baseStress: 65,
    trafficVolume: 3700,
    heavyVehiclePct: 15,
    floodVulnerability: 42,
    speedLimit: 50,
    asphaltAgeYears: 3,
    description: 'Eastern IT corridor with moderate baseline wear'
  }
];

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generate a complete, connected H3 Resolution 8 digital twin grid for Pune Metro
 */
export function generatePuneH3Grid(
  rainIntensityMm: number = 20,
  trafficMultiplier: number = 100
): PuneHexCell[] {
  const resolution = 8;
  const uniqueHexes = new Set<string>();

  // Generate H3 disks around all anchors
  PUNE_ANCHORS.forEach((anchor) => {
    const centerHex = h3.latLngToCell(anchor.lat, anchor.lng, resolution);
    const disk = h3.gridDisk(centerHex, 2); // 2 rings = 19 hexes per anchor
    disk.forEach((hex) => uniqueHexes.add(hex));
  });

  const cells: PuneHexCell[] = [];

  uniqueHexes.forEach((hexId) => {
    const [cLat, cLng] = h3.cellToLatLng(hexId);
    const rawBoundary = h3.cellToBoundary(hexId);

    // Convert to GeoJSON [lng, lat] format and close polygon ring
    const boundary: [number, number][] = rawBoundary.map(([bLat, bLng]) => [bLng, bLat]);
    if (boundary.length > 0) {
      boundary.push([...boundary[0]]);
    }

    // Find closest anchor to inherit realistic urban context
    let closestAnchor = PUNE_ANCHORS[0];
    let minDistance = Infinity;

    PUNE_ANCHORS.forEach((anchor) => {
      const dist = getDistanceKm(cLat, cLng, anchor.lat, anchor.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestAnchor = anchor;
      }
    });

    // Deterministic pseudo-random variation based on H3 string hash
    const seed = hexId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const jitter = ((seed % 100) - 50) / 100; // -0.5 to +0.5
    const jitter2 = (((seed * 19) % 100) - 50) / 100;

    // Decay base stress slightly with distance from core anchor
    const distanceDecay = Math.max(0.7, 1 - minDistance * 0.08);
    const baseStress = Math.min(95, Math.max(15, Math.round((closestAnchor.baseStress + jitter * 16) * distanceDecay)));

    const trafficVolume = Math.round(
      Math.max(400, (closestAnchor.trafficVolume + jitter * 800) * distanceDecay) * (trafficMultiplier / 100)
    );

    const heavyVehiclePct = Math.min(
      85,
      Math.max(5, Math.round(closestAnchor.heavyVehiclePct + jitter2 * 10))
    );

    const floodVulnerability = Math.min(
      98,
      Math.max(10, Math.round(closestAnchor.floodVulnerability + (cLat < 18.50 ? 10 : 0) + jitter * 12))
    );

    // Moisture increases with rainfall and flood vulnerability
    const moisturePct = Math.min(
      99,
      Math.max(10, Math.round(floodVulnerability * 0.4 + (rainIntensityMm / 100) * 55 + 10))
    );

    // Stress formula: BaseStress * (1 + rain/200) * (traffic/100) * (1 + heavyAxle/100 * 0.4)
    const weatherMult = 1 + (rainIntensityMm / 200) * (floodVulnerability / 50);
    const trafficMult = trafficMultiplier / 100;
    const heavyMult = 1 + (heavyVehiclePct / 100) * 0.35;

    const calculatedStress = Math.min(
      100,
      Math.max(10, Math.round(baseStress * weatherMult * trafficMult * heavyMult * 0.85))
    );

    const esalDaily = Math.round(trafficVolume * (heavyVehiclePct / 100) * 3.8);

    let potholeRisk: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical' = 'Low';
    if (calculatedStress >= 86 || moisturePct >= 85) potholeRisk = 'Critical';
    else if (calculatedStress >= 72 || moisturePct >= 72) potholeRisk = 'Severe';
    else if (calculatedStress >= 50 || moisturePct >= 50) potholeRisk = 'High';
    else if (calculatedStress >= 30) potholeRisk = 'Moderate';

    const hexShort = hexId.slice(-4).toUpperCase();
    const cellName = minDistance < 0.6 
      ? closestAnchor.name 
      : `${closestAnchor.district} Grid #${hexShort}`;

    cells.push({
      id: hexId,
      h3Index: hexId,
      centroid: [cLng, cLat],
      boundary,
      name: cellName,
      district: closestAnchor.district,
      baseStress,
      calculatedStress,
      trafficVolume,
      heavyVehiclePct,
      floodVulnerability,
      moisturePct,
      roadType: closestAnchor.roadType,
      speedLimit: closestAnchor.speedLimit,
      surfaceHealth: Math.max(5, 100 - calculatedStress),
      potholeRisk,
      asphaltAgeYears: closestAnchor.asphaltAgeYears,
      esalDaily,
      isClosed: false
    });
  });

  return cells;
}

/**
 * Convert H3 cells to GeoJSON FeatureCollection for direct Mapbox layer injection
 */
export function cellsToGeoJson(cells: PuneHexCell[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: cells.map((cell) => ({
      type: 'Feature',
      id: cell.h3Index,
      properties: {
        id: cell.h3Index,
        name: cell.name,
        district: cell.district,
        stress: cell.calculatedStress,
        baseStress: cell.baseStress,
        traffic: cell.trafficVolume,
        heavyPct: cell.heavyVehiclePct,
        floodVuln: cell.floodVulnerability,
        moisture: cell.moisturePct,
        roadType: cell.roadType,
        speedLimit: cell.speedLimit,
        potholeRisk: cell.potholeRisk,
        isClosed: cell.isClosed ? 1 : 0
      },
      geometry: {
        type: 'Polygon',
        coordinates: [cell.boundary]
      }
    }))
  };
}
