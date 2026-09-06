import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: React.ReactNode;
  title?: string;
  badge?: string;
  badgeColor?: 'teal' | 'amber' | 'rose' | 'slate';
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  title,
  badge,
  badgeColor = 'teal',
  position = 'top',
  children,
  delay = 150,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Positioning classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent border-t-[6px] border-x-[5px] border-b-0',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent border-b-[6px] border-x-[5px] border-t-0',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent border-l-[6px] border-y-[5px] border-r-0',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent border-r-[6px] border-y-[5px] border-l-0'
  };

  const badgeColors = {
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    slate: 'bg-slate-700/50 text-slate-300 border-slate-600'
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none w-64 max-w-xs p-3 rounded-xl bg-[#161b22] border border-slate-700 shadow-2xl shadow-black/80 backdrop-blur-xl text-left transition-all duration-200 animate-fadeIn ${positionClasses[position]}`}
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
        >
          {/* Arrow */}
          <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />

          {/* Header */}
          {(title || badge) && (
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-800">
              {title && (
                <span className="text-xs font-headline font-bold text-white tracking-tight flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-400" />
                  {title}
                </span>
              )}
              {badge && (
                <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${badgeColors[badgeColor]}`}>
                  {badge}
                </span>
              )}
            </div>
          )}

          {/* Body Content */}
          <div className="text-[11px] font-sans text-slate-300 leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};
