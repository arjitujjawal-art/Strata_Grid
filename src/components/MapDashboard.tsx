import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapboxToken } from '../config/env';
import { generatePuneH3Grid, cellsToGeoJson } from '../data/puneHexGrid';
import { PUNE_ROUTES, getRoutesForCorridor, routesToGeoJson } from '../data/puneRoutes';
import { DEMO_SCENARIO_STEPS } from '../data/demoScript';
import { PuneHexCell, GeoRouteOption, GridMode, TerminalLog as TerminalLogType, DemoScenarioStep } from '../types';
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

export const MapDashboard: React.FC<MapDashboardProps> = ({ onAskAiAboutCell }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Token management
  const [token, setToken] = useState<string>(() => getMapboxToken());
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
      message: 'StrataGrid Kernel initialized. Connecting to Pune Metropolitan telemetry mesh...'
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'success',
      message: 'H3 Resolution-8 spatial grid active: 320 hex cells mapped.'
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

    const source = map.getSource('h3-grid') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(cellsToGeoJson(cells));
    }
  }, [cells]);

  // Update Route Layer GeoJSON whenever corridor or activeRoute changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const source = map.getSource('pune-routes') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(routesToGeoJson(activeRoutes));
    }
  }, [activeRoutes]);

  // Toggle 3D Buildings visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('3d-buildings')) {
      map.setLayoutProperty('3d-buildings', 'visibility', show3DBuildings ? 'visible' : 'none');
    }
  }, [show3DBuildings]);

  // Initialize Mapbox Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!token) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [73.8050, 18.5650], // Pune Metro
      zoom: 11.8,
      pitch: 52,
      bearing: -15,
      antialias: true
    });

    mapRef.current = map;

    map.on('load', () => {
      applyMapboxAtmosphere(map, 'morning');

      // Add 3D Terrain DEM source if supported
      try {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        });
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.15 });
      } catch (err) {
        console.debug('Terrain source could not be added:', err);
      }

      // Add 3D Building Extrusions from Mapbox vector tiles
      const layers = map.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      try {
        map.addLayer(
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 12.5,
            paint: {
              'fill-extrusion-color': '#0f172a',
              'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                13,
                0,
                14.5,
                ['get', 'height']
              ],
              'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                13,
                0,
                14.5,
                ['get', 'min_height']
              ],
              'fill-extrusion-opacity': 0.6
            }
          },
          labelLayerId
        );
      } catch (err) {
        console.debug('3D buildings layer error:', err);
      }

      // Add H3 Hexagonal Grid GeoJSON Source
      map.addSource('h3-grid', {
        type: 'geojson',
        data: cellsToGeoJson(cells)
      });

      // Fill Layer for Hexagons
      map.addLayer({
        id: 'h3-hex-fill',
        type: 'fill',
        source: 'h3-grid',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'isClosed'], 1],
            '#991b1b', // Red-800 for closed
            ['>=', ['get', 'stress'], 86],
            '#ef4444', // Red-500
            ['>=', ['get', 'stress'], 70],
            '#f97316', // Orange-500
            ['>=', ['get', 'stress'], 45],
            '#f59e0b', // Amber-500
            '#10b981' // Emerald-500
          ],
          'fill-opacity': [
            'case',
            ['==', ['get', 'isClosed'], 1],
            0.75,
            ['>=', ['get', 'stress'], 70],
            0.55,
            0.32
          ]
        }
      });

      // Hexagon Wireframe Line Layer
      map.addLayer({
        id: 'h3-hex-line',
        type: 'line',
        source: 'h3-grid',
        paint: {
          'line-color': [
            'case',
            ['>=', ['get', 'stress'], 75],
            '#fda4af',
            '#06b6d4'
          ],
          'line-width': 1.2,
          'line-opacity': 0.7
        }
      });

      // Add Routes GeoJSON Source
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
          'line-opacity': 0.35,
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

      // Interactive Click on Hex Cell
      map.on('click', 'h3-hex-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const clickedFeature = e.features[0];
        const hexId = clickedFeature.properties?.id;
        if (hexId) {
          setSelectedCellId(hexId);
          addLog(`Selected H3 Cell: ${clickedFeature.properties?.name} (${hexId})`, 'info');
        }
      });

      // Cursor pointer on hover
      map.on('mouseenter', 'h3-hex-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'h3-hex-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [token]);

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
    addLog('Simulation reset to factory baseline telemetry.', 'info');
  };

  const handleSelectRoute = (routeId: string) => {
    setActiveRouteId(routeId);
    const selected = PUNE_ROUTES.find((r) => r.id === routeId);
    if (selected) {
      addLog(`Active corridor route switched to: ${selected.name}`, selected.type === 'cooperative' ? 'success' : 'warn');
      if (mapRef.current && selected.pathCoords.length > 0) {
        const midPoint = selected.pathCoords[Math.floor(selected.pathCoords.length / 2)];
        mapRef.current.easeTo({
          center: midPoint,
          zoom: 12.8,
          pitch: 54,
          duration: 1800
        });
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden select-none">
      {/* 3D Mapbox Map Canvas Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Fallback View when Token is missing */}
      {!token && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl text-white text-center">
          <div className="max-w-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold font-mono">Mapbox 3D Engine Ready</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              To render the interactive 3D terrain, building extrusions, and live H3 hex spatial mesh over Pune,
              please provide your free Mapbox public token.
            </p>
            <button
              onClick={() => setIsTokenModalOpen(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
            >
              Configure Mapbox Token
            </button>
          </div>
        </div>
      )}

      {/* Top Telemetry Status Bar */}
      <StatusBar
        activeHexCount={cells.length}
        avgStress={avgStress}
        rainfallMm={rainfallMm}
        isPlayingScenario={isPlayingScenario}
        scenarioPhase={currentStep?.phase}
        onOpenTokenSettings={() => setIsTokenModalOpen(true)}
        hasToken={Boolean(token)}
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

      {/* Bottom Route Comparison Panel */}
      <RouteCompare
        routes={activeRoutes}
        activeRouteId={activeRouteId}
        onSelectRoute={handleSelectRoute}
        corridorName={selectedCorridor === 'hinjewadi_shivajinagar' ? 'Hinjewadi ↔ Shivajinagar' : 'PCMC ↔ Hadapsar Freight'}
      />

      {/* Bottom-Left Simulated Kernel Telemetry Console */}
      <TerminalLog logs={logs} onClearLogs={() => setLogs([])} />

      {/* Token Modal */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        currentToken={token}
        onSaveToken={(newToken) => {
          setToken(newToken);
          addLog('Mapbox access token updated. Reloading 3D engine.', 'success');
        }}
      />
    </div>
  );
};
