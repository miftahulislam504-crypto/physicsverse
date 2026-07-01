"use client";

// src/components/labs/IdealGasSimulation.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const COLOR = "#fb7185";
const R_GAS = 8.314;

type LawMode = "boyle" | "charles" | "custom";

export function IdealGasSimulation() {
  const [mode,  setMode]  = useState<LawMode>("custom");
  const [P,     setP]     = useState(100);    // kPa
  const [V,     setV]     = useState(10);     // L
  const [T,     setT]     = useState(300);    // K
  const [n,     setN]     = useState(0.4);    // mol

  // Compute the constrained value
  const computed = useMemo(() => {
    const PkPa = P * 1000; const VL = V * 0.001;
    switch (mode) {
      case "boyle":   return { T: (PkPa * VL) / (n * R_GAS), label: "T (K)", val: +(PkPa * VL / (n * R_GAS)).toFixed(1) };
      case "charles": return { V: (n * R_GAS * T) / PkPa * 1000, label: "V (L)", val: +(n * R_GAS * T / PkPa * 1000).toFixed(2) };
      default:        return { P: (n * R_GAS * T) / VL / 1000, label: "P (kPa)", val: +(n * R_GAS * T / VL / 1000).toFixed(2) };
    }
  }, [mode, P, V, T, n]);

  // Graph data — sweep the x variable
  const graphData = useMemo(() => {
    const pts = [];
    if (mode === "boyle") {
      // P vs V at constant T
      const T_const = computed.val || 300;
      for (let v = 2; v <= 30; v += 1) {
        const VL = v * 0.001;
        pts.push({ x: v, y: +((n * R_GAS * T_const) / VL / 1000).toFixed(2) });
      }
    } else if (mode === "charles") {
      // V vs T at constant P
      for (let t = 200; t <= 600; t += 20) {
        pts.push({ x: t, y: +((n * R_GAS * t) / (P * 1000) * 1000).toFixed(3) });
      }
    } else {
      // P vs T at constant V
      for (let t = 200; t <= 600; t += 20) {
        pts.push({ x: t, y: +((n * R_GAS * t) / (V * 0.001) / 1000).toFixed(2) });
      }
    }
    return pts;
  }, [mode, n, P, V, computed]);

  const graphLabels = {
    boyle:   { x: "Volume (L)", y: "Pressure (kPa)", title: "Boyle's Law: P vs V (T constant)" },
    charles: { x: "Temperature (K)", y: "Volume (L)", title: "Charles's Law: V vs T (P constant)" },
    custom:  { x: "Temperature (K)", y: "Pressure (kPa)", title: "Gay-Lussac's Law: P vs T (V constant)" },
  };

  // Piston visual
  const pistonH  = Math.min(160, Math.max(30, V * 8));
  const dotCount = Math.max(4, Math.round(n * 20));
  const dotColor = T > 400 ? "#ef4444" : T > 300 ? "#f97316" : "#60a5fa";

  return (
    <div className="space-y-4">
      {/* Law mode selector */}
      <div className="flex gap-2">
        {([
          { id: "boyle",   label: "Boyle's Law (T const)"  },
          { id: "charles", label: "Charles's Law (P const)" },
          { id: "custom",  label: "Custom (V const)"        },
        ] as const).map(({ id, label }) => (
          <button key={id} onClick={() => setMode(id)}
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background:  mode === id ? COLOR + "22" : "var(--color-surface)",
              color:       mode === id ? COLOR : "var(--color-text-muted)",
              border:      `1px solid ${mode === id ? COLOR + "45" : "var(--color-border)"}`,
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Piston diagram */}
      <div className="rounded-2xl border flex items-center justify-center p-4"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25`, minHeight: 200 }}>
        <div className="relative flex flex-col items-center">
          {/* Cylinder */}
          <div className="relative border-x border-b-2 rounded-b-lg overflow-hidden"
            style={{
              width: 120, height: pistonH,
              borderColor: COLOR + "60",
              background:  "rgba(251,113,133,0.05)",
              transition: "height 0.4s ease",
            }}>
            {/* Gas molecules (dots) */}
            {Array.from({ length: dotCount }, (_, i) => (
              <motion.div key={i}
                animate={{ x: [Math.random() * 80, Math.random() * 80], y: [Math.random() * (pistonH - 10), Math.random() * (pistonH - 10)] }}
                transition={{ duration: 0.4 + Math.random() * 0.6, repeat: Infinity, repeatType: "mirror" }}
                className="absolute w-2 h-2 rounded-full"
                style={{ background: dotColor, opacity: 0.8 }}
              />
            ))}
            {/* Pressure indicator */}
            <div className="absolute bottom-1 left-1 text-xs font-mono"
              style={{ color: COLOR, opacity: 0.8 }}>
              {P} kPa
            </div>
          </div>

          {/* Piston */}
          <div className="flex items-center justify-center font-bold text-xs rounded-t-lg"
            style={{ width: 130, height: 20, background: COLOR + "40", color: COLOR, border: `2px solid ${COLOR}` }}>
            PISTON
          </div>

          {/* Labels */}
          <p className="text-xs mt-2 font-mono" style={{ color: COLOR }}>V = {V} L</p>
          <p className="text-xs font-mono" style={{ color: dotColor }}>T = {T} K</p>
        </div>
      </div>

      {/* Sliders */}
      <div className="rounded-2xl border p-4 space-y-3"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {([
          { label: "Pressure P (kPa)", val: P, setV: setP, min: 10, max: 500, step: 5,   unit: "kPa", color: COLOR,     hide: mode === "custom" },
          { label: "Volume V (L)",     val: V, setV: setV, min: 1,  max: 30,  step: 0.5, unit: "L",  color: "#f97316", hide: mode === "charles" },
          { label: "Temperature T (K)",val: T, setV: setT, min: 100,max: 700, step: 10,  unit: "K",  color: "#facc15", hide: mode === "boyle"   },
          { label: "Moles n",          val: n, setV: setN, min: 0.1,max: 2,   step: 0.1, unit: "mol",color: "#34d399", hide: false               },
        ]).filter((s) => !s.hide).map(({ label, val, setV, min, max, step, unit, color }) => (
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

      {/* Computed value highlight */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm"
        style={{ background: `${COLOR}10`, borderColor: `${COLOR}35` }}>
        <span className="text-xl">📐</span>
        <div>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Computed from PV = nRT</p>
          <p className="font-bold font-mono" style={{ color: COLOR }}>
            {computed.label} = {computed.val}
          </p>
        </div>
      </div>

      {/* Graph */}
      <div className="rounded-2xl border p-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-secondary)" }}>
          {graphLabels[mode].title}
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
            <XAxis dataKey="x" tick={{ fontSize: 9, fill: "var(--color-text-muted)" }}
              label={{ value: graphLabels[mode].x, position: "insideBottom", offset: -2, fontSize: 9, fill: "var(--color-text-muted)" }} />
            <YAxis tick={{ fontSize: 9, fill: "var(--color-text-muted)" }} width={45}
              label={{ value: graphLabels[mode].y, angle: -90, position: "insideLeft", fontSize: 9, fill: "var(--color-text-muted)" }} />
            <Tooltip contentStyle={{ background: "var(--color-surface)", border: `1px solid ${COLOR}40`, borderRadius: 8, fontSize: 10 }} />
            <Line type="monotone" dataKey="y" stroke={COLOR} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 rounded-xl text-xs"
        style={{ background: `${COLOR}08`, border: `1px solid ${COLOR}20`, color: "var(--color-text-secondary)" }}>
        💡 <strong>Boyle</strong>: P↑ → V↓ (T fixed) — hyperbola.
        <strong> Charles</strong>: T↑ → V↑ (P fixed) — linear.
        <strong> PV = nRT</strong> is the ideal gas law combining both.
      </div>
    </div>
  );
}
