import React, { useRef, useEffect, useState, useMemo } from 'react';
import { PuneHexCell } from '../types';
import { PUNE_ROUTES } from '../data/puneRoutes';

interface DigitalTwinFallbackProps {
  cells: PuneHexCell[];
  activeRouteId: string;
  onSelectCell?: (cell: PuneHexCell) => void;
  selectedCellId?: string | null;
}

export const DigitalTwinFallback: React.FC<DigitalTwinFallbackProps> = ({
  cells,
  activeRouteId,
  onSelectCell,
  selectedCellId
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCell, setHoveredCell] = useState<PuneHexCell | null>(null);

  // Bounds for Pune Metro
  const bounds = useMemo(() => {
    let minLng = 73.68, maxLng = 73.98;
    let minLat = 18.46, maxLat = 18.68;
    return { minLng, maxLng, minLat, maxLat };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Convert Geo to Screen coords
    const project = (lng: number, lat: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const pad = 60;
      const x = pad + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (w - pad * 2);
      // Invert Y
      const y = h - pad - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (h - pad * 2);
      return { x, y };
    };

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep obsidian background with Gatsby crosshatch lines
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Faint Art Deco radial backdrop
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 50,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
      );
      grad.addColorStop(0, 'rgba(212, 175, 55, 0.05)');
      grad.addColorStop(1, 'rgba(10, 10, 10, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw H3 Hexagons as isometric pads
      for (const cell of cells) {
        const center = project(cell.center[0], cell.center[1]);
        const radius = 18;
        const isSelected = selectedCellId === cell.h3Index;

        // Color based on stress
        let fillColor = 'rgba(6, 78, 59, 0.45)'; // Emerald
        let strokeColor = 'rgba(212, 175, 55, 0.35)'; // Gold wireframe

        if (cell.isClosed) {
          fillColor = 'rgba(127, 29, 29, 0.85)';
          strokeColor = '#EF4444';
        } else if (cell.calculatedStress >= 86) {
          fillColor = 'rgba(153, 27, 27, 0.75)';
          strokeColor = '#EF4444';
        } else if (cell.calculatedStress >= 70) {
          fillColor = 'rgba(194, 65, 12, 0.65)';
          strokeColor = '#F59E0B';
        } else if (cell.calculatedStress >= 45) {
          fillColor = 'rgba(154, 123, 28, 0.55)';
          strokeColor = '#D4AF37';
        }

        if (isSelected) {
          fillColor = 'rgba(212, 175, 55, 0.65)';
          strokeColor = '#FFFFFF';
        }

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i + Math.PI / 6;
          const hx = center.x + radius * Math.cos(angle);
          const hy = center.y + (radius * 0.75) * Math.sin(angle); // 2.5D squish
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = isSelected ? 2.5 : 1;
        ctx.stroke();

        // High stress extrusion shadow
        if (cell.calculatedStress >= 80) {
          ctx.beginPath();
          ctx.arc(center.x, center.y, radius * 1.2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + 0.3 * Math.sin(tick * 0.08)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Draw Routes
      for (const route of PUNE_ROUTES) {
        if (route.pathCoords.length < 2) continue;
        const isActive = route.id === activeRouteId;

        ctx.beginPath();
        const start = project(route.pathCoords[0][0], route.pathCoords[0][1]);
        ctx.moveTo(start.x, start.y);

        for (let i = 1; i < route.pathCoords.length; i++) {
          const p = project(route.pathCoords[i][0], route.pathCoords[i][1]);
          ctx.lineTo(p.x, p.y);
        }

        // Route Glow
        ctx.strokeStyle = route.color;
        ctx.lineWidth = isActive ? 6 : 2;
        ctx.globalAlpha = isActive ? 0.9 : 0.3;
        ctx.stroke();

        if (isActive) {
          ctx.lineWidth = 14;
          ctx.globalAlpha = 0.25;
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
      }

      // Animated traffic particles along the active route
      const activeRoute = PUNE_ROUTES.find((r) => r.id === activeRouteId);
      if (activeRoute && activeRoute.pathCoords.length > 1) {
        const count = 15;
        for (let i = 0; i < count; i++) {
          const t = (tick * 0.003 + i / count) % 1;
          // Simple lerp between route coords
          const totalIdx = t * (activeRoute.pathCoords.length - 1);
          const i1 = Math.floor(totalIdx);
          const i2 = Math.min(activeRoute.pathCoords.length - 1, i1 + 1);
          const frac = totalIdx - i1;
          const p1 = activeRoute.pathCoords[i1];
          const p2 = activeRoute.pathCoords[i2];
          const lng = p1[0] + (p2[0] - p1[0]) * frac;
          const lat = p1[1] + (p2[1] - p1[1]) * frac;
          const screenPos = project(lng, lat);

          // Draw vehicle dot
          ctx.beginPath();
          ctx.arc(screenPos.x, screenPos.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = activeRoute.type === 'cooperative' ? '#D4AF37' : '#EF4444';
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [cells, activeRouteId, selectedCellId, bounds]);

  return (
    <div className="relative w-full h-full bg-[#0A0A0A] overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

      {/* Mode Badge */}
      <div className="absolute bottom-4 right-4 bg-[#141414]/90 border border-[#D4AF37] px-3 py-1.5 text-[9px] font-display text-[#D4AF37] uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        2.5D DIGITAL TWIN CANVAS ACTIVE (WEBGL COMPATIBILITY SAFE MODE)
      </div>
    </div>
  );
};
