"use client";

// src/components/labs/CircularMotionSimulation.tsx
import { useRef, useEffect, useState } from "react";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { SimulationControls } from "@/components/physics/SimulationControls";

const COLOR = "#f97316";
const G = 9.81;

export function CircularMotionSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [radius, setRadius] = useState(120);  // pixels
  const [speed,  setSpeed]  = useState(2);    // rad/s (angular velocity)
  const [mass,   setMass]   = useState(1);    // kg
  const [showVectors, setShowVectors] = useState(true);

  const sim = useSimulation({ autoStart: true });

  // Physical quantities (using px as unit for display)
  const v_lin  = speed * radius * 0.01;            // m/s (scaled)
  const a_c    = speed ** 2 * radius * 0.01;       // m/s²
  const F_c    = mass * a_c;                        // N
  const period = (2 * Math.PI) / speed;            // s

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width; const H = canvas.height;
    const cx = W / 2; const cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Background grid
    ctx.strokeStyle = "rgba(249,115,22,0.07)"; ctx.lineWidth = 1;
    for (let x = cx % 40; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = cy % 40; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Orbit path
    ctx.strokeStyle = `rgba(249,115,22,0.25)`;
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // Radius markers
    [60, 120, 180].filter((r) => r <= Math.min(W, H) / 2 - 20).forEach((r) => {
      ctx.strokeStyle = "rgba(249,115,22,0.08)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(249,115,22,0.3)"; ctx.font = "9px monospace";
      ctx.fillText(`r=${r}`, cx + r + 2, cy);
    });

    const angle = speed * sim.t;
    const px    = cx + radius * Math.cos(angle);
    const py    = cy + radius * Math.sin(angle);

    // String (pivot to ball)
    ctx.strokeStyle = "rgba(249,115,22,0.5)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

    // Pivot
    ctx.fillStyle = "rgba(249,115,22,0.9)";
    ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();

    if (showVectors) {
      // Centripetal force arrow (toward centre)
      const fcLen = Math.min(60, F_c * 20);
      const toCx = cx - px; const toCy = cy - py;
      const toCD = Math.sqrt(toCx ** 2 + toCy ** 2);
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py);
      ctx.lineTo(px + (toCx / toCD) * fcLen, py + (toCy / toCD) * fcLen);
      ctx.stroke();
      // Arrowhead
      const ax = px + (toCx / toCD) * fcLen;
      const ay = py + (toCy / toCD) * fcLen;
      const headAngle = Math.atan2(toCy, toCx);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax - 8 * Math.cos(headAngle - 0.4), ay - 8 * Math.sin(headAngle - 0.4));
      ctx.lineTo(ax - 8 * Math.cos(headAngle + 0.4), ay - 8 * Math.sin(headAngle + 0.4));
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#ef4444"; ctx.font = "10px sans-serif";
      ctx.fillText("Fc", ax + 5, ay);

      // Velocity arrow (tangential)
      const vLen = Math.min(50, v_lin * 15);
      const vx   = -Math.sin(angle) * vLen;
      const vy   =  Math.cos(angle) * vLen;
      ctx.strokeStyle = "#34d399"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + vx, py + vy); ctx.stroke();
      const vAngle = Math.atan2(vy, vx);
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.moveTo(px + vx, py + vy);
      ctx.lineTo(px + vx - 8 * Math.cos(vAngle - 0.4), py + vy - 8 * Math.sin(vAngle - 0.4));
      ctx.lineTo(px + vx - 8 * Math.cos(vAngle + 0.4), py + vy - 8 * Math.sin(vAngle + 0.4));
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#34d399"; ctx.font = "10px sans-serif";
      ctx.fillText("v", px + vx + 5, py + vy - 5);
    }

    // Ball with glow
    ctx.shadowColor = COLOR; ctx.shadowBlur = 16;
    ctx.fillStyle = COLOR;
    ctx.beginPath(); ctx.arc(px, py, 12 + mass * 2, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`${mass}kg`, px, py + 4);

    // Angle label
    const deg = ((angle * 180 / Math.PI) % 360 + 360) % 360;
    ctx.fillStyle = "rgba(249,115,22,0.7)"; ctx.font = "10px monospace"; ctx.textAlign = "left";
    ctx.fillText(`θ = ${deg.toFixed(0)}°`, 8, 18);

    // Legend
    if (showVectors) {
      ctx.fillStyle = "#ef4444"; ctx.fillRect(W - 90, 10, 12, 3);
      ctx.fillStyle = "#ef4444"; ctx.font = "9px sans-serif"; ctx.fillText("Centripetal F", W - 75, 15);
      ctx.fillStyle = "#34d399"; ctx.fillRect(W - 90, 22, 12, 3);
      ctx.fillStyle = "#34d399"; ctx.fillText("Velocity", W - 75, 27);
    }
    ctx.textAlign = "left";
  }, [sim.t, radius, speed, mass, showVectors, v_lin, a_c, F_c]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}>
        <canvas ref={canvasRef} width={500} height={380} className="w-full" style={{ maxHeight: 380 }} />
      </div>

      <SimulationControls running={sim.running} finished={sim.finished}
        onToggle={sim.toggle} onReset={sim.reset}
        color={COLOR} timeLabel={`t = ${sim.t.toFixed(2)} s`} />

      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {([
          { label: "Radius (r)",           val: radius, setV: setRadius, min: 40, max: 180, step: 5,  unit: "px",     color: COLOR    },
          { label: "Angular Speed (ω)",    val: speed,  setV: setSpeed,  min: 0.3,max: 6,   step: 0.1,unit: "rad/s",  color: "#a78bfa"},
          { label: "Mass (m)",             val: mass,   setV: setMass,   min: 0.5,max: 10,  step: 0.5, unit: "kg",    color: "#22c55e"},
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

        <label className="flex items-center gap-3 cursor-pointer">
          <div onClick={() => setShowVectors((v) => !v)}
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{ background: showVectors ? COLOR : "var(--color-border)" }}>
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
              style={{ transform: showVectors ? "translateX(20px)" : "translateX(0)" }} />
          </div>
          <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Show force & velocity vectors</span>
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Linear Speed v",    value: `${v_lin.toFixed(2)} m/s`, color: "#34d399" },
          { label: "Centripetal ac",    value: `${a_c.toFixed(2)} m/s²`,  color: "#ef4444" },
          { label: "Centripetal Force", value: `${F_c.toFixed(2)} N`,     color: COLOR     },
          { label: "Period T",          value: `${period.toFixed(2)} s`,   color: "#a78bfa" },
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
        💡 Red arrow = centripetal force (inward). Green arrow = velocity (tangential — always perpendicular to radius).
        Increase speed or reduce radius to feel more centripetal force needed.
      </div>
    </div>
  );
}
