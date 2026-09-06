import { GeoRouteOption } from '../types';

export const PUNE_ROUTES: GeoRouteOption[] = [
  // --- CORRIDOR 1: HINJEWADI TO SHIVAJINAGAR (COMMUTER) ---
  {
    id: 'route-hinjewadi-selfish',
    name: 'GPS Shortest Path (Conventional / Selfish)',
    type: 'selfish',
    corridor: 'hinjewadi_shivajinagar',
    color: '#ef4444', // Red-500
    durationMin: 42,
    distanceKm: 18.2,
    avgStress: 88,
    structuralImpact: 'Critical Degradation',
    isRecommended: false,
    tag: 'Saturates Wakad & University Chokepoints',
    // Accurate road coordinates [lng, lat] from Hinjewadi Phase 1 through Wakad, Aundh, to Shivajinagar
    pathCoords: [
      [73.7389, 18.5913], // Hinjewadi Phase 1 (Wipro Circle)
      [73.7485, 18.5940], // Hinjewadi Flyover approach
      [73.7663, 18.5987], // Wakad Bridge bottleneck
      [73.7840, 18.5920], // Jagtap Dairy
      [73.8010, 18.5750], // Parihar Chowk, Aundh
      [73.8077, 18.5580], // Rajiv Gandhi Bridge
      [73.8240, 18.5440], // Pune University Circle chokepoint
      [73.8340, 18.5360], // Agricultural College
      [73.8446, 18.5314]  // Shivajinagar Sancheti Flyover
    ],
    traversedH3: [],
    fatigueSavedPct: 0,
    co2SavedKg: 0,
    description:
      'Standard navigation funnels 6,200+ peak commuters onto the narrow Wakad viaduct and older Aundh arterial, accelerating asphalt micro-cracking and causing severe sub-base fatigue.'
  },
  {
    id: 'route-hinjewadi-cooperative',
    name: 'StrataGrid Cooperative Load-Balanced Corridor',
    type: 'cooperative',
    corridor: 'hinjewadi_shivajinagar',
    color: '#06b6d4', // Cyan-500
    durationMin: 38,
    distanceKm: 20.4,
    avgStress: 34,
    structuralImpact: 'Minimal Impact (Eco-Protect)',
    isRecommended: true,
    tag: 'AI-Staggered Flow via Pashan-Sus Bypass',
    // Reroute via Hinjewadi Phase 2 -> Sus -> Pashan -> SB Road -> Shivajinagar
    pathCoords: [
      [73.7389, 18.5913], // Hinjewadi Phase 1
      [73.7510, 18.5720], // Sus Road link
      [73.7680, 18.5580], // Sus Village bypass
      [73.7820, 18.5420], // Pashan Circle (Reinforced asphalt)
      [73.8050, 18.5340], // Pashan-Panchawati link
      [73.8270, 18.5280], // Senapati Bapat Marg
      [73.8446, 18.5314]  // Shivajinagar Central
    ],
    traversedH3: [],
    fatigueSavedPct: 62,
    co2SavedKg: 4.8,
    description:
      'AI dynamically splits 45% of traffic onto the newly surfaced Pashan highway corridor. Commuters gain 4 minutes, while cutting cyclic asphalt strain on Wakad Bridge by 62%.'
  },

  // --- CORRIDOR 2: PCCOE / PCMC TO HADAPSAR (FREIGHT & HEAVY VEHICLE) ---
  {
    id: 'route-pcmc-selfish',
    name: 'Direct Urban Cut-Through (Heavy Freight Violation)',
    type: 'selfish',
    corridor: 'pcmc_freight',
    color: '#f97316', // Orange-500
    durationMin: 55,
    distanceKm: 24.1,
    avgStress: 93,
    structuralImpact: 'Critical Degradation',
    isRecommended: false,
    tag: '50-Ton Axle Loads in High-Density Residential',
    // Cut directly through Old Highway, Dapodi, Shivajinagar, Swargate to Hadapsar
    pathCoords: [
      [73.7615, 18.6517], // PCCOE / Akurdi Sector 26
      [73.7740, 18.6410], // Chinchwad Station
      [73.8070, 18.6250], // Pimpri Grade Separator
      [73.8280, 18.5830], // Dapodi Bridge (fragile pier joints)
      [73.8446, 18.5314], // Shivajinagar Core
      [73.8580, 18.5018], // Swargate Chokepoint
      [73.8940, 18.5030], // Fatimanagar
      [73.9260, 18.5089]  // Hadapsar Industrial Hub
    ],
    traversedH3: [],
    fatigueSavedPct: 0,
    co2SavedKg: 0,
    description:
      'Multi-axle container trucks from PCMC cut straight through old city centers, crushing residential pavement foundations and triggering severe subgrade hydraulic pumping.'
  },
  {
    id: 'route-pcmc-cooperative',
    name: 'StrataGrid Heavy-Freight Ring Bypass',
    type: 'cooperative',
    corridor: 'pcmc_freight',
    color: '#10b981', // Emerald-500
    durationMin: 48,
    distanceKm: 29.8,
    avgStress: 28,
    structuralImpact: 'Minimal Impact (Eco-Protect)',
    isRecommended: true,
    tag: 'Reinforced 6-Lane Industrial Highway Ring',
    // Bypass around outer northern spine into Alandi-Wagholi to Hadapsar
    pathCoords: [
      [73.7615, 18.6517], // PCCOE / Akurdi
      [73.7850, 18.6650], // Spine Road Expressway
      [73.8240, 18.6690], // Moshi Toll Plaza (WIM Station #04)
      [73.8760, 18.6480], // Alandi Ring Road
      [73.9280, 18.6010], // Wagholi Outer Link
      [73.9510, 18.5440], // Mundhwa-Kharadi Bypass
      [73.9260, 18.5089]  // Hadapsar Freight Depot
    ],
    traversedH3: [],
    fatigueSavedPct: 78,
    co2SavedKg: 11.2,
    description:
      'Automatically enforces geo-fenced freight rerouting via the heavy-duty outer industrial corridor. Prevents premature bridge expansion joint failure and saves 78% subgrade life.'
  }
];

export function getRoutesForCorridor(corridor: 'hinjewadi_shivajinagar' | 'pcmc_freight'): GeoRouteOption[] {
  return PUNE_ROUTES.filter((r) => r.corridor === corridor);
}

export function routesToGeoJson(routes: GeoRouteOption[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: routes.map((r) => ({
      type: 'Feature',
      id: r.id,
      properties: {
        id: r.id,
        name: r.name,
        type: r.type,
        color: r.color,
        duration: r.durationMin,
        distance: r.distanceKm,
        stress: r.avgStress,
        tag: r.tag,
        isRecommended: r.isRecommended ? 1 : 0
      },
      geometry: {
        type: 'LineString',
        coordinates: r.pathCoords
      }
    }))
  };
}
