import React from 'react';
import { Hexagon } from 'lucide-react';
import { PageId } from '../types';
import { DecoCorners } from './common/DecoCorners';

interface FooterProps {
  onSelectPage?: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectPage }) => {
  const handleClick = (page: PageId, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectPage) {
      onSelectPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0A0A0A] border-t-2 border-[#D4AF37] py-12 px-4 sm:px-6 lg:px-8 font-body text-xs select-none relative deco-crosshatch">
      {/* Top micro gold line */}
      <div className="absolute top-[-4px] left-0 right-0 h-[1px] bg-[#D4AF37]/40" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Ceremonial Marquee Telemetry Status Box */}
        <div className="deco-panel p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          <DecoCorners />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 deco-diamond bg-[#0A0A0A] border border-[#D4AF37]">
              <div className="deco-diamond-inner">
                <Hexagon className="w-4 h-4 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <span className="font-display text-sm tracking-[0.2em] text-[#F2F0E4] font-bold block uppercase">
                STRATAGRID AI TELEMETRY MESH
              </span>
              <span className="text-[10px] font-body uppercase tracking-[0.2em] text-[#888888]">
                PUNE METROPOLITAN H3 SPATIAL RESOLUTION VIII DYNAMIC KERNEL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-body tracking-[0.15em]">
            <span className="flex items-center gap-2 text-[#D4AF37] font-semibold">
              <span className="w-2 h-2 bg-[#D4AF37] rotate-45 animate-pulse" />
              320+ SPATIAL NODES SYNCHRONIZED
            </span>
            <span className="text-[#D4AF37]/50">•</span>
            <span className="text-[#888888]">EDGE LATENCY: 12ms</span>
          </div>
        </div>

        {/* Footer Navigation Links & Seal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-[#888888] text-[11px] tracking-[0.2em] pt-4 border-t border-[#D4AF37]/20 uppercase">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 border border-[#D4AF37] rotate-45" />
            <p className="text-[#888888]">
              MMXXVI STRATAGRID AI • MUNICIPAL CIVIL INFRASTRUCTURE
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[#F2F0E4]/80">
            <button
              onClick={(e) => handleClick('home', e)}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              OVERVIEW
            </button>
            <button
              onClick={(e) => handleClick('dashboard', e)}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              3D MESH
            </button>
            <button
              onClick={(e) => handleClick('pipeline', e)}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              ARCHITECTURE
            </button>
            <button
              onClick={(e) => handleClick('case-studies', e)}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              PILOTS
            </button>
            <button
              onClick={(e) => handleClick('gallery', e)}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              PROFILOMETRY
            </button>
            <button
              onClick={(e) => handleClick('team', e)}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              FELLOWSHIP
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
