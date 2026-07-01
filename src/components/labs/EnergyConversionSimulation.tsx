"use client";

// src/components/labs/EnergyConversionSimulation.tsx
import { useRef, useEffect, useState, useMemo } from "react";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { SimulationControls } from "@/components/physics/SimulationControls";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLOR = "#facc15";
const G = 9.81;

interface TrackPoint { x: number; y: number }   // normalized 0-1

// Pre-defined roller coaster profile (normalized 0-1)
const TRACK: TrackPoint[] = [
  { x: 0,    y: 1    },  // start (high)
  { x: 0.15, y: 0.02 },  // valley 1
  { x: 0.3,  y: 0.65 },  // hill 1
  { x: 0.45, y: 0.05 },  // valley 2
  { x: 0.6,  y: 0.45 },  // hill 2
  { x: 0.75, y: 0.08 },  // valley 3
  { x: 0.9,  y: 0.25 },  // small hill
  { x: 1,    y: 0    },  // end
];

function interpTrack(t: number, track: TrackPoint[]): { x: number; y: number } {
  const clamped = Math.max(0, Math.min(1, t));
  let i = 0;
  while (i < track.length - 2 && track[i + 1].x < clamped) i++;
  const p1 = track[i]; const p2 = track[i + 1];
  const frac = (clamped - p1.x) / (p2.x - p1.x);
  return { x: clamped, y: p1.y + frac * (p2.y - p1.y) };
}

