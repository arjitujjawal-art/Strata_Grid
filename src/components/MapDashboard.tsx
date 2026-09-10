import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, GeoJSONSource, Marker as MapLibreMarker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { generatePuneH3Grid, cellsToGeoJson } from '../data/puneHexGrid';
import { PUNE_ROUTES, getRoutesForCorridor, routesToGeoJson } from '../data/puneRoutes';
import { PuneHexCell, GridMode, TerminalLog as TerminalLogType, DemoScenarioStep } from '../types';
import { StatusBar } from './panels/StatusBar';
import { ControlPanel } from './panels/ControlPanel';
import { HexInspector } from './panels/HexInspector';
import { RouteCompare } from './panels/RouteCompare';
import { TerminalLog } from './panels/TerminalLog';
import { ScenarioOverlay } from './panels/ScenarioOverlay';
import { TokenModal } from './panels/TokenModal';
import { DigitalTwinFallback } from './DigitalTwinFallback';
import { useDemoScenario } from '../hooks/useDemoScenario';
import { applyMapboxAtmosphere, TimeOfDay } from '../hooks/useTimeOfDay';
import {
  createTrafficFleet,
  particlesToGeoJson,
  precalculateRouteLengths,
  TrafficParticle
} from '../utils/trafficSimulation';

interface MapDashboardProps {
  onAskAiAboutCell?: (cell: PuneHexCell) => void;
}

// 100% Free, High-Performance CartoDB Dark Matter Basemap (Zero API Key / Zero Remote GL Font Dependencies)
const CARTO_DARK_RASTER_STYLE: any = {
  version: 8,
  name: 'CartoDB Dark Matter',
  sources: {
    'carto-dark-tiles': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
      ],
      tileSize: 256,
      attribution: '© CARTO, © OpenStreetMap'
    }
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark-tiles',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

