import React from 'react';
import { Hexagon, Radio, Shield, Github } from 'lucide-react';
import { PageId } from '../types';

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
    <footer className="bg-[#070d1a] border-t border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8 font-mono text-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top bar with telemetry status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Hexagon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block">StrataGrid AI Telemetry Mesh</span>
              <span className="text-[10px] text-slate-400">Pune Metro H3 Spatial Resolution-8 Dynamic Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              320+ Spatial Nodes Active
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Edge Latency: 12ms</span>
          </div>
        </div>

        {/* Footer links & copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] pt-2">
          <p>© {new Date().getFullYear()} StrataGrid AI. Built for Smart City Hackathon.</p>
          <div className="flex flex-wrap items-center gap-5 text-slate-400">
            <button onClick={(e) => handleClick('home', e)} className="hover:text-cyan-400 transition-colors cursor-pointer">Overview</button>
            <button onClick={(e) => handleClick('dashboard', e)} className="hover:text-cyan-400 transition-colors cursor-pointer">3D Command Mesh</button>
            <button onClick={(e) => handleClick('pipeline', e)} className="hover:text-cyan-400 transition-colors cursor-pointer">8-Stage Architecture</button>
            <button onClick={(e) => handleClick('case-studies', e)} className="hover:text-cyan-400 transition-colors cursor-pointer">Case Studies</button>
            <button onClick={(e) => handleClick('gallery', e)} className="hover:text-cyan-400 transition-colors cursor-pointer">Sensor Scans</button>
            <button onClick={(e) => handleClick('team', e)} className="hover:text-cyan-400 transition-colors cursor-pointer">Team</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
