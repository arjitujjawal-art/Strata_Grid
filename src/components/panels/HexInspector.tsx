import React from 'react';
import {
  X,
  Activity,
  Droplets,
  Truck,
  Gauge,
  ShieldAlert,
  Ban,
  Sparkles
} from 'lucide-react';
import { PuneHexCell } from '../../types';
import { DecoCorners } from '../common/DecoCorners';

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

  const isHighRisk = cell.calculatedStress >= 70;
  const stressColor = cell.calculatedStress >= 85
    ? '#991B1B'
    : cell.calculatedStress >= 70
    ? '#D4AF37'
    : '#10B981';

  return (
    <aside className="absolute top-20 right-4 z-20 w-80 md:w-88 pointer-events-auto select-none font-body transition-all animate-in fade-in duration-200">
      <div className="bg-[#141414]/95 backdrop-blur-md border border-[#D4AF37] p-5 shadow-[0_0_30px_rgba(0,0,0,0.9)] text-[#F2F0E4] space-y-4 relative">
        <DecoCorners />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#D4AF37]/40 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-display font-bold uppercase tracking-[0.25em] text-[#D4AF37] bg-[#0A0A0A] px-2 py-0.5 border border-[#D4AF37]/50">
                {cell.district}
              </span>
              {cell.isClosed && (
                <span className="text-[9px] font-display font-bold uppercase tracking-[0.2em] bg-[#991B1B] text-[#F2E8C4] px-2 py-0.5 flex items-center gap-1">
                  <Ban className="w-2.5 h-2.5" /> CLOSED
                </span>
              )}
            </div>
            <h3 className="text-sm font-display font-bold text-[#F2F0E4] mt-1.5 tracking-[0.1em] uppercase">
              {cell.name}
            </h3>
            <p className="text-[9px] font-mono text-[#888888] mt-0.5 uppercase tracking-wider">
              H3 NODE: {cell.h3Index}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-[#D4AF37] p-1 border border-transparent hover:border-[#D4AF37]/40 transition-colors cursor-pointer"
            aria-label="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Stress Metric Exhibit Card */}
        <div className="bg-[#0A0A0A] border border-[#D4AF37]/60 p-3.5 flex items-center justify-between relative">
          <div>
            <span className="text-[10px] font-body uppercase tracking-[0.2em] text-[#888888] flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#D4AF37]" />
              CYCLIC STRESS SCORE
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-display font-bold" style={{ color: stressColor }}>
                {cell.calculatedStress}%
              </span>
              <span className="text-[10px] uppercase font-mono text-[#888888]">
                (BASE: {cell.baseStress}%)
              </span>
            </div>
            <span
              className="inline-block text-[9px] font-display font-bold tracking-[0.2em] uppercase px-2 py-0.5 mt-1 border"
              style={{
                borderColor: stressColor,
                color: stressColor,
                backgroundColor: 'rgba(0,0,0,0.6)'
              }}
            >
              RISK: {cell.potholeRisk.toUpperCase()}
            </span>
          </div>

          {/* Art Deco Circular Dial */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="#1C1C1C"
                strokeWidth="3"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke={stressColor}
                strokeWidth="3"
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * cell.calculatedStress) / 100}
                fill="transparent"
                className="transition-all duration-500"
              />
            </svg>
            <Activity className="w-4 h-4 absolute" style={{ color: stressColor }} />
          </div>
        </div>

        {/* Physics & Telemetry Breakdown Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.1em]">
          <div className="bg-[#0A0A0A] p-2.5 border border-[#D4AF37]/30">
            <span className="text-[9px] text-[#888888] flex items-center gap-1">
              <Droplets className="w-3 h-3 text-[#D4AF37]" /> Moisture Sat.
            </span>
            <span className="text-sm font-display font-bold text-[#F2F0E4] mt-0.5 block">
              {cell.moisturePct}%
            </span>
            <span className="text-[8px] text-[#888888]">Vuln: {cell.floodVulnerability}%</span>
          </div>

          <div className="bg-[#0A0A0A] p-2.5 border border-[#D4AF37]/30">
            <span className="text-[9px] text-[#888888] flex items-center gap-1">
              <Truck className="w-3 h-3 text-[#D4AF37]" /> Heavy Axle
            </span>
            <span className="text-sm font-display font-bold text-[#F2F0E4] mt-0.5 block">
              {cell.heavyVehiclePct}%
            </span>
            <span className="text-[8px] text-[#888888]">{cell.trafficVolume} V/H</span>
          </div>

          <div className="bg-[#0A0A0A] p-2.5 border border-[#D4AF37]/30">
            <span className="text-[9px] text-[#888888] flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#D4AF37]" /> Shear Strain
            </span>
            <span className="text-sm font-display font-bold text-[#F2F0E4] mt-0.5 block">
              {Math.round(cell.calculatedStress * 8.8 + (cell.moisturePct > 60 ? 220 : 60))} µε
            </span>
            <span className="text-[8px] text-[#888888]">AASHTO 4th Power</span>
          </div>

          <div className="bg-[#0A0A0A] p-2.5 border border-[#D4AF37]/30">
            <span className="text-[9px] text-[#888888] flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-[#D4AF37]" /> PCI Rating
            </span>
            <span className="text-sm font-display font-bold text-[#F2F0E4] mt-0.5 block">
              {Math.max(12, 100 - Math.round(cell.calculatedStress * 0.85))} / 100
            </span>
            <span className="text-[8px] text-[#888888]">Age: {cell.asphaltAgeYears} Yrs</span>
          </div>
        </div>

        {/* AI Geotechnical Diagnosis */}
        <div className="bg-[#0A0A0A] p-3 border border-[#D4AF37]/40 text-xs">
          <span className="text-[9px] font-display text-[#D4AF37] font-bold uppercase tracking-[0.25em] block mb-1">
            STRATAGRID AI FORENSIC OPINION:
          </span>
          <p className="text-[#F2F0E4]/80 text-[11px] leading-relaxed tracking-wide">
            {isHighRisk
              ? `Severe shear strain concentration. Funneling commuters across this node triggers sub-base pumping and acute pavement failure within 72 hours.`
              : `Operating within elastic fatigue endurance limits. Recommended as active cooperative load-balancing target.`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#D4AF37]/30">
          <button
            onClick={() => onToggleClosure(cell.h3Index)}
            className={`flex-1 py-2 px-3 text-[10px] font-body font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              cell.isClosed
                ? 'bg-[#10B981] hover:bg-[#34D399] text-[#0A0A0A]'
                : 'bg-[#991B1B] hover:bg-[#B91C1C] text-[#F2E8C4] border border-[#991B1B]'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            {cell.isClosed ? 'REOPEN SECTOR' : 'FORCE CLOSURE'}
          </button>

          {onAskAiAboutCell && (
            <button
              onClick={() => onAskAiAboutCell(cell)}
              className="py-2 px-4 bg-[#141414] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#0A0A0A] border border-[#D4AF37] text-[10px] font-body font-bold tracking-[0.2em] uppercase flex items-center gap-1 transition-all cursor-pointer"
              title="Query Gemini about this cell"
            >
              <Sparkles className="w-3 h-3" />
              ASK AI
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
