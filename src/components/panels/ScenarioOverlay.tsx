import React from 'react';
import { Square, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { DemoScenarioStep } from '../../types';
import { DecoCorners } from '../common/DecoCorners';

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

const ROMAN_STEPS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

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
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-2xl pointer-events-auto select-none font-body transition-all animate-in fade-in duration-300">
      <div className="bg-[#141414]/95 backdrop-blur-xl border border-[#D4AF37] p-5 shadow-[0_0_35px_rgba(0,0,0,0.9)] text-[#F2F0E4] relative">
        <DecoCorners />

        {/* Top gold accent line with diamond */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="w-12 h-[1px] bg-[#D4AF37]" />
          <div className="w-2 h-2 bg-[#D4AF37] rotate-45" />
          <div className="w-12 h-[1px] bg-[#D4AF37]" />
        </div>

        <div className="flex items-start justify-between gap-4 pt-1">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37] text-[9px] font-display font-bold px-3 py-0.5 uppercase tracking-[0.25em]">
                PHASE {ROMAN_STEPS[currentStepIndex] || currentStepIndex + 1} OF VI
              </span>
              <span className="text-[9px] uppercase font-body tracking-[0.2em] text-[#888888]">
                DEMO NARRATIVE PLAYTHROUGH
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-display font-bold text-[#F2F0E4] mt-2 leading-snug tracking-[0.1em] uppercase">
              {currentStep.title}
            </h3>
            <p className="text-xs font-body text-[#F2F0E4]/80 mt-1.5 leading-relaxed tracking-wide">
              {currentStep.caption}
            </p>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 border border-[#D4AF37]/50">
            <button
              onClick={onPrev}
              disabled={currentStepIndex === 0}
              className="p-1.5 text-[#888888] hover:text-[#D4AF37] disabled:opacity-30 transition-colors cursor-pointer"
              title="Previous phase"
              aria-label="Previous Phase"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onStop}
              className="px-2.5 py-1 bg-[#991B1B] hover:bg-[#B91C1C] text-[#F2E8C4] text-[9px] font-display font-bold tracking-[0.2em] uppercase flex items-center gap-1 transition-all cursor-pointer"
              title="Halt playback"
            >
              <Square className="w-3 h-3 fill-[#F2E8C4]" />
              HALT
            </button>

            <button
              onClick={onNext}
              disabled={currentStepIndex === totalSteps - 1}
              className="p-1.5 text-[#888888] hover:text-[#D4AF37] disabled:opacity-30 transition-colors cursor-pointer"
              title="Next phase"
              aria-label="Next Phase"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Roman Numeral Step Buttons */}
        <div className="grid grid-cols-6 gap-2 mt-4 pt-3 border-t border-[#D4AF37]/30">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => onGoToStep(idx)}
              className={`h-6 text-[9px] font-display font-bold transition-all border cursor-pointer uppercase tracking-wider flex items-center justify-center ${
                idx === currentStepIndex
                  ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.5)]'
                  : idx < currentStepIndex
                  ? 'bg-[#141414] text-[#D4AF37] border-[#D4AF37]/50'
                  : 'bg-[#0A0A0A] text-[#888888] border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
              }`}
              title={`Phase ${ROMAN_STEPS[idx]}`}
            >
              {ROMAN_STEPS[idx]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
