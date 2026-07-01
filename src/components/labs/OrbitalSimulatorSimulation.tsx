"use client";

// src/components/labs/OrbitalSimulatorSimulation.tsx
import { useRef, useEffect, useState } from "react";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { SimulationControls } from "@/components/physics/SimulationControls";

const COLOR  = "#818cf8";
const G_SIM  = 500;      // simulation gravitational constant

interface Body { x: number; y: number; vx: number; vy: number; mass: number; trail: { x: number; y: number }[] }

export function OrbitalSimulatorSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [orbitRadius, setOrbitRadius] = useState(120);
  const [orbitSpeed,  setOrbitSpeed]  = useState(1.8);
  const [starMass,    setStarMass]    = useState(1000);
  const [showTrail,   setShowTrail]   = useState(true);

  const bodyRef = useRef<Body>({
    x: 0, y: 0, vx: 0, vy: 0, mass: 1, trail: [],
  });
  const W_HALF = 300; const H_HALF = 200;

  // Init body
  const resetBody = () => {
    bodyRef.current = {
      x: orbitRadius, y: 0,
      vx: 0, vy: orbitSpeed,
      mass: 1, trail: [],
    };
  };

  const sim = useSimulation({ fps: 60, autoStart: false });

  // Physics step
  useEffect(() => {
    if (!sim.running) return;
    const b = bodyRef.current;
    const dt = 0.016;
    const STEPS = 4;
    for (let i = 0; i < STEPS; i++) {
      const dx = 0 - b.x; const dy = 0 - b.y;
      const dist2 = dx * dx + dy * dy;
      const dist  = Math.sqrt(dist2);
      if (dist < 15) { b.x = orbitRadius; b.y = 0; b.vx = 0; b.vy = orbitSpeed; b.trail = []; continue; }
      const F = G_SIM * starMass * b.mass / dist2;
      const ax = F * dx / dist / b.mass;
      const ay = F * dy / dist / b.mass;
      b.vx += ax * (dt / STEPS);
      b.vy += ay * (dt / STEPS);
      b.x  += b.vx * (dt / STEPS);
      b.y  += b.vy * (dt / STEPS);
    }
    if (showTrail) {
      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > 400) b.trail.shift();
    }
  }, [sim.t, sim.running, starMass, orbitRadius, orbitSpeed, showTrail]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width; const H = canvas.height;
    const cx = W / 2; const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Background starfield
    ctx.fillStyle = "rgba(129,140,248,0.015)";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(129,140,248,0.06)"; ctx.lineWidth = 1;
    for (let x = cx % 40; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = cy % 40; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Distance rings
    [60, 120, 180, 240].forEach((r) => {
      ctx.strokeStyle = "rgba(129,140,248,0.08)"; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(129,140,248,0.3)"; ctx.font = "9px monospace";
      ctx.fillText(`${r}`, cx + r + 2, cy - 2);
    });

    // Star (at centre)
    const starGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
    starGlow.addColorStop(0, "rgba(255,220,80,0.9)");
    starGlow.addColorStop(0.4, "rgba(255,160,20,0.5)");
    starGlow.addColorStop(1, "transparent");
    ctx.fillStyle = starGlow; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 20;
    ctx.fillStyle = "#fde68a"; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("★", cx, cy + 4);

    const b = bodyRef.current;

    // Orbit trail
    if (showTrail && b.trail.length > 1) {
      for (let i = 1; i < b.trail.length; i++) {
        const alpha = i / b.trail.length;
        ctx.strokeStyle = `rgba(129,140,248,${alpha * 0.6})`;
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + b.trail[i - 1].x, cy + b.trail[i - 1].y);
        ctx.lineTo(cx + b.trail[i].x,     cy + b.trail[i].y);
        ctx.stroke();
      }
    }

    // Planet
    const px = cx + b.x; const py = cy + b.y;
    const speed = Math.sqrt(b.vx ** 2 + b.vy ** 2);
    ctx.shadowColor = COLOR; ctx.shadowBlur = 12;
    ctx.fillStyle = COLOR;
    ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Velocity vector
    const vScale = 8;
    ctx.strokeStyle = "#34d399"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + b.vx * vScale, py + b.vy * vScale); ctx.stroke();

    // Gravity line (faint)
    const dist = Math.sqrt(b.x ** 2 + b.y ** 2);
    ctx.strokeStyle = "rgba(251,191,36,0.15)"; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.setLineDash([]);

    // Stats
    ctx.fillStyle = "rgba(129,140,248,0.8)"; ctx.font = "10px monospace"; ctx.textAlign = "left";
    ctx.fillText(`r = ${dist.toFixed(0)} px`, 8, 18);
    ctx.fillText(`v = ${speed.toFixed(2)}`,   8, 32);
    ctx.textAlign = "left";
  }, [sim.t, showTrail]);

  const handleReset = () => { sim.reset(); resetBody(); };

  // Calculate escape velocity for reference
  const escapeV = Math.sqrt(2 * G_SIM * starMass / orbitRadius).toFixed(2);
  const circV   = Math.sqrt(G_SIM * starMass / orbitRadius).toFixed(2);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}>
        <canvas ref={canvasRef} width={600} height={400} className="w-full" style={{ maxHeight: 400 }} />
      </div>

      <SimulationControls running={sim.running} finished={sim.finished}
        onToggle={() => { if (!sim.running && sim.t === 0) resetBody(); sim.toggle(); }}
        onReset={handleReset} color={COLOR} timeLabel={`t = ${sim.t.toFixed(1)} s`} />

      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {([
          { label: "Orbit Radius",  val: orbitRadius, setV: setOrbitRadius, min: 60,  max: 240, step: 10, unit: "px",  color: COLOR     },
          { label: "Launch Speed",  val: orbitSpeed,  setV: setOrbitSpeed,  min: 0.5, max: 5,   step: 0.1,unit: "",    color: "#34d399" },
          { label: "Star Mass",     val: starMass,    setV: setStarMass,    min: 200, max: 3000, step: 50, unit: "",    color: "#fbbf24" },
        ]).map(({ label, val, setV, min, max, step, unit, color }) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
              <span className="font-mono" style={{ color }}>{val} {unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => { handleReset(); setV(+e.target.value); }}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: color }} />
          </div>
        ))}

        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => setShowTrail((v) => !v)}
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{ background: showTrail ? COLOR : "var(--color-border)" }}>
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
              style={{ transform: showTrail ? "translateX(20px)" : "translateX(0)" }} />
          </div>
          <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Show orbit trail</span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Circular orbit speed", value: circV,   color: "#34d399" },
          { label: "Escape velocity",       value: escapeV, color: "#ef4444" },
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
        💡 Set launch speed to <strong>{circV}</strong> for a circular orbit.
        Above <strong>{escapeV}</strong> = escape. Between them = elliptical.
        Green arrow = velocity, yellow line = gravity.
      </div>
    </div>
  );
}
