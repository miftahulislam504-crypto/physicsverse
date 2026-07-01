"use client";

// src/components/labs/ProjectileSimulation.tsx
import { useRef, useEffect, useState, useCallback } from "react";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { SimulationControls } from "@/components/physics/SimulationControls";
import { FormulaRenderer } from "@/components/physics/FormulaRenderer";

const COLOR = "#f97316";
const G     = 9.81;

interface Params {
  speed: number;   // m/s
  angle: number;   // degrees
  mass:  number;   // kg (doesn't affect trajectory)
}

interface DataPoint { t: number; x: number; y: number; vx: number; vy: number }

export function ProjectileSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState<Params>({ speed: 25, angle: 45, mass: 1 });
  const [trail,  setTrail]  = useState<{ x: number; y: number }[]>([]);
  const [current, setCurrent] = useState<DataPoint | null>(null);

  // Derived values
  const rad  = (params.angle * Math.PI) / 180;
  const vx0  = params.speed * Math.cos(rad);
  const vy0  = params.speed * Math.sin(rad);
  const T    = (2 * vy0) / G;
  const R    = vx0 * T;
  const H    = (vy0 * vy0) / (2 * G);

  const sim = useSimulation({ maxTime: T + 0.1 });

  // Compute position at time t
  const compute = useCallback((t: number): DataPoint => {
    const clampedT = Math.min(t, T);
    return {
      t: clampedT,
      x:  vx0 * clampedT,
      y:  vy0 * clampedT - 0.5 * G * clampedT ** 2,
      vx: vx0,
      vy: vy0 - G * clampedT,
    };
  }, [vx0, vy0, T]);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d")!;
    const W = canvas.width;
    const H_canvas = canvas.height;
    const pad = 40;

    // Scale
    const scaleX = (W - pad * 2) / Math.max(R * 1.1, 1);
    const scaleY = (H_canvas - pad * 2) / Math.max(H * 2.2, 1);
    const scale  = Math.min(scaleX, scaleY);

    function toCanvas(x: number, y: number) {
      return {
        cx: pad + x * scale,
        cy: H_canvas - pad - y * scale,
      };
    }

    // Clear
    ctx.clearRect(0, 0, W, H_canvas);

    // Background grid
    ctx.strokeStyle = "rgba(249,115,22,0.08)";
    ctx.lineWidth   = 1;
    for (let gx = 0; gx <= Math.ceil(R * 1.1); gx += 5) {
      const { cx } = toCanvas(gx, 0);
      ctx.beginPath(); ctx.moveTo(cx, pad); ctx.lineTo(cx, H_canvas - pad); ctx.stroke();
    }
    for (let gy = 0; gy <= Math.ceil(H * 2.2); gy += 5) {
      const { cy } = toCanvas(0, gy);
      ctx.beginPath(); ctx.moveTo(pad, cy); ctx.lineTo(W - pad, cy); ctx.stroke();
    }

    // Ground line
    const { cy: groundY } = toCanvas(0, 0);
    ctx.strokeStyle = "rgba(249,115,22,0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(pad, groundY); ctx.lineTo(W - pad, groundY); ctx.stroke();

    // Ideal full trajectory (dashed)
    ctx.strokeStyle = "rgba(249,115,22,0.2)";
    ctx.setLineDash([4, 4]);
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const pt = compute(T * i / 80);
      const { cx, cy } = toCanvas(pt.x, Math.max(0, pt.y));
      i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Trail
    if (trail.length > 1) {
      ctx.strokeStyle = COLOR;
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      trail.forEach((p, i) => {
        const { cx, cy } = toCanvas(p.x, Math.max(0, p.y));
        i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
      });
      ctx.stroke();
    }

    // Current position dot
    if (current && current.y >= 0) {
      const { cx, cy } = toCanvas(current.x, current.y);
      ctx.fillStyle = COLOR;
      ctx.shadowColor = COLOR;
      ctx.shadowBlur  = 12;
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur  = 0;

      // Velocity vector
      const vScale = 2;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + current.vx * vScale, cy - current.vy * vScale);
      ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = "rgba(249,115,22,0.7)";
    ctx.font      = "11px Inter, system-ui, sans-serif";
    ctx.fillText("x (m)", W - 30, groundY - 6);
    ctx.fillText("y (m)", pad + 6, pad + 4);

  }, [trail, current, R, H, T, compute]);

  // Update trail from simulation time
  useEffect(() => {
    if (sim.t === 0) { setTrail([]); setCurrent(null); return; }
    const pt = compute(sim.t);
    if (pt.y >= -0.5) {
      setTrail((prev) => [...prev.slice(-200), { x: pt.x, y: Math.max(0, pt.y) }]);
      setCurrent(pt);
    }
  }, [sim.t, compute]);

  // Reset trail when params change
  const handleParam = (key: keyof Params, val: number) => {
    sim.reset();
    setTrail([]);
    setCurrent(null);
    setParams((p) => ({ ...p, [key]: val }));
  };

  const SliderRow = ({ label, paramKey, min, max, step, unit }: {
    label: string; paramKey: keyof Params;
    min: number; max: number; step: number; unit: string;
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
        <span className="font-mono" style={{ color: COLOR }}>
          {params[paramKey]} {unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step}
        value={params[paramKey]}
        onChange={(e) => handleParam(paramKey, +e.target.value)}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: COLOR }}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: "rgba(249,115,22,0.25)" }}
      >
        <canvas
          ref={canvasRef}
          width={640} height={360}
          className="w-full"
          style={{ maxHeight: 360 }}
        />
      </div>

      {/* Controls */}
      <SimulationControls
        running={sim.running} finished={sim.finished}
        onToggle={sim.toggle} onReset={() => { sim.reset(); setTrail([]); setCurrent(null); }}
        color={COLOR}
        timeLabel={`t = ${sim.t.toFixed(2)} s`}
      />

      {/* Sliders */}
      <div
        className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}>Parameters</p>
        <SliderRow label="Launch Speed (u)" paramKey="speed" min={5}  max={60} step={1}    unit="m/s" />
        <SliderRow label="Launch Angle (θ)" paramKey="angle" min={5}  max={85} step={1}    unit="°"   />
        <SliderRow label="Mass (m)"          paramKey="mass"  min={0.5}max={10} step={0.5}  unit="kg"  />
      </div>

      {/* Live measurements */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Range R",     value: `${R.toFixed(1)} m`,         latex: "R" },
          { label: "Max Height H",value: `${H.toFixed(1)} m`,         latex: "H" },
          { label: "Flight Time", value: `${T.toFixed(2)} s`,         latex: "T" },
          { label: "Speed now",   value: current
              ? `${Math.sqrt(current.vx**2 + current.vy**2).toFixed(1)} m/s`
              : `${params.speed} m/s`,                                 latex: "v" },
        ].map((m) => (
          <div
            key={m.label}
            className="p-3 rounded-xl border text-center"
            style={{ background: "var(--color-surface)", borderColor: "rgba(249,115,22,0.2)" }}
          >
            <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
              {m.label}
            </p>
            <p className="text-base font-bold font-mono" style={{ color: COLOR }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Observation note */}
      <div
        className="p-3 rounded-xl text-xs"
        style={{
          background:  "rgba(249,115,22,0.07)",
          border:      "1px solid rgba(249,115,22,0.2)",
          color:       "var(--color-text-secondary)",
        }}
      >
        💡 Try <strong>45°</strong> for maximum range. Complementary angles (e.g. 30° and 60°) give the{" "}
        <strong>same range</strong>. The white arrow shows the velocity vector.
      </div>
    </div>
  );
}
