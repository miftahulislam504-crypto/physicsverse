"use client";

// src/components/labs/VelocityExplorerSimulation.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const COLOR = "#f97316";

interface Params {
  u: number;   // initial velocity m/s
  a: number;   // acceleration m/s²
}

export function VelocityExplorerSimulation() {
  const [params, setParams] = useState<Params>({ u: 5, a: 2 });
  const [tMax] = useState(10);

  const data = useMemo(() => {
    return Array.from({ length: 101 }, (_, i) => {
      const t = (i / 100) * tMax;
      const v = params.u + params.a * t;
      const s = params.u * t + 0.5 * params.a * t ** 2;
      return { t: +t.toFixed(2), v: +v.toFixed(3), s: +s.toFixed(3) };
    });
  }, [params, tMax]);

  // Time when velocity = 0 (if deceleration)
  const tZeroV = params.a !== 0 ? -params.u / params.a : null;
  const showZero = tZeroV !== null && tZeroV > 0 && tZeroV < tMax;

  const Slider = ({ label, value, min, max, step, unit, key_, color = COLOR }: {
    label: string; value: number; min: number; max: number;
    step: number; unit: string; key_: keyof Params; color?: string;
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
        <span className="font-mono" style={{ color }}>
          {value > 0 ? "+" : ""}{value} {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => setParams((p) => ({ ...p, [key_]: +e.target.value }))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }} />
      <div className="flex justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
        <span>{min}</span><span>{max}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Sliders */}
      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}>Parameters</p>
        <Slider label="Initial Velocity (u)" value={params.u} min={-20} max={30}
          step={0.5} unit="m/s" key_="u" />
        <Slider label="Acceleration (a)" value={params.a} min={-10} max={10}
          step={0.5} unit="m/s²" key_="a" color="#a78bfa" />
      </div>

      {/* s-t Graph */}
      <div className="rounded-2xl border p-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-secondary)" }}>
          Displacement–Time (s–t)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
            <XAxis dataKey="t" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
              label={{ value: "Time t (s)", position: "insideBottom", offset: -2, fontSize: 10, fill: "var(--color-text-muted)" }} />
            <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
              label={{ value: "s (m)", angle: -90, position: "insideLeft", fontSize: 10, fill: "var(--color-text-muted)" }} width={45} />
            <Tooltip contentStyle={{ background: "var(--color-surface)", border: `1px solid ${COLOR}40`, borderRadius: 8, fontSize: 11 }}
              formatter={(v: number) => [`${v.toFixed(2)} m`, "Displacement"]}
              labelFormatter={(t) => `t = ${t} s`} />
            <Line type="monotone" dataKey="s" stroke={COLOR} strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* v-t Graph */}
      <div className="rounded-2xl border p-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-secondary)" }}>
          Velocity–Time (v–t) — slope = acceleration, area = displacement
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
            <XAxis dataKey="t" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
              label={{ value: "Time t (s)", position: "insideBottom", offset: -2, fontSize: 10, fill: "var(--color-text-muted)" }} />
            <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted)" }}
              label={{ value: "v (m/s)", angle: -90, position: "insideLeft", fontSize: 10, fill: "var(--color-text-muted)" }} width={50} />
            <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid #a78bfa40", borderRadius: 8, fontSize: 11 }}
              formatter={(v: number) => [`${v.toFixed(2)} m/s`, "Velocity"]}
              labelFormatter={(t) => `t = ${t} s`} />
            {showZero && <ReferenceLine x={tZeroV!} stroke="#ef4444" strokeDasharray="4 4"
              label={{ value: "v=0", fill: "#ef4444", fontSize: 10 }} />}
            <ReferenceLine y={0} stroke="var(--color-border)" />
            <Line type="monotone" dataKey="v" stroke="#a78bfa" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Live values */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "v at t=5s", value: `${(params.u + params.a * 5).toFixed(2)} m/s`, color: "#a78bfa" },
          { label: "s at t=5s", value: `${(params.u * 5 + 0.5 * params.a * 25).toFixed(2)} m`,  color: COLOR },
          { label: "Acceleration", value: `${params.a} m/s²`,  color: "#22c55e" },
          { label: "v=0 at t",   value: showZero ? `${tZeroV!.toFixed(2)} s` : "N/A", color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-xl border text-center"
            style={{ background: "var(--color-surface)", borderColor: `${s.color}25` }}>
            <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
            <p className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl text-xs"
        style={{ background: `${COLOR}08`, border: `1px solid ${COLOR}20`, color: "var(--color-text-secondary)" }}>
        💡 On the <strong>v-t graph</strong>: slope = acceleration, area under curve = displacement.
        Set <strong>a = 0</strong> for uniform motion. Set <strong>u negative</strong> to start going backward.
      </div>
    </div>
  );
}
