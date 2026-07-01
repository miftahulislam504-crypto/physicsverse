"use client";

// src/components/physics/FormulaGraph.tsx
import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceDot,
} from "recharts";
import type { FormulaData } from "@/lib/constants/formulas-data";

interface FormulaGraphProps {
  formula:  FormulaData;
  values:   Record<string, number>;
  color?:   string;
}

// ── Compute graph data points ─────────────────────────────────────────────────
function computePoints(
  formula: FormulaData,
  values:  Record<string, number>
): { x: number; y: number }[] {
  const xVar = formula.xVar;
  const xMeta = formula.variables.find((v) => v.symbol === xVar);
  if (!xMeta) return [];

  const POINTS = 60;
  const xMin = xMeta.min === 0 && formula.graphType === "inverse" ? xMeta.step : xMeta.min;
  const xMax = xMeta.max;
  const step = (xMax - xMin) / POINTS;

  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= POINTS; i++) {
    const x = xMin + i * step;
    if (x === 0 && formula.graphType === "inverse") continue;

    const vars = { ...values, [xVar]: x };
    const y = evalFormula(formula.id, vars);
    if (y !== null && isFinite(y) && !isNaN(y)) {
      points.push({ x: +x.toPrecision(4), y: +y.toPrecision(4) });
    }
  }
  return points;
}

// ── Formula evaluation ────────────────────────────────────────────────────────
function evalFormula(id: string, v: Record<string, number>): number | null {
  try {
    switch (id) {
      // Mechanics
      case "f-velocity":           return v["u"] + v["a"] * v["t"];
      case "f-displacement":       return v["u"] * v["t"] + 0.5 * v["a"] * v["t"] ** 2;
      case "f-velocity-squared":   return Math.sqrt(Math.max(0, v["u"] ** 2 + 2 * v["a"] * v["s"]));
      case "f-newtons-second":     return v["m"] * v["a"];
      case "f-weight":             return v["m"] * v["g"];
      case "f-kinetic-energy":     return 0.5 * v["m"] * v["v"] ** 2;
      case "f-potential-energy":   return v["m"] * v["g"] * v["h"];
      case "f-gravitational-force":return (6.674e-11 * v["m₁"] * v["m₂"]) / v["r"] ** 2;
      case "f-projectile-range": {
        const rad = (v["θ"] * Math.PI) / 180;
        return (v["u"] ** 2 * Math.sin(2 * rad)) / v["g"];
      }
      // Electricity
      case "f-ohms-law":           return v["I"] * v["R"];
      case "f-electrical-power":   return v["I"] * v["V"];
      // Waves
      case "f-wave-speed":         return v["v"] / v["λ"];  // f = v/λ
      // Optics
      case "f-snells-law": {
        const arg = (v["n₁"] * Math.sin((v["θ₁"] * Math.PI) / 180)) / v["n₂"];
        if (Math.abs(arg) > 1) return null; // TIR
        return (Math.asin(arg) * 180) / Math.PI;
      }
      // Modern
      case "f-photon-energy":      return v["h"] * v["f"];
      case "f-de-broglie":         return v["h"] / (v["m"] * v["v"]);
      default:                     return null;
    }
  } catch { return null; }
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, formula, color }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl border text-xs"
      style={{
        background:  "var(--color-surface)",
        borderColor: color + "40",
        boxShadow:   "var(--shadow-md)",
      }}
    >
      <p style={{ color: "var(--color-text-muted)" }}>
        {formula.graphLabel.x}: <span style={{ color }}>{Number(label).toPrecision(4)}</span>
      </p>
      <p style={{ color: "var(--color-text-muted)" }}>
        {formula.graphLabel.y}: <span style={{ color }}>{Number(payload[0].value).toPrecision(4)}</span>
      </p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function FormulaGraph({ formula, values, color = "#0090f0" }: FormulaGraphProps) {
  const points = useMemo(() => computePoints(formula, values), [formula, values]);

  // Current point from slider values
  const currentX    = values[formula.xVar];
  const currentY    = evalFormula(formula.id, values);

  if (points.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-56 rounded-2xl border"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Graph not available for this formula
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {/* Graph title */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold" style={{ color: "var(--color-text-secondary)" }}>
          {formula.graphLabel.y} vs {formula.graphLabel.x}
        </p>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: color + "15", color }}
        >
          Live
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={points} margin={{ top: 5, right: 16, bottom: 5, left: 8 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            opacity={0.5}
          />
          <XAxis
            dataKey="x"
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
            label={{
              value:    formula.graphLabel.x,
              position: "insideBottom",
              offset:   -2,
              fontSize: 10,
              fill:     "var(--color-text-muted)",
            }}
            tickFormatter={(v) => Number(v).toPrecision(3)}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
            label={{
              value:    formula.graphLabel.y,
              angle:    -90,
              position: "insideLeft",
              offset:   8,
              fontSize: 10,
              fill:     "var(--color-text-muted)",
            }}
            tickFormatter={(v) => Number(v).toPrecision(3)}
            width={55}
          />
          <Tooltip content={<CustomTooltip formula={formula} color={color} />} />
          <Line
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "var(--color-surface)", strokeWidth: 2 }}
          />
          {/* Current value highlight */}
          {currentY !== null && currentX !== undefined && (
            <ReferenceDot
              x={currentX}
              y={currentY}
              r={5}
              fill={color}
              stroke="var(--color-surface)"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
