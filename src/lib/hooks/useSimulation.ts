"use client";

// src/lib/hooks/useSimulation.ts
// Generic animation loop for all physics simulations

import { useState, useEffect, useRef, useCallback } from "react";

interface SimulationOptions {
  fps?:         number;    // target frames per second (default 60)
  autoStart?:   boolean;
  maxTime?:     number;    // stop at this t (seconds), undefined = infinite
}

export interface SimState {
  t:        number;   // simulation time (seconds)
  running:  boolean;
  finished: boolean;
}

export function useSimulation(options: SimulationOptions = {}) {
  const { fps = 60, autoStart = false, maxTime } = options;

  const [state, setState] = useState<SimState>({ t: 0, running: false, finished: false });
  const rafRef   = useRef<number | null>(null);
  const lastRef  = useRef<number | null>(null);
  const tRef     = useRef(0);
  const runRef   = useRef(false);

  const tick = useCallback((now: number) => {
    if (!runRef.current) return;

    const dt = lastRef.current !== null
      ? Math.min((now - lastRef.current) / 1000, 1 / fps * 2) // clamp delta
      : 0;
    lastRef.current = now;

    tRef.current += dt;

    const finished = maxTime !== undefined && tRef.current >= maxTime;
    if (finished) {
      tRef.current = maxTime!;
      runRef.current = false;
    }

    setState({ t: tRef.current, running: runRef.current, finished });

    if (!finished) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [fps, maxTime]);

  const play = useCallback(() => {
    if (runRef.current) return;
    runRef.current = true;
    lastRef.current = null;
    setState((s) => ({ ...s, running: true, finished: false }));
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    runRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setState((s) => ({ ...s, running: false }));
  }, []);

  const reset = useCallback(() => {
    runRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    tRef.current   = 0;
    lastRef.current = null;
    setState({ t: 0, running: false, finished: false });
  }, []);

  const toggle = useCallback(() => {
    if (runRef.current) pause(); else play();
  }, [play, pause]);

  // Auto-start
  useEffect(() => {
    if (autoStart) play();
    return () => {
      runRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, play, pause, reset, toggle };
}
