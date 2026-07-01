"use client";

// src/components/labs/HeatTransferSimulation.tsx
import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from "recharts";

const COLOR = "#fb7185";

interface Material {
  name:    string;
  c:       number;    // J/(kg·K) specific heat
  Tm:      number;    // °C melting point
  Tb:      number;    // °C boiling point
  Lf:      number;    // kJ/kg latent heat of fusion
  Lv:      number;    // kJ/kg latent heat of vaporisation
  color:   string;
}

const MATERIALS: Material[] = [
  { name: "Water",      c: 4186, Tm: 0,    Tb: 100, Lf: 334,  Lv: 2260, color: "#60a5fa" },
  { name: "Ethanol",    c: 2440, Tm: -115, Tb: 78,  Lf: 108,  Lv: 841,  color: "#a78bfa" },
  { name: "Ice (below)",c: 2090, Tm: 0,    Tb: 100, Lf: 334,  Lv: 2260, color: "#bae6fd" },
  { name: "Glycerol",   c: 2400, Tm: 18,   Tb: 290, Lf: 200,  Lv: 830,  color: "#34d399" },
  { name: "Mercury",    c: 140,  Tm: -39,  Tb: 357, Lf: 11.4, Lv: 272,  color: "#94a3b8" },
];

export function HeatTransferSimulation() {
  const [matIdx,    setMatIdx]    = useState(0);
  const [mass,      setMass]      = useState(1);       // kg
  const [heatRate,  setHeatRate]  = useState(5000);    // J/s (watts)
  const [startTemp, setStartTemp] = useState(-20);     // °C

  const mat = MATERIALS[matIdx];

  const data = useMemo(() => {
    const pts: { q: number; T: number; phase: string }[] = [];
    let T = startTemp;
    let q = 0;

    const qToMelt  = mass * mat.c * (mat.Tm - startTemp);          // heat to reach Tm
    const qMelt    = mass * mat.Lf * 1000;                          // latent heat fusion
    const qToBoil  = mass * mat.c * (mat.Tb - mat.Tm);             // heat solid→liquid then to Tb
    const qBoil    = mass * mat.Lv * 1000;                          // latent heat vaporisation

    const totalQ   = Math.max(qToMelt + qMelt + qToBoil + qBoil, 1);
    const STEPS    = 200;

    for (let i = 0; i <= STEPS; i++) {
      const qStep = (totalQ / STEPS) * i;

      let phase = "Solid";
      let TStep = startTemp;

      if (qStep < qToMelt) {
        TStep = startTemp + qStep / (mass * mat.c);
        phase = "Solid";
      } else if (qStep < qToMelt + qMelt) {
        TStep = mat.Tm;
        phase = "Melting";
      } else if (qStep < qToMelt + qMelt + qToBoil) {
        TStep = mat.Tm + (qStep - qToMelt - qMelt) / (mass * mat.c);
        phase = "Liquid";
      } else if (qStep < qToMelt + qMelt + qToBoil + qBoil) {
        TStep = mat.Tb;
        phase = "Boiling";
      } else {
        TStep = mat.Tb + (qStep - qToMelt - qMelt - qToBoil - qBoil) / (mass * mat.c * 0.5);
        phase = "Gas";
      }

      pts.push({ q: +(qStep / 1000).toFixed(2), T: +TStep.toFixed(2), phase });
    }
    return pts;
  }, [mat, mass, heatRate, startTemp]);

  const timeToBoil = useMemo(() => {
    const lastPt = data.find((d) => d.phase === "Gas");
    if (!lastPt) return "—";
    return `${(lastPt.q * 1000 / heatRate).toFixed(0)} s`;
  }, [data, heatRate]);

  const meltPts = data.filter((d) => d.phase === "Melting");
  const boilPts = data.filter((d) => d.phase === "Boiling");

  return (
    <div className="space-y-4">
      {/* T-Q graph */}
      <div className="rounded-2xl border p-4"
        style={{ background: "var(--color-surface)", borderColor: `${COLOR}25` }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-secondary)" }}>
          Temperature–Heat (Heating Curve) — {mat.name}
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
            <XAxis dataKey="q" tick={{ fontSize: 9, fill: "var(--color-text-muted)" }}
              label={{ value: "Heat Added Q (kJ)", position: "insideBottom", offset: -2, fontSize: 9, fill: "var(--color-text-muted)" }} />
            <YAxis tick={{ fontSize: 9, fill: "var(--color-text-muted)" }} width={45}
              label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft", fontSize: 9, fill: "var(--color-text-muted)" }} />
            <Tooltip contentStyle={{ background: "var(--color-surface)", border: `1px solid ${COLOR}40`, borderRadius: 8, fontSize: 10 }}
              formatter={(v: number, name: string) => [name === "T" ? `${v}°C` : v, name === "T" ? "Temperature" : ""]}
              labelFormatter={(q) => `Q = ${q} kJ`} />

            {/* Shade phase change regions */}
            {meltPts.length > 1 && (
              <ReferenceArea x1={meltPts[0].q} x2={meltPts[meltPts.length - 1].q}
                fill="rgba(96,165,250,0.1)" label={{ value: "Melting", fill: "#60a5fa", fontSize: 9 }} />
            )}
            {boilPts.length > 1 && (
              <ReferenceArea x1={boilPts[0].q} x2={boilPts[boilPts.length - 1].q}
                fill="rgba(249,115,22,0.1)" label={{ value: "Boiling", fill: "#f97316", fontSize: 9 }} />
            )}

            <ReferenceLine y={mat.Tm} stroke="rgba(96,165,250,0.5)" strokeDasharray="4 4"
              label={{ value: `Tm=${mat.Tm}°C`, fill: "#60a5fa", fontSize: 9 }} />
            <ReferenceLine y={mat.Tb} stroke="rgba(249,115,22,0.5)" strokeDasharray="4 4"
              label={{ value: `Tb=${mat.Tb}°C`, fill: "#f97316", fontSize: 9 }} />

            <Line type="monotone" dataKey="T" stroke={COLOR} strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {/* Material selector */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}>Material</p>
          <div className="flex flex-wrap gap-2">
            {MATERIALS.map((m, i) => (
              <button key={m.name} onClick={() => setMatIdx(i)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  background:  matIdx === i ? m.color + "22" : "var(--color-surface-2)",
                  color:       matIdx === i ? m.color : "var(--color-text-muted)",
                  border:      `1px solid ${matIdx === i ? m.color + "50" : "transparent"}`,
                }}>
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {([
          { label: "Mass (m)",       val: mass,      setV: setMass,      min: 0.1, max: 5,     step: 0.1,  unit: "kg", color: COLOR     },
          { label: "Heating Rate",   val: heatRate,  setV: setHeatRate,  min: 500, max: 20000, step: 500,  unit: "W",  color: "#f97316" },
          { label: "Start Temp",     val: startTemp, setV: setStartTemp, min: -50, max: mat.Tm - 1, step: 5, unit: "°C",color: "#60a5fa"},
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Melting Point",   value: `${mat.Tm}°C`,                     color: "#60a5fa" },
          { label: "Boiling Point",   value: `${mat.Tb}°C`,                     color: "#f97316" },
          { label: "Latent Heat (f)", value: `${mat.Lf} kJ/kg`,                 color: COLOR     },
          { label: "Time to Gas",     value: timeToBoil,                         color: "#22c55e" },
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
        💡 Notice the <strong>flat plateaus</strong> at melting and boiling points — heat goes into breaking bonds
        (latent heat), not raising temperature. This is why boiling water stays at 100°C.
      </div>
    </div>
  );
}