export const MapDashboard: React.FC<MapDashboardProps> = ({ onAskAiAboutCell }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // Settings modal state
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  // Simulation controls state
  const [rainfallMm, setRainfallMm] = useState(20);
  const [trafficMultiplier, setTrafficMultiplier] = useState(100);
  const [gridMode, setGridMode] = useState<GridMode>('driver');
  const [selectedCorridor, setSelectedCorridor] = useState<'hinjewadi_shivajinagar' | 'pcmc_freight'>('hinjewadi_shivajinagar');
  const [show3DBuildings, setShow3DBuildings] = useState(true);

  // Inspection and routing state
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [closedCellIds, setClosedCellIds] = useState<Set<string>>(new Set());
  const [activeRouteId, setActiveRouteId] = useState<string>('route-hinjewadi-selfish');

  // Time of day state
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');

  // Chokepoint HTML Markers ref
  const chokepointMarkersRef = useRef<MapLibreMarker[]>([]);

  // Particle simulation refs
  const particlesRef = useRef<TrafficParticle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Terminal log state
  const [logs, setLogs] = useState<TerminalLogType[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: 'StrataGrid Kernel active. MapLibre GL 3D WebGL engine initialized.'
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'success',
      message: 'Open CartoDB Dark Matter basemap loaded with zero API keys required.'
    },
    {
      id: 'init-3',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: 'H3 Resolution-8 spatial grid: 320 hex cells mapped across Pune Metro.'
    }
  ]);

  const addLog = useCallback((message: string, level: TerminalLogType['level'] = 'info') => {
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        level,
        message
      }
    ]);
  }, []);

  // Compute live Pune H3 cells based on current rainfall, traffic, and closures
  const cells: PuneHexCell[] = useMemo(() => {
    const rawCells = generatePuneH3Grid(rainfallMm, trafficMultiplier);
    return rawCells.map((cell) => {
      if (closedCellIds.has(cell.h3Index)) {
        return {
          ...cell,
          isClosed: true,
          calculatedStress: 100,
          potholeRisk: 'Critical'
        };
      }
      return cell;
    });
  }, [rainfallMm, trafficMultiplier, closedCellIds]);

  const selectedCell = useMemo(() => {
    if (!selectedCellId) return null;
    return cells.find((c) => c.h3Index === selectedCellId) || null;
  }, [selectedCellId, cells]);

  const activeRoutes = useMemo(() => {
    return getRoutesForCorridor(selectedCorridor);
  }, [selectedCorridor]);

  const avgStress = useMemo(() => {
    if (cells.length === 0) return 0;
    const total = cells.reduce((acc, c) => acc + c.calculatedStress, 0);
    return Math.round(total / cells.length);
  }, [cells]);

  // Demo Scenario Handler
  const handleScenarioStepChange = useCallback(
    (step: DemoScenarioStep) => {
      setRainfallMm(step.rainfallMm);
      setTrafficMultiplier(step.trafficMultiplier);
      setSelectedCorridor(step.corridor);
      setActiveRouteId(step.activeRouteId);
      setTimeOfDay(step.timeOfDay);
      addLog(step.systemLog, step.id === 3 ? 'alert' : step.id === 4 ? 'success' : 'info');
      if (step.highlightedHexId) {
        setSelectedCellId(step.highlightedHexId);
      }
    },
    [addLog]
  );

  const {
    isPlaying: isPlayingScenario,
    isPaused: isScenarioPaused,
    currentStepIndex,
    currentStep,
    totalSteps,
    progressPct,
    speedMultiplier,
    setSpeedMultiplier,
    togglePause,
    startScenario,
    stopScenario,
    nextStep,
    prevStep,
    goToStep
  } = useDemoScenario({
    map: mapInstance,
    onStepChange: handleScenarioStepChange
  });

  // Check WebGL availability on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const isSupported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      if (!isSupported) {
        console.warn('WebGL is not supported in this browser. Switching to 2.5D Digital Twin Canvas fallback.');
        setWebGlSupported(false);
      }
    } catch {
      setWebGlSupported(false);
    }
  }, []);

  // Apply atmosphere whenever timeOfDay changes
  useEffect(() => {
    if (mapInstance) {
      applyMapboxAtmosphere(mapInstance, timeOfDay);
    }
  }, [mapInstance, timeOfDay]);

  // Update H3 Layer GeoJSON whenever cells change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    const source = map.getSource('h3-grid') as GeoJSONSource;
    if (source) {
      source.setData(cellsToGeoJson(cells));
    }
  }, [cells, isMapReady]);

  // Update Route Layer GeoJSON whenever corridor or activeRoute changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    const source = map.getSource('pune-routes') as GeoJSONSource;
    if (source) {
      source.setData(routesToGeoJson(activeRoutes));
    }
  }, [activeRoutes, isMapReady]);

  // Toggle 3D Extrusion vs 2D Flat Hexagons
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    if (map.getLayer('h3-hex-extrusion') && map.getLayer('h3-hex-fill')) {
      map.setLayoutProperty('h3-hex-extrusion', 'visibility', show3DBuildings ? 'visible' : 'none');
      map.setLayoutProperty('h3-hex-fill', 'visibility', show3DBuildings ? 'none' : 'visible');
    }
  }, [show3DBuildings, isMapReady]);

  // Initialize MapLibre GL 3D Map
  useEffect(() => {
    if (!mapContainerRef.current || !webGlSupported) return;

    let map: MapLibreMap;
    try {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: CARTO_DARK_RASTER_STYLE,
        center: [73.8050, 18.5650], // Pune Metro
        zoom: 12.0,
        pitch: 52, // 3D Isometric View
        bearing: -15
      });
    } catch (err) {
      console.error('Failed to initialize MapLibre GL:', err);
      setWebGlSupported(false);
      return;
    }

    mapRef.current = map;

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');

    const onMapReady = () => {
      // 1. Add H3 Hexagonal Grid GeoJSON Source
      if (!map.getSource('h3-grid')) {
        map.addSource('h3-grid', {
          type: 'geojson',
          data: cellsToGeoJson(cells)
        });

        // 3D Hexagon Column Extrusion Layer (proportional to stress score)
        map.addLayer({
          id: 'h3-hex-extrusion',
          type: 'fill-extrusion',
          source: 'h3-grid',
          layout: {
            visibility: 'visible'
          },
          paint: {
            'fill-extrusion-color': [
              'case',
              ['==', ['get', 'isClosed'], 1],
              '#7F1D1D',
              ['>=', ['get', 'stress'], 86],
              '#991B1B', // Ruby Red for high stress
              ['>=', ['get', 'stress'], 70],
              '#C2410C', // Bronze Saffron
              ['>=', ['get', 'stress'], 45],
              '#D4AF37', // Art Deco Metallic Gold
              '#064E3B'  // Deep Emerald
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['get', 'stress'],
              0, 20,
              100, 320
            ],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.75
          }
        });

        // 2D Flat Fill Layer for Hexagons (used when 3D extrusion is toggled off)
        map.addLayer({
          id: 'h3-hex-fill',
          type: 'fill',
          source: 'h3-grid',
          layout: {
            visibility: 'none'
          },
          paint: {
            'fill-color': [
              'case',
              ['==', ['get', 'isClosed'], 1],
              '#7F1D1D',
              ['>=', ['get', 'stress'], 86],
              '#991B1B',
              ['>=', ['get', 'stress'], 70],
              '#C2410C',
              ['>=', ['get', 'stress'], 45],
              '#9A7B1C',
              '#064E3B'
            ],
            'fill-opacity': [
              'case',
              ['==', ['get', 'isClosed'], 1],
              0.80,
              ['>=', ['get', 'stress'], 70],
              0.65,
              0.40
            ]
          }
        });

        // Hexagon Wireframe Line Layer in Art Deco Metallic Gold
        map.addLayer({
          id: 'h3-hex-line',
          type: 'line',
          source: 'h3-grid',
          paint: {
            'line-color': '#D4AF37',
            'line-width': 1.2,
            'line-opacity': 0.70
          }
        });
      }

      // 2. Add Routes GeoJSON Source
      if (!map.getSource('pune-routes')) {
        map.addSource('pune-routes', {
          type: 'geojson',
          data: routesToGeoJson(activeRoutes)
        });

        // Outer glow for routes
        map.addLayer({
          id: 'routes-glow',
          type: 'line',
          source: 'pune-routes',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 12,
            'line-opacity': 0.45,
            'line-blur': 5
          }
        });

        // Core route lines
        map.addLayer({
          id: 'routes-line',
          type: 'line',
          source: 'pune-routes',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 4.5,
            'line-opacity': 0.95
          }
        });
      }

      // 3. Add Live Traffic Vehicle Particles Source & Layers
      if (!map.getSource('traffic-vehicles')) {
        map.addSource('traffic-vehicles', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });

        // Vehicle Glow Layer
        map.addLayer({
          id: 'traffic-vehicles-glow',
          type: 'circle',
          source: 'traffic-vehicles',
          paint: {
            'circle-radius': 11,
            'circle-color': ['get', 'color'],
            'circle-opacity': 0.55,
            'circle-blur': 0.85
          }
        });

        // Vehicle Core Layer
        map.addLayer({
          id: 'traffic-vehicles-core',
          type: 'circle',
          source: 'traffic-vehicles',
          paint: {
            'circle-radius': ['get', 'size'],
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 1.8,
            'circle-stroke-color': '#FFFFFF'
          }
        });
      }

      // Interactive Click on Hex Cell (works for both extrusion and fill)
      const handleCellClick = (e: any) => {
        if (!e.features || e.features.length === 0) return;
        const clickedFeature = e.features[0];
        const hexId = clickedFeature.properties?.id;
        if (hexId) {
          setSelectedCellId(hexId);
          addLog(`Sector Inspected: ${clickedFeature.properties?.name} (${hexId})`, 'info');
        }
      };

      map.on('click', 'h3-hex-extrusion', handleCellClick);
      map.on('click', 'h3-hex-fill', handleCellClick);

      map.on('mouseenter', 'h3-hex-extrusion', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'h3-hex-extrusion', () => {
        map.getCanvas().style.cursor = '';
      });

      setIsMapReady(true);
      setMapInstance(map);
    };

    map.on('load', onMapReady);

    map.on('error', (e: any) => {
      console.warn('MapLibre event error:', e?.error || e);
    });

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      chokepointMarkersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
      setIsMapReady(false);
    };
  }, [webGlSupported]);

  // Dynamic 3D HTML Markers for Demonstration Chokepoints
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    // Remove existing markers
    chokepointMarkersRef.current.forEach((m) => m.remove());
    chokepointMarkersRef.current = [];

    if (!isPlayingScenario || !currentStep?.chokepoints) return;

    currentStep.chokepoints.forEach((cp) => {
      const el = document.createElement('div');
      el.className = 'stratagrid-chokepoint-marker pointer-events-none select-none flex flex-col items-center';

      const isCritical = cp.status === 'critical';
      const isMitigated = cp.status === 'mitigated';
      const isRestricted = cp.status === 'restricted';

      const ringColor = isCritical ? 'border-[#EF4444]' : isMitigated ? 'border-[#10B981]' : isRestricted ? 'border-[#F59E0B]' : 'border-[#D4AF37]';
      const badgeBg = isCritical ? 'bg-[#1C0F0F]' : isMitigated ? 'bg-[#0E2015]' : isRestricted ? 'bg-[#261B0F]' : 'bg-[#141414]';
      const textColor = isCritical ? 'text-[#FCA5A5]' : isMitigated ? 'text-[#6EE7B7]' : isRestricted ? 'text-[#FDE68A]' : 'text-[#D4AF37]';
      const borderColor = isCritical ? 'border-[#EF4444]' : isMitigated ? 'border-[#10B981]' : isRestricted ? 'border-[#F59E0B]' : 'border-[#D4AF37]';

      el.innerHTML = `
        <div class="relative flex items-center justify-center mb-1">
          <div class="absolute w-8 h-8 rounded-full border-2 ${ringColor} animate-ping opacity-75"></div>
          <div class="w-3.5 h-3.5 ${isCritical ? 'bg-[#EF4444]' : isMitigated ? 'bg-[#10B981]' : 'bg-[#D4AF37]'} rotate-45 shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
        </div>
        <div class="${badgeBg} border-2 ${borderColor} px-2.5 py-1 text-center shadow-[0_0_20px_rgba(0,0,0,0.9)] min-w-[130px] backdrop-blur-md">
          <div class="text-[9px] font-bold font-display ${textColor} uppercase tracking-[0.15em] leading-tight">${cp.label}</div>
          <div class="text-[8px] font-body text-[#F2F0E4]/80 tracking-wide mt-0.5">${cp.sublabel}</div>
        </div>
      `;

      try {
        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat(cp.coords)
          .addTo(map);
        chokepointMarkersRef.current.push(marker);
      } catch (err) {
        console.debug('Marker add error:', err);
      }
    });
  }, [isPlayingScenario, currentStep, isMapReady]);

  // Continuous Traffic Particle Animation Engine (requestAnimationFrame)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    // Precalculate cumulative lengths for active corridor routes
    const routeLookup: Record<string, { path: [number, number][]; segments: number[]; total: number }> = {};
    for (const r of activeRoutes) {
      const { total, segments } = precalculateRouteLengths(r.pathCoords);
      routeLookup[r.id] = { path: r.pathCoords, segments, total };
    }

    // Seed fleet based on active scenario step or default
    const stepId = isPlayingScenario ? currentStep?.id || 1 : 1;
    particlesRef.current = createTrafficFleet(stepId, activeRoutes);

    let isDestroyed = false;

    const animateParticles = () => {
      if (isDestroyed) return;

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.progress = (p.progress + p.speed) % 1;
      }

      if (map && map.isStyleLoaded()) {
        const source = map.getSource('traffic-vehicles') as GeoJSONSource;
        if (source) {
          source.setData(particlesToGeoJson(particles, routeLookup));
        }
      }

      animFrameIdRef.current = requestAnimationFrame(animateParticles);
    };

    animFrameIdRef.current = requestAnimationFrame(animateParticles);

    return () => {
      isDestroyed = true;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [activeRoutes, isPlayingScenario, currentStep?.id, isMapReady]);

  // Handlers
  const handleToggleClosure = (hexId: string) => {
    setClosedCellIds((prev) => {
      const next = new Set(prev);
      if (next.has(hexId)) {
        next.delete(hexId);
        addLog(`Sector ${hexId} reopened for traffic routing.`, 'success');
      } else {
        next.add(hexId);
        addLog(`Sector ${hexId} closed for preventative maintenance diversion.`, 'alert');
      }
      return next;
    });
  };

  const handleApplyPreset = (preset: 'normal' | 'monsoon' | 'freight') => {
    switch (preset) {
      case 'normal':
        setRainfallMm(15);
        setTrafficMultiplier(100);
        setSelectedCorridor('hinjewadi_shivajinagar');
        setActiveRouteId('route-hinjewadi-selfish');
        setTimeOfDay('morning');
        addLog('Preset applied: Baseline Clear Morning.', 'info');
        break;
      case 'monsoon':
        setRainfallMm(80);
        setTrafficMultiplier(135);
        setSelectedCorridor('hinjewadi_shivajinagar');
        setActiveRouteId('route-hinjewadi-cooperative');
        setTimeOfDay('monsoon_noon');
        addLog('Preset applied: Severe Monsoon Cloudburst with cooperative rerouting.', 'warn');
        break;
      case 'freight':
        setRainfallMm(35);
        setTrafficMultiplier(125);
        setSelectedCorridor('pcmc_freight');
        setActiveRouteId('route-pcmc-cooperative');
        setTimeOfDay('evening_rush');
        addLog('Preset applied: PCMC Freight Surge with industrial bypass enforcement.', 'info');
        break;
    }
  };

  const handleResetSimulation = () => {
    setRainfallMm(20);
    setTrafficMultiplier(100);
    setClosedCellIds(new Set());
    setSelectedCellId(null);
    setSelectedCorridor('hinjewadi_shivajinagar');
    setActiveRouteId('route-hinjewadi-selfish');
    setTimeOfDay('morning');
    addLog('Simulation reset to baseline telemetry.', 'info');
  };

  const handleSelectRoute = (routeId: string) => {
    setActiveRouteId(routeId);
    const selected = PUNE_ROUTES.find((r) => r.id === routeId);
    if (selected) {
      addLog(`Corridor route switched: ${selected.name}`, selected.type === 'cooperative' ? 'success' : 'warn');
      if (mapRef.current && selected.pathCoords.length > 0) {
        const midPoint = selected.pathCoords[Math.floor(selected.pathCoords.length / 2)];
        mapRef.current.easeTo({
          center: midPoint as [number, number],
          zoom: 12.8,
          pitch: 54,
          duration: 1800
        });
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#0A0A0A] overflow-hidden select-none font-body">
      {/* Primary 3D MapLibre WebGL Canvas Container or 2.5D Digital Twin Fallback */}
      {webGlSupported ? (
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      ) : (
        <DigitalTwinFallback
          cells={cells}
          activeRouteId={activeRouteId}
          onSelectCell={(c) => setSelectedCellId(c.h3Index)}
          selectedCellId={selectedCellId}
        />
      )}

      {/* Top Telemetry Status Bar */}
      <StatusBar
        activeHexCount={cells.length}
        avgStress={avgStress}
        rainfallMm={rainfallMm}
        isPlayingScenario={isPlayingScenario}
        scenarioPhase={currentStep?.phase}
        onOpenTokenSettings={() => setIsTokenModalOpen(true)}
        hasToken={true}
      />

      {/* Auto-Play Demo Scenario Presentation Overlay */}
      {isPlayingScenario && currentStep && (
        <ScenarioOverlay
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          isPlaying={isPlayingScenario}
          isPaused={isScenarioPaused}
          progressPct={progressPct}
          speedMultiplier={speedMultiplier}
          onTogglePause={togglePause}
          onToggleSpeed={() => setSpeedMultiplier(speedMultiplier === 1 ? 1.5 : 1)}
          onNext={nextStep}
          onPrev={prevStep}
          onStop={stopScenario}
          onGoToStep={goToStep}
        />
      )}

      {/* Left Simulation Control Panel */}
      <ControlPanel
        rainfallMm={rainfallMm}
        onRainfallChange={setRainfallMm}
        trafficMultiplier={trafficMultiplier}
        onTrafficChange={setTrafficMultiplier}
        gridMode={gridMode}
        onGridModeChange={setGridMode}
        selectedCorridor={selectedCorridor}
        onCorridorChange={(corridor) => {
          setSelectedCorridor(corridor);
          const firstRoute = getRoutesForCorridor(corridor)[0];
          if (firstRoute) setActiveRouteId(firstRoute.id);
          addLog(`Corridor switched: ${corridor === 'hinjewadi_shivajinagar' ? 'Hinjewadi IT Commute' : 'PCMC Heavy Freight'}`, 'info');
        }}
        isPlayingScenario={isPlayingScenario}
        onToggleScenario={() => {
          if (isPlayingScenario) stopScenario();
          else startScenario();
        }}
        show3DBuildings={show3DBuildings}
        onToggle3DBuildings={() => setShow3DBuildings(!show3DBuildings)}
        onResetSimulation={handleResetSimulation}
        onApplyPreset={handleApplyPreset}
      />

      {/* Right H3 Cell Inspector (visible on hex click) */}
      <HexInspector
        cell={selectedCell}
        onClose={() => setSelectedCellId(null)}
        onToggleClosure={handleToggleClosure}
        onAskAiAboutCell={onAskAiAboutCell}
      />

      {/* Bottom Route Comparison Panel with Collapse Toggle */}
      <RouteCompare
        routes={activeRoutes}
        activeRouteId={activeRouteId}
        onSelectRoute={handleSelectRoute}
        corridorName={selectedCorridor === 'hinjewadi_shivajinagar' ? 'Hinjewadi ↔ Shivajinagar' : 'PCMC ↔ Hadapsar Freight'}
      />

      {/* Bottom-Left Simulated Kernel Telemetry Console */}
      <TerminalLog logs={logs} onClearLogs={() => setLogs([])} />

      {/* Free Engine Information Modal */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        currentToken=""
        onSaveToken={() => {
          setIsTokenModalOpen(false);
        }}
      />
    </div>
  );
};
