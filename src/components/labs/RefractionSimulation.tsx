"use client";

// src/components/labs/RefractionSimulation.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const COLOR = "#a5f3fc";

interface Medium {
  name: string;
  n:    number;
  color: string;
}

const MEDIA: Medium[] = [
  { name: "Air",        n: 1.000, color: "rgba(165,243,252,0.05)" },
  { name: "Water",      n: 1.333, color: "rgba(59,130,246,0.15)"  },
  { name: "Glass",      n: 1.500, color: "rgba(148,163,184,0.2)"  },
  { name: "Crown Glass",n: 1.520, color: "rgba(167,139,250,0.15)" },
  { name: "Diamond",    n: 2.417, color: "rgba(250,204,21,0.12)"  },
  { name: "Glycerol",   n: 1.473, color: "rgba(34,211,153,0.15)"  },
];

export function RefractionSimulation() {
  const [incidentAngle, setIncidentAngle] = useState(45);
  const [medium1Idx, setMedium1Idx]       = useState(0); // Air
  const [medium2Idx, setMedium2Idx]       = useState(2); // Glass

  const m1 = MEDIA[medium1Idx];
  const m2 = MEDIA[medium2Idx];

  const W = 400; const H = 360;
  const boundaryY = H / 2;
  const originX   = W / 2;

  const incRad    = (incidentAngle * Math.PI) / 180;
  const sinRefract = (m1.n * Math.sin(incRad)) / m2.n;
  const isTIR      = sinRefract > 1;
  const critAngle  = m1.n < m2.n ? null : Math.asin(m2.n / m1.n) * 180 / Math.PI;
  const refractRad = isTIR ? null : Math.asin(sinRefract);
  const refractDeg = refractRad !== null ? refractRad * 180 / Math.PI : null;

  // Ray endpoints
  const rayLen = 160;
  // Incoming ray (top-left → origin)
  const incX1 = originX - rayLen * Math.sin(incRad);
  const incY1 = boundaryY - rayLen * Math.cos(incRad);

  // Refracted ray
  const refX2 = refractRad !== null
    ? originX + rayLen * Math.sin(refractRad)
    : null;
  const refY2 = refractRad !== null
    ? boundaryY + rayLen * Math.cos(refractRad)
    : null;

  // Reflected ray
  const reflX2 = originX + rayLen * Math.sin(incRad);
  const reflY2 = boundaryY - rayLen * Math.cos(incRad);

  return (
    <div className="space-y-4">
      {/* SVG canvas */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}
      >
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: H }}>
          {/* Medium 1 */}
          <rect x={0} y={0} width={W} height={boundaryY} fill={m1.color} />
          <text x={12} y={24} fill={COLOR} fontSize={12} fontFamily="Inter, sans-serif" opacity={0.8}>
            {m1.name} (n₁ = {m1.n})
          </text>

          {/* Medium 2 */}
          <rect x={0} y={boundaryY} width={W} height={H - boundaryY} fill={m2.color} />
          <text x={12} y={boundaryY + 20} fill={COLOR} fontSize={12} fontFamily="Inter, sans-serif" opacity={0.8}>
            {m2.name} (n₂ = {m2.n})
          </text>

          {/* Boundary */}
          <line x1={0} y1={boundaryY} x2={W} y2={boundaryY}
            stroke="rgba(165,243,252,0.35)" strokeWidth={1.5} strokeDasharray="6 4" />

          {/* Normal line */}
          <line x1={originX} y1={boundaryY - 90} x2={originX} y2={boundaryY + 90}
            stroke="rgba(165,243,252,0.25)" strokeWidth={1} strokeDasharray="4 4" />
          <text x={originX + 6} y={boundaryY - 70} fill="rgba(165,243,252,0.5)"
            fontSize={10} fontFamily="sans-serif">Normal</text>

          {/* Incident ray */}
          <defs>
            <marker id="arrow-in" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill={COLOR} />
            </marker>
            <marker id="arrow-ref" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill="#f97316" />
            </marker>
            <marker id="arrow-refr" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill="#22c55e" />
            </marker>
          </defs>

          <line x1={incX1} y1={incY1} x2={originX} y2={boundaryY}
            stroke={COLOR} strokeWidth={2.5} markerEnd="url(#arrow-in)"
            style={{ filter: `drop-shadow(0 0 4px ${COLOR})` }} />

          {/* Reflected ray */}
          <line x1={originX} y1={boundaryY} x2={reflX2} y2={reflY2}
            stroke="#f97316" strokeWidth={isTIR ? 2.5 : 1.5}
            strokeDasharray={isTIR ? "none" : "4 4"}
            markerEnd="url(#arrow-ref)"
            opacity={isTIR ? 1 : 0.5}
          />

          {/* Refracted ray */}
          {refX2 !== null && refY2 !== null && (
            <line x1={originX} y1={boundaryY} x2={refX2} y2={refY2}
              stroke="#22c55e" strokeWidth={2.5} markerEnd="url(#arrow-refr)"
              style={{ filter: "drop-shadow(0 0 4px #22c55e)" }} />
          )}

          {/* TIR label */}
          {isTIR && (
            <text x={originX - 60} y={boundaryY + 50}
              fill="#ef4444" fontSize={13} fontFamily="Inter, sans-serif" fontWeight="600">
              ⚡ Total Internal Reflection
            </text>
          )}

          {/* Angle arcs */}
          <text x={originX + 16} y={boundaryY - 30}
            fill={COLOR} fontSize={11} fontFamily="monospace">
            θ₁={incidentAngle}°
          </text>
          {refractDeg !== null && (
            <text x={originX + 16} y={boundaryY + 40}
              fill="#22c55e" fontSize={11} fontFamily="monospace">
              θ₂={refractDeg.toFixed(1)}°
            </text>
          )}
        </svg>
      </div>

      {/* Incident angle slider */}
      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>

        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--color-text-secondary)" }}>Incident Angle (θ₁)</span>
            <span className="font-mono" style={{ color: COLOR }}>{incidentAngle}°</span>
          </div>
          <input type="range" min={1} max={89} step={1} value={incidentAngle}
            onChange={(e) => setIncidentAngle(+e.target.value)}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: COLOR }} />
        </div>

        {/* Medium selectors */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Medium 1 (top)", idx: medium1Idx, setIdx: setMedium1Idx },
            { label: "Medium 2 (bottom)", idx: medium2Idx, setIdx: setMedium2Idx },
          ].map(({ label, idx, setIdx }) => (
            <div key={label} className="space-y-1">
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{label}</p>
              <select
                value={idx}
                onChange={(e) => setIdx(+e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border text-xs outline-none"
                style={{
                  background:  "var(--color-surface-2)",
                  borderColor: "var(--color-border)",
                  color:       "var(--color-text-primary)",
                }}
              >
                {MEDIA.map((m, i) => (
                  <option key={m.name} value={i}>{m.name} (n={m.n})</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Readings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "n₁ sin θ₁",      value: (m1.n * Math.sin(incRad)).toFixed(4), color: COLOR     },
          { label: "n₂ sin θ₂",      value: isTIR ? "N/A" : (m2.n * Math.sin(refractRad!)).toFixed(4), color: "#22c55e" },
          { label: "Refracted θ₂",   value: refractDeg !== null ? `${refractDeg.toFixed(1)}°` : "TIR", color: refractDeg !== null ? "#22c55e" : "#ef4444" },
          { label: "Critical Angle", value: critAngle !== null ? `${critAngle.toFixed(1)}°` : "N/A", color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-xl border text-center"
            style={{ background: "var(--color-surface)", borderColor: `${s.color}25` }}>
            <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
            <p className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl text-xs"
        style={{ background: `${COLOR}07`, border: `1px solid ${COLOR}20`, color: "var(--color-text-secondary)" }}>
        💡 Switch Medium 1 to Glass and Medium 2 to Air. Increase θ₁ past the <strong>critical angle</strong> to see Total Internal Reflection — the principle behind <strong>optical fibers</strong>.
      </div>
    </div>
  );
}
