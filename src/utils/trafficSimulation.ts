// Traffic Particle Animation Engine for Pune Corridors
import { GeoRouteOption } from '../types';

export interface TrafficParticle {
  id: string;
  routeId: string;
  progress: number; // 0.0 to 1.0 along the path
  speed: number;    // increment per tick
  color: string;
  size: number;
  type: 'car' | 'truck' | 'bus';
  label?: string;
  isDiverted?: boolean;
}

// Haversine / Equirectangular distance approximation for speed
function getDistance(p1: [number, number], p2: [number, number]): number {
  const dx = (p2[0] - p1[0]) * Math.cos(((p1[1] + p2[1]) / 2) * (Math.PI / 180));
  const dy = p2[1] - p1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

// Compute cumulative lengths along a polyline
export function precalculateRouteLengths(path: [number, number][]): { total: number; segments: number[] } {
  const segments: number[] = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const d = getDistance(path[i], path[i + 1]);
    segments.push(d);
    total += d;
  }
  return { total, segments };
}

// Interpolate [lng, lat] along a polyline given progress t in [0, 1]
export function interpolatePosition(
  path: [number, number][],
  segments: number[],
  totalLength: number,
  t: number
): [number, number] {
  if (path.length === 0) return [73.805, 18.565];
  if (path.length === 1 || totalLength === 0) return path[0];

  const targetDist = Math.max(0, Math.min(1, t)) * totalLength;
  let accumulated = 0;

  for (let i = 0; i < segments.length; i++) {
    const segLen = segments[i];
    if (accumulated + segLen >= targetDist || i === segments.length - 1) {
      const segT = segLen === 0 ? 0 : (targetDist - accumulated) / segLen;
      const p1 = path[i];
      const p2 = path[i + 1];
      const lng = p1[0] + (p2[0] - p1[0]) * segT;
      const lat = p1[1] + (p2[1] - p1[1]) * segT;
      return [lng, lat];
    }
    accumulated += segLen;
  }

  return path[path.length - 1];
}

// Generate initial fleet of particles for demonstration
export function createTrafficFleet(stepId: number, routes: GeoRouteOption[]): TrafficParticle[] {
  const particles: TrafficParticle[] = [];
  const selfishRoute = routes.find((r) => r.type === 'selfish') || routes[0];
  const coopRoute = routes.find((r) => r.type === 'cooperative') || routes[1] || routes[0];

  if (!selfishRoute) return [];

  // Phase 1: Baseline Morning Flow (14 smooth golden vehicles)
  if (stepId === 1) {
    for (let i = 0; i < 14; i++) {
      particles.push({
        id: `p1-${i}`,
        routeId: selfishRoute.id,
        progress: (i / 14 + Math.random() * 0.05) % 1,
        speed: 0.0018 + (i % 3) * 0.0003,
        color: i % 4 === 0 ? '#F2E8C4' : '#D4AF37',
        size: 5,
        type: 'car'
      });
    }
  }
  // Phase 2: Monsoon Surge (16 amber vehicles, slowed down due to rain)
  else if (stepId === 2) {
    for (let i = 0; i < 16; i++) {
      particles.push({
        id: `p2-${i}`,
        routeId: selfishRoute.id,
        progress: (i / 16 + Math.random() * 0.04) % 1,
        speed: 0.0012 + (i % 2) * 0.0002, // Slower
        color: '#F59E0B', // Amber
        size: 5.5,
        type: 'car'
      });
    }
  }
  // Phase 3: Selfish GPS Overload (26 ruby red vehicles clustered tightly at Wakad Bridge)
  else if (stepId === 3) {
    for (let i = 0; i < 26; i++) {
      // Clustered heavily around progress 0.20 to 0.45 (Wakad Chokepoint)
      const clusteredProgress = 0.15 + (i / 26) * 0.35 + (Math.random() * 0.04 - 0.02);
      particles.push({
        id: `p3-${i}`,
        routeId: selfishRoute.id,
        progress: Math.min(0.95, Math.max(0.05, clusteredProgress)),
        speed: 0.0003 + (i % 2) * 0.00015, // Dead slow crawl
        color: '#EF4444', // Ruby Red
        size: 6,
        type: 'car'
      });
    }
  }
  // Phase 4: StrataGrid Cooperative Balancing (Stream splits dynamically!)
  else if (stepId === 4) {
    // 55% remain on Wakad, but decongested and moving freely
    for (let i = 0; i < 12; i++) {
      particles.push({
        id: `p4-main-${i}`,
        routeId: selfishRoute.id,
        progress: (i / 12) % 1,
        speed: 0.0022,
        color: '#10B981', // Healthy Green
        size: 5,
        type: 'car'
      });
    }
    // 45% diverted onto Pashan-Sus bypass moving fast in metallic gold
    if (coopRoute) {
      for (let i = 0; i < 12; i++) {
        particles.push({
          id: `p4-coop-${i}`,
          routeId: coopRoute.id,
          progress: (i / 12) % 1,
          speed: 0.0028, // Fast flow
          color: '#D4AF37', // Art Deco Metallic Gold
          size: 6,
          type: 'car',
          isDiverted: true
        });
      }
    }
  }
  // Phase 5: PCCOE Heavy Freight Rerouting (50-ton multi-axle trucks on Spine Road)
  else if (stepId === 5) {
    // Light local cars on urban road
    for (let i = 0; i < 8; i++) {
      particles.push({
        id: `p5-local-${i}`,
        routeId: selfishRoute.id,
        progress: (i / 8) % 1,
        speed: 0.0020,
        color: '#888888',
        size: 4,
        type: 'car'
      });
    }
    // Heavy freight trucks (50T) diverted onto outer industrial Spine Road
    if (coopRoute) {
      for (let i = 0; i < 10; i++) {
        particles.push({
          id: `p5-truck-${i}`,
          routeId: coopRoute.id,
          progress: (i / 10) % 1,
          speed: 0.0018,
          color: '#D4AF37',
          size: 7.5,
          type: 'truck',
          label: '50T',
          isDiverted: true
        });
      }
    }
  }
  // Phase 6: Equilibrium (Harmonious gold and emerald flows)
  else {
    for (let i = 0; i < 10; i++) {
      particles.push({
        id: `p6-a-${i}`,
        routeId: selfishRoute.id,
        progress: (i / 10) % 1,
        speed: 0.0024,
        color: '#10B981',
        size: 5,
        type: 'car'
      });
    }
    if (coopRoute) {
      for (let i = 0; i < 10; i++) {
        particles.push({
          id: `p6-b-${i}`,
          routeId: coopRoute.id,
          progress: (i / 10) % 1,
          speed: 0.0026,
          color: '#D4AF37',
          size: 5.5,
          type: 'car'
        });
      }
    }
  }

  return particles;
}

// Convert particle positions to a GeoJSON FeatureCollection for MapLibre
export function particlesToGeoJson(
  particles: TrafficParticle[],
  routeLookup: Record<string, { path: [number, number][]; segments: number[]; total: number }>
): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  for (const p of particles) {
    const routeData = routeLookup[p.routeId];
    if (!routeData) continue;

    const coords = interpolatePosition(routeData.path, routeData.segments, routeData.total, p.progress);

    features.push({
      type: 'Feature',
      id: p.id,
      properties: {
        id: p.id,
        color: p.color,
        size: p.size,
        type: p.type,
        label: p.label || '',
        isDiverted: p.isDiverted ? 1 : 0
      },
      geometry: {
        type: 'Point',
        coordinates: coords
      }
    });
  }

  return {
    type: 'FeatureCollection',
    features
  };
}
