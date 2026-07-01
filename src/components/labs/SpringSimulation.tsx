"use client";

// src/components/labs/SpringSimulation.tsx
import { useRef, useEffect, useState } from "react";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { SimulationControls } from "@/components/physics/SimulationControls";

const COLOR = "#f59e0b";

export function SpringSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k,    setK]    = useState(20);    // N/m
  const [mass, setMass] = useState(1);     // kg
  const [amp,  setAmp]  = useState(80);    // pixels amplitude

  const sim = useSimulation({ autoStart: true });
  const omega = Math.sqrt(k / mass);
  const T     = 2 * Math.PI / omega;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width; const H = canvas.height;
    const anchorX = W / 2; const anchorY = 60;
    const restLen = 120;

    ctx.clearRect(0, 0, W, H);

    const x = amp * Math.cos(omega * sim.t);
    const bobY = anchorY + restLen + x;

    // Spring coils
    const coils = 12;
    const springH = restLen + x;
    ctx.strokeStyle = `rgba(245,158,11,${0.6 + 0.4 * Math.abs(x) / Math.max(amp, 1)})`;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY);
    for (let i = 0; i <= coils * 2; i++) {
      const ty  = anchorY + (springH / (coils * 2)) * i;
      const tx  = anchorX + (i % 2 === 0 ? 0 : (i % 4 < 2 ? 18 : -18));
      ctx.lineTo(tx, ty);
    }
    ctx.stroke();

    // Anchor
    ctx.fillStyle = "rgba(245,158,11,0.8)";
    ctx.fillRect(anchorX - 20, anchorY - 8, 40, 8);

    // Equilibrium marker
    ctx.strokeStyle = "rgba(245,158,11,0.2)"; ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(anchorX - 60, anchorY + restLen); ctx.lineTo(anchorX + 60, anchorY + restLen); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(245,158,11,0.4)"; ctx.font = "10px monospace"; ctx.textAlign = "center";
    ctx.fillText("equilibrium", anchorX + 75, anchorY + restLen + 4);

    // Displacement arrow
    if (Math.abs(x) > 5) {
      ctx.strokeStyle = x > 0 ? "#ef4444" : "#22c55e"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(anchorX + 30, anchorY + restLen); ctx.lineTo(anchorX + 30, bobY); ctx.stroke();
      ctx.fillStyle = x > 0 ? "#ef4444" : "#22c55e"; ctx.font = "10px monospace";
      ctx.fillText(`x=${x.toFixed(0)}px`, anchorX + 50, (anchorY + restLen + bobY) / 2);
    }

    // Bob with glow
    const speed = amp * omega * Math.abs(Math.sin(omega * sim.t));
    const ke_ratio = Math.abs(Math.sin(omega * sim.t));
    ctx.shadowColor = COLOR; ctx.shadowBlur = 8 + ke_ratio * 14;
    ctx.fillStyle   = COLOR;
    ctx.beginPath(); ctx.arc(anchorX, bobY, 18 + mass * 2, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur  = 0;
    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.font = "bold 10px sans-serif";
    ctx.fillText(`${mass}kg`, anchorX, bobY + 4);

    // Force arrow (restoring)
    const forceDir = -Math.sign(x);
    if (Math.abs(x) > 8) {
      const fLen = Math.min(40, Math.abs(x) * 0.4);
      ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(anchorX - 35, bobY); ctx.lineTo(anchorX - 35 + forceDir * fLen, bobY); ctx.stroke();
      ctx.fillStyle = "#60a5fa"; ctx.font = "9px sans-serif";
      ctx.fillText(`F=${(k * Math.abs(x) * 0.01).toFixed(1)}N`, anchorX - 35, bobY - 8);
    }

    // Energy bars (right side)
    const totalE  = 0.5 * k * (amp * 0.01) ** 2;
    const pe      = 0.5 * k * (x * 0.01) ** 2;
    const ke      = Math.max(0, totalE - pe);
    const barH    = 100; const barX = W - 60; const barY = H - 30; const barW = 16;

    ctx.fillStyle = "rgba(245,158,11,0.15)"; ctx.fillRect(barX, barY - barH, barW, barH);
    ctx.fillStyle = COLOR; ctx.fillRect(barX, barY - (pe / totalE) * barH, barW, (pe / totalE) * barH);
    ctx.fillStyle = "rgba(245,158,11,0.7)"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
    ctx.fillText("PE", barX + barW / 2, barY + 12);

    ctx.fillStyle = "rgba(34,211,153,0.15)"; ctx.fillRect(barX + barW + 8, barY - barH, barW, barH);
    ctx.fillStyle = "#34d399"; ctx.fillRect(barX + barW + 8, barY - (ke / totalE) * barH, barW, (ke / totalE) * barH);
    ctx.fillStyle = "rgba(34,211,153,0.7)"; ctx.fillText("KE", barX + barW + 8 + barW / 2, barY + 12);

    ctx.textAlign = "left";
  }, [sim.t, k, mass, amp, omega]);

  const handleReset = () => {
    sim.reset();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}>
        <canvas ref={canvasRef} width={500} height={380} className="w-full" style={{ maxHeight: 380 }} />
      </div>

      <SimulationControls running={sim.running} finished={sim.finished}
        onToggle={sim.toggle} onReset={handleReset}
        color={COLOR} timeLabel={`t = ${sim.t.toFixed(2)} s`} />

      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {([
          { label: "Spring Constant (k)", val: k,    setV: setK,    min: 1,  max: 100, step: 1,  unit: "N/m", color: COLOR    },
          { label: "Mass (m)",            val: mass, setV: setMass, min: 0.1,max: 10,  step: 0.1, unit: "kg", color: "#22c55e"},
          { label: "Amplitude",           val: amp,  setV: setAmp,  min: 10, max: 120, step: 5,  unit: "px", color: "#a78bfa"},
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
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Period T",       value: `${T.toFixed(3)} s`,                  color: COLOR    },
          { label: "Frequency f",    value: `${(1/T).toFixed(3)} Hz`,             color: "#a78bfa"},
          { label: "Angular ω",      value: `${omega.toFixed(2)} rad/s`,          color: "#22d3ee"},
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
        💡 Blue arrow = restoring force (F = -kx). Bar chart shows PE ↔ KE exchange.
        Period <strong>T = 2π√(m/k)</strong> — increase mass to slow it, increase k to speed it up.
      </div>
    </div>
  );
}
