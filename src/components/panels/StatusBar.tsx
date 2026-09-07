import React from 'react';
import { Activity, CloudRain, Cpu, Radio, Key } from 'lucide-react';
import { DecoCorners } from '../common/DecoCorners';

interface StatusBarProps {
  activeHexCount: number;
  avgStress: number;
  rainfallMm: number;
  isPlayingScenario: boolean;
  scenarioPhase?: string;
  onOpenTokenSettings?: () => void;
  hasToken: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  activeHexCount,
  avgStress,
  rainfallMm,
  isPlayingScenario,
  scenarioPhase,
  onOpenTokenSettings,
  hasToken
}) => {
  const getStressBadge = (stress: number) => {
    if (stress >= 80) {
      return {
        bg: 'bg-[#991B1B]/40 text-[#F2E8C4] border-[#991B1B]',
        text: 'CRITICAL OVERLOAD'
      };
    }
    if (stress >= 65) {
      return {
        bg: 'bg-[#9A7B1C]/40 text-[#F2E8C4] border-[#D4AF37]',
        text: 'ELEVATED WEAR'
      };
    }
    return {
      bg: 'bg-[#064E3B]/40 text-[#F2E8C4] border-[#10B981]',
      text: 'BALANCED / OPTIMAL'
    };
  };

  const badge = getStressBadge(avgStress);

  return (
    <header className="absolute top-[72px] left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none select-none font-body">
      {/* Brand & Active Mesh Status */}
      <div className="flex items-center gap-3 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#D4AF37] px-4 py-2 shadow-[0_0_20px_rgba(212,175,55,0.15)] pointer-events-auto relative">
        <DecoCorners />
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 bg-[#D4AF37] rotate-45 animate-pulse" />
          <span className="font-display font-bold text-sm tracking-[0.2em] text-[#F2E8C4] uppercase">
            STRATAGRID <span className="text-[#D4AF37]">AI</span>
          </span>
        </div>
        <div className="h-4 w-[1px] bg-[#D4AF37]/40" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5 font-semibold">
          <Radio className="w-3.5 h-3.5 text-[#D4AF37]" />
          PUNE METROPOLITAN MESH
        </span>
        {isPlayingScenario && scenarioPhase && (
          <span className="bg-[#1E3D59] border border-[#D4AF37] text-[#D4AF37] text-[9px] font-display font-bold px-2.5 py-0.5 uppercase tracking-[0.2em]">
            {scenarioPhase}
          </span>
        )}
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="hidden md:flex items-center gap-5 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#D4AF37]/50 px-5 py-2 shadow-xl pointer-events-auto relative">
        <DecoCorners />
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#F2F0E4]">
          <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[#888888]">H3 RES-VIII:</span>
          <span className="font-bold text-[#D4AF37]">{activeHexCount} NODES</span>
        </div>

        <div className="h-4 w-[1px] bg-[#D4AF37]/30" />

        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#F2F0E4]">
          <CloudRain className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[#888888]">PRECIP:</span>
          <span className="font-bold text-[#F2E8C4]">{rainfallMm} MM/H</span>
        </div>

        <div className="h-4 w-[1px] bg-[#D4AF37]/30" />

        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
          <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[#888888]">NETWORK STRESS:</span>
          <span className={`px-2 py-0.5 border text-[10px] font-display font-bold tracking-[0.15em] ${badge.bg}`}>
            {avgStress}% • {badge.text}
          </span>
        </div>
      </div>

      {/* Engine Status & Info */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onOpenTokenSettings}
          className="flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-[0.2em] font-body font-bold border transition-all cursor-pointer bg-[#064E3B]/60 text-emerald-300 border-emerald-500/60 hover:bg-[#064E3B]"
          title="Engine: MapLibre GL 3D (Open Source & 100% Free)"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>MAPLIBRE 3D • ACTIVE</span>
        </button>
      </div>
    </header>
  );
};
