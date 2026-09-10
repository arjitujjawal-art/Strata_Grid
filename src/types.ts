export type GridMode = 'driver' | 'fleet' | 'city';
export type PageId = 'home' | 'dashboard' | 'pipeline' | 'case-studies' | 'gallery' | 'team';
export type ThemePalette = 'emerald' | 'indigo' | 'amber' | 'cyan';
export type ChatMode = 'general' | 'simulation' | 'geotech' | 'roi';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export interface PuneHexCell {
  id: string; // h3Index
  h3Index: string;
  centroid: [number, number]; // [lng, lat]
  boundary: [number, number][]; // [lng, lat][]
  name: string; // e.g. "Hinjewadi Phase 1", "PCCOE Tech Corridor"
  district: string; // e.g. "Hinjewadi", "PCMC", "Shivajinagar"
  baseStress: number; // 0-100
  calculatedStress: number; // 0-100
  trafficVolume: number; // vehicles / hr
  heavyVehiclePct: number; // 0-100%
  floodVulnerability: number; // 0-100%
  moisturePct: number; // 0-100%
  roadType: 'arterial' | 'highway' | 'bridge' | 'urban_corridor' | 'freight_spur';
  speedLimit: number; // km/h
  surfaceHealth: number; // 0-100%
  potholeRisk: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical';
  asphaltAgeYears: number;
  esalDaily: number;
  isClosed?: boolean;
}

export interface HexCell {
  id: string; // e.g. "HEX-01", "HEX-11"
  q?: number;
  r?: number;
  name: string;
  district: string;
  baseStress: number;
  trafficVolume: number;
  heavyVehiclePct: number;
  floodVulnerability: number;
  isClosed?: boolean;
  roadType: 'arterial' | 'highway' | 'bridge' | 'urban_corridor' | 'freight_spur';
  speedLimit: number;
  surfaceHealth: number;
  potholeRisk: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical';
}

export interface GeoRouteOption {
  id: string;
  name: string;
  type: 'selfish' | 'cooperative';
  corridor: 'hinjewadi_shivajinagar' | 'pcmc_freight';
  color: string;
  durationMin: number;
  distanceKm: number;
  avgStress: number;
  structuralImpact: 'Critical Degradation' | 'Moderate Wear' | 'Minimal Impact (Eco-Protect)';
  isRecommended: boolean;
  tag: string;
  pathCoords: [number, number][]; // [lng, lat]
  traversedH3: string[];
  fatigueSavedPct: number;
  co2SavedKg: number;
  description: string;
}

// Backward compatibility alias
export interface RouteOption {
  id: string;
  name: string;
  durationMin: number;
  distanceMiles: number;
  stressScore: number;
  structuralImpact: 'Critical Degradation' | 'Moderate Wear' | 'Minimal Impact (Eco-Protect)';
  isRecommended: boolean;
  tag: string;
  pathHexIds: string[];
}

export interface DemoScenarioStep {
  id: number;
  phase: string;
  title: string;
  caption: string;
  rainfallMm: number;
  trafficMultiplier: number;
  camera: {
    center: [number, number]; // [lng, lat]
    zoom: number;
    pitch: number;
    bearing: number;
  };
  activeRouteId: string;
  corridor: 'hinjewadi_shivajinagar' | 'pcmc_freight';
  highlightedHexId?: string;
  closedHexId?: string;
  timeOfDay: 'morning' | 'monsoon_noon' | 'evening_rush' | 'night';
  systemLog: string;
  bannerType?: 'problem' | 'solution' | 'neutral';
  bannerHeadline?: string;
  bannerDetail?: string;
  metrics?: {
    strainPct: number;
    conditionText: string;
    commuteMin: number;
    impactSavings: string;
    statusColor: 'emerald' | 'gold' | 'red';
  };
  chokepoints?: {
    id: string;
    name: string;
    coords: [number, number];
    strain: number;
    status: 'critical' | 'mitigated' | 'restricted' | 'nominal';
    label: string;
    sublabel: string;
  }[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatarUrl: string;
  bio?: string;
  github?: string;
  linkedin?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
  location?: string;
  isUserVerified?: boolean;
  pciRating?: number;
  distressTags?: string[];
  caseStudyId?: string;
  verifiedTimestamp?: string;
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'success' | 'alert';
  message: string;
}

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface CaseStudyQuote {
  text: string;
  author: string;
  role: string;
}

export interface CaseStudyVerification {
  isVerified: boolean;
  verdict: 'VERIFIED_GENUINE' | 'VERIFIED_WITH_CORRECTIONS' | 'REJECTED_ANOMALY';
  confidencePct: number;
  pavementConditionIndex: number;
  pciCategory: 'Good' | 'Fair' | 'Poor' | 'Severe' | 'Failed';
  detectedDistressTypes: string[];
  dynamicShearStrainMicrostrain: number;
  subgradePumpingRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  fatigueReductionPct: number;
  recommendedMitigation: string;
  scientificBasis: string;
  verifiedAt: string;
  modelUsed: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle?: string;
  district?: string;
  badge?: string;
  badgeColor?: 'teal' | 'amber' | 'emerald' | 'rose';
  description?: string;
  summary: string;
  problem: string;
  solution: string;
  location: string;
  timeframe: string;
  roadType?: 'arterial' | 'highway' | 'bridge' | 'urban_corridor' | 'freight_spur';
  trafficVolume?: number;
  heavyVehiclePct?: number;
  metrics: CaseStudyMetric[];
  quote: CaseStudyQuote;
  metricLabel?: string;
  metricValue?: string;
  vizType?: 'bars' | 'wave' | 'load';
  imageUrl?: string;
  imageAlt?: string;
  isUserSubmitted?: boolean;
  verification?: CaseStudyVerification;
  createdAt?: string;
}
