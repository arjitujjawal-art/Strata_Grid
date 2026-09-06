import React from 'react';
import {
  X,
  AlertTriangle,
  Activity,
  Droplets,
  Truck,
  Gauge,
  ShieldAlert,
  Ban,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { PuneHexCell } from '../../types';
import { getStressColor } from '../../utils/stressCalculator';

interface HexInspectorProps {
  cell: PuneHexCell | null;
  onClose: () => void;
  onToggleClosure: (hexId: string) => void;
  onAskAiAboutCell?: (cell: PuneHexCell) => void;
}

export const HexInspector: React.FC<HexInspectorProps> = ({
  cell,
  onClose,
  onToggleClosure,
  onAskAiAboutCell
}) => {
  if (!cell) return null;

  const stressColor = getStressColor(cell.calculatedStress);
  const isHighRisk = cell.calculatedStress >= 70;

  return (
    <aside className="absolute top-20 right-4 z-20 w-80 md:w-88 pointer-events-auto transition-all animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl shadow-black/80 text-white space-y-3.5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                {cell.district}
              </span>
              {cell.isClosed && (
                <span className="text-[10px] font-mono font-bold uppercase bg-rose-950/80 text-rose-400 border border-rose-800 px-2 py-0.5 rounded flex items-center gap-1">
                  <Ban className="w-2.5 h-2.5" /> CLOSED
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-white mt-1 leading-tight">{cell.name}</h3>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">H3 INDEX: {cell.h3Index}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Stress Score Gauge Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              STRUCTURAL STRESS SCORE
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black font-mono" style={{ color: stressColor }}>
                {cell.calculatedStress}%
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                (Base: {cell.baseStress}%)
              </span>
            </div>
            <span
              className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded mt-1"
              style={{
                backgroundColor: `${stressColor}20`,
                color: stressColor,
                border: `1px solid ${stressColor}40`
              }}
            >
              RISK: {cell.potholeRisk.toUpperCase()}
            </span>
          </div>

          {/* Mini circular visualization */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke={stressColor}
                strokeWidth="4"
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * cell.calculatedStress) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500"
              />
            </svg>
            <Activity className="w-5 h-5 absolute" style={{ color: stressColor }} />
          </div>
        </div>

        {/* Physics & Telemetry Breakdown Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-400" /> Moisture Sat.
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">{cell.moisturePct}%</span>
            <span className="text-[9px] text-slate-500">Vuln: {cell.floodVulnerability}%</span>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Truck className="w-3 h-3 text-amber-400" /> Heavy Axle %
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">{cell.heavyVehiclePct}%</span>
            <span className="text-[9px] text-slate-500">{cell.trafficVolume} v/h total</span>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-400" /> Shear Strain
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {Math.round(cell.calculatedStress * 8.8 + (cell.moisturePct > 60 ? 220 : 60))} µε
            </span>
            <span className="text-[9px] text-slate-500">AASHTO 4th Power</span>
          </div>

          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400" /> PCI Rating
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {Math.max(12, 100 - Math.round(cell.calculatedStress * 0.85))} / 100
            </span>
            <span className="text-[9px] text-slate-500">Age: {cell.asphaltAgeYears} yrs</span>
          </div>
        </div>

        {/* AI Geotechnical Diagnosis */}
        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 text-xs">
          <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
            StrataGrid AI Diagnosis:
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {isHighRisk
              ? `High shear strain concentration. Funneling commuters here risks sub-base pumping and acute pothole blowout within 72 hours.`
              : `Cell operating within safe fatigue endurance limits. Recommended as active cooperative load-balancing target.`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
          <button
            onClick={() => onToggleClosure(cell.h3Index)}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
              cell.isClosed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 border border-rose-800/70'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            {cell.isClosed ? 'REOPEN SECTOR' : 'FORCE SECTOR CLOSURE'}
          </button>

          {onAskAiAboutCell && (
            <button
              onClick={() => onAskAiAboutCell(cell)}
              className="py-1.5 px-3 bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-800/80 text-cyan-300 rounded-xl text-xs font-mono font-medium flex items-center gap-1 transition-all"
              title="Query Gemini about this cell"
            >
              Ask AI
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
