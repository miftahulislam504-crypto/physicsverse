"use client";

// src/lib/hooks/useKeyboardControls.ts
import { useEffect, useRef } from "react";

export interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
}

const KEY_MAP: Record<string, keyof MovementState> = {
  KeyW: "forward", ArrowUp: "forward",
  KeyS: "backward", ArrowDown: "backward",
  KeyA: "left", ArrowLeft: "left",
  KeyD: "right", ArrowRight: "right",
  ShiftLeft: "sprint", ShiftRight: "sprint",
};

export function useKeyboardControls() {
  const stateRef = useRef<MovementState>({
    forward: false, backward: false, left: false, right: false, sprint: false,
  });

  useEffect(() => {
    function handleDown(e: KeyboardEvent) {
      const key = KEY_MAP[e.code];
      if (key) { stateRef.current[key] = true; }
    }
    function handleUp(e: KeyboardEvent) {
      const key = KEY_MAP[e.code];
      if (key) { stateRef.current[key] = false; }
    }
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);

  return stateRef;
}
