import React from 'react';
import { 
  Activity, 
  Layers, 
  AlertTriangle, 
  Cpu, 
  ShieldCheck, 
  Award, 
  Camera, 
  Users, 
  Compass,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Home,
  CheckCircle2
} from 'lucide-react';
import { PageId } from '../types';

interface PageHeaderBannerProps {
  pageId: PageId;
  title: string;
  category: string;
  explanation: string;
  metrics?: { label: string; value: string; color?: string }[];
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  subSegments?: { id: string; label: string }[];
  activeSubSegment?: string;
  onSelectSubSegment?: (subId: string) => void;
}

export const PageHeaderBanner: React.FC<PageHeaderBannerProps> = ({
  pageId,
  title,
  category,
  explanation,
  metrics = [],
  activePage,
  onSelectPage,
  subSegments = [],
  activeSubSegment,
  onSelectSubSegment
}) => {
  const getIcon = () => {
    switch (pageId) {
      case 'home':
        return Home;
      case 'demo':
        return Activity;
      case 'problem':
        return AlertTriangle;
      case 'how-it-works':
        return Cpu;
      case 'case-studies':
        return ShieldCheck;
      case 'impact':
        return Award;
      case 'gallery':
        return Camera;
      case 'team':
        return Users;
      default:
        return Compass;
    }
  };

  const getBadgeColor = () => {
    switch (pageId) {
      case 'problem':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'demo':
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400';
      case 'impact':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'case-studies':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      default:
        return 'bg-teal-500/10 border-teal-500/30 text-teal-400';
    }
  };

  const Icon = getIcon();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4">
      {/* Main Executive Explanation Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#101726]/95 via-[#152033]/90 to-[#101726]/95 rounded-2xl border border-slate-700/80 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-3xl">
            {/* Category Badge & Status */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${getBadgeColor()}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{category}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Dedicated Segment Webpage</span>
              </span>
            </div>

            {/* Page Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-black text-white tracking-tight leading-snug">
              {title}
            </h1>

            {/* Section Explanation Box */}
            <div className="p-4 rounded-xl bg-[#090d16]/90 border border-slate-700/70 text-slate-300 text-sm leading-relaxed font-sans shadow-inner">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-200">
                  <span className="font-semibold text-white">Segment Explanation: </span>
                  {explanation}
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics / Quick Action Box */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5 lg:w-72 shrink-0 font-mono">
              {metrics.map((m, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-xl bg-[#090d16]/90 border border-slate-700/80 flex flex-col justify-between"
                >
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                    {m.label}
                  </span>
                  <span className={`text-base sm:text-lg font-bold mt-1 ${m.color || 'text-emerald-400'}`}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional Sub-Segments Pills */}
        {subSegments.length > 0 && onSelectSubSegment && (
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-2">
              Topic Segments:
            </span>
            {subSegments.map((sub) => {
              const isSubActive = activeSubSegment === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubSegment(sub.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    isSubActive
                      ? 'bg-slate-700 text-white font-bold border border-emerald-500/40 shadow-sm'
                      : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
