import React from 'react';
import { Radio, X, Check, ShieldCheck, Globe, Zap } from 'lucide-react';
import { DecoCorners } from '../common/DecoCorners';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentToken?: string;
  onSaveToken?: (token: string) => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none font-body">
      <div className="bg-[#141414] border-2 border-[#D4AF37] w-full max-w-md p-6 sm:p-7 text-[#F2F0E4] shadow-[0_0_50px_rgba(212,175,55,0.3)] space-y-5 relative">
        <DecoCorners />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/40 pb-3.5">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-display font-bold text-sm sm:text-base tracking-[0.2em] uppercase text-[#F2F0E4]">
              OPEN 3D GEOSPATIAL ENGINE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-[#D4AF37] p-1.5 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Callout */}
        <div className="p-4 bg-[#064E3B]/30 border border-emerald-500/50 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 block">
              100% Free & Open Source Basemap Active
            </span>
            <p className="text-[11px] text-[#F2F0E4]/80 leading-relaxed font-body">
              StrataGrid AI runs on <strong className="text-emerald-200">MapLibre GL JS v6</strong> and <strong className="text-emerald-200">CartoDB Dark Matter</strong>. Zero proprietary access tokens, credit cards, or rate limits are required.
            </p>
          </div>
        </div>

        {/* Engine Specs */}
        <div className="bg-[#0A0A0A] border border-[#D4AF37]/40 p-4 space-y-2.5 text-xs font-mono">
          <div className="font-display font-bold text-[#D4AF37] uppercase tracking-[0.15em] flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            Active Architecture Specifications:
          </div>
          <ul className="space-y-1.5 text-[#888888] text-[11px]">
            <li className="flex items-center gap-2">
              <span className="text-[#D4AF37]">◆</span>
              <span><strong className="text-[#F2E8C4]">Map Engine:</strong> MapLibre GL JS (BSD 3-Clause)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#D4AF37]">◆</span>
              <span><strong className="text-[#F2E8C4]">Basemap:</strong> CartoDB Dark Matter Vector Tiles</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#D4AF37]">◆</span>
              <span><strong className="text-[#F2E8C4]">Spatial Mesh:</strong> Uber H3 DGGS (Resolution 8 & 9)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#D4AF37]">◆</span>
              <span><strong className="text-[#F2E8C4]">3D Canvas:</strong> Hardware-Accelerated WebGL</span>
            </li>
          </ul>
        </div>

        {/* Close CTA */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="deco-btn-solid px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] cursor-pointer"
          >
            CONFIRM & RESUME 3D MESH
          </button>
        </div>
      </div>
    </div>
  );
};