export function EnergyConversionSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mass,    setMass]    = useState(5);       // kg
  const [startH,  setStartH]  = useState(80);      // metres
  const [friction, setFriction] = useState(false);
  const [history,  setHistory] = useState<{ t: number; ke: number; pe: number; total: number }[]>([]);

  const sim = useSimulation({ maxTime: 8, autoStart: false });
  const progress = sim.t / 8; // 0-1 along track

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width; const H = canvas.height;
    const padX = 40; const padY = 30;
    const drawW = W - padX * 2; const drawH = H - padY * 2;

    ctx.clearRect(0, 0, W, H);

    // Draw track
    ctx.strokeStyle = "rgba(250,204,21,0.5)"; ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const pt = interpTrack(t, TRACK);
      const cx = padX + pt.x * drawW;
      const cy = padY + (1 - pt.y) * drawH;
      i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Track fill
    ctx.fillStyle = "rgba(250,204,21,0.06)";
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const pt = interpTrack(t, TRACK);
      const cx = padX + pt.x * drawW;
      const cy = padY + (1 - pt.y) * drawH;
      i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
    }
    ctx.lineTo(padX + drawW, padY + drawH);
    ctx.lineTo(padX, padY + drawH);
    ctx.closePath(); ctx.fill();

    // Height markers
    ctx.strokeStyle = "rgba(250,204,21,0.1)"; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
    [0.25, 0.5, 0.75, 1].forEach((f) => {
      const y = padY + (1 - f) * drawH;
      ctx.beginPath(); ctx.moveTo(padX, y); ctx.lineTo(W - padX, y); ctx.stroke();
      ctx.fillStyle = "rgba(250,204,21,0.4)"; ctx.font = "9px monospace";
      ctx.fillText(`${(f * startH).toFixed(0)}m`, 2, y + 3);
    });
    ctx.setLineDash([]);

    // Cart
    const cart = interpTrack(progress, TRACK);
    const cx = padX + cart.x * drawW;
    const cy = padY + (1 - cart.y) * drawH;
    const h  = cart.y * startH;

    const totalE = mass * G * startH;
    const pe     = mass * G * h;
    const frictionLoss = friction ? progress * totalE * 0.15 : 0;
    const ke     = Math.max(0, totalE - pe - frictionLoss);
    const speed  = Math.sqrt(2 * ke / mass);

    // Glow intensity based on KE
    const keRatio = totalE > 0 ? ke / totalE : 0;
    ctx.shadowColor = COLOR; ctx.shadowBlur = 8 + keRatio * 20;
    ctx.fillStyle   = `hsl(${45 + keRatio * 20}, 96%, ${50 + keRatio * 10}%)`;
    ctx.beginPath(); ctx.roundRect(cx - 14, cy - 10, 28, 16, 4); ctx.fill();
    ctx.shadowBlur = 0;

    // Wheels
    [-8, 8].forEach((dx) => {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.beginPath(); ctx.arc(cx + dx, cy + 6, 5, 0, Math.PI * 2); ctx.fill();
    });

    // Speed label
    ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.font = "bold 9px monospace"; ctx.textAlign = "center";
    ctx.fillText(`${speed.toFixed(1)}m/s`, cx, cy + 25);
    ctx.textAlign = "left";

    // Update history
    if (sim.running && sim.t > 0) {
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && Math.abs(last.t - sim.t) < 0.15) return prev;
        return [...prev.slice(-60), { t: +sim.t.toFixed(2), ke: +ke.toFixed(2), pe: +pe.toFixed(2), total: +(ke + pe).toFixed(2) }];
      });
    }
    if (sim.t === 0) setHistory([]);
  }, [sim.t, sim.running, mass, startH, friction, progress]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}>
        <canvas ref={canvasRef} width={580} height={280} className="w-full" style={{ maxHeight: 280 }} />
      </div>

      <SimulationControls running={sim.running} finished={sim.finished}
        onToggle={sim.toggle} onReset={() => { sim.reset(); setHistory([]); }}
        color={COLOR} timeLabel={`t = ${sim.t.toFixed(2)} s`} />

      {/* Sliders */}
      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {([
          { label: "Mass (m)",    val: mass,   setV: setMass,   min: 1,  max: 20, step: 0.5, unit: "kg", color: COLOR },
          { label: "Start Height",val: startH, setV: setStartH, min: 20, max: 150,step: 5,  unit: "m",  color: "#f97316" },
        ]).map(({ label, val, setV, min, max, step, unit, color }) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
              <span className="font-mono" style={{ color }}>{val} {unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => { sim.reset(); setHistory([]); setV(+e.target.value); }}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: color }} />
          </div>
        ))}

        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => { sim.reset(); setHistory([]); setFriction((v) => !v); }}
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{ background: friction ? "#ef4444" : "var(--color-border)" }}>
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
              style={{ transform: friction ? "translateX(20px)" : "translateX(0)" }} />
          </div>
          <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            Enable friction (energy loss)
          </span>
        </label>
      </div>

      {/* Energy graph */}
      {history.length > 1 && (
        <div className="rounded-2xl border p-4"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-secondary)" }}>
            Energy vs Time
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
              <XAxis dataKey="t" tick={{ fontSize: 9, fill: "var(--color-text-muted)" }} />
              <YAxis tick={{ fontSize: 9, fill: "var(--color-text-muted)" }} width={45}
                label={{ value: "Energy (J)", angle: -90, position: "insideLeft", fontSize: 9, fill: "var(--color-text-muted)" }} />
              <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid rgba(250,204,21,0.3)", borderRadius: 8, fontSize: 10 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="pe"    stroke={COLOR}    strokeWidth={2} dot={false} name="PE (J)" />
              <Line type="monotone" dataKey="ke"    stroke="#34d399"  strokeWidth={2} dot={false} name="KE (J)" />
              <Line type="monotone" dataKey="total" stroke="#60a5fa"  strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="Total (J)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="p-3 rounded-xl text-xs"
        style={{ background: `${COLOR}08`, border: `1px solid ${COLOR}20`, color: "var(--color-text-secondary)" }}>
        💡 Without friction: <strong>Total energy stays constant</strong> — PE converts to KE and back.
        Enable friction to see energy lost as heat. The cart can't reach the starting height again!
      </div>
    </div>
  );
}
