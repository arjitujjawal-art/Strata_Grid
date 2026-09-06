import React from 'react';
import { Clock, Navigation, AlertOctagon, ShieldCheck } from 'lucide-react';
import { GeoRouteOption } from '../../types';
import { DecoCorners } from '../common/DecoCorners';

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
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-3xl pointer-events-auto select-none font-body transition-all">
      <div className="bg-[#141414]/95 backdrop-blur-md border border-[#D4AF37] p-4 sm:p-5 shadow-[0_0_35px_rgba(0,0,0,0.9)] text-[#F2F0E4] relative">
        <DecoCorners />

        {/* Header Bar */}
        <div className="flex items-center justify-between mb-3 border-b border-[#D4AF37]/30 pb-2.5">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-display font-bold uppercase tracking-[0.2em] text-[#F2F0E4]">
              PARETO ROUTING ARBITRATION • {corridorName}
            </span>
          </div>
          <span className="text-[9px] font-body uppercase tracking-[0.25em] text-[#888888] hidden sm:inline">
            SELFISH ROUTING VS. COOPERATIVE INFRASTRUCTURE BALANCING
          </span>
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {routes.map((route, idx) => {
            const isSelected = route.id === activeRouteId;
            const isCooperative = route.type === 'cooperative';

            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute(route.id)}
                className={`p-3.5 border transition-all cursor-pointer relative ${
                  isSelected
                    ? isCooperative
                      ? 'bg-[#0A0A0A] border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                      : 'bg-[#0A0A0A] border-2 border-[#991B1B] shadow-[0_0_20px_rgba(153,27,27,0.3)]'
                    : 'bg-[#0A0A0A]/70 border border-[#D4AF37]/30 hover:border-[#D4AF37]/70'
                }`}
              >
                <DecoCorners />

                {/* Header Tag & Route Name */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[9px] font-display font-bold px-2 py-0.5 uppercase tracking-[0.2em] border ${
                        isCooperative
                          ? 'bg-[#141414] text-[#D4AF37] border-[#D4AF37]'
                          : 'bg-[#141414] text-[#F2E8C4] border-[#991B1B]'
                      }`}
                    >
                      {isCooperative ? <ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> : <AlertOctagon className="w-3 h-3 text-[#991B1B]" />}
                      {route.tag}
                    </span>
                    <h4 className="text-xs font-display font-bold text-[#F2F0E4] mt-2 tracking-[0.1em] uppercase">
                      {route.name}
                    </h4>
                  </div>
                  {isSelected && (
                    <span className="text-[9px] font-display font-bold px-2 py-0.5 bg-[#D4AF37] text-[#0A0A0A] uppercase tracking-wider">
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-[#D4AF37]/20 text-xs uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <div>
                      <span className="font-display font-bold text-[#F2F0E4]">{route.durationMin} MIN</span>
                      <span className="text-[8px] text-[#888888] block font-mono">{route.distanceKm} KM</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[8px] text-[#888888] block">ROAD STRESS</span>
                    <span
                      className={`font-display font-bold ${
                        route.avgStress >= 70 ? 'text-[#991B1B]' : 'text-[#D4AF37]'
                      }`}
                    >
                      {route.avgStress}% AVG
                    </span>
                  </div>

                  <div>
                    <span className="text-[8px] text-[#888888] block">IMPACT</span>
                    <span
                      className={`text-[9px] font-display font-bold leading-none ${
                        isCooperative ? 'text-[#D4AF37]' : 'text-[#991B1B]'
                      }`}
                    >
                      {isCooperative ? '-62% FATIGUE' : 'HIGH VOID RISK'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[10px] font-body text-[#888888] mt-2 leading-relaxed line-clamp-2 tracking-wide">
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
