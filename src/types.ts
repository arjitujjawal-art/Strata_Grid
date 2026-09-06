export type GridMode = 'driver' | 'fleet' | 'city';
export type PageId = 'home' | 'demo' | 'problem' | 'how-it-works' | 'case-studies' | 'impact' | 'gallery' | 'team';
export type ThemePalette = 'emerald' | 'indigo' | 'amber' | 'cyan';
export type ChatMode = 'general' | 'simulation' | 'geotech' | 'roi';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export interface HexCell {
  id: string; // e.g. "HEX-01", "HEX-11"
  q: number; // axial or column
  r: number; // axial or row
  name: string; // e.g. "Grand Ave Overpass", "Sector 7G Flyover"
  district: string; // e.g. "Metropolis Core", "Harbor District", "Logistics Hub"
  baseStress: number; // 0-100
  trafficVolume: number; // vehicles / hr
  heavyVehiclePct: number; // 0-100%
  floodVulnerability: number; // 0-100%
  isClosed?: boolean;
  roadType: 'arterial' | 'highway' | 'bridge' | 'urban_corridor' | 'freight_spur';
  speedLimit: number; // mph
  surfaceHealth: number; // 0-100%
  potholeRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
}

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
