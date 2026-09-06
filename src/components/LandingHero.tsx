import React from 'react';
import {
  Play,
  ArrowRight,
  Cpu,
  Layers,
  Activity,
  Truck
} from 'lucide-react';
import { PageId } from '../types';
import { DecoCorners } from './common/DecoCorners';

interface LandingHeroProps {
  onNavigate: (page: PageId) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#F2F0E4] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-24 overflow-hidden deco-crosshatch select-none">
      {/* Sunburst Radial Backdrop */}
      <div className="absolute inset-0 deco-sunburst pointer-events-none" />

      {/* Vertical architectural divider accents */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/15 to-transparent hidden xl:block pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/15 to-transparent hidden xl:block pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10">
        {/* Ceremonial Marquee Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#141414] border border-[#D4AF37]/70 shadow-[0_0_15px_rgba(212,175,55,0.2)] backdrop-blur-md relative">
          <DecoCorners />
          <span className="w-2 h-2 bg-[#D4AF37] rotate-45 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-body uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
            PUNE METROPOLITAN DIGITAL TWIN • H3 RESOLUTION VIII
          </span>
          <span className="w-2 h-2 bg-[#D4AF37] rotate-45 animate-pulse" />
        </div>

        {/* Headline with Decorative Art Deco Accents */}
        <div className="space-y-6">
          {/* Top Decorative Line with Diamond */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <div className="w-2.5 h-2.5 border border-[#D4AF37] rotate-45 bg-[#0A0A0A]" />
            <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-normal tracking-[0.14em] uppercase text-[#F2F0E4] leading-[1.12]">
            DON'T WAIT FOR <br />
            <span className="deco-gold-gradient-text font-bold block mt-1">
              ROADS TO FAIL.
            </span>
          </h1>

          {/* Bottom Decorative Line with Diamond */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <div className="w-2.5 h-2.5 border border-[#D4AF37] rotate-45 bg-[#0A0A0A]" />
            <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          {/* Killer Pitch Statement */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-[#F2F0E4]/90 font-body font-light leading-relaxed tracking-wide">
            Conventional navigation systems optimize for your individual travel time today by accelerating
            structural failure tomorrow.{' '}
            <strong className="text-[#D4AF37] font-bold tracking-wider uppercase">StrataGrid AI</strong>{' '}
            cooperatively distributes vehicular load across resilient spatial corridors—delivering tranquil journeys
            while protecting municipal roadbeds.
          </p>
        </div>

        {/* Architectural CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="deco-btn-solid px-8 py-4 text-xs sm:text-sm tracking-[0.25em] flex items-center gap-3 group cursor-pointer"
          >
            <Play className="w-4 h-4 fill-[#0A0A0A]" />
            <span>ENTER 3D COMMAND MESH</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('pipeline')}
            className="deco-btn-gold px-8 py-4 text-xs sm:text-sm tracking-[0.25em] flex items-center gap-2.5 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>THE VIII-STAGE BLUEPRINT</span>
          </button>
        </div>

        {/* Four Classical Roman Numeral Metric Exhibit Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto">
          {/* Card I */}
          <div className="deco-panel p-5 relative text-center group">
            <DecoCorners />
            <span className="text-[10px] font-display text-[#D4AF37] tracking-[0.3em] block mb-1">
              EXHIBIT I
            </span>
            <span className="block text-3xl sm:text-4xl font-display font-bold text-[#F2F0E4] group-hover:text-[#D4AF37] transition-colors">
              320+
            </span>
            <span className="text-[9px] font-body uppercase tracking-[0.2em] text-[#888888] mt-1.5 block">
              H3 Res-8 Spatial Nodes
            </span>
          </div>

          {/* Card II */}
          <div className="deco-panel p-5 relative text-center group">
            <DecoCorners />
            <span className="text-[10px] font-display text-[#D4AF37] tracking-[0.3em] block mb-1">
              EXHIBIT II
            </span>
            <span className="block text-3xl sm:text-4xl font-display font-bold text-[#D4AF37]">
              -62%
            </span>
            <span className="text-[9px] font-body uppercase tracking-[0.2em] text-[#888888] mt-1.5 block">
              Cyclic Asphalt Fatigue
            </span>
          </div>

          {/* Card III */}
          <div className="deco-panel p-5 relative text-center group">
            <DecoCorners />
            <span className="text-[10px] font-display text-[#D4AF37] tracking-[0.3em] block mb-1">
              EXHIBIT III
            </span>
            <span className="block text-3xl sm:text-4xl font-display font-bold text-[#F2F0E4] group-hover:text-[#D4AF37] transition-colors">
              4.2m
            </span>
            <span className="text-[9px] font-body uppercase tracking-[0.2em] text-[#888888] mt-1.5 block">
              Commuter Equity Saved
            </span>
          </div>

          {/* Card IV */}
          <div className="deco-panel p-5 relative text-center group">
            <DecoCorners />
            <span className="text-[10px] font-display text-[#D4AF37] tracking-[0.3em] block mb-1">
              EXHIBIT IV
            </span>
            <span className="block text-3xl sm:text-4xl font-display font-bold text-[#D4AF37]">
              $2.4M
            </span>
            <span className="text-[9px] font-body uppercase tracking-[0.2em] text-[#888888] mt-1.5 block">
              Capital Repair Avoidance
            </span>
          </div>
        </div>

        {/* Three Value Pillars - Architectural Facades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
          {/* Pillar I */}
          <div className="deco-panel p-7 relative group">
            <DecoCorners />
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 deco-diamond bg-[#0A0A0A] border border-[#D4AF37]">
                <div className="deco-diamond-inner">
                  <Cpu className="w-5 h-5 text-[#D4AF37]" />
                </div>
              </div>
              <span className="text-xs font-display font-bold text-[#D4AF37] tracking-[0.3em]">
                PILLAR I
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-display font-bold text-[#F2F0E4] mb-2 tracking-[0.15em] uppercase">
              PREDICTIVE INFRASTRUCTURE
            </h3>
            <div className="h-[1px] w-12 bg-[#D4AF37]/50 mb-3" />
            <p className="text-xs font-body text-[#888888] leading-relaxed tracking-wide">
              Discretizes Pune into Uber H3 Resolution-8 hexagons. Computes dynamic 0–100 Road Stress Scores
              synthesizing monsoon saturation, AASHTO 4th-power heavy axle fatigue, and subgrade moisture.
            </p>
          </div>

          {/* Pillar II */}
          <div className="deco-panel p-7 relative group">
            <DecoCorners />
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 deco-diamond bg-[#0A0A0A] border border-[#D4AF37]">
                <div className="deco-diamond-inner">
                  <Activity className="w-5 h-5 text-[#D4AF37]" />
                </div>
              </div>
              <span className="text-xs font-display font-bold text-[#D4AF37] tracking-[0.3em]">
                PILLAR II
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-display font-bold text-[#F2F0E4] mb-2 tracking-[0.15em] uppercase">
              COOPERATIVE LOAD BALANCING
            </h3>
            <div className="h-[1px] w-12 bg-[#D4AF37]/50 mb-3" />
            <p className="text-xs font-body text-[#888888] leading-relaxed tracking-wide">
              Replaces selfish shortest-path navigation with cooperative multi-objective Pareto pathfinding,
              staggering commuter flows across parallel corridors before asphalt micro-cracking propagates into voids.
            </p>
          </div>

          {/* Pillar III */}
          <div className="deco-panel p-7 relative group">
            <DecoCorners />
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 deco-diamond bg-[#0A0A0A] border border-[#D4AF37]">
                <div className="deco-diamond-inner">
                  <Truck className="w-5 h-5 text-[#D4AF37]" />
                </div>
              </div>
              <span className="text-xs font-display font-bold text-[#D4AF37] tracking-[0.3em]">
                PILLAR III
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-display font-bold text-[#F2F0E4] mb-2 tracking-[0.15em] uppercase">
              HEAVY FREIGHT GEO-FENCING
            </h3>
            <div className="h-[1px] w-12 bg-[#D4AF37]/50 mb-3" />
            <p className="text-xs font-body text-[#888888] leading-relaxed tracking-wide">
              Heavy multi-axle freight causes over 85% of pavement damage. StrataGrid dynamically restricts 50-ton
              trucks from waterlogged residential corridors, rerouting them to reinforced industrial bypasses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
