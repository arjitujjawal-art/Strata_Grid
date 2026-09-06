import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { TerminalLog as TerminalLogType } from '../../types';
import { DecoCorners } from '../common/DecoCorners';

interface TerminalLogProps {
  logs: TerminalLogType[];
  onClearLogs?: () => void;
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ logs, onClearLogs }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  const getLevelClass = (level: TerminalLogType['level']) => {
    switch (level) {
      case 'alert':
        return 'text-[#991B1B] font-bold';
      case 'warn':
        return 'text-[#D4AF37] font-semibold';
      case 'success':
        return 'text-[#10B981] font-semibold';
      case 'info':
      default:
        return 'text-[#F2E8C4]';
    }
  };

  return (
    <div className="absolute bottom-6 left-4 z-20 w-72 md:w-84 pointer-events-auto select-none font-body transition-all">
      <div className="bg-[#141414]/95 backdrop-blur-md border border-[#D4AF37] shadow-[0_0_25px_rgba(0,0,0,0.9)] text-[#F2F0E4] overflow-hidden relative">
        <DecoCorners />

        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0A0A0A] border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2 text-xs font-display tracking-[0.15em]">
            <Terminal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-bold text-[#F2F0E4] uppercase">TELEMETRY STREAM</span>
            <span className="text-[10px] text-[#888888] font-mono">({logs.length})</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onClearLogs && (
              <button
                onClick={onClearLogs}
                className="text-[#888888] hover:text-[#D4AF37] p-1 transition-colors cursor-pointer"
                title="Clear console"
                aria-label="Clear Console"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#888888] hover:text-[#D4AF37] p-1 transition-colors cursor-pointer"
              aria-label={isExpanded ? "Collapse Console" : "Expand Console"}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Log body */}
        {isExpanded && (
          <div className="p-3 h-28 overflow-y-auto space-y-1.5 font-mono text-[11px] scrollbar-thin scrollbar-thumb-[#D4AF37]">
            {logs.length === 0 ? (
              <div className="text-[#888888] text-center py-4 uppercase text-[10px] tracking-wider">
                Telemetry ticker standing by...
              </div>
            ) : (
              logs.slice(-25).map((log) => (
                <div key={log.id} className="leading-tight flex items-start gap-2">
                  <span className="text-[#888888] text-[9px] select-none font-mono">
                    [{log.timestamp}]
                  </span>
                  <span className={getLevelClass(log.level)}>{log.message}</span>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
};
