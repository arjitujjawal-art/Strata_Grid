import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
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
import { useDemoScenario } from '../hooks/useDemoScenario';
import { applyMapboxAtmosphere, TimeOfDay } from '../hooks/useTimeOfDay';

interface MapDashboardProps {
  onAskAiAboutCell?: (cell: PuneHexCell) => void;
}

// 100% Free & Open Vector Dark Style (CartoDB Dark Matter GL Style - Zero API Key Required)
const PUNE_DARK_GL_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// Offline/Emergency Fallback Raster Dark Style
const CARTO_DARK_RASTER_FALLBACK: any = {
  version: 8,
  name: 'CartoDB Dark Matter Raster',
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
    currentStepIndex,
    currentStep,
    totalSteps,
    startScenario,
    stopScenario,
    nextStep,
    prevStep,
    goToStep
  } = useDemoScenario({
    map: mapRef.current,
    onStepChange: handleScenarioStepChange
  });

  // Apply atmosphere whenever timeOfDay changes
  useEffect(() => {
    if (mapRef.current) {
      applyMapboxAtmosphere(mapRef.current, timeOfDay);
    }
  }, [timeOfDay]);

  // Update H3 Layer GeoJSON whenever cells change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('h3-grid') as GeoJSONSource;
    if (source) {
      source.setData(cellsToGeoJson(cells));
    }
  }, [cells]);

  // Update Route Layer GeoJSON whenever corridor or activeRoute changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('pune-routes') as GeoJSONSource;
    if (source) {
      source.setData(routesToGeoJson(activeRoutes));
    }
  }, [activeRoutes]);

  // Initialize MapLibre GL 3D Map (100% Free, No Token Needed)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: PUNE_DARK_GL_STYLE,
      center: [73.8050, 18.5650], // Pune Metro (Hinjewadi - Wakad - Shivajinagar)
      zoom: 11.8,
      pitch: 52, // 3D Isometric View
      bearing: -15
    });

    mapRef.current = map;

    // Add navigation controls (zoom & 3D pitch/bearing compass)
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');

    const onMapReady = () => {
      // Add H3 Hexagonal Grid GeoJSON Source
      if (!map.getSource('h3-grid')) {
        map.addSource('h3-grid', {
          type: 'geojson',
          data: cellsToGeoJson(cells)
        });

        // Fill Layer for Hexagons with Art Deco Gatsby Palette
        map.addLayer({
          id: 'h3-hex-fill',
          type: 'fill',
          source: 'h3-grid',
          paint: {
            'fill-color': [
              'case',
              ['==', ['get', 'isClosed'], 1],
              '#7F1D1D', // Dark Crimson for closed
              ['>=', ['get', 'stress'], 86],
              '#991B1B', // Ruby Red
              ['>=', ['get', 'stress'], 70],
              '#C2410C', // Bronze Saffron
              ['>=', ['get', 'stress'], 45],
              '#9A7B1C', // Antique Gold
              '#064E3B'  // Deep Emerald
            ],
            'fill-opacity': [
              'case',
              ['==', ['get', 'isClosed'], 1],
              0.80,
              ['>=', ['get', 'stress'], 70],
              0.60,
              0.38
            ]
          }
        });

        // Hexagon Wireframe Line Layer in Metallic Gold
        map.addLayer({
          id: 'h3-hex-line',
          type: 'line',
          source: 'h3-grid',
          paint: {
            'line-color': '#D4AF37', // Art Deco Metallic Gold
            'line-width': 1.2,
            'line-opacity': 0.70
          }
        });
      }

      // Add Routes GeoJSON Source
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
            'line-width': 10,
            'line-opacity': 0.40,
            'line-blur': 4
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

      // Interactive Click on Hex Cell
      map.on('click', 'h3-hex-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const clickedFeature = e.features[0];
        const hexId = clickedFeature.properties?.id;
        if (hexId) {
          setSelectedCellId(hexId);
          addLog(`Inspected Cell: ${clickedFeature.properties?.name} (${hexId})`, 'info');
        }
      });

      // Cursor pointer on hover
      map.on('mouseenter', 'h3-hex-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'h3-hex-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    };

    map.on('load', onMapReady);

    // If Carto GL vector style encounters any network hiccup, fallback to raster tiles
    map.on('error', (e: any) => {
      if (e?.error?.message?.includes('style') || e?.status === 404 || e?.status === 403) {
        console.warn('Vector basemap encountered an issue. Falling back to Carto Dark raster basemap.');
        try {
          map.setStyle(CARTO_DARK_RASTER_FALLBACK);
        } catch {
          // ignore
        }
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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
      {/* 3D MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Top Telemetry Status Bar - Positioned cleanly under the Navbar */}
      <StatusBar
        activeHexCount={cells.length}
        avgStress={avgStress}
        rainfallMm={rainfallMm}
        isPlayingScenario={isPlayingScenario}
        scenarioPhase={currentStep?.phase}
        onOpenTokenSettings={() => setIsTokenModalOpen(true)}
        hasToken={true}
      />

      {/* Auto-Play Demo Scenario Narrative Overlay */}
      {isPlayingScenario && currentStep && (
        <ScenarioOverlay
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          isPlaying={isPlayingScenario}
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
