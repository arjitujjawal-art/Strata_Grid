import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { DEMO_SCENARIO_STEPS } from '../data/demoScript';
import { DemoScenarioStep } from '../types';

interface UseDemoScenarioOptions {
  map: mapboxgl.Map | null;
  onStepChange?: (step: DemoScenarioStep) => void;
  stepDurationMs?: number;
}

export function useDemoScenario({
  map,
  onStepChange,
  stepDurationMs = 11000
}: UseDemoScenarioOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = DEMO_SCENARIO_STEPS[currentStepIndex];

  // Execute camera movement and state update for a specific step
  const applyStep = useCallback(
    (stepIndex: number) => {
      const step = DEMO_SCENARIO_STEPS[stepIndex];
      if (!step) return;

      // Animate map camera with cinematic ease
      if (map) {
        map.flyTo({
          center: step.camera.center,
          zoom: step.camera.zoom,
          pitch: step.camera.pitch,
          bearing: step.camera.bearing,
          duration: 3500,
          essential: true
        });
      }

      if (onStepChange) {
        onStepChange(step);
      }
    },
    [map, onStepChange]
  );

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const next = prev + 1;
      if (next >= DEMO_SCENARIO_STEPS.length) {
        setIsPlaying(false);
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

  const startScenario = useCallback(() => {
    setIsPlaying(true);
    setCurrentStepIndex(0);
    applyStep(0);
  }, [applyStep]);

  const stopScenario = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < DEMO_SCENARIO_STEPS.length) {
        setCurrentStepIndex(index);
        applyStep(index);
      }
    },
    [applyStep]
  );

  // Timer loop when auto-playing
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next >= DEMO_SCENARIO_STEPS.length) {
          setIsPlaying(false);
          return prev;
        }
        applyStep(next);
        return next;
      });
    }, stepDurationMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, stepDurationMs, applyStep]);

  return {
    isPlaying,
    currentStepIndex,
    currentStep,
    totalSteps: DEMO_SCENARIO_STEPS.length,
    startScenario,
    stopScenario,
    nextStep,
    prevStep,
    goToStep
  };
}
