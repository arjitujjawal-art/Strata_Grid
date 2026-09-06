import React from 'react';
import { Activity, ShieldCheck, CloudRain, Cpu, Radio, Zap } from 'lucide-react';

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
    if (stress >= 80) return { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', text: 'CRITICAL OVERLOAD' };
    if (stress >= 65) return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', text: 'ELEVATED STRAIN' };
    return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', text: 'BALANCED / OPTIMAL' };
  };

  const badge = getStressBadge(avgStress);

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Brand & Live status */}
      <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 px-3.5 py-2 rounded-xl shadow-2xl shadow-cyan-950/50 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </div>
          <span className="font-extrabold text-sm tracking-wider text-white uppercase font-mono">
            STRATAGRID <span className="text-cyan-400">AI</span>
          </span>
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <span className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          PUNE METRO MESH
        </span>
        {isPlayingScenario && scenarioPhase && (
          <span className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
            {scenarioPhase}
          </span>
        )}
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="hidden md:flex items-center gap-4 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-4 py-2 rounded-xl shadow-xl pointer-events-auto">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">H3 RES-8 NODES:</span>
          <span className="font-bold text-white">{activeHexCount}</span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <CloudRain className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">PRECIP:</span>
          <span className="font-bold text-white">{rainfallMm} mm/h</span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">AVG STRESS:</span>
          <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${badge.bg}`}>
            {avgStress}% • {badge.text}
          </span>
        </div>
      </div>

      {/* Action shortcuts / token status */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onOpenTokenSettings}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border backdrop-blur-md transition-all ${
            hasToken
              ? 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-cyan-500 hover:text-white'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30 animate-pulse'
          }`}
          title="Mapbox Configuration"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          {hasToken ? '3D MAP ACTIVE' : 'SET MAPBOX KEY'}
        </button>
      </div>
    </header>
  );
};
