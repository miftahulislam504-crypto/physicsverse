"use client";

// src/components/labs/OhmsLawSimulation.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const COLOR = "#22d3ee";

interface Params { voltage: number; resistance: number }

function CircuitDiagram({ voltage, current, resistance }: {
  voltage: number; current: number; resistance: number;
}) {
  const W = 320; const H = 220;
  const glowIntensity = Math.min(current / 2, 1);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: H }}>
      {/* Circuit wires */}
      <rect x={40} y={40} width={240} height={140} rx={8}
        fill="none" stroke={`rgba(34,211,238,${0.3 + glowIntensity * 0.4})`} strokeWidth={2.5} />

      {/* Battery (left side) */}
      <line x1={40} y1={85}  x2={40} y2={105} stroke={COLOR} strokeWidth={4} />
      <line x1={30} y1={100} x2={50} y2={100} stroke={COLOR} strokeWidth={2} />
      <line x1={35} y1={105} x2={45} y2={105} stroke={COLOR} strokeWidth={1.5} />
      <line x1={40} y1={105} x2={40} y2={125} stroke={COLOR} strokeWidth={4} />
      {/* Battery label */}
      <text x={8} y={112} fill={COLOR} fontSize={11} fontFamily="monospace">
        {voltage}V
      </text>

      {/* Resistor (right side, zig-zag) */}
      {[0,1,2,3,4,5].map((i) => (
        <line key={i}
          x1={280} y1={80 + i * 12}
          x2={280} y2={80 + (i + 1) * 12}
          stroke={`rgba(250,204,21,${0.6 + glowIntensity * 0.4})`}
          strokeWidth={3}
        />
      ))}
      {/* Resistor box */}
      <rect x={271} y={76} width={18} height={68} rx={3}
        fill="rgba(250,204,21,0.08)" stroke="rgba(250,204,21,0.5)" strokeWidth={1.5} />
      <text x={296} y={115} fill="#facc15" fontSize={11} fontFamily="monospace">
        {resistance}Ω
      </text>

      {/* Ammeter (top) */}
      <circle cx={160} cy={40} r={14}
        fill="rgba(34,211,238,0.1)" stroke={COLOR} strokeWidth={1.5} />
      <text x={160} y={44} fill={COLOR} fontSize={10}
        fontFamily="monospace" textAnchor="middle">A</text>
      <text x={160} y={20} fill={COLOR} fontSize={10}
        fontFamily="monospace" textAnchor="middle">
        {current.toFixed(3)}A
      </text>

      {/* Voltmeter (bottom) */}
      <circle cx={160} cy={180} r={14}
        fill="rgba(34,211,238,0.1)" stroke={COLOR} strokeWidth={1.5} />
      <text x={160} y={184} fill={COLOR} fontSize={10}
        fontFamily="monospace" textAnchor="middle">V</text>
      <text x={160} y={205} fill={COLOR} fontSize={10}
        fontFamily="monospace" textAnchor="middle">
        {voltage.toFixed(1)}V
      </text>

      {/* Current flow arrows */}
      {[80, 160, 240].map((x) => (
        <polygon key={x}
          points={`${x},35 ${x + 8},40 ${x},45`}
          fill={`rgba(34,211,238,${0.4 + glowIntensity * 0.5})`}
        />
      ))}

      {/* Power label */}
      <text x={160} y={120} fill="rgba(255,255,255,0.5)" fontSize={10}
        fontFamily="monospace" textAnchor="middle">
        P = {(voltage * current).toFixed(2)}W
      </text>
    </svg>
  );
}

export function OhmsLawSimulation() {
  const [params, setParams] = useState<Params>({ voltage: 6, resistance: 10 });
  const current = params.voltage / params.resistance;

  // Build I-V data (vary voltage, fixed R)
  const ivData = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => {
      const v = i * 0.5;
      return { v, i: v / params.resistance };
    }),
  [params.resistance]);

  // Build V-R data (vary resistance, fixed V)
  const vrData = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => {
      const r = (i + 1) * 2;
      return { r, i: params.voltage / r };
    }),
  [params.voltage]);

  return (
    <div className="space-y-5">
      {/* Circuit diagram */}
      <div
        className="rounded-2xl border p-4 flex items-center justify-center"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}
      >
        <CircuitDiagram
          voltage={params.voltage}
          current={current}
          resistance={params.resistance}
        />
      </div>

      {/* Sliders */}
      <div
        className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}>Adjust Circuit</p>

        {([
          { label: "Voltage (V)", key: "voltage",    min: 1, max: 24, step: 0.5, unit: "V", color: COLOR    },
          { label: "Resistance (R)", key: "resistance", min: 1, max: 100,step: 1,   unit: "Ω", color: "#facc15" },
        ] as const).map(({ label, key, min, max, step, unit, color }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
              <span className="font-mono" style={{ color }}>
                {params[key]} {unit}
              </span>
            </div>
            <input
              type="range" min={min} max={max} step={step} value={params[key]}
              onChange={(e) => setParams((p) => ({ ...p, [key]: +e.target.value }))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: color }}
            />
          </div>
        ))}
      </div>

      {/* Live readings */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Voltage V",   value: `${params.voltage} V`,                  color: COLOR       },
          { label: "Current I",   value: `${current.toFixed(4)} A`,               color: "#22c55e"   },
          { label: "Power P",     value: `${(params.voltage * current).toFixed(3)} W`, color: "#f97316" },
        ].map((s) => (
          <motion.div
            key={s.label}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 0.3 }}
            className="p-3 rounded-xl border text-center"
            style={{ background: "var(--color-surface)", borderColor: `${s.color}25` }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
            <p className="text-base font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* I-V Graph */}
      <div
        className="rounded-2xl border p-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-secondary)" }}>
          I–V Characteristic (R = {params.resistance} Ω fixed)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={ivData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
            <XAxis dataKey="v" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
              label={{ value: "Voltage (V)", position: "insideBottom", offset: -2, fontSize: 10, fill: "var(--color-text-muted)" }} />
            <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
              label={{ value: "Current (A)", angle: -90, position: "insideLeft", offset: 10, fontSize: 10, fill: "var(--color-text-muted)" }}
              width={50} />
            <Tooltip
              contentStyle={{ background: "var(--color-surface)", border: `1px solid ${COLOR}40`, borderRadius: 8, fontSize: 11 }}
              formatter={(val: number) => [`${val.toFixed(4)} A`, "Current"]}
              labelFormatter={(v) => `V = ${v} V`}
            />
            <Line type="monotone" dataKey="i" stroke={COLOR} strokeWidth={2} dot={false} />
            {/* Current operating point */}
            <ReferenceLine x={params.voltage} stroke={COLOR} strokeDasharray="4 4" opacity={0.6} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        className="p-3 rounded-xl text-xs"
        style={{ background: `${COLOR}07`, border: `1px solid ${COLOR}20`, color: "var(--color-text-secondary)" }}
      >
        💡 The <strong>slope of the I-V line = 1/R</strong>. Steeper slope = lower resistance = more current for same voltage.
      </div>
    </div>
  );
}
