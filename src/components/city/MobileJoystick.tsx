"use client";

// src/components/city/MobileJoystick.tsx
import { useCallback } from "react";
import { motion } from "framer-motion";
import { useJoystick } from "@/lib/hooks/useJoystick";

interface MobileJoystickProps {
  onVectorChange: (x: number, y: number) => void;
}

export function MobileJoystick({ onVectorChange }: MobileJoystickProps) {
  const { active, knobPos, handleStart, handleMove, handleEnd } = useJoystick();

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    handleStart(t.clientX, t.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    handleMove(t.clientX, t.clientY);
    // Report normalized vector up to parent
    const dx = t.clientX;
    const dy = t.clientY;
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
    onVectorChange(0, 0);
  }, [handleEnd, onVectorChange]);

  // Report vector on every move via effect-like callback
  const handleMoveWithReport = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    handleMove(t.clientX, t.clientY);
  }, [handleMove]);

  return (
    <div
      className="fixed bottom-8 left-8 z-40 lg:hidden touch-none select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleMoveWithReport}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: 100, height: 100,
          background: "rgba(0,144,240,0.08)",
          border: "1.5px solid rgba(0,144,240,0.3)",
          backdropFilter: "blur(4px)",
        }}
      >
        <motion.div
          animate={{ x: knobPos.x, y: knobPos.y }}
          transition={{ type: "spring", stiffness: active ? 800 : 300, damping: 25 }}
          className="w-11 h-11 rounded-full"
          style={{
            background: "rgba(0,144,240,0.6)",
            border: "1.5px solid rgba(0,144,240,0.9)",
            boxShadow: "0 0 12px rgba(0,144,240,0.5)",
          }}
        />
      </div>
      <p className="text-center text-xs mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
        Move
      </p>
    </div>
  );
}
