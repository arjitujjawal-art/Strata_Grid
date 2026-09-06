import React, { useState, useMemo, useEffect } from 'react';
import { HexCell, GridMode, RouteOption } from '../types';
import { INITIAL_HEX_CELLS, MOCK_ROUTES, INITIAL_TERMINAL_LOGS } from '../data/mockData';
import { HexGridCanvas } from './HexGridCanvas';
import { Tooltip } from './Tooltip';
import { 
  CloudRain, 
  Car, 
  Sliders, 
  ShieldAlert, 
  RefreshCw, 
  Zap, 
  Navigation, 
  Truck, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  TrendingDown, 
  DollarSign, 
  Info,
  Ban,
  ArrowRight,
  Gauge,
  Radio,
  Play,
  Pause,
  HelpCircle,
  Map as MapIcon
} from 'lucide-react';

export const DemoDashboard: React.FC = () => {
  const [cells, setCells] = useState<HexCell[]>(INITIAL_HEX_CELLS);
  const [selectedCell, setSelectedCell] = useState<HexCell | null>(INITIAL_HEX_CELLS[10]); // Sector 7G Flyover
  const [rainfallIntensity, setRainfallIntensity] = useState<number>(45); // 0-100 mm
  const [trafficVolumePct, setTrafficVolumePct] = useState<number>(100); // 50-150%
  const [closedCellIds, setClosedCellIds] = useState<string[]>([]);
  const [mode, setMode] = useState<GridMode>('city');
  const [selectedDriverRouteId, setSelectedDriverRouteId] = useState<string>('route-b');
  const [logs, setLogs] = useState(INITIAL_TERMINAL_LOGS);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [livePacketCount, setLivePacketCount] = useState<number>(428190);

  // Periodic live telemetry simulation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setLivePacketCount(prev => prev + Math.floor(Math.random() * 45) + 10);

      // 20% chance to generate a random live event
      if (Math.random() < 0.25) {
        const events = [
          'ULTRASONIC_SENSOR: Micro-vibration variance detected on Harbor Expressway (+3.2Hz).',
          'WEATHER_RADAR: Precipitation front moving northeast; updating sub-surface moisture vectors.',
          'ALGO_DISPATCH: Rerouting 48 freight carriers from Sector 11 to avoid joint resonance.',
          'DYNAMIC_GATING: Synchronized traffic lights on Civic Arterial to smooth acceleration cycles.',
          'INSPECTION_DRONE: LiDAR point cloud ingested for North Skyway — deck surface nominal.'
        ];
        const randomMsg = events[Math.floor(Math.random() * events.length)];
        addLog(randomMsg, 'info');
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Active route coordinates for Driver or Fleet mode
  const activeRouteHexIds = useMemo(() => {
    if (mode === 'driver') {
      const activeRoute = MOCK_ROUTES.driver.find(r => r.id === selectedDriverRouteId);
      return activeRoute ? activeRoute.pathHexIds : [];
    }
    if (mode === 'fleet') {
      return ['HEX-06', 'HEX-07', 'HEX-14', 'HEX-20', 'HEX-34', 'HEX-41'];
    }
    return [];
  }, [mode, selectedDriverRouteId]);

  // Dynamic calculated stress for the selected cell
  const selectedCellCalculatedStress = useMemo(() => {
    if (!selectedCell) return 0;
    if (closedCellIds.includes(selectedCell.id)) return 0;

    const isNeighborOfClosed = closedCellIds.some(closedId => {
      const closed = cells.find(c => c.id === closedId);
      if (!closed) return false;
      const dq = Math.abs(selectedCell.q - closed.q);
      const dr = Math.abs(selectedCell.r - closed.r);
      return (dq <= 1 && dr <= 1);
    });

    const rainFactor = 1 + rainfallIntensity / 200;
    const trafficFactor = trafficVolumePct / 100;
    const spillover = isNeighborOfClosed ? 1.32 : 1.0;

    return Math.min(100, Math.max(5, Math.round(selectedCell.baseStress * rainFactor * trafficFactor * spillover)));
  }, [selectedCell, rainfallIntensity, trafficVolumePct, closedCellIds, cells]);

  // Aggregate Network Statistics for City Mode
  const networkStats = useMemo(() => {
    let totalStress = 0;
    let criticalCount = 0;
    let severeCount = 0;
    let totalVehicles = 0;

    cells.forEach(cell => {
      if (closedCellIds.includes(cell.id)) return;
      const isNeighborOfClosed = closedCellIds.some(closedId => {
        const closed = cells.find(c => c.id === closedId);
        if (!closed) return false;
        return Math.abs(cell.q - closed.q) <= 1 && Math.abs(cell.r - closed.r) <= 1;
      });

      const rainFactor = 1 + rainfallIntensity / 200;
      const trafficFactor = trafficVolumePct / 100;
      const spillover = isNeighborOfClosed ? 1.32 : 1.0;
      const stress = Math.min(100, Math.max(5, Math.round(cell.baseStress * rainFactor * trafficFactor * spillover)));

      totalStress += stress;
      totalVehicles += Math.round(cell.trafficVolume * (trafficVolumePct / 100));
      if (stress >= 86) criticalCount++;
      else if (stress >= 71) severeCount++;
    });

    const activeCount = cells.length - closedCellIds.length;
    const avgStress = activeCount > 0 ? Math.round(totalStress / activeCount) : 0;
    const routesDiverted = Math.round(1432 * (trafficVolumePct / 100) * (1 + rainfallIntensity / 150) + closedCellIds.length * 480);
    const savingsMillion = (3.8 + (routesDiverted / 1000) * 0.45).toFixed(2);

    return {
      avgStress,
      criticalCount,
      severeCount,
      totalVehicles,
      routesDiverted,
      savingsMillion
    };
  }, [cells, rainfallIntensity, trafficVolumePct, closedCellIds]);

  // Toggle Road Closure simulation for a cell
  const toggleClosure = (cellId: string) => {
    const targetCell = cells.find(c => c.id === cellId);
    if (!targetCell) return;

    if (closedCellIds.includes(cellId)) {
      setClosedCellIds(prev => prev.filter(id => id !== cellId));
      addLog(`REOPENED: Sector ${targetCell.id} (${targetCell.name}) restored to active network flow.`, 'info');
    } else {
      setClosedCellIds(prev => [...prev, cellId]);
      addLog(`ROAD CLOSURE SIMULATION: Sector ${targetCell.id} closed. Traffic redistributing to adjacent H3 sectors.`, 'warn');
    }
  };

  // Add terminal log helper
  const addLog = (message: string, level: 'info' | 'warn' | 'success' | 'alert') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs(prev => [
      { id: `log-${Date.now()}`, timestamp: timeStr, level, message },
      ...prev.slice(0, 7)
    ]);
  };

  // Preset scenarios
  const applyPreset = (preset: 'monsoon' | 'rush_hour' | 'bridge_closure' | 'reset') => {
    if (preset === 'monsoon') {
      setRainfallIntensity(85);
      setTrafficVolumePct(90);
      addLog('PRESET APPLIED: Heavy Monsoon Storm (85mm/h precipitation). Flood vulnerability matrix active.', 'alert');
    } else if (preset === 'rush_hour') {
      setRainfallIntensity(10);
      setTrafficVolumePct(145);
      addLog('PRESET APPLIED: Peak Freight Rush Hour (145% traffic volume). Adaptive load balancing enabled.', 'warn');
    } else if (preset === 'bridge_closure') {
      setClosedCellIds(['HEX-11', 'HEX-17']);
      addLog('PRESET APPLIED: Sector 7G Flyover & Grand Ave Overpass closed for emergency structural relief.', 'alert');
    } else {
      setRainfallIntensity(45);
      setTrafficVolumePct(100);
      setClosedCellIds([]);
      addLog('PRESET APPLIED: Telemetry system baseline reset to normal operating conditions.', 'success');
    }
  };

  // Determine recommendation text for cell
  const getRecommendation = (stress: number, isClosed: boolean, heavyPct: number) => {
    if (isClosed) return 'Emergency Road Closure Active — All traffic rerouted through peripheral green H3 sectors.';
    if (stress >= 86) {
      if (heavyPct > 40) return 'Immediate Action: Divert Class 7-8 heavy freight (>15T) to East Industrial Bypass.';
      return 'Critical Stress: Enforce cooperative speed damping and dynamic signal gating to protect road base.';
    }
    if (stress >= 71) {
      return 'Severe Wear Warning: Shift non-essential passenger vehicles to Route B corridor.';
    }
    if (stress >= 41) {
      return 'Elevated Load: Continuous ultrasonic sensor monitoring; normal traffic throttling active.';
    }
    return 'Optimal Network State: Routine telemetry monitoring. No rerouting needed.';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6" id="live-demo">
      {/* Bento Top Header & 3-Way Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-[#161b22] rounded-2xl border border-slate-700 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="font-mono text-xs text-teal-400 uppercase tracking-widest font-bold">
              Real-Time H3 Digital Twin Grid
            </span>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              STREAM: {isLiveStreaming ? 'ACTIVE' : 'PAUSED'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
            Infrastructure Telemetry & Dynamic Rerouting Command
          </h2>
        </div>

        {/* Mode Toggle & Live Simulation Control */}
        <div className="flex flex-wrap items-center gap-3">
          <Tooltip
            title="Live Stream Simulation"
            badge={isLiveStreaming ? 'Live' : 'Paused'}
            badgeColor={isLiveStreaming ? 'teal' : 'slate'}
            position="bottom"
            content="Controls the simulated streaming data packets, ultrasonic sensor readings, and real-time stress jitter across the 49 H3 spatial sectors."
          >
            <button
              onClick={() => {
                setIsLiveStreaming(!isLiveStreaming);
                addLog(isLiveStreaming ? 'SIMULATION PAUSED: Live telemetry stream frozen.' : 'SIMULATION RESUMED: Real-time sensor stream active.', 'info');
              }}
              className={`p-2 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 ${
                isLiveStreaming 
                  ? 'bg-teal-500/10 text-teal-400 border-teal-500/30 hover:bg-teal-500/20' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {isLiveStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline">{isLiveStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
            </button>
          </Tooltip>

          {/* 3-Way Mode Toggle with Interactive Tooltips */}
          <div className="inline-flex p-1.5 bg-[#0d1117] rounded-xl border border-slate-700">
            <Tooltip
              title="Driver Mode"
              badge="Cooperative GPS"
              badgeColor="teal"
              position="bottom"
              content="Evaluates personal commute routes, comparing 'Selfish Fast' paths that accelerate asphalt damage against 'StrataGrid Cooperative' routes that preserve road longevity for a nominal +2 min."
            >
              <button
                onClick={() => { setMode('driver'); addLog('MODE SWITCH: Driver Mode activated — route comparison ready.', 'info'); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                  mode === 'driver'
                    ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" /> Driver
              </button>
            </Tooltip>

            <Tooltip
              title="Fleet Logistics Mode"
              badge="Axle Weight"
              badgeColor="amber"
              position="bottom"
              content="Monitors heavy freight vehicles (Class 7-8, >15 Tons). Calculates Equivalent Single Axle Loads (ESAL) and enforces bypass routing around bridge joints with high moisture or micro-fractures."
            >
              <button
                onClick={() => { setMode('fleet'); addLog('MODE SWITCH: Fleet Logistics Mode activated — heavy axle monitoring.', 'info'); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                  mode === 'fleet'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Truck className="w-3.5 h-3.5" /> Fleet
              </button>
            </Tooltip>

            <Tooltip
              title="City Command Mode"
              badge="Municipal"
              badgeColor="teal"
              position="bottom"
              content="City-wide holistic resilience dashboard. Aggregates all 49 H3 cells, computes total network stress averages, predicts critical failure bottlenecks, and tracks estimated maintenance dollars saved."
            >
              <button
                onClick={() => { setMode('city'); addLog('MODE SWITCH: City Command Mode activated — aggregate resilience view.', 'info'); }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                  mode === 'city'
                    ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> City
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Main Command Center: Interactive H3 Digital Twin Grid Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Hex Map Canvas Bento (8 cols) */}
          <div className="lg:col-span-8 bg-[#161b22] rounded-2xl p-4 sm:p-6 border border-slate-700 flex flex-col gap-5 shadow-2xl relative overflow-hidden">
          {/* Controls Bar above map */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl bg-[#0d1117] border border-slate-800">
            {/* Rainfall Slider with Rich Tooltip */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Tooltip
                  title="Rainfall Intensity"
                  badge="Moisture Index"
                  badgeColor="teal"
                  position="top"
                  content="Precipitation weakens sub-surface asphalt aggregate bonds. Higher rainfall increases the vulnerability multiplier across all low-lying and port sectors."
                >
                  <span className="flex items-center gap-1.5 font-mono text-xs text-slate-300 cursor-help hover:text-teal-400 transition-colors">
                    <CloudRain className="w-3.5 h-3.5 text-teal-400" /> Rainfall Intensity
                    <HelpCircle className="w-3 h-3 text-slate-500" />
                  </span>
                </Tooltip>
                <span className="font-mono text-xs font-bold text-teal-400">
                  {rainfallIntensity} mm/h
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rainfallIntensity}
                onChange={(e) => setRainfallIntensity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0mm (Dry)</span>
                <span>50mm (Heavy)</span>
                <span>100mm (Monsoon)</span>
              </div>
            </div>

            {/* Traffic Volume Slider with Rich Tooltip */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Tooltip
                  title="Traffic Volume Multiplier"
                  badge="Load Stress"
                  badgeColor="amber"
                  position="top"
                  content="Controls the gross vehicle load applied across the 49-cell network. Higher traffic accelerates fatigue cycling and compounds wear on already weakened sectors."
                >
                  <span className="flex items-center gap-1.5 font-mono text-xs text-slate-300 cursor-help hover:text-amber-400 transition-colors">
                    <Car className="w-3.5 h-3.5 text-amber-400" /> Traffic Volume
                    <HelpCircle className="w-3 h-3 text-slate-500" />
                  </span>
                </Tooltip>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {trafficVolumePct}% ({trafficVolumePct > 120 ? 'Peak' : trafficVolumePct > 85 ? 'Normal' : 'Light'})
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={trafficVolumePct}
                onChange={(e) => setTrafficVolumePct(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>50% (Night)</span>
                <span>100% (Baseline)</span>
                <span>150% (Gridlock)</span>
              </div>
            </div>

            {/* Road Closure Selector & Quick Action with Tooltip */}
            <div className="flex flex-col justify-between">
              <Tooltip
                title="Simulate Road Closure"
                badge="Spillover Test"
                badgeColor="rose"
                position="top"
                content="Closing a sector simulates physical blockage or emergency maintenance. Watch StrataGrid dynamically propagate traffic spillover to adjacent hexagonal cells."
              >
                <span className="font-mono text-xs text-slate-300 mb-1.5 flex items-center gap-1.5 cursor-help hover:text-rose-400 transition-colors">
                  <Ban className="w-3.5 h-3.5 text-rose-400" /> Simulate Road Closure
                  <HelpCircle className="w-3 h-3 text-slate-500" />
                </span>
              </Tooltip>
              <select
                value={closedCellIds[0] || ''}
                onChange={(e) => {
                  if (e.target.value) {
                    toggleClosure(e.target.value);
                  }
                }}
                className="w-full bg-[#161b22] border border-slate-700 text-xs font-mono text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-teal-400"
              >
                <option value="">-- Select Sector to Close --</option>
                {cells.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.name} {closedCellIds.includes(c.id) ? '(CLOSED)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Simulation Preset Bar with Tooltips */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider mr-1">Presets:</span>
            
            <Tooltip
              title="Monsoon Surge Scenario"
              badge="Rain: 85mm/h"
              badgeColor="teal"
              position="top"
              content="Simulates a sudden high-intensity tropical storm with waterlogging vulnerability across low-elevation sectors."
            >
              <button
                onClick={() => applyPreset('monsoon')}
                className="px-2.5 py-1 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 transition-colors flex items-center gap-1"
              >
                <CloudRain className="w-3 h-3" /> Monsoon Surge
              </button>
            </Tooltip>

            <Tooltip
              title="Heavy Freight Rush Scenario"
              badge="Traffic: 145%"
              badgeColor="amber"
              position="top"
              content="Simulates peak logistics port discharge with 145% traffic volume and 50%+ heavy cargo vehicles."
            >
              <button
                onClick={() => applyPreset('rush_hour')}
                className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1"
              >
                <Zap className="w-3 h-3" /> Freight Rush
              </button>
            </Tooltip>

            <Tooltip
              title="Sector 7G Emergency Closure"
              badge="Structural Relief"
              badgeColor="rose"
              position="top"
              content="Instantly closes Sector 7G Flyover and Grand Ave Overpass to observe algorithmic traffic redistribution."
            >
              <button
                onClick={() => applyPreset('bridge_closure')}
                className="px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors flex items-center gap-1"
              >
                <Ban className="w-3 h-3" /> Close Sector 7G
              </button>
            </Tooltip>

            <Tooltip
              title="Reset Grid Telemetry"
              badge="Nominal"
              badgeColor="slate"
              position="top"
              content="Restores all road closures, resets rainfall to 45mm/h, and recalibrates baseline traffic volumes."
            >
              <button
                onClick={() => applyPreset('reset')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 ml-auto"
              >
                <RefreshCw className="w-3 h-3" /> Reset Grid
              </button>
            </Tooltip>
          </div>

          {/* Hex Map Area */}
          <div className="relative w-full min-h-[460px] bg-[#0d1117] rounded-xl border border-slate-800 p-2 overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
            <HexGridCanvas
              cells={cells}
              selectedCellId={selectedCell?.id || null}
              onSelectCell={(cell) => {
                setSelectedCell(cell);
                addLog(`INSPECTION: Selected ${cell.id} (${cell.name}) for real-time telemetry analysis.`, 'info');
              }}
              rainfallIntensity={rainfallIntensity}
              trafficMultiplier={trafficVolumePct}
              closedCellIds={closedCellIds}
              mode={mode}
              activeRouteHexIds={activeRouteHexIds}
              onToggleClosure={toggleClosure}
              isLiveStreaming={isLiveStreaming}
            />
          </div>

          {/* Terminal Console Stream Bento */}
          <div className="p-3.5 bg-[#0d1117] rounded-xl border border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="flex items-center gap-2 text-slate-400 uppercase text-[11px] tracking-wider font-bold">
                <Terminal className="w-3.5 h-3.5 text-teal-400" /> StrataGrid AI Kernel Stream
              </span>
              <span className="text-[10px] text-teal-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
                {livePacketCount.toLocaleString()} Telemetry Packets
              </span>
            </div>
            <div className="space-y-1.5 max-h-24 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 text-[11px] leading-tight">
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <span
                    className={
                      log.level === 'alert'
                        ? 'text-rose-400 font-semibold'
                        : log.level === 'warn'
                        ? 'text-amber-400'
                        : log.level === 'success'
                        ? 'text-emerald-400'
                        : 'text-teal-400'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mode-Aware Telemetry & Sector Inspection Panel (4 cols Bento) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Mode-Specific Content Card */}
          {mode === 'driver' && (
            <div className="bg-[#161b22] p-5 rounded-2xl border border-teal-500/40 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-teal-400" />
                  <h3 className="font-headline font-bold text-white text-base">Driver Route Comparison</h3>
                </div>
                <span className="font-mono text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded border border-teal-500/30">
                  Cooperative GPS
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Standard navigation apps overload the same road. StrataGrid offers balanced alternatives that preserve asphalt longevity while keeping your commute fast.
              </p>

              {/* Route A Card */}
              <Tooltip
                title="Route A (Conventional)"
                badge="High Wear"
                badgeColor="rose"
                position="left"
                content="Standard shortest-path algorithm funneling commuters directly across the fragile Sector 7G Flyover."
              >
                <div
                  onClick={() => setSelectedDriverRouteId('route-a')}
                  className={`w-full p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedDriverRouteId === 'route-a'
                      ? 'bg-rose-500/10 border-rose-500/50 shadow-lg shadow-rose-500/10'
                      : 'bg-[#0d1117] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-headline font-semibold text-white text-sm">Route A (Conventional GPS)</h4>
                      <span className="font-mono text-[11px] text-rose-400">Overloads Sector 7G Flyover</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">14 min</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-3 pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400">Road Stress: </span>
                      <span className="text-rose-400 font-bold">89% (Critical)</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Impact: </span>
                      <span className="text-rose-300">Fast Wear</span>
                    </div>
                  </div>
                </div>
              </Tooltip>

              {/* Route B Card (Recommended) */}
              <Tooltip
                title="Route B (StrataGrid Recommended)"
                badge="Eco-Protect"
                badgeColor="teal"
                position="left"
                content="Balances vehicle load onto Civic District bypass (+2 min), reducing asphalt fatigue by 42%."
              >
                <div
                  onClick={() => setSelectedDriverRouteId('route-b')}
                  className={`w-full p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedDriverRouteId === 'route-b'
                      ? 'bg-teal-500/10 border-teal-400 shadow-lg shadow-teal-500/20'
                      : 'bg-[#0d1117] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-headline font-bold text-white text-sm">Route B (StrataGrid Cooperative)</h4>
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-teal-500 text-slate-900 font-mono">
                          RECOMMENDED
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-teal-400">Civic District Bypass</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">16 min</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mb-2">
                    Only +2 minutes longer, but prevents 42% road fatigue by distributing traffic across resilient roads.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-teal-500/20">
                    <div>
                      <span className="text-slate-400">Road Stress: </span>
                      <span className="text-emerald-400 font-bold">28% (Optimal)</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Infrastructure: </span>
                      <span className="text-teal-400 font-bold">Protected</span>
                    </div>
                  </div>
                </div>
              </Tooltip>
            </div>
          )}

          {mode === 'fleet' && (
            <div className="bg-[#161b22] p-5 rounded-2xl border border-amber-500/40 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <h3 className="font-headline font-bold text-white text-base">Fleet & Freight Telemetry</h3>
                </div>
                <span className="font-mono text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  Active Carrier Unit
                </span>
              </div>

              <div className="p-3.5 bg-[#0d1117] rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Vehicle ID:</span>
                  <span className="text-white font-bold">FREIGHT-TX94 (Volvo FH16)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Weight Class:</span>
                  <span className="text-amber-300 font-bold">Class 8 (38.5 Metric Tons)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Axle Stress Multiplier:</span>
                  <span className="text-rose-400 font-bold">4.2 ESAL Equivalent</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Bridge Resonance:</span>
                  <span className="text-emerald-400 font-bold">Compliant</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                <div className="flex items-center gap-2 font-headline font-semibold text-amber-300 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-400" /> Red-Zone Restrictions Active
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Vehicles &gt;15T are automatically restricted from Sector 7G Flyover due to elevated micro-vibrations and sub-surface moisture. Rerouting via Port Logistics Arterial.
                </p>
              </div>

              <button
                onClick={() => addLog('FLEET DISPATCH: Optimized alternate freight corridor transmitted to 42 active trucks.', 'success')}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Enforce Freight Bypass
              </button>
            </div>
          )}

          {mode === 'city' && (
            <div className="bg-[#161b22] p-5 rounded-2xl border border-slate-700 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-400" />
                  <h3 className="font-headline font-bold text-white text-base">City-Wide Resilience Metrics</h3>
                </div>
                <span className="font-mono text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded border border-teal-500/30">
                  Municipal Overview
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#0d1117] rounded-xl border border-slate-800">
                  <div className="font-mono text-[10px] text-slate-400 uppercase mb-1">Network Stress Avg</div>
                  <div className={`text-2xl font-mono font-bold ${
                    networkStats.avgStress > 70 ? 'text-rose-400' : networkStats.avgStress > 40 ? 'text-amber-400' : 'text-teal-400'
                  }`}>
                    {networkStats.avgStress}%
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">49 Grid Sectors</div>
                </div>

                <div className="p-3.5 bg-[#0d1117] rounded-xl border border-slate-800">
                  <div className="font-mono text-[10px] text-slate-400 uppercase mb-1">Critical Bottlenecks</div>
                  <div className="text-2xl font-mono font-bold text-rose-400">
                    {networkStats.criticalCount} <span className="text-xs text-slate-400 font-normal">cells</span>
                  </div>
                  <div className="text-[10px] font-mono text-amber-400 mt-1">+{networkStats.severeCount} elevated</div>
                </div>

                <div className="p-3.5 bg-[#0d1117] rounded-xl border border-slate-800">
                  <div className="font-mono text-[10px] text-slate-400 uppercase mb-1">Routes Diverted</div>
                  <div className="text-2xl font-mono font-bold text-white">
                    {networkStats.routesDiverted.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono text-teal-400 mt-1">Real-time balance</div>
                </div>

                <div className="p-3.5 bg-[#0d1117] rounded-xl border border-slate-800">
                  <div className="font-mono text-[10px] text-slate-400 uppercase mb-1">Est. Repairs Saved</div>
                  <div className="text-2xl font-mono font-bold text-emerald-400">
                    ${networkStats.savingsMillion}M
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">Annualized ROI</div>
                </div>
              </div>
            </div>
          )}

          {/* Selected Cell Live Telemetry Bento Card */}
          {selectedCell && (
            <div className="bg-[#161b22] p-5 rounded-2xl border border-slate-700 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-400">{selectedCell.id}</span>
                    <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 uppercase">
                      {selectedCell.roadType.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-headline font-bold text-white text-base mt-0.5">{selectedCell.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{selectedCell.district}</p>
                </div>

                <button
                  onClick={() => toggleClosure(selectedCell.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1 ${
                    closedCellIds.includes(selectedCell.id)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  {closedCellIds.includes(selectedCell.id) ? 'Reopen' : 'Simulate Close'}
                </button>
              </div>

              {/* Stress Gauge Bar */}
              <div>
                <div className="flex justify-between items-center mb-1.5 font-mono text-xs">
                  <span className="text-slate-300">Computed Stress Score:</span>
                  <span className={`font-bold text-sm ${
                    closedCellIds.includes(selectedCell.id)
                      ? 'text-slate-500'
                      : selectedCellCalculatedStress >= 86
                      ? 'text-rose-400'
                      : selectedCellCalculatedStress >= 71
                      ? 'text-orange-400'
                      : selectedCellCalculatedStress >= 41
                      ? 'text-amber-400'
                      : 'text-teal-400'
                  }`}>
                    {closedCellIds.includes(selectedCell.id) ? 'CLOSED / 0%' : `${selectedCellCalculatedStress} / 100`}
                  </span>
                </div>
                <div className="w-full bg-[#0d1117] h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      closedCellIds.includes(selectedCell.id)
                        ? 'w-0'
                        : selectedCellCalculatedStress >= 86
                        ? 'bg-gradient-to-r from-rose-500 to-red-600'
                        : selectedCellCalculatedStress >= 71
                        ? 'bg-gradient-to-r from-orange-400 to-rose-500'
                        : selectedCellCalculatedStress >= 41
                        ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                        : 'bg-gradient-to-r from-teal-400 to-emerald-400'
                    }`}
                    style={{ width: closedCellIds.includes(selectedCell.id) ? '0%' : `${selectedCellCalculatedStress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                <div className="p-2.5 bg-[#0d1117] rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Traffic Flow</span>
                  <span className="text-white font-semibold text-sm">
                    {Math.round(selectedCell.trafficVolume * (trafficVolumePct / 100))} <span className="text-[10px] text-slate-500">v/hr</span>
                  </span>
                </div>

                <div className="p-2.5 bg-[#0d1117] rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Heavy Vehicles</span>
                  <span className="text-amber-400 font-semibold text-sm">
                    {selectedCell.heavyVehiclePct}% <span className="text-[10px] text-slate-500">(Freight)</span>
                  </span>
                </div>

                <div className="p-2.5 bg-[#0d1117] rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Flood Probability</span>
                  <span className="text-cyan-400 font-semibold text-sm">
                    {Math.min(100, Math.round(selectedCell.floodVulnerability * (1 + rainfallIntensity / 100)))}%
                  </span>
                </div>

                <div className="p-2.5 bg-[#0d1117] rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Pothole Risk</span>
                  <span className={`font-semibold text-sm ${
                    selectedCellCalculatedStress > 80 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {selectedCellCalculatedStress > 85 ? 'Critical' : selectedCellCalculatedStress > 65 ? 'High' : 'Moderate'}
                  </span>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="p-3 bg-[#0d1117] rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-teal-400 font-headline font-semibold mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> AI Recommended Action:
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {getRecommendation(selectedCellCalculatedStress, closedCellIds.includes(selectedCell.id), selectedCell.heavyVehiclePct)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
