import React from 'react';
import {
  ShieldCheck,
  Zap,
  Play,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  ChevronRight,
  BarChart3,
  Truck,
  Activity
} from 'lucide-react';
import { PageId } from '../types';

interface LandingHeroProps {
  onNavigate: (page: PageId) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen bg-[#070d1a] text-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
      {/* Ambient background glow & cyber grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0b192e_1px,transparent_1px),linear-gradient(to_bottom,#0b192e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* System Online Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-lg shadow-cyan-950/50 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="font-bold tracking-wider uppercase">PUNE METROPOLITAN DIGITAL TWIN ONLINE</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">H3 RES-8 SPATIAL MESH</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] font-sans">
            Don't Wait for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              Roads to Fail.
            </span>
          </h1>

          {/* The Killer Hackathon Pitch Line */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
            Standard navigation apps optimize for your trip today by destroying our roads tomorrow.
            <strong className="text-white font-semibold"> StrataGrid AI </strong>
            orchestrates traffic and protects municipal infrastructure simultaneously—giving drivers a peaceful,
            uncrowded journey while saving cities millions in preventative repair costs.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-extrabold text-sm sm:text-base flex items-center gap-3 shadow-2xl shadow-cyan-500/30 hover:scale-[1.02] transition-all"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            LAUNCH LIVE 3D COMMAND MESH
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('pipeline')}
            className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/60 text-slate-200 hover:text-white font-mono font-bold text-sm flex items-center gap-2 backdrop-blur-md transition-all"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            8-Stage Architecture
          </button>
        </div>

        {/* 4 Quantitative Validation Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 max-w-4xl mx-auto">
          <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center backdrop-blur-sm">
            <span className="block text-2xl sm:text-3xl font-black font-mono text-cyan-400">320+</span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5 block">
              H3 Res-8 Spatial Nodes
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center backdrop-blur-sm">
            <span className="block text-2xl sm:text-3xl font-black font-mono text-emerald-400">-62%</span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5 block">
              Peak Pavement Fatigue
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center backdrop-blur-sm">
            <span className="block text-2xl sm:text-3xl font-black font-mono text-blue-400">4.2 min</span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5 block">
              Commuter Time Equity
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center backdrop-blur-sm">
            <span className="block text-2xl sm:text-3xl font-black font-mono text-amber-400">$2.4M</span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5 block">
              Annual Capital Avoidance
            </span>
          </div>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 text-left">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-mono">1. Predictive Infrastructure</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maps Pune into discrete H3 hexagonal cells. Calculates real-time 0–100 Road Stress Scores factoring in
              monsoon rainfall infiltration, AASHTO 4th-power heavy axle fatigue, and subgrade moisture saturation.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-mono">2. Cooperative Load Balancing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike standard GPS which creates flash bottlenecks by funneling thousands of cars down the exact same
              shortcut, StrataGrid dynamically splits commuter volume across structurally resilient parallel corridors.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 font-mono">3. Heavy Freight Geo-Fencing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-axle container freight accounts for 85%+ of pavement destruction. StrataGrid automatically enforces
              intelligent bypass routes away from fragile residential streets and flood-prone basins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
