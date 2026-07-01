"use client";

// src/components/physics/SimulationControls.tsx
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulationControlsProps {
  running:    boolean;
  finished:   boolean;
  onToggle:   () => void;
  onReset:    () => void;
  color?:     string;
  timeLabel?: string;   // e.g. "t = 3.2 s"
  className?: string;
}

export function SimulationControls({
  running, finished, onToggle, onReset,
  color = "var(--color-primary)",
  timeLabel,
  className,
}: SimulationControlsProps) {
  return (
    <div
      className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl border", className)}
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {/* Play / Pause */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
        style={{
          background: running ? "rgba(239,68,68,0.12)" : color + "18",
          color:      running ? "#ef4444"               : color,
          border:     `1px solid ${running ? "rgba(239,68,68,0.3)" : color + "40"}`,
        }}
      >
        {running
          ? <><Pause size={15} /> Pause</>
          : <><Play  size={15} /> {finished ? "Replay" : "Play"}</>
        }
      </button>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:scale-105"
        style={{
          background:  "var(--color-surface-2)",
          color:       "var(--color-text-secondary)",
          border:      "1px solid var(--color-border)",
        }}
      >
        <RotateCcw size={14} /> Reset
      </button>

      {/* Time display */}
      {timeLabel && (
        <div
          className="ml-auto text-xs font-mono px-3 py-1.5 rounded-lg"
          style={{
            background: color + "10",
            color,
          }}
        >
          {timeLabel}
        </div>
      )}

      {/* Running indicator */}
      {running && (
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: color }}
          />
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Live
          </span>
        </div>
      )}
    </div>
  );
}
