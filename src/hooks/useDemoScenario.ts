import { useState, useEffect, useRef, useCallback } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { DEMO_SCENARIO_STEPS } from '../data/demoScript';
import { DemoScenarioStep } from '../types';

interface UseDemoScenarioOptions {
  map: MapLibreMap | null;
  onStepChange?: (step: DemoScenarioStep) => void;
  baseStepDurationMs?: number;
}

export function useDemoScenario({
  map,
  onStepChange,
  baseStepDurationMs = 9500
}: UseDemoScenarioOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 1.5>(1);
  const [progressPct, setProgressPct] = useState(0);

  const stepStartTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onStepChangeRef = useRef(onStepChange);
  const mapRef = useRef(map);

  // Keep references fresh
  useEffect(() => {
    onStepChangeRef.current = onStepChange;
  }, [onStepChange]);

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  const stepDuration = Math.round(baseStepDurationMs / speedMultiplier);
  const currentStep = DEMO_SCENARIO_STEPS[currentStepIndex];

  // Execute camera movement and state update for a specific step
  const applyStep = useCallback((stepIndex: number) => {
    const step = DEMO_SCENARIO_STEPS[stepIndex];
    if (!step) return;

    stepStartTimeRef.current = Date.now();
    setProgressPct(0);

    // Animate map camera with cinematic ease
    const activeMap = mapRef.current;
    if (activeMap) {
      try {
        activeMap.flyTo({
          center: step.camera.center,
          zoom: step.camera.zoom,
          pitch: step.camera.pitch,
          bearing: step.camera.bearing,
          duration: 2800,
          essential: true
        });
      } catch (err) {
        console.debug('Camera flyTo caught:', err);
      }
    }

    if (onStepChangeRef.current) {
      onStepChangeRef.current(step);
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const next = prev + 1;
      if (next >= DEMO_SCENARIO_STEPS.length) {
        setIsPlaying(false);
        setIsPaused(false);
        return prev;
      }
      applyStep(next);
      return next;
    });
  }, [applyStep]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const next = Math.max(0, prev - 1);
      applyStep(next);
      return next;
    });
  }, [applyStep]);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < DEMO_SCENARIO_STEPS.length) {
        setCurrentStepIndex(index);
        applyStep(index);
      }
    },
    [applyStep]
  );

  const startScenario = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentStepIndex(0);
    applyStep(0);
  }, [applyStep]);

  const stopScenario = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setProgressPct(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Smooth progress ticker & auto-advance timer
  useEffect(() => {
    if (isPlaying && !isPaused) {
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - stepStartTimeRef.current;
        const pct = Math.min(100, Math.round((elapsed / stepDuration) * 100));
        setProgressPct(pct);

        if (elapsed >= stepDuration) {
          setCurrentStepIndex((prev) => {
            const next = prev + 1;
            if (next >= DEMO_SCENARIO_STEPS.length) {
              setIsPlaying(false);
              setIsPaused(false);
              return prev;
            }
            applyStep(next);
            return next;
          });
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, isPaused, stepDuration, applyStep]);

  return {
    isPlaying,
    isPaused,
    currentStepIndex,
    currentStep,
    totalSteps: DEMO_SCENARIO_STEPS.length,
    progressPct,
    speedMultiplier,
    setSpeedMultiplier,
    togglePause,
    startScenario,
    stopScenario,
    nextStep,
    prevStep,
    goToStep
  };
}
