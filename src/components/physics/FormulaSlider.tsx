"use client";

// src/components/physics/FormulaSlider.tsx
import { useCallback } from "react";
import { motion } from "framer-motion";
import { FormulaRenderer } from "./FormulaRenderer";
import type { FormulaVariable } from "@/lib/constants/formulas-data";

interface FormulaSliderProps {
  variable:  FormulaVariable;
  value:     number;
  onChange:  (symbol: string, value: number) => void;
  color?:    string;
  disabled?: boolean;
}

function formatValue(value: number): string {
  const abs = Math.abs(value);
  if (abs === 0) return "0";
  if (abs >= 1e12) return `${(value / 1e12).toPrecision(3)}×10¹²`;
  if (abs >= 1e9)  return `${(value / 1e9).toPrecision(3)}×10⁹`;
  if (abs >= 1e6)  return `${(value / 1e6).toPrecision(3)}×10⁶`;
  if (abs >= 1e3)  return `${(value / 1e3).toPrecision(3)}×10³`;
  if (abs < 1e-9)  return value.toExponential(3);
  if (abs < 1e-6)  return `${(value * 1e9).toPrecision(3)} n`;
  if (abs < 1e-3)  return `${(value * 1e6).toPrecision(3)} μ`;
  if (abs < 1)     return value.toPrecision(4);
  return abs >= 100 ? value.toFixed(1) : value.toPrecision(4);
}

export function FormulaSlider({
  variable, value, onChange, color = "var(--color-primary)", disabled = false,
}: FormulaSliderProps) {

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(variable.symbol, Number(e.target.value));
    },
    [onChange, variable.symbol]
  );

  const pct = variable.max === variable.min
    ? 0
    : ((value - variable.min) / (variable.max - variable.min)) * 100;

  return (
    <div
      className="p-4 rounded-xl border space-y-3 transition-opacity"
      style={{
        background:  "var(--color-surface)",
        borderColor: "var(--color-border)",
        opacity:     disabled ? 0.5 : 1,
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Symbol */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: color + "18", color }}
          >
            <FormulaRenderer latex={variable.symbol} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
              {variable.name}
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {variable.description}
            </p>
          </div>
        </div>

        {/* Live value badge */}
        <motion.div
          key={value}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold"
          style={{ background: color + "18", color }}
        >
          {formatValue(value)}
          {variable.unit && (
            <span className="ml-1 opacity-70 font-normal">{variable.unit}</span>
          )}
        </motion.div>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Track fill */}
        <div
          className="absolute top-1/2 left-0 h-1.5 rounded-full pointer-events-none -translate-y-1/2"
          style={{ width: `${pct}%`, background: color, zIndex: 1 }}
        />
        <input
          type="range"
          min={variable.min}
          max={variable.max}
          step={variable.step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer relative"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, var(--color-border) ${pct}%, var(--color-border) 100%)`,
            accentColor: color,
          }}
        />
        {/* Min / Max labels */}
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {formatValue(variable.min)}
          </span>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {formatValue(variable.max)}
          </span>
        </div>
      </div>
    </div>
  );
}
