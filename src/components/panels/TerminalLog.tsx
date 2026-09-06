import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { TerminalLog as TerminalLogType } from '../../types';

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
        return 'text-rose-400 font-bold';
      case 'warn':
        return 'text-amber-400';
      case 'success':
        return 'text-emerald-400 font-semibold';
      case 'info':
      default:
        return 'text-cyan-300';
    }
  };

  return (
    <div className="absolute bottom-6 left-4 z-20 w-72 md:w-84 pointer-events-auto transition-all">
      <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800/90 rounded-2xl shadow-2xl shadow-black/80 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-slate-300">TELEMETRY STREAM</span>
            <span className="text-[10px] text-slate-500 font-mono">({logs.length})</span>
          </div>

          <div className="flex items-center gap-1">
            {onClearLogs && (
              <button
                onClick={onClearLogs}
                className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
                title="Clear terminal"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Log body */}
        {isExpanded && (
          <div className="p-2.5 h-28 overflow-y-auto space-y-1 font-mono text-[11px] scrollbar-thin scrollbar-thumb-slate-800">
            {logs.length === 0 ? (
              <div className="text-slate-600 text-center py-4">Kernel telemetry stream idle...</div>
            ) : (
              logs.slice(-25).map((log) => (
                <div key={log.id} className="leading-tight flex items-start gap-1.5">
                  <span className="text-slate-500 text-[10px] select-none">[{log.timestamp}]</span>
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
