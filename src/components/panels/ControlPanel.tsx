import React, { useState } from 'react';
import {
  Sliders,
  Play,
  Square,
  CloudRain,
  Car,
  Truck,
  Building2,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Navigation
} from 'lucide-react';
import { GridMode } from '../../types';
import { DecoCorners } from '../common/DecoCorners';

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
      className={`absolute top-[128px] left-4 z-20 transition-all duration-300 pointer-events-auto select-none font-body ${
        isCollapsed ? 'w-12' : 'w-80 md:w-88'
      }`}
    >
      <div className="bg-[#141414]/95 backdrop-blur-md border border-[#D4AF37] p-5 shadow-[0_0_25px_rgba(0,0,0,0.9)] text-[#F2F0E4] relative">
        <DecoCorners />

        {/* Collapse toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-4 bg-[#0A0A0A] border border-[#D4AF37] text-[#D4AF37] p-1 hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-all cursor-pointer shadow-lg"
          title={isCollapsed ? 'Expand Controls' : 'Collapse Controls'}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {isCollapsed ? (
          <div className="flex flex-col items-center py-4 gap-4">
            <Sliders className="w-5 h-5 text-[#D4AF37]" />
            <button
              onClick={onToggleScenario}
              className={`p-2 transition-all cursor-pointer ${
                isPlayingScenario ? 'bg-[#991B1B] text-[#F2F0E4]' : 'bg-[#D4AF37] text-[#0A0A0A]'
              }`}
              title={isPlayingScenario ? 'Halt Scenario' : 'Run Demo Scenario'}
            >
              {isPlayingScenario ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header with Title & Reset Button */}
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D4AF37]" />
                <h2 className="font-display font-bold text-xs tracking-[0.2em] text-[#F2F0E4]">
                  SIMULATION KERNEL
                </h2>
              </div>
              <button
                onClick={onResetSimulation}
                className="text-[10px] text-[#888888] hover:text-[#D4AF37] flex items-center gap-1 uppercase tracking-[0.15em] transition-colors cursor-pointer"
                title="Reset Parameters"
              >
                <RotateCcw className="w-3 h-3" />
                RESET
              </button>
            </div>

            {/* Run Demo Scenario CTA - Solid Art Deco Button */}
            <button
              onClick={onToggleScenario}
              className={`w-full py-3 px-4 font-body text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPlayingScenario
                  ? 'bg-[#991B1B] hover:bg-[#B91C1C] text-[#F2F0E4] border border-[#991B1B] shadow-[0_0_20px_rgba(153,27,27,0.5)]'
                  : 'bg-[#D4AF37] hover:bg-[#F2E8C4] text-[#0A0A0A] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
              }`}
            >
              {isPlayingScenario ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-[#F2F0E4]" />
                  HALT DEMO SCENARIO
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-[#0A0A0A]" />
                  ▶ RUN VI-PHASE DEMO SCENARIO
                </>
              )}
            </button>

            {/* Active Corridor Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold flex items-center justify-between">
                <span>ACTIVE TEST CORRIDOR</span>
                <Navigation className="w-3 h-3 text-[#D4AF37]" />
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-[#0A0A0A] p-1 border border-[#D4AF37]/40">
                <button
                  onClick={() => onCorridorChange('hinjewadi_shivajinagar')}
                  className={`py-2 px-2 text-[10px] uppercase tracking-[0.15em] font-semibold transition-all cursor-pointer ${
                    selectedCorridor === 'hinjewadi_shivajinagar'
                      ? 'bg-[#141414] text-[#D4AF37] border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.25)]'
                      : 'text-[#888888] hover:text-[#F2F0E4]'
                  }`}
                >
                  Hinjewadi ↔ Shivajinagar
                </button>
                <button
                  onClick={() => onCorridorChange('pcmc_freight')}
                  className={`py-2 px-2 text-[10px] uppercase tracking-[0.15em] font-semibold transition-all cursor-pointer ${
                    selectedCorridor === 'pcmc_freight'
                      ? 'bg-[#141414] text-[#D4AF37] border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.25)]'
                      : 'text-[#888888] hover:text-[#F2F0E4]'
                  }`}
                >
                  PCCOE ↔ Hadapsar Freight
                </button>
              </div>
            </div>

            {/* Stakeholder Perspective Switcher */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#888888] font-semibold flex items-center justify-between">
                <span>STAKEHOLDER PERSPECTIVE</span>
                <span className="text-[#D4AF37] font-display">{gridMode.toUpperCase()}</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#0A0A0A] p-1 border border-[#D4AF37]/30 text-[10px] uppercase tracking-[0.15em]">
                <button
                  onClick={() => onGridModeChange('driver')}
                  className={`py-1.5 flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    gridMode === 'driver'
                      ? 'bg-[#141414] text-[#D4AF37] font-bold border border-[#D4AF37]'
                      : 'text-[#888888] hover:text-[#F2F0E4]'
                  }`}
                >
                  <Car className="w-3 h-3" /> Driver
                </button>
                <button
                  onClick={() => onGridModeChange('fleet')}
                  className={`py-1.5 flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    gridMode === 'fleet'
                      ? 'bg-[#141414] text-[#D4AF37] font-bold border border-[#D4AF37]'
                      : 'text-[#888888] hover:text-[#F2F0E4]'
                  }`}
                >
                  <Truck className="w-3 h-3" /> Freight
                </button>
                <button
                  onClick={() => onGridModeChange('city')}
                  className={`py-1.5 flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    gridMode === 'city'
                      ? 'bg-[#141414] text-[#D4AF37] font-bold border border-[#D4AF37]'
                      : 'text-[#888888] hover:text-[#F2F0E4]'
                  }`}
                >
                  <Building2 className="w-3 h-3" /> City DOT
                </button>
              </div>
            </div>

            {/* Slider 1: Precipitation Infiltration */}
            <div className="space-y-1.5 bg-[#0A0A0A] p-3 border border-[#D4AF37]/30">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em]">
                <span className="text-[#888888] flex items-center gap-1.5">
                  <CloudRain className="w-3 h-3 text-[#D4AF37]" />
                  Precipitation Influx
                </span>
                <span className="font-bold text-[#D4AF37]">{rainfallMm} MM/H</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={rainfallMm}
                onChange={(e) => onRainfallChange(Number(e.target.value))}
                className="w-full h-1 bg-[#141414] appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between text-[9px] text-[#888888] uppercase tracking-[0.15em]">
                <span>0 (Dry)</span>
                <span>40 (Moderate)</span>
                <span>80+ (Cloudburst)</span>
              </div>
            </div>

            {/* Slider 2: Commuter Flow Multiplier */}
            <div className="space-y-1.5 bg-[#0A0A0A] p-3 border border-[#D4AF37]/30">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em]">
                <span className="text-[#888888] flex items-center gap-1.5">
                  <Car className="w-3 h-3 text-[#D4AF37]" />
                  Commuter Flow Load
                </span>
                <span className="font-bold text-[#D4AF37]">{trafficMultiplier}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                value={trafficMultiplier}
                onChange={(e) => onTrafficChange(Number(e.target.value))}
                className="w-full h-1 bg-[#141414] appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between text-[9px] text-[#888888] uppercase tracking-[0.15em]">
                <span>50% (Off-Peak)</span>
                <span>100% (Baseline)</span>
                <span>150% (Gridlock)</span>
              </div>
            </div>

            {/* Instant Scenarios Presets */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#888888] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" /> SCENARIO PRESETS
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => onApplyPreset('normal')}
                  className="py-1.5 px-1 bg-[#0A0A0A] hover:bg-[#141414] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[9px] uppercase tracking-[0.15em] text-[#F2F0E4] transition-all cursor-pointer"
                >
                  Clear Sky
                </button>
                <button
                  onClick={() => onApplyPreset('monsoon')}
                  className="py-1.5 px-1 bg-[#0A0A0A] hover:bg-[#141414] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[9px] uppercase tracking-[0.15em] text-[#D4AF37] transition-all cursor-pointer"
                >
                  Monsoon
                </button>
                <button
                  onClick={() => onApplyPreset('freight')}
                  className="py-1.5 px-1 bg-[#0A0A0A] hover:bg-[#141414] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[9px] uppercase tracking-[0.15em] text-[#F2F0E4] transition-all cursor-pointer"
                >
                  Freight Rush
                </button>
              </div>
            </div>

            {/* 3D Buildings Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/30 text-[11px] uppercase tracking-[0.15em]">
              <span className="text-[#888888] flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-[#D4AF37]" /> 3D City Facades
              </span>
              <button
                onClick={onToggle3DBuildings}
                className={`px-3 py-0.5 text-[10px] font-bold border transition-all cursor-pointer ${
                  show3DBuildings
                    ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37]'
                    : 'bg-[#0A0A0A] text-[#888888] border-[#D4AF37]/40'
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
