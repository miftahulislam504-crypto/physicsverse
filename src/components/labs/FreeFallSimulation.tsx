"use client";

// src/components/labs/FreeFallSimulation.tsx
import { useRef, useEffect, useState } from "react";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { SimulationControls } from "@/components/physics/SimulationControls";

const COLOR = "#f97316";
const G = 9.81;

interface Params {
  height: number;     // metres
  mass: number;       // kg
  dragCoeff: number;  // 0 = vacuum
}

export function FreeFallSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState<Params>({ height: 80, mass: 1, dragCoeff: 0.5 });
  const [airOn, setAirOn]   = useState(false);

  // Vacuum: y = h - ½gt²
  // Air: numerically integrate with drag F = -bv
  const posRef  = useRef({ vacuum: params.height, air: params.height });
  const velRef  = useRef({ vacuum: 0, air: 0 });
  const hitRef  = useRef({ vacuum: false, air: false });

  const sim = useSimulation({ fps: 60 });

  // Physics step
  useEffect(() => {
    if (!sim.running) return;
    const dt = 1 / 60;

    // Vacuum
    if (!hitRef.current.vacuum) {
      velRef.current.vacuum += G * dt;
      posRef.current.vacuum -= velRef.current.vacuum * dt;
      if (posRef.current.vacuum <= 0) { posRef.current.vacuum = 0; hitRef.current.vacuum = true; }
    }

    // Air
    if (!hitRef.current.air && airOn) {
      const drag = params.dragCoeff * velRef.current.air ** 2 / params.mass;
      velRef.current.air += (G - drag) * dt;
      posRef.current.air -= velRef.current.air * dt;
      if (posRef.current.air <= 0) { posRef.current.air = 0; hitRef.current.air = true; }
    } else if (!airOn) {
      posRef.current.air = posRef.current.vacuum;
      velRef.current.air = velRef.current.vacuum;
      hitRef.current.air = hitRef.current.vacuum;
    }
  }, [sim.t, sim.running, params, airOn]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width; const H = canvas.height;
    const pad = 40; const groundY = H - pad;
    const scale = (H - 2 * pad) / params.height;

    ctx.clearRect(0, 0, W, H);

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "rgba(249,115,22,0.03)");
    bg.addColorStop(1, "transparent");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Height markers
    for (let h = 0; h <= params.height; h += Math.ceil(params.height / 8)) {
      const y = groundY - h * scale;
      ctx.strokeStyle = "rgba(249,115,22,0.1)"; ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(249,115,22,0.5)"; ctx.font = "10px monospace";
      ctx.fillText(`${h}m`, 4, y + 4);
    }

    // Ground
    ctx.strokeStyle = "rgba(249,115,22,0.5)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(pad, groundY); ctx.lineTo(W - pad, groundY); ctx.stroke();
    ctx.fillStyle = "rgba(249,115,22,0.15)";
    ctx.fillRect(pad, groundY, W - 2 * pad, H - groundY);
    ctx.fillStyle = "rgba(249,115,22,0.6)"; ctx.font = "11px sans-serif";
    ctx.fillText("Ground", W / 2 - 20, groundY + 18);

    const vaccX = W * 0.35;
    const airX  = W * 0.65;

    // Vacuum object
    const vy = groundY - posRef.current.vacuum * scale;
    ctx.shadowColor = COLOR; ctx.shadowBlur = hitRef.current.vacuum ? 0 : 16;
    ctx.fillStyle   = hitRef.current.vacuum ? "rgba(239,68,68,0.8)" : COLOR;
    ctx.beginPath(); ctx.arc(vaccX, vy, 14, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur  = 0;
    ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(params.mass + "kg", vaccX, vy + 3);

    // Vacuum label
    ctx.fillStyle = COLOR; ctx.font = "11px sans-serif";
    ctx.fillText("Vacuum", vaccX, pad - 10);
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "10px monospace";
    ctx.fillText(`v = ${velRef.current.vacuum.toFixed(1)} m/s`, vaccX, pad + 6);

    // Air object
    if (airOn) {
      const ay = groundY - posRef.current.air * scale;
      ctx.shadowColor = "#60a5fa"; ctx.shadowBlur = hitRef.current.air ? 0 : 16;
      ctx.fillStyle   = hitRef.current.air ? "rgba(239,68,68,0.8)" : "#60a5fa";
      ctx.beginPath(); ctx.arc(airX, ay, 14, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur  = 0;
      ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.font = "bold 9px sans-serif";
      ctx.fillText(params.mass + "kg", airX, ay + 3);
      ctx.fillStyle = "#60a5fa"; ctx.font = "11px sans-serif";
      ctx.fillText("With Air", airX, pad - 10);
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "10px monospace";
      ctx.fillText(`v = ${velRef.current.air.toFixed(1)} m/s`, airX, pad + 6);
    }

    ctx.textAlign = "left";

    // Hit flash
    if (hitRef.current.vacuum) {
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(vaccX + Math.cos(angle) * 16, groundY + Math.sin(angle) * 8);
        ctx.lineTo(vaccX + Math.cos(angle) * 26, groundY + Math.sin(angle) * 14);
        ctx.stroke();
      }
    }
  }, [sim.t, params, airOn]);

  const handleReset = () => {
    sim.reset();
    posRef.current = { vacuum: params.height, air: params.height };
    velRef.current = { vacuum: 0, air: 0 };
    hitRef.current = { vacuum: false, air: false };
  };

  const handleParam = (key: keyof Params, val: number) => {
    handleReset();
    setParams((p) => ({ ...p, [key]: val }));
  };

  const tFall = Math.sqrt(2 * params.height / G);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}>
        <canvas ref={canvasRef} width={520} height={380} className="w-full" style={{ maxHeight: 380 }} />
      </div>

      <SimulationControls running={sim.running} finished={sim.finished}
        onToggle={sim.toggle} onReset={handleReset}
        color={COLOR} timeLabel={`t = ${sim.t.toFixed(2)} s`} />

      {/* Air toggle */}
      <label className="flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <div onClick={() => { handleReset(); setAirOn((v) => !v); }}
          className="relative w-10 h-5 rounded-full transition-colors"
          style={{ background: airOn ? "#60a5fa" : "var(--color-border)" }}>
          <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
            style={{ transform: airOn ? "translateX(20px)" : "translateX(0)" }} />
        </div>
        <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Show air resistance comparison
        </span>
      </label>

      {/* Sliders */}
      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {([
          { label: "Drop Height (h)", key: "height",    min: 10, max: 200, step: 5,   unit: "m",   color: COLOR    },
          { label: "Mass (m)",        key: "mass",      min: 0.1,max: 20,  step: 0.1, unit: "kg",  color: "#22c55e"},
          { label: "Drag Coefficient",key: "dragCoeff", min: 0,  max: 2,   step: 0.1, unit: "",    color: "#60a5fa"},
        ] as const).map(({ label, key, min, max, step, unit, color }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
              <span className="font-mono" style={{ color }}>{params[key]} {unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={params[key]}
              onChange={(e) => handleParam(key, +e.target.value)}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor: color }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Fall Time (vacuum)", value: `${tFall.toFixed(2)} s`,    color: COLOR    },
          { label: "Impact Speed",       value: `${(G * tFall).toFixed(1)} m/s`, color: "#f59e0b" },
          { label: "Current Speed",      value: `${velRef.current.vacuum.toFixed(1)} m/s`, color: "#22c55e" },
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
        💡 In <strong>vacuum</strong>, all masses fall at the same rate — Galileo proved this.
        Enable <strong>air resistance</strong> to see how drag slows heavier objects less (terminal velocity concept).
      </div>
    </div>
  );
}
