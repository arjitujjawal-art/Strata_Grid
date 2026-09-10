import React from 'react';
import { Square, ChevronRight, ChevronLeft, Play, Pause, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { DemoScenarioStep } from '../../types';
import { DecoCorners } from '../common/DecoCorners';

interface ScenarioOverlayProps {
  currentStep: DemoScenarioStep;
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  isPaused?: boolean;
  progressPct?: number;
  speedMultiplier?: 1 | 1.5;
  onTogglePause?: () => void;
  onToggleSpeed?: () => void;
  onNext: () => void;
  onPrev: () => void;
  onStop: () => void;
  onGoToStep: (idx: number) => void;
}

const PHASE_NAMES = [
  { roman: 'I', label: 'Baseline' },
  { roman: 'II', label: 'Monsoon' },
  { roman: 'III', label: 'GPS Overload' },
  { roman: 'IV', label: 'AI Balance' },
  { roman: 'V', label: 'Freight Ring' },
  { roman: 'VI', label: 'Equilibrium' }
];

export const ScenarioOverlay: React.FC<ScenarioOverlayProps> = ({
  currentStep,
  currentStepIndex,
  totalSteps,
  isPlaying: _isPlaying,
  isPaused = false,
  progressPct = 0,
  speedMultiplier = 1,
  onTogglePause,
  onToggleSpeed,
  onNext,
  onPrev,
  onStop,
  onGoToStep
}) => {
  const metrics = currentStep.metrics;

  return (
    <div className="absolute top-[128px] left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-3xl pointer-events-auto select-none font-body transition-all animate-in fade-in duration-300">
      <div className="bg-[#141414]/95 backdrop-blur-xl border-2 border-[#D4AF37] p-5 shadow-[0_0_40px_rgba(0,0,0,0.95)] text-[#F2F0E4] relative overflow-hidden">
        <DecoCorners />

        {/* Dynamic Art Deco Progress Bar along top edge */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#0A0A0A]">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F2E8C4] to-[#D4AF37] transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(212,175,55,0.8)]"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Top gold accent diamond */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="w-16 h-[1px] bg-[#D4AF37]" />
          <div className="w-2.5 h-2.5 bg-[#D4AF37] rotate-45" />
          <div className="w-16 h-[1px] bg-[#D4AF37]" />
        </div>

        {/* Header row with Phase Pill and Playback Controls */}
        <div className="flex items-center justify-between gap-4 pt-1 border-b border-[#D4AF37]/20 pb-3">
          <div className="flex items-center gap-3">
            <span className="bg-[#0A0A0A] text-[#D4AF37] border border-[#D4AF37] text-[10px] font-display font-bold px-3 py-1 uppercase tracking-[0.25em] shadow-[0_0_10px_rgba(212,175,55,0.3)]">
              PHASE {PHASE_NAMES[currentStepIndex]?.roman || currentStepIndex + 1} OF VI
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-[#888888]' : 'bg-[#10B981] animate-ping'}`} />
              <span className="text-[9px] uppercase font-body tracking-[0.2em] text-[#D4AF37]/80">
                {isPaused ? 'DEMO PAUSED' : 'ORCHESTRATION IN PROGRESS'}
              </span>
            </div>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 border border-[#D4AF37]/50">
            <button
              onClick={onPrev}
              disabled={currentStepIndex === 0}
              className="p-1.5 text-[#888888] hover:text-[#D4AF37] disabled:opacity-25 transition-colors cursor-pointer"
              title="Previous phase"
              aria-label="Previous Phase"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {onTogglePause && (
              <button
                onClick={onTogglePause}
                className="px-2 py-1 text-[#D4AF37] hover:bg-[#D4AF37]/10 text-[9px] font-display font-bold tracking-wider uppercase flex items-center gap-1 transition-colors cursor-pointer"
                title={isPaused ? 'Resume playback' : 'Pause playback'}
              >
                {isPaused ? <Play className="w-3 h-3 fill-[#D4AF37]" /> : <Pause className="w-3 h-3" />}
                {isPaused ? 'RESUME' : 'PAUSE'}
              </button>
            )}

            {onToggleSpeed && (
              <button
                onClick={onToggleSpeed}
                className="px-2 py-1 text-[9px] font-display font-bold tracking-wider uppercase border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] cursor-pointer"
                title="Toggle playback speed"
              >
                {speedMultiplier}x
              </button>
            )}

            <button
              onClick={onNext}
              disabled={currentStepIndex === totalSteps - 1}
              className="p-1.5 text-[#888888] hover:text-[#D4AF37] disabled:opacity-25 transition-colors cursor-pointer"
              title="Next phase"
              aria-label="Next Phase"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onStop}
              className="px-2.5 py-1 bg-[#991B1B] hover:bg-[#B91C1C] text-[#F2E8C4] text-[9px] font-display font-bold tracking-[0.2em] uppercase flex items-center gap-1 transition-all cursor-pointer"
              title="Exit demo scenario"
            >
              <Square className="w-3 h-3 fill-[#F2E8C4]" />
              HALT
            </button>
          </div>
        </div>

        {/* Narrative Title & Caption */}
        <div className="mt-3">
          <h3 className="text-base sm:text-xl font-display font-bold text-[#F2F0E4] leading-snug tracking-[0.1em] uppercase">
            {currentStep.title}
          </h3>
          <p className="text-xs sm:text-sm font-body text-[#F2F0E4]/85 mt-1.5 leading-relaxed tracking-wide">
            {currentStep.caption}
          </p>
        </div>

        {/* Prominent Problem vs Solution Banner */}
        {currentStep.bannerType && currentStep.bannerHeadline && (
          <div
            className={`mt-3.5 p-3 border ${
              currentStep.bannerType === 'problem'
                ? 'bg-[#1C0F0F]/90 border-[#991B1B] shadow-[0_0_20px_rgba(153,27,27,0.3)]'
                : currentStep.bannerType === 'solution'
                ? 'bg-[#141A14]/90 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                : 'bg-[#0A0A0A] border-[#D4AF37]/40'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {currentStep.bannerType === 'problem' ? (
                <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
              ) : currentStep.bannerType === 'solution' ? (
                <Zap className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              )}
              <div>
                <h4
                  className={`text-[11px] sm:text-xs font-display font-bold uppercase tracking-[0.15em] ${
                    currentStep.bannerType === 'problem'
                      ? 'text-[#FCA5A5]'
                      : currentStep.bannerType === 'solution'
                      ? 'text-[#D4AF37]'
                      : 'text-[#F2F0E4]'
                  }`}
                >
                  {currentStep.bannerHeadline}
                </h4>
                <p className="text-[11px] font-body text-[#F2F0E4]/80 mt-0.5 leading-snug">
                  {currentStep.bannerDetail}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Live 4-Column Presentation Telemetry Metrics */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5">
            <div className="bg-[#0A0A0A] p-2.5 border border-[#D4AF37]/30 text-center">
              <span className="text-[9px] uppercase font-display tracking-[0.2em] text-[#888888] block">
                AXLE STRAIN
              </span>
              <span
                className={`text-lg sm:text-xl font-display font-bold block mt-0.5 ${
                  metrics.statusColor === 'red'
                    ? 'text-[#EF4444]'
                    : metrics.statusColor === 'gold'
                    ? 'text-[#D4AF37]'
                    : 'text-[#10B981]'
                }`}
              >
                {metrics.strainPct}%
              </span>
            </div>

            <div className="bg-[#0A0A0A] p-2.5 border border-[#D4AF37]/30 text-center">
              <span className="text-[9px] uppercase font-display tracking-[0.2em] text-[#888888] block">
                ROAD INTEGRITY
              </span>
              <span className="text-xs sm:text-sm font-display font-bold text-[#F2F0E4] block mt-1 truncate">
                {metrics.conditionText}
              </span>
            </div>

            <div className="bg-[#0A0A0A] p-2.5 border border-[#D4AF37]/30 text-center">
              <span className="text-[9px] uppercase font-display tracking-[0.2em] text-[#888888] block">
                TRANSIT TIME
              </span>
              <span className="text-lg sm:text-xl font-display font-bold text-[#F2E8C4] block mt-0.5">
                {metrics.commuteMin}m
              </span>
            </div>

            <div className="bg-[#0A0A0A] p-2.5 border border-[#D4AF37]/30 text-center">
              <span className="text-[9px] uppercase font-display tracking-[0.2em] text-[#888888] block">
                IMPACT DELTA
              </span>
              <span className="text-xs sm:text-sm font-display font-bold text-[#D4AF37] block mt-1 truncate">
                {metrics.impactSavings}
              </span>
            </div>
          </div>
        )}

        {/* Roman Numeral Scrubber Buttons (Phases I - VI) */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-3 border-t border-[#D4AF37]/30">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const info = PHASE_NAMES[idx] || { roman: `${idx + 1}`, label: `Phase ${idx + 1}` };
            const isActive = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;

            return (
              <button
                key={idx}
                onClick={() => onGoToStep(idx)}
                className={`p-1.5 transition-all border cursor-pointer uppercase flex flex-col items-center justify-center ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.6)]'
                    : isPast
                    ? 'bg-[#141414] text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/10'
                    : 'bg-[#0A0A0A] text-[#888888] border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:text-[#F2F0E4]'
                }`}
                title={`Jump to Phase ${info.roman}: ${info.label}`}
              >
                <span className="text-[10px] font-display font-bold">{info.roman}</span>
                <span className="text-[8px] font-body tracking-wider opacity-85 truncate max-w-[85px]">
                  {info.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
