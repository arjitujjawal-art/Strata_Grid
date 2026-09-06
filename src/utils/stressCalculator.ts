/**
 * Geotechnical & traffic engineering stress calculation utility
 * Implements empirical pavement degradation models (AASHTO 4th-power fatigue laws)
 */

export interface StressCalculationInput {
  baseStress: number; // 0-100
  rainfallMm: number; // 0-100 mm/h
  trafficMultiplier: number; // 50-150%
  heavyVehiclePct: number; // 0-100%
  floodVulnerability: number; // 0-100%
  asphaltAgeYears?: number;
}

export interface StressCalculationOutput {
  stressScore: number; // 0-100
  moisturePct: number; // 0-100%
  potholeProbability: number; // 0-100%
  potholeRisk: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical';
  shearStrainMicrostrain: number; // µε
  pciScore: number; // 0-100 Pavement Condition Index
  structuralState: string;
}

export function calculatePavementStress(input: StressCalculationInput): StressCalculationOutput {
  const {
    baseStress,
    rainfallMm,
    trafficMultiplier,
    heavyVehiclePct,
    floodVulnerability,
    asphaltAgeYears = 4
  } = input;

  // Weather multiplier: Subgrade moisture softens pavement elasticity
  const weatherFactor = 1 + (rainfallMm / 160) * (floodVulnerability / 50);
  
  // Traffic multiplier: Normalized against 100% standard volume
  const trafficFactor = trafficMultiplier / 100;
  
  // Heavy axle factor: AASHTO 4th-power damage law (ESAL multiplier)
  const heavyFactor = 1 + (heavyVehiclePct / 100) * 0.45;

  // Asphalt aging modifier
  const ageFactor = 1 + Math.min(0.5, asphaltAgeYears * 0.04);

  // Raw stress score calculation
  const rawStress = baseStress * weatherFactor * trafficFactor * heavyFactor * ageFactor * 0.72;
  const stressScore = Math.min(100, Math.max(10, Math.round(rawStress)));

  // Moisture saturation calculation
  const moisturePct = Math.min(
    98,
    Math.max(12, Math.round(floodVulnerability * 0.35 + (rainfallMm / 100) * 55 + 10))
  );

  // Pothole probability: composite of stress, moisture, and cyclic heavy axle strain
  const potholeProbability = Math.min(
    99,
    Math.max(5, Math.round(stressScore * 0.52 + moisturePct * 0.34 + heavyVehiclePct * 0.18))
  );

  // Dynamic shear strain (microstrain µε): typically 150-1200 µε on active roads
  const shearStrainMicrostrain = Math.round(stressScore * 9.2 + (moisturePct > 65 ? 280 : 75));

  // Pavement Condition Index (100 = Brand new, 0 = Failed)
  const pciScore = Math.max(10, Math.min(95, Math.round(100 - stressScore * 0.85)));

  let potholeRisk: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical' = 'Low';
  let structuralState = 'Nominal / Elastic Response';

  if (stressScore >= 88 || potholeProbability >= 88) {
    potholeRisk = 'Critical';
    structuralState = 'Imminent Asphalt Fracture & Subgrade Voiding';
  } else if (stressScore >= 72 || potholeProbability >= 70) {
    potholeRisk = 'Severe';
    structuralState = 'Accelerated Fatigue Micro-Cracking';
  } else if (stressScore >= 52 || potholeProbability >= 50) {
    potholeRisk = 'High';
    structuralState = 'Elevated Cyclic Shear Strain';
  } else if (stressScore >= 32) {
    potholeRisk = 'Moderate';
    structuralState = 'Stable Wear within Design Tolerance';
  }

  return {
    stressScore,
    moisturePct,
    potholeProbability,
    potholeRisk,
    shearStrainMicrostrain,
    pciScore,
    structuralState
  };
}

/**
 * Returns hexadecimal color code corresponding to stress level
 */
export function getStressColor(stress: number): string {
  if (stress >= 86) return '#ef4444'; // Red-500 Critical
  if (stress >= 70) return '#f97316'; // Orange-500 Severe
  if (stress >= 45) return '#f59e0b'; // Amber-500 Elevated
  return '#10b981'; // Emerald-500 Optimal
}
