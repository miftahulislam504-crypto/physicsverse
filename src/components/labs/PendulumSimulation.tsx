"use client";

// src/components/labs/PendulumSimulation.tsx
import { useRef, useEffect, useState, useCallback } from "react";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { SimulationControls } from "@/components/physics/SimulationControls";

const COLOR = "#facc15";
const G     = 9.81;

interface Params {
  length: number;   // metres
  angle:  number;   // degrees (initial)
  mass:   number;   // kg
}

export function PendulumSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams]   = useState<Params>({ length: 1.5, angle: 30, mass: 1 });
  const [energy, setEnergy]   = useState({ ke: 0, pe: 0 });
  const sim = useSimulation({ autoStart: false });

  const T = 2 * Math.PI * Math.sqrt(params.length / G);

  // Compute angle at time t (small angle approximation for <30°)
  const theta = useCallback((t: number) => {
    const rad = (params.angle * Math.PI) / 180;
    return rad * Math.cos((2 * Math.PI / T) * t);
  }, [params.angle, params.length, T]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = 60;

    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "rgba(250,204,21,0.03)");
    bg.addColorStop(1, "transparent");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Pivot
    ctx.fillStyle = "rgba(250,204,21,0.8)";
    ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();

    // Current angle
    const angle = theta(sim.t);
    const scale = 180;  // pixels per metre
    const px = cx + Math.sin(angle) * params.length * scale;
    const py = cy + Math.cos(angle) * params.length * scale;

    // Swept arc (trail)
    const maxAngleRad = (params.angle * Math.PI) / 180;
    ctx.strokeStyle = "rgba(250,204,21,0.12)";
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, params.length * scale, Math.PI / 2 - maxAngleRad, Math.PI / 2 + maxAngleRad);
    ctx.stroke();

    // Rod
    ctx.strokeStyle = "rgba(250,204,21,0.6)";
    ctx.lineWidth   = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

    // Bob shadow / glow
    ctx.shadowColor = COLOR;
    ctx.shadowBlur  = 20;
    ctx.fillStyle   = COLOR;
    const bobR = 8 + params.mass * 3;
    ctx.beginPath(); ctx.arc(px, py, bobR, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur  = 0;

    // Angle indicator
    ctx.strokeStyle = "rgba(250,204,21,0.4)";
    ctx.lineWidth   = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + params.length * scale); ctx.stroke();
    ctx.setLineDash([]);

    // Angle text
    ctx.fillStyle = "rgba(250,204,21,0.9)";
    ctx.font      = "12px JetBrains Mono, monospace";
    ctx.fillText(`θ = ${((angle * 180) / Math.PI).toFixed(1)}°`, cx + 10, cy + 20);

    // Energy bars (bottom right)
    const maxH_px = 80;
    const totalE  = 0.5 * params.mass * G * params.length * (1 - Math.cos(maxAngleRad));
    const peVal   = params.mass * G * (py - (cy + params.length * scale)); // negative height = PE
    const peAbs   = Math.abs(params.mass * G * params.length * (1 - Math.cos(angle)));
    const keAbs   = Math.max(0, totalE - peAbs);
    const peH     = totalE > 0 ? (peAbs / totalE) * maxH_px : 0;
    const keH     = totalE > 0 ? (keAbs / totalE) * maxH_px : 0;

    setEnergy({ ke: keAbs, pe: peAbs });

    const barX  = W - 70;
    const barY  = H - 20;
    const barW  = 18;
    const gap   = 8;

    // PE bar
    ctx.fillStyle = "rgba(250,204,21,0.2)";
    ctx.fillRect(barX, barY - maxH_px, barW, maxH_px);
    ctx.fillStyle = "#facc15";
    ctx.fillRect(barX, barY - peH, barW, peH);
    ctx.fillStyle = "rgba(250,204,21,0.7)";
    ctx.font = "10px sans-serif";
    ctx.fillText("PE", barX + 1, barY + 12);

    // KE bar
    ctx.fillStyle = "rgba(249,115,22,0.2)";
    ctx.fillRect(barX + barW + gap, barY - maxH_px, barW, maxH_px);
    ctx.fillStyle = "#f97316";
    ctx.fillRect(barX + barW + gap, barY - keH, barW, keH);
    ctx.fillStyle = "rgba(249,115,22,0.7)";
    ctx.fillText("KE", barX + barW + gap + 1, barY + 12);

  }, [sim.t, params, theta]);

  const handleParam = (key: keyof Params, val: number) => {
    sim.reset();
    setParams((p) => ({ ...p, [key]: val }));
  };

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}30` }}
      >
        <canvas ref={canvasRef} width={540} height={380} className="w-full" style={{ maxHeight: 380 }} />
      </div>

      {/* Controls */}
      <SimulationControls
        running={sim.running} finished={sim.finished}
        onToggle={sim.toggle} onReset={sim.reset}
        color={COLOR} timeLabel={`t = ${sim.t.toFixed(2)} s`}
      />

      {/* Sliders */}
      <div
        className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}>Parameters</p>

        {([
          { label: "Length (L)", key: "length", min: 0.3, max: 3,  step: 0.1, unit: "m"  },
          { label: "Angle (θ₀)", key: "angle",  min: 5,   max: 60, step: 1,   unit: "°"  },
          { label: "Mass (m)",   key: "mass",   min: 0.1, max: 5,  step: 0.1, unit: "kg" },
        ] as const).map(({ label, key, min, max, step, unit }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
              <span className="font-mono" style={{ color: COLOR }}>
                {params[key]} {unit}
              </span>
            </div>
            <input
              type="range" min={min} max={max} step={step} value={params[key]}
              onChange={(e) => handleParam(key, +e.target.value)}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: COLOR }}
            />
          </div>
        ))}
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Period T",  value: `${T.toFixed(3)} s`,             color: COLOR      },
          { label: "KE",        value: `${energy.ke.toFixed(3)} J`,      color: "#f97316"  },
          { label: "PE",        value: `${energy.pe.toFixed(3)} J`,      color: "#facc15"  },
        ].map((s) => (
          <div key={s.label}
            className="p-3 rounded-xl border text-center"
            style={{ background: "var(--color-surface)", borderColor: `${s.color}25` }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
            <p className="text-base font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div
        className="p-3 rounded-xl text-xs"
        style={{ background: `${COLOR}08`, border: `1px solid ${COLOR}20`, color: "var(--color-text-secondary)" }}
      >
        💡 Notice: Period <strong>doesn't change with mass</strong> or small angle. Increase length to slow the pendulum — T ∝ √L.
      </div>
    </div>
  );
}
