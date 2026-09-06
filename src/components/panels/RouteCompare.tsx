import React from 'react';
import { Clock, Navigation, Zap, AlertOctagon, CheckCircle2, ShieldCheck, Leaf } from 'lucide-react';
import { GeoRouteOption } from '../../types';

interface RouteCompareProps {
  routes: GeoRouteOption[];
  activeRouteId: string;
  onSelectRoute: (routeId: string) => void;
  corridorName: string;
}

export const RouteCompare: React.FC<RouteCompareProps> = ({
  routes,
  activeRouteId,
  onSelectRoute,
  corridorName
}) => {
  if (routes.length === 0) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-3xl pointer-events-auto transition-all">
      <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-3 md:p-4 shadow-2xl shadow-black/90 text-white">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              PARETO ROUTING ARBITRATION • {corridorName.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            SELFISH ROUTING VS. COOPERATIVE INFRASTRUCTURE BALANCING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {routes.map((route) => {
            const isSelected = route.id === activeRouteId;
            const isCooperative = route.type === 'cooperative';

            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute(route.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? isCooperative
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-500/50'
                      : 'bg-rose-950/30 border-rose-500/80 shadow-lg shadow-rose-950/60 ring-1 ring-rose-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Header tag & name */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isCooperative
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {isCooperative ? <ShieldCheck className="w-3 h-3" /> : <AlertOctagon className="w-3 h-3" />}
                      {route.tag}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1 leading-snug">{route.name}</h4>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/30">
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="font-bold text-white">{route.durationMin} min</span>
                      <span className="text-[9px] text-slate-500 block">{route.distanceKm} km</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 block">ROAD STRESS</span>
                    <span
                      className={`font-bold ${
                        route.avgStress >= 70 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {route.avgStress}% Avg
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 block">IMPACT</span>
                    <span
                      className={`text-[10px] font-semibold leading-none ${
                        isCooperative ? 'text-cyan-300' : 'text-rose-400'
                      }`}
                    >
                      {isCooperative ? '-62% Fatigue' : 'High Pothole Risk'}
                    </span>
                  </div>
                </div>

                {/* Narrative note */}
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-2">
                  {route.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
