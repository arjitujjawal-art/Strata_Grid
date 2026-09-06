import React, { useState } from 'react';
import {
  Sliders,
  Play,
  Square,
  CloudRain,
  Car,
  Truck,
  Building2,
  Layers,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Route
} from 'lucide-react';
import { GridMode } from '../../types';

interface ControlPanelProps {
  rainfallMm: number;
  onRainfallChange: (val: number) => void;
  trafficMultiplier: number;
  onTrafficChange: (val: number) => void;
  gridMode: GridMode;
  onGridModeChange: (mode: GridMode) => void;
  selectedCorridor: 'hinjewadi_shivajinagar' | 'pcmc_freight';
  onCorridorChange: (corridor: 'hinjewadi_shivajinagar' | 'pcmc_freight') => void;
  isPlayingScenario: boolean;
  onToggleScenario: () => void;
  show3DBuildings: boolean;
  onToggle3DBuildings: () => void;
  onResetSimulation: () => void;
  onApplyPreset: (preset: 'normal' | 'monsoon' | 'freight') => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  rainfallMm,
  onRainfallChange,
  trafficMultiplier,
  onTrafficChange,
  gridMode,
  onGridModeChange,
  selectedCorridor,
  onCorridorChange,
  isPlayingScenario,
  onToggleScenario,
  show3DBuildings,
  onToggle3DBuildings,
  onResetSimulation,
  onApplyPreset
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`absolute top-20 left-4 z-20 transition-all duration-300 pointer-events-auto ${
        isCollapsed ? 'w-12' : 'w-80 md:w-88'
      }`}
    >
      <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800/90 rounded-2xl p-4 shadow-2xl shadow-black/80 text-white relative">
        {/* Collapse toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-4 bg-slate-900 border border-slate-700 text-cyan-400 p-1 rounded-full hover:bg-slate-800 transition-all shadow-lg"
          title={isCollapsed ? 'Expand Controls' : 'Collapse Controls'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {isCollapsed ? (
          <div className="flex flex-col items-center py-4 gap-4">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <button
              onClick={onToggleScenario}
              className={`p-2 rounded-xl transition-all ${
                isPlayingScenario ? 'bg-rose-500 text-white' : 'bg-cyan-500 text-slate-950'
              }`}
              title={isPlayingScenario ? 'Stop Scenario' : 'Run Demo Scenario'}
            >
              {isPlayingScenario ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header with Title & Scenario Button */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h2 className="font-bold text-sm tracking-wide font-mono">SIMULATION KERNEL</h2>
              </div>
              <button
                onClick={onResetSimulation}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 font-mono transition-colors"
                title="Reset Parameters"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Run Demo Scenario CTA */}
            <button
              onClick={onToggleScenario}
              className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isPlayingScenario
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 shadow-rose-950/50'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold shadow-cyan-500/20'
              }`}
            >
              {isPlayingScenario ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  HALT DEMO SCENARIO
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  ▶ RUN 6-STEP DEMO SCENARIO
                </>
              )}
            </button>

            {/* Corridor Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-semibold text-slate-400 flex items-center justify-between">
                <span>ACTIVE TEST CORRIDOR</span>
                <Route className="w-3.5 h-3.5 text-cyan-400" />
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => onCorridorChange('hinjewadi_shivajinagar')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-medium transition-all ${
                    selectedCorridor === 'hinjewadi_shivajinagar'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Hinjewadi ↔ Shivajinagar
                </button>
                <button
                  onClick={() => onCorridorChange('pcmc_freight')}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-medium transition-all ${
                    selectedCorridor === 'pcmc_freight'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  PCCOE ↔ Hadapsar Freight
                </button>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-semibold text-slate-400 flex items-center justify-between">
                <span>STAKEHOLDER PERSPECTIVE</span>
                <span className="text-[10px] text-cyan-400 uppercase font-mono">{gridMode}</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                <button
                  onClick={() => onGridModeChange('driver')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    gridMode === 'driver'
                      ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Car className="w-3 h-3" /> Driver
                </button>
                <button
                  onClick={() => onGridModeChange('fleet')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    gridMode === 'fleet'
                      ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Truck className="w-3 h-3" /> Freight
                </button>
                <button
                  onClick={() => onGridModeChange('city')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    gridMode === 'city'
                      ? 'bg-slate-800 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-3 h-3" /> City DOT
                </button>
              </div>
            </div>

            {/* Slider 1: Rainfall Intensity */}
            <div className="space-y-1.5 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  Precipitation Infiltration
                </span>
                <span className="font-bold text-blue-400">{rainfallMm} mm/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={rainfallMm}
                onChange={(e) => onRainfallChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 (Dry)</span>
                <span>40 (Moderate)</span>
                <span>80+ (Cloudburst)</span>
              </div>
            </div>

            {/* Slider 2: Traffic Volume Multiplier */}
            <div className="space-y-1.5 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-cyan-400" />
                  Commuter Flow Volume
                </span>
                <span className="font-bold text-cyan-400">{trafficMultiplier}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                value={trafficMultiplier}
                onChange={(e) => onTrafficChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50% (Off-Peak)</span>
                <span>100% (Baseline)</span>
                <span>150% (Gridlock)</span>
              </div>
            </div>

            {/* Scenario Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Instant Stress Presets
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => onApplyPreset('normal')}
                  className="py-1 px-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-[10px] font-mono text-slate-300 text-center transition-all"
                >
                  Clear Sky
                </button>
                <button
                  onClick={() => onApplyPreset('monsoon')}
                  className="py-1 px-1.5 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/50 rounded-lg text-[10px] font-mono text-blue-300 text-center transition-all"
                >
                  Monsoon (80mm)
                </button>
                <button
                  onClick={() => onApplyPreset('freight')}
                  className="py-1 px-1.5 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/50 rounded-lg text-[10px] font-mono text-amber-300 text-center transition-all"
                >
                  Freight Rush
                </button>
              </div>
            </div>

            {/* 3D Buildings Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> 3D City Buildings
              </span>
              <button
                onClick={onToggle3DBuildings}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                  show3DBuildings
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {show3DBuildings ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
