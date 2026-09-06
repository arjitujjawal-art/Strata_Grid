import React, { useState, useEffect } from 'react';
import { HexCell, GridMode } from '../types';
import { AlertTriangle, ShieldCheck, Droplets, Truck, Navigation, Activity, Info, Zap, Flame, Radio } from 'lucide-react';

interface HexGridCanvasProps {
  cells: HexCell[];
  selectedCellId: string | null;
  onSelectCell: (cell: HexCell) => void;
  rainfallIntensity: number; // 0-100 mm
  trafficMultiplier: number; // 50 - 150 %
  closedCellIds: string[];
  mode: GridMode;
  activeRouteHexIds?: string[];
  onToggleClosure?: (cellId: string) => void;
  isLiveStreaming?: boolean;
}

export const HexGridCanvas: React.FC<HexGridCanvasProps> = ({
  cells,
  selectedCellId,
  onSelectCell,
  rainfallIntensity,
  trafficMultiplier,
  closedCellIds,
  mode,
  activeRouteHexIds = [],
  isLiveStreaming = true
}) => {
  const [hoveredCell, setHoveredCell] = useState<HexCell | null>(null);
  const [pulseTick, setPulseTick] = useState<number>(0);
  const [activeTelemetryCellId, setActiveTelemetryCellId] = useState<string | null>('HEX-11');

  // Hexagon geometry parameters
  const hexRadius = 46;
  const hexWidth = Math.sqrt(3) * hexRadius; // ~79.67
  const hexHeight = hexRadius * 1.5; // ~69

  const gridCols = 7;
  const gridRows = 7;
  const viewBoxWidth = gridCols * hexWidth + hexWidth;
  const viewBoxHeight = gridRows * hexHeight + hexRadius + 20;

  // Real-time live data stream simulation effect
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      setPulseTick(prev => (prev + 1) % 100);
      
      // Randomly pick a cell receiving an ultrasonic or radar burst
      if (Math.random() > 0.4) {
        const randomIndex = Math.floor(Math.random() * cells.length);
        setActiveTelemetryCellId(cells[randomIndex]?.id || null);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [cells, isLiveStreaming]);

  // Helper to calculate effective stress for any cell with live subtle micro-jitter
  const getCellStress = (cell: HexCell) => {
    if (closedCellIds.includes(cell.id)) return 0; // Closed road
    
    // Check if neighboring any closed cell
    const isNeighborOfClosed = closedCellIds.some(closedId => {
      const closedCell = cells.find(c => c.id === closedId);
      if (!closedCell) return false;
      const dq = Math.abs(cell.q - closedCell.q);
      const dr = Math.abs(cell.r - closedCell.r);
      return (dq <= 1 && dr <= 1);
    });

    const rainFactor = 1 + rainfallIntensity / 200; // 0mm -> 1.0, 100mm -> 1.5
    const trafficFactor = trafficMultiplier / 100; // 1.0 base
    const closureSpillover = isNeighborOfClosed ? 1.32 : 1.0;

    // Subtle pseudo-live jitter based on pulseTick & cell id
    const hash = (cell.q * 13 + cell.r * 29 + pulseTick) % 7;
    const jitter = isLiveStreaming ? (hash - 3) * 0.75 : 0;

    const computed = cell.baseStress * rainFactor * trafficFactor * closureSpillover + jitter;
    return Math.min(100, Math.max(4, Math.round(computed)));
  };

  // Color mapper based on stress score matching Bento palette
  const getStressColor = (stress: number, isClosed: boolean) => {
    if (isClosed) {
      return {
        fill: 'rgba(15, 23, 42, 0.95)',
        stroke: '#f43f5e',
        text: '#fda4af',
        glow: 'rgba(244, 63, 94, 0.4)',
        category: 'Closed / Rerouted',
        badge: 'CLOSED',
        badgeBg: 'bg-rose-500/20 text-rose-300'
      };
    }
    if (stress <= 40) {
      return {
        fill: 'rgba(20, 184, 166, 0.15)',
        stroke: '#14b8a6',
        text: '#2dd4bf',
        glow: 'rgba(20, 184, 166, 0.4)',
        category: 'Optimal (0-40)',
        badge: 'OPTIMAL',
        badgeBg: 'bg-teal-500/20 text-teal-300'
      };
    }
    if (stress <= 70) {
      return {
        fill: 'rgba(245, 158, 11, 0.18)',
        stroke: '#f59e0b',
        text: '#fbbf24',
        glow: 'rgba(245, 158, 11, 0.4)',
        category: 'Elevated (41-70)',
        badge: 'ELEVATED',
        badgeBg: 'bg-amber-500/20 text-amber-300'
      };
    }
    if (stress <= 85) {
      return {
        fill: 'rgba(249, 115, 22, 0.25)',
        stroke: '#f97316',
        text: '#fb923c',
        glow: 'rgba(249, 115, 22, 0.5)',
        category: 'Severe (71-85)',
        badge: 'SEVERE',
        badgeBg: 'bg-orange-500/20 text-orange-300'
      };
    }
    return {
      fill: 'rgba(239, 68, 68, 0.35)',
      stroke: '#ef4444',
      text: '#f87171',
      glow: 'rgba(239, 68, 68, 0.7)',
      category: 'Critical (86-100)',
      badge: 'CRITICAL',
      badgeBg: 'bg-rose-500/20 text-rose-300'
    };
  };

  // Hexagon point generator
  const getHexPoints = (cx: number, cy: number, r: number) => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6; // Pointy-topped
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return points.join(' ');
  };

  // Center coordinates for cell (col, row)
  const getCellCenter = (col: number, row: number) => {
    const cx = col * hexWidth + (row % 2 === 1 ? hexWidth / 2 : 0) + hexRadius + 16;
    const cy = row * hexHeight + hexRadius + 14;
    return { cx, cy };
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none">
      {/* City Background Texture & Grid lines */}
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        className="w-full h-full max-h-[620px] transition-all duration-300 drop-shadow-2xl"
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="hex-subgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(45, 212, 191, 0.05)" strokeWidth="0.5" />
          </pattern>

          {/* Hazard stripe pattern for closed roads */}
          <pattern id="hazard-stripes" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#ef4444" strokeWidth="4" opacity="0.6" />
            <line x1="6" y1="0" x2="6" y2="12" stroke="#0d1117" strokeWidth="4" />
          </pattern>

          {/* Glow filters */}
          <filter id="glow-teal" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-pulse" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Network Arteries */}
        <g opacity="0.3">
          {cells.map((cell) => {
            const { cx, cy } = getCellCenter(cell.q, cell.r);
            const neighbor = cells.find(c => c.q === cell.q + 1 && c.r === cell.r);
            if (!neighbor) return null;
            const nCoords = getCellCenter(neighbor.q, neighbor.r);
            return (
              <line
                key={`artery-${cell.id}-${neighbor.id}`}
                x1={cx}
                y1={cy}
                x2={nCoords.cx}
                y2={nCoords.cy}
                stroke="#2dd4bf"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            );
          })}
        </g>

        {/* Route Path Highlight Lines */}
        {activeRouteHexIds.length > 1 && (
          <g>
            {activeRouteHexIds.map((hexId, idx) => {
              if (idx === activeRouteHexIds.length - 1) return null;
              const nextId = activeRouteHexIds[idx + 1];
              const cellA = cells.find(c => c.id === hexId);
              const cellB = cells.find(c => c.id === nextId);
              if (!cellA || !cellB) return null;
              const { cx: x1, cy: y1 } = getCellCenter(cellA.q, cellA.r);
              const { cx: x2, cy: y2 } = getCellCenter(cellB.q, cellB.r);

              return (
                <g key={`route-segment-${idx}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#14b8a6"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.85"
                    filter="url(#glow-teal)"
                  />
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="6 4"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Hexagon Cells */}
        {cells.map((cell) => {
          const { cx, cy } = getCellCenter(cell.q, cell.r);
          const isClosed = closedCellIds.includes(cell.id);
          const stress = getCellStress(cell);
          const colorTheme = getStressColor(stress, isClosed);
          const isSelected = selectedCellId === cell.id;
          const isHovered = hoveredCell?.id === cell.id;
          const isInRoute = activeRouteHexIds.includes(cell.id);
          const isPulsingLive = isLiveStreaming && activeTelemetryCellId === cell.id;

          return (
            <g
              key={cell.id}
              onClick={() => onSelectCell(cell)}
              onMouseEnter={() => setHoveredCell(cell)}
              onMouseLeave={() => setHoveredCell(null)}
              className="cursor-pointer transition-transform duration-200"
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            >
              {/* Real-time live burst ripple */}
              {isPulsingLive && !isClosed && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={hexRadius + 8}
                  fill="none"
                  stroke={stress > 70 ? '#f59e0b' : '#2dd4bf'}
                  strokeWidth="1.5"
                  opacity="0.7"
                  className="animate-ping"
                />
              )}

              {/* Outer Selection Glow Ring */}
              {isSelected && (
                <polygon
                  points={getHexPoints(cx, cy, hexRadius + 4)}
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                  className="animate-pulse"
                />
              )}

              {/* Base Hexagon */}
              <polygon
                points={getHexPoints(cx, cy, isHovered ? hexRadius + 2 : hexRadius)}
                fill={isClosed ? 'url(#hazard-stripes)' : colorTheme.fill}
                stroke={isSelected ? '#ffffff' : colorTheme.stroke}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2.2 : 1.2}
                strokeOpacity={isHovered ? 1 : 0.85}
                className="transition-all duration-300"
              />

              {/* In-Route Halo */}
              {isInRoute && !isClosed && (
                <polygon
                  points={getHexPoints(cx, cy, hexRadius - 6)}
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
              )}

              {/* Inner Content */}
              {isClosed ? (
                <g>
                  <circle cx={cx} cy={cy - 6} r="10" fill="#991b1b" />
                  <line x1={cx - 5} y1={cy - 11} x2={cx + 5} y2={cy - 1} stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1={cx + 5} y1={cy - 11} x2={cx - 5} y2={cy - 1} stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                  <text
                    x={cx}
                    y={cy + 13}
                    textAnchor="middle"
                    fill="#fda4af"
                    fontSize="9.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="700"
                    letterSpacing="0.05em"
                  >
                    CLOSED
                  </text>
                </g>
              ) : (
                <g pointerEvents="none">
                  {/* Sector Identifier */}
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill={colorTheme.text}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="600"
                    opacity="0.9"
                  >
                    {cell.id}
                  </text>

                  {/* Stress Score Number */}
                  <text
                    x={cx}
                    y={cy + 7}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="13"
                    fontFamily="Hanken Grotesk, sans-serif"
                    fontWeight="800"
                    className="drop-shadow"
                  >
                    {stress}%
                  </text>

                  {/* Flow Indicator with live blinking dot if high freight */}
                  <text
                    x={cx}
                    y={cy + 19}
                    textAnchor="middle"
                    fill="rgba(203, 213, 225, 0.75)"
                    fontSize="7.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {cell.heavyVehiclePct > 45 ? '🚛 ' : ''}{Math.round(cell.trafficVolume / 1000)}k/h
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Interactive Hover Tooltip Card */}
      {hoveredCell && (
        <div
          className="absolute top-3 right-3 pointer-events-none p-4 rounded-xl bg-[#161b22]/95 border border-slate-700 z-30 shadow-2xl max-w-xs animate-fadeIn backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              <span className="font-mono text-xs text-teal-400 font-bold">{hoveredCell.id}</span>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded uppercase">
                (q:{hoveredCell.q}, r:{hoveredCell.r})
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 uppercase">{hoveredCell.district}</span>
          </div>

          <p className="text-sm font-headline font-bold text-white truncate mb-2">{hoveredCell.name}</p>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono border-t border-slate-800 pt-2">
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Stress Index</span>
              <span className={`font-bold ${getCellStress(hoveredCell) > 75 ? 'text-rose-400' : 'text-teal-400'}`}>
                {closedCellIds.includes(hoveredCell.id) ? 'ROAD CLOSED' : `${getCellStress(hoveredCell)}%`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Traffic Flow</span>
              <span className="text-slate-200 font-bold">{hoveredCell.trafficVolume} v/h</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Heavy Vehicles</span>
              <span className="text-amber-400 font-bold">{hoveredCell.heavyVehiclePct}%</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Pothole Risk</span>
              <span className={`font-bold ${hoveredCell.potholeRisk === 'Severe' ? 'text-rose-400' : 'text-slate-300'}`}>
                {hoveredCell.potholeRisk}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-teal-400">
              <Zap className="w-3 h-3" /> Click cell to inspect
            </span>
            <span>Speed: {hoveredCell.speedLimit}mph</span>
          </div>
        </div>
      )}

      {/* Grid Legend Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800 px-2 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">Stress Index:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-500/30 border border-teal-500"></span>
            <span className="text-slate-300 text-[11px]">0-40 Optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/30 border border-amber-500"></span>
            <span className="text-slate-300 text-[11px]">41-70 Elevated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500/30 border border-orange-500"></span>
            <span className="text-slate-300 text-[11px]">71-85 Severe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/30 border border-rose-500"></span>
            <span className="text-slate-300 text-[11px]">86-100 Critical</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5 text-teal-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> 49 Monitored H3 Spatial Hex Cells
          </span>
        </div>
      </div>
    </div>
  );
};
