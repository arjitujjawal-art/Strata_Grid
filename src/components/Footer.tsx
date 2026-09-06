import React from 'react';
import { Hexagon, Activity, Radio, Shield, Github, Twitter, Linkedin, Heart } from 'lucide-react';
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
    <footer className="bg-[#0d1117] border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-mono text-xs">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top bar with telemetry status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#161b22] border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Hexagon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block font-headline">StrataGrid AI Telemetry Kernel</span>
              <span className="text-[10px] text-slate-400">H3 Spatial Index Res-8 Spatial Dynamic Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All 49 Sector Nodes Operational
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Edge Latency: 12ms</span>
          </div>
        </div>

        {/* Footer links & copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] pt-4">
          <p>© {new Date().getFullYear()} StrataGrid AI. Built for Smart City Hackathon.</p>
          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <button onClick={(e) => handleClick('demo', e)} className="hover:text-teal-400 transition-colors cursor-pointer">Live Simulation</button>
            <button onClick={(e) => handleClick('problem', e)} className="hover:text-teal-400 transition-colors cursor-pointer">The Problem</button>
            <button onClick={(e) => handleClick('how-it-works', e)} className="hover:text-teal-400 transition-colors cursor-pointer">Architecture</button>
            <button onClick={(e) => handleClick('case-studies', e)} className="hover:text-teal-400 transition-colors cursor-pointer">Deployments</button>
            <button onClick={(e) => handleClick('impact', e)} className="hover:text-teal-400 transition-colors cursor-pointer">Impact ROI</button>
            <button onClick={(e) => handleClick('gallery', e)} className="hover:text-teal-400 transition-colors cursor-pointer">Sensors</button>
            <button onClick={(e) => handleClick('team', e)} className="hover:text-teal-400 transition-colors cursor-pointer">Team</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

