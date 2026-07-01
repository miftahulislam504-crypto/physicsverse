"use client";

// src/components/playground/CollisionSimulation.tsx
import { useRef, useEffect, useState, useCallback } from "react";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { SimulationControls } from "@/components/physics/SimulationControls";

const COLOR = "#f97316";

interface Ball { x: number; y: number; vx: number; vy: number; mass: number; r: number; color: string }

export function CollisionSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(2);
  const [m2, setM2] = useState(4);
  const [v1, setV1] = useState(4);
  const [elastic, setElastic] = useState(true);

  const ballsRef = useRef<Ball[]>([]);
  const collidedRef = useRef(false);
  const W = 560; const H = 220; const groundY = H - 30;

  const resetBalls = useCallback(() => {
    ballsRef.current = [
      { x: 80,  y: groundY, vx: v1, vy: 0, mass: m1, r: 10 + m1 * 2, color: COLOR },
      { x: 380, y: groundY, vx: 0,  vy: 0, mass: m2, r: 10 + m2 * 2, color: "#60a5fa" },
    ];
    collidedRef.current = false;
  }, [m1, m2, v1]);

  const sim = useSimulation({ fps: 60, autoStart: false });

  useEffect(() => { resetBalls(); }, [resetBalls]);

  useEffect(() => {
    if (!sim.running) return;
    const balls = ballsRef.current;
    const dt = 0.016;

    for (const b of balls) {
      b.x += b.vx * dt * 60;
      if (b.x - b.r < 0) { b.x = b.r; b.vx *= -1; }
      if (b.x + b.r > W) { b.x = W - b.r; b.vx *= -1; }
    }

    // Collision check
    const [a, c] = balls;
    const dist = Math.abs(a.x - c.x);
    if (dist <= a.r + c.r && !collidedRef.current) {
      collidedRef.current = true;
      if (elastic) {
        // Elastic collision formulas
        const u1 = a.vx; const u2 = c.vx;
        const newV1 = ((a.mass - c.mass) * u1 + 2 * c.mass * u2) / (a.mass + c.mass);
        const newV2 = ((c.mass - a.mass) * u2 + 2 * a.mass * u1) / (a.mass + c.mass);
        a.vx = newV1; c.vx = newV2;
      } else {
        // Perfectly inelastic — stick together
        const combinedV = (a.mass * a.vx + c.mass * c.vx) / (a.mass + c.mass);
        a.vx = combinedV; c.vx = combinedV;
      }
      // Separate slightly to avoid re-trigger
      const overlap = (a.r + c.r) - dist;
      if (a.x < c.x) { a.x -= overlap / 2; c.x += overlap / 2; }
      else            { a.x += overlap / 2; c.x -= overlap / 2; }
    }
    if (dist > a.r + c.r + 5) collidedRef.current = false;
  }, [sim.t, sim.running, elastic]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, W, H);

    // Ground
    ctx.strokeStyle = "rgba(249,115,22,0.4)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, groundY + 1); ctx.lineTo(W, groundY + 1); ctx.stroke();

    ballsRef.current.forEach((b) => {
      ctx.shadowColor = b.color; ctx.shadowBlur = 10;
      ctx.fillStyle = b.color;
      ctx.beginPath(); ctx.arc(b.x, b.y - b.r, b.r, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`${b.mass}kg`, b.x, b.y - b.r + 3);
      ctx.fillStyle = b.color; ctx.font = "10px monospace";
      ctx.fillText(`${b.vx.toFixed(2)} m/s`, b.x, b.y - b.r - 16);
      ctx.textAlign = "left";
    });

    // Momentum readout
    const [a, c] = ballsRef.current;
    const totalP = a.mass * a.vx + c.mass * c.vx;
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "10px monospace";
    ctx.fillText(`Total p = ${totalP.toFixed(2)} kg·m/s`, 8, 16);
  }, [sim.t]);

  const handleReset = () => { sim.reset(); resetBalls(); };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}>
        <canvas ref={canvasRef} width={W} height={H} className="w-full" style={{ maxHeight: H }} />
      </div>

      <SimulationControls running={sim.running} finished={sim.finished}
        onToggle={() => { if (sim.t === 0) resetBalls(); sim.toggle(); }}
        onReset={handleReset} color={COLOR} timeLabel={`t = ${sim.t.toFixed(2)} s`} />

      <div className="flex gap-2">
        {([true, false] as const).map((el) => (
          <button key={String(el)} onClick={() => { setElastic(el); handleReset(); }}
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: elastic === el ? COLOR + "22" : "var(--color-surface)",
              color:      elastic === el ? COLOR : "var(--color-text-muted)",
              border:     `1px solid ${elastic === el ? COLOR + "45" : "var(--color-border)"}`,
            }}>
            {el ? "⚡ Elastic" : "💥 Inelastic (stick)"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border p-4 space-y-3"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {([
          { label: "Mass 1 (m₁)", val: m1, setV: setM1, min: 0.5, max: 10, step: 0.5, color: COLOR },
          { label: "Mass 2 (m₂)", val: m2, setV: setM2, min: 0.5, max: 10, step: 0.5, color: "#60a5fa" },
          { label: "Initial Speed (v₁)", val: v1, setV: setV1, min: 1, max: 10, step: 0.5, color: "#22c55e" },
        ]).map(({ label, val, setV, min, max, step, color }) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
              <span className="font-mono" style={{ color }}>{val} {label.includes("Speed") ? "m/s" : "kg"}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => { handleReset(); setV(+e.target.value); }}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: color }} />
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl text-xs"
        style={{ background: `${COLOR}08`, border: `1px solid ${COLOR}20`, color: "var(--color-text-secondary)" }}>
        💡 <strong>Momentum is always conserved</strong> (watch the total p stay constant).
        In elastic collisions, KE is also conserved. In inelastic, balls stick and move together — KE is lost as heat/sound.
      </div>
    </div>
  );
}
