"use client";

// src/lib/hooks/useJoystick.ts
import { useRef, useState, useCallback } from "react";

export interface JoystickVector { x: number; y: number }

export function useJoystick(maxRadius = 45) {
  const [active, setActive]   = useState(false);
  const [knobPos, setKnobPos] = useState<JoystickVector>({ x: 0, y: 0 });
  const vectorRef = useRef<JoystickVector>({ x: 0, y: 0 });
  const originRef = useRef<{ x: number; y: number } | null>(null);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    originRef.current = { x: clientX, y: clientY };
    setActive(true);
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!originRef.current) return;
    let dx = clientX - originRef.current.x;
    let dy = clientY - originRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxRadius) {
      dx = (dx / dist) * maxRadius;
      dy = (dy / dist) * maxRadius;
    }
    setKnobPos({ x: dx, y: dy });
    // Normalize to -1..1, y inverted (up = forward = -1 in screen space)
    vectorRef.current = { x: dx / maxRadius, y: -dy / maxRadius };
  }, [maxRadius]);

  const handleEnd = useCallback(() => {
    originRef.current = null;
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    vectorRef.current = { x: 0, y: 0 };
  }, []);

  return { active, knobPos, vectorRef, handleStart, handleMove, handleEnd };
}
