import React from 'react';
import { Play, Square, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { DemoScenarioStep } from '../../types';

interface ScenarioOverlayProps {
  currentStep: DemoScenarioStep;
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onNext: () => void;
  onPrev: () => void;
  onStop: () => void;
  onGoToStep: (idx: number) => void;
}

export const ScenarioOverlay: React.FC<ScenarioOverlayProps> = ({
  currentStep,
  currentStepIndex,
  totalSteps,
  isPlaying,
  onNext,
  onPrev,
  onStop,
  onGoToStep
}) => {
  return (
    <div className="absolute top-18 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl pointer-events-auto transition-all animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-950/95 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-4 shadow-2xl shadow-cyan-950/70 text-white relative overflow-hidden">
        {/* Glowing top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {currentStep.phase}
              </span>
              <span className="text-xs font-mono text-slate-400">DEMO NARRATIVE PLAYTHROUGH</span>
            </div>

            <h3 className="text-base font-bold text-white mt-1.5 leading-snug">{currentStep.title}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentStep.caption}</p>
          </div>

          {/* Player controls */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={onPrev}
                disabled={currentStepIndex === 0}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onStop}
                className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
                title="Stop auto-play"
              >
                <Square className="w-3 h-3 fill-rose-300" />
                STOP
              </button>

              <button
                onClick={onNext}
                disabled={currentStepIndex === totalSteps - 1}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                title="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Step progress pills */}
        <div className="grid grid-cols-6 gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => onGoToStep(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'bg-cyan-400 shadow-md shadow-cyan-400/50 scale-y-125'
                  : idx < currentStepIndex
                  ? 'bg-cyan-600/60'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Step ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
