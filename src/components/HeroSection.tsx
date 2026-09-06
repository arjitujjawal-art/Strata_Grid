import React from 'react';
import { HeroShader } from './HeroShader';
import { 
  Play, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  AlertTriangle, 
  Cpu, 
  Award, 
  Camera, 
  Users,
  Compass
} from 'lucide-react';
import { PageId } from '../types';

interface HeroSectionProps {
  onNavigate: (page: PageId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const portalModules = [
    {
      id: 'demo' as PageId,
      title: 'Live Hex Grid Simulator',
      desc: 'Interactive 49-cell spatial canvas, rainfall/volume sliders, road closure triggers, and real-time route comparisons.',
      icon: Activity,
      badge: 'Interactive Command Center',
      color: 'teal'
    },
    {
      id: 'problem' as PageId,
      title: 'The Urban Dilemma',
      desc: 'Why selfish GPS routing causes concentrated asphalt shear strain, subgrade pumping, and rapid pothole outbreaks.',
      icon: AlertTriangle,
      badge: 'Civil Mechanics',
      color: 'rose'
    },
    {
      id: 'how-it-works' as PageId,
      title: '4-Stage Architecture',
      desc: 'Multimodal sensor ingestion, Res-8 H3 spatial tensor modeling, Pareto-optimal rerouting, and active protection.',
      icon: Cpu,
      badge: 'Algorithm Pipeline',
      color: 'teal'
    },
    {
      id: 'case-studies' as PageId,
      title: 'Field Deployments',
      desc: 'Empirical results across Metropolis Core, Harbor Port Access, and Valley Arterials with 84% pothole reduction.',
      icon: ShieldCheck,
      badge: 'Municipal Pilots',
      color: 'amber'
    },
    {
      id: 'impact' as PageId,
      title: 'Macro ROI & Longevity',
      desc: '$3.8M annual savings per metro area, 4x road base lifespan extensions, and zero unannounced bridge failures.',
      icon: Award,
      badge: 'Economic Return',
      color: 'emerald'
    },
    {
      id: 'gallery' as PageId,
      title: 'Sensor & Drone Gallery',
      desc: 'LiDAR drone scans, thermal moisture profiling, acoustic radar imaging, and weigh-in-motion stations.',
      icon: Camera,
      badge: 'Field Telemetry',
      color: 'teal'
    },
    {
      id: 'team' as PageId,
      title: 'Research & Engineers',
      desc: 'Meet the spatial AI leads, geotechnical engineers, and distributed systems architects behind StrataGrid.',
      icon: Users,
      badge: 'Core Team',
      color: 'teal'
    }
  ];

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/10 pt-20">
      {/* Interactive WebGL Pulsing Hex Grid Background */}
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
        <HeroShader />
        {/* Radial vignette gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1326]/40 via-transparent to-[#0b1326]"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0b1326]/30 to-[#0b1326]"></div>
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 py-16">
        {/* System Online Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-[#00f5ff]/30 text-[#00f5ff] font-mono-code text-xs shadow-lg shadow-[#00f5ff]/10">
          <span className="w-2 h-2 rounded-full bg-[#00f5ff] animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-[#00f5ff] -ml-4"></span>
          <span className="tracking-widest uppercase font-semibold">
            SYSTEM ONLINE — REAL-TIME TELEMETRY ACTIVE
          </span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-headline font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Don't Wait for <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-[#63f7ff] to-[#feb700] drop-shadow-sm">
            Roads to Fail.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="font-body text-base sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
          StrataGrid AI bridges civil structural engineering with dynamic spatial traffic routing — predicting pavement stress in real time to <span className="text-white font-medium">protect infrastructure before potholes and bridge failures happen</span>.
        </p>

        {/* Dual Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('demo')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#00f5ff] hover:bg-[#63f7ff] text-[#002021] font-mono-code text-sm font-bold transition-all shadow-xl shadow-[#00f5ff]/25 hover:shadow-[#00f5ff]/40 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Live Interactive Demo</span>
          </button>

          <button
            onClick={() => onNavigate('how-it-works')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-white hover:text-[#00f5ff] border border-white/20 hover:border-[#00f5ff]/50 font-mono-code text-sm font-semibold transition-all hover:bg-white/5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#00f5ff]" />
            <span>Explore 4-Stage Architecture</span>
          </button>
        </div>

        {/* Live Infrastructure Quick Stats Ticker */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left font-mono-code">
          <div className="p-3.5 glass-panel-subtle rounded-xl border border-white/10">
            <span className="text-[10px] text-gray-400 uppercase block">Active H3 Grid Nodes</span>
            <span className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
              4,281,904 <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff]"></span>
            </span>
          </div>

          <div className="p-3.5 glass-panel-subtle rounded-xl border border-white/10">
            <span className="text-[10px] text-gray-400 uppercase block">Stress Reduction</span>
            <span className="text-lg font-bold text-[#00f5ff] flex items-center gap-1.5 mt-0.5">
              -32.4% <span className="text-xs text-gray-400">Peak</span>
            </span>
          </div>

          <div className="p-3.5 glass-panel-subtle rounded-xl border border-white/10">
            <span className="text-[10px] text-gray-400 uppercase block">Inference Latency</span>
            <span className="text-lg font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              12ms <span className="text-xs text-gray-400">Edge</span>
            </span>
          </div>

          <div className="p-3.5 glass-panel-subtle rounded-xl border border-white/10">
            <span className="text-[10px] text-gray-400 uppercase block">System SLA</span>
            <span className="text-lg font-bold text-[#feb700] flex items-center gap-1.5 mt-0.5">
              99.998%
            </span>
          </div>
        </div>

        {/* Dedicated Section Webpages Grid Portal */}
        <div className="pt-12 text-left space-y-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f5ff] uppercase tracking-wider font-bold">
              <Compass className="w-4 h-4" />
              <span>Platform Webpages & Deep Dives</span>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:block">
              Click any module to open its dedicated full webpage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portalModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.id}
                  onClick={() => onNavigate(mod.id)}
                  className="bg-[#161b22]/90 hover:bg-[#1c2330] p-5 rounded-2xl border border-slate-700/80 hover:border-[#00f5ff]/60 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-xl hover:-translate-y-1"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-[#0d1117] border border-slate-700 flex items-center justify-center text-[#00f5ff] group-hover:border-[#00f5ff]/50 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {mod.badge}
                      </span>
                    </div>

                    <h3 className="font-headline font-bold text-white text-base group-hover:text-[#00f5ff] transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-[#00f5ff]">
                    <span>Open Webpage</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

