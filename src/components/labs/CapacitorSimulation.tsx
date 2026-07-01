"use client";

// src/components/labs/CapacitorSimulation.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const COLOR = "#22d3ee";

export function CapacitorSimulation() {
  const [C,      setC]      = useState(100);    // μF
  const [R,      setR]      = useState(10);     // kΩ
  const [V0,     setV0]     = useState(12);     // V (supply)
  const [mode,   setMode]   = useState<"charge" | "discharge">("charge");

  const tau     = (R * 1000) * (C * 1e-6);       // seconds
  const tMax    = tau * 5;
  const energy  = 0.5 * (C * 1e-6) * V0 ** 2;   // J

  const data = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * tMax;
      const v = mode === "charge"
        ? V0 * (1 - Math.exp(-t / tau))
        : V0 * Math.exp(-t / tau);
      const q = (C * 1e-6) * v;
      const ic = mode === "charge"
        ? (V0 / (R * 1000)) * Math.exp(-t / tau)
        : -(V0 / (R * 1000)) * Math.exp(-t / tau);
      pts.push({ t: +t.toFixed(3), v: +v.toFixed(4), q: +(q * 1e6).toFixed(4), i: +(ic * 1000).toFixed(4) });
    }
    return pts;
  }, [C, R, V0, tau, tMax, mode]);

  const atTau   = mode === "charge" ? V0 * (1 - Math.exp(-1)) : V0 * Math.exp(-1);
  const atTauPct= mode === "charge" ? 63.2 : 36.8;

  return (
    <div className="space-y-4">
      {/* Circuit diagram */}
      <div className="rounded-2xl border p-4 flex items-center justify-center"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25`, minHeight: 160 }}>
        <svg width={400} height={140} viewBox="0 0 400 140" className="w-full" style={{ maxHeight: 140 }}>
          {/* Wires */}
          <rect x={30} y={30} width={340} height={80} rx={8}
            fill="none" stroke={`${COLOR}50`} strokeWidth={2} />

          {/* Battery (left) */}
          <line x1={30} y1={55} x2={30} y2={70} stroke={COLOR} strokeWidth={4} />
          <line x1={20} y1={70} x2={40} y2={70} stroke={COLOR} strokeWidth={2} />
          <line x1={25} y1={75} x2={35} y2={75} stroke={COLOR} strokeWidth={1.5} />
          <line x1={30} y1={75} x2={30} y2={90} stroke={COLOR} strokeWidth={4} />
          <text x={8} y={74} fill={COLOR} fontSize={10} fontFamily="monospace">{V0}V</text>

          {/* Resistor (top) */}
          {[0,1,2,3,4].map((i) => (
            <line key={i} x1={120 + i * 20} y1={30} x2={120 + (i + 1) * 20} y2={30}
              stroke={`rgba(250,204,21,0.7)`} strokeWidth={2} />
          ))}
          <rect x={118} y={24} width={104} height={12} rx={3}
            fill="rgba(250,204,21,0.08)" stroke="rgba(250,204,21,0.5)" strokeWidth={1.5} />
          <text x={165} y={20} fill="#facc15" fontSize={10} fontFamily="monospace" textAnchor="middle">
            {R} kΩ
          </text>

          {/* Capacitor (right) */}
          <line x1={320} y1={35} x2={320} y2={60} stroke={COLOR} strokeWidth={2} />
          <line x1={305} y1={60} x2={335} y2={60} stroke={COLOR} strokeWidth={3} />
          <line x1={305} y1={65} x2={335} y2={65} stroke={COLOR} strokeWidth={3} />
          <line x1={320} y1={65} x2={320} y2={90} stroke={COLOR} strokeWidth={2} />
          <text x={340} y={64} fill={COLOR} fontSize={10} fontFamily="monospace">{C} μF</text>

          {/* Voltage across capacitor */}
          <text x={200} y={74} fill={COLOR} fontSize={11} fontFamily="monospace" textAnchor="middle">
            Vc = {(mode === "charge"
              ? V0 * (1 - Math.exp(-0))
              : V0 * Math.exp(-0)).toFixed(2)} V
          </text>

          {/* Charge/discharge indicator */}
          <text x={200} y={120} fill={mode === "charge" ? "#22c55e" : "#ef4444"}
            fontSize={12} fontFamily="sans-serif" fontWeight="600" textAnchor="middle">
            {mode === "charge" ? "⚡ Charging..." : "📉 Discharging..."}
          </text>
        </svg>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2">
        {(["charge", "discharge"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className="flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all"
            style={{
              background:  mode === m ? COLOR + "20" : "var(--color-surface)",
              color:       mode === m ? COLOR : "var(--color-text-muted)",
              border:      `1px solid ${mode === m ? COLOR + "45" : "var(--color-border)"}`,
            }}>
            {m === "charge" ? "⚡ Charge" : "📉 Discharge"}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {([
          { label: "Capacitance C", val: C,  setV: setC,  min: 10,  max: 1000, step: 10,  unit: "μF",  color: COLOR    },
          { label: "Resistance R",  val: R,  setV: setR,  min: 1,   max: 100,  step: 1,   unit: "kΩ",  color: "#facc15"},
          { label: "Voltage V₀",   val: V0, setV: setV0, min: 1.5, max: 24,   step: 0.5, unit: "V",   color: "#22c55e"},
        ]).map(({ label, val, setV, min, max, step, unit, color }) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
              <span className="font-mono" style={{ color }}>{val} {unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => setV(+e.target.value)}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: color }} />
          </div>
        ))}
      </div>

      {/* V-t graph */}
      <div className="rounded-2xl border p-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-secondary)" }}>
          Voltage vs Time — {mode === "charge" ? "Charging" : "Discharging"}
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
            <XAxis dataKey="t" tick={{ fontSize: 9, fill: "var(--color-text-muted)" }}
              label={{ value: "Time (s)", position: "insideBottom", offset: -2, fontSize: 9, fill: "var(--color-text-muted)" }} />
            <YAxis tick={{ fontSize: 9, fill: "var(--color-text-muted)" }} width={40}
              label={{ value: "V (V)", angle: -90, position: "insideLeft", fontSize: 9, fill: "var(--color-text-muted)" }} />
            <Tooltip contentStyle={{ background: "var(--color-surface)", border: `1px solid ${COLOR}40`, borderRadius: 8, fontSize: 10 }}
              formatter={(v: number) => [`${v.toFixed(3)} V`, "Voltage"]} />
            <ReferenceLine x={tau} stroke={COLOR} strokeDasharray="4 4" opacity={0.7}
              label={{ value: `τ=${tau.toFixed(2)}s`, fill: COLOR, fontSize: 9 }} />
            <ReferenceLine y={atTau} stroke="rgba(250,204,21,0.4)" strokeDasharray="3 5" />
            <Line type="monotone" dataKey="v" stroke={COLOR} strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Time Constant τ",  value: `${tau.toFixed(3)} s`,           color: COLOR    },
          { label: `V at τ (${atTauPct}%)`, value: `${atTau.toFixed(3)} V`,   color: "#facc15"},
          { label: "Full charge ~5τ",  value: `${(5 * tau).toFixed(2)} s`,     color: "#22c55e"},
          { label: "Energy stored",    value: `${(energy * 1000).toFixed(3)} mJ`, color: "#a78bfa"},
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
        💡 <strong>τ = RC</strong> — time constant. After 1τ: 63.2% charged. After 5τ: fully charged (99.3%).
        Increase R or C to slow the charging curve.
      </div>
    </div>
  );
}
