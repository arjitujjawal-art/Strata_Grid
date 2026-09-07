import type { Map as MapLibreMap } from 'maplibre-gl';

export type TimeOfDay = 'morning' | 'monsoon_noon' | 'evening_rush' | 'night';

export function applyMapboxAtmosphere(map: MapLibreMap | null, time: TimeOfDay) {
  if (!map || !map.isStyleLoaded()) return;

  try {
    // Attempt to set fog if supported by the current style engine
    if (typeof (map as any).setFog === 'function') {
      switch (time) {
        case 'morning':
          (map as any).setFog({
            range: [1.0, 12.0],
            color: '#1a2238',
            'horizon-blend': 0.2,
            'high-color': '#ffecd2',
            'space-color': '#0d1322',
            'star-intensity': 0.1
          });
          break;

        case 'monsoon_noon':
          (map as any).setFog({
            range: [0.3, 6.0],
            color: '#111a28',
            'horizon-blend': 0.45,
            'high-color': '#2a3b5c',
            'space-color': '#070b14',
            'star-intensity': 0.0
          });
          break;

        case 'evening_rush':
          (map as any).setFog({
            range: [0.8, 10.0],
            color: '#261b2e',
            'horizon-blend': 0.35,
            'high-color': '#e07a5f',
            'space-color': '#0f0c1b',
            'star-intensity': 0.3
          });
          break;

        case 'night':
        default:
          (map as any).setFog({
            range: [0.5, 12.0],
            color: '#080d1a',
            'horizon-blend': 0.2,
            'high-color': '#020617',
            'space-color': '#000000',
            'star-intensity': 0.8
          });
          break;
      }
    }
  } catch (err) {
    console.debug('Atmosphere fog set error (safe to ignore):', err);
  }
}
