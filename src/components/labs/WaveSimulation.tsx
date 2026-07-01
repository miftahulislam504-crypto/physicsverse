"use client";

// src/components/labs/WaveSimulation.tsx
import { useRef, useEffect, useState } from "react";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { SimulationControls } from "@/components/physics/SimulationControls";

const COLOR = "#34d399";

interface WaveParams {
  amplitude:   number;
  frequency:   number;
  speed:       number;
  showSecond:  boolean;
  amp2:        number;
  freq2:       number;
  waveType:    "transverse" | "longitudinal";
}

export function WaveSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState<WaveParams>({
    amplitude: 40,
    frequency: 1.5,
    speed:     150,
    showSecond:false,
    amp2:      30,
    freq2:     1.5,
    waveType:  "transverse",
  });

  const sim = useSimulation({ autoStart: true });

  const wavelength = params.speed / params.frequency;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    const midY = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "rgba(52,211,153,0.02)";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(52,211,153,0.06)";
    ctx.lineWidth   = 1;
    for (let y = 0; y <= H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let x = 0; x <= W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    // Equilibrium line
    ctx.strokeStyle = "rgba(52,211,153,0.2)";
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();
    ctx.setLineDash([]);

    const k1 = (2 * Math.PI) / wavelength;
    const omega1 = 2 * Math.PI * params.frequency;
    const k2 = (2 * Math.PI) / (params.speed / params.freq2);
    const omega2 = 2 * Math.PI * params.freq2;

    if (params.waveType === "transverse") {
      // Wave 1
      ctx.strokeStyle = COLOR;
      ctx.lineWidth   = 2.5;
      ctx.shadowColor = COLOR;
      ctx.shadowBlur  = 8;
      ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        const y = midY - params.amplitude * Math.sin(k1 * x - omega1 * sim.t);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Wave 2 (interference)
      if (params.showSecond) {
        ctx.strokeStyle = "#f97316";
        ctx.lineWidth   = 2;
        ctx.beginPath();
        for (let x = 0; x <= W; x++) {
          const y = midY - params.amp2 * Math.sin(k2 * x - omega2 * sim.t);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Superposition (resultant)
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth   = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        for (let x = 0; x <= W; x++) {
          const y1 = params.amplitude * Math.sin(k1 * x - omega1 * sim.t);
          const y2 = params.amp2      * Math.sin(k2 * x - omega2 * sim.t);
          const y = midY - (y1 + y2);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Labels
      ctx.fillStyle = "rgba(52,211,153,0.8)";
      ctx.font      = "11px monospace";
      ctx.fillText(`λ = ${wavelength.toFixed(0)} px  f = ${params.frequency} Hz  A = ${params.amplitude} px`, 12, 20);

    } else {
      // Longitudinal wave — draw particles
      const numParticles = 40;
      const spacing = W / numParticles;
      ctx.fillStyle = "rgba(52,211,153,0.8)";

      for (let i = 0; i < numParticles; i++) {
        const x0 = i * spacing + spacing / 2;
        const displacement = params.amplitude * 0.3 *
          Math.sin(k1 * x0 - omega1 * sim.t);
        const px = x0 + displacement;

        // Colour by compression/rarefaction
        const compressionRatio = Math.abs(displacement) / (params.amplitude * 0.3);
        const alpha = 0.4 + compressionRatio * 0.6;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(px, midY, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Pressure wave overlay
      ctx.strokeStyle = "rgba(52,211,153,0.4)";
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= W; x++) {
        const pressure = midY - (params.amplitude * 0.5) *
          Math.cos(k1 * x - omega1 * sim.t);
        x === 0 ? ctx.moveTo(x, pressure) : ctx.lineTo(x, pressure);
      }
      ctx.stroke();

      ctx.fillStyle = "rgba(52,211,153,0.8)";
      ctx.font      = "11px monospace";
      ctx.fillText("Longitudinal wave — dots show particle displacement", 12, 20);
    }

  }, [sim.t, params, wavelength]);

  const Slider = ({ label, value, min, max, step, unit, onChange, color = COLOR }: {
    label: string; value: number; min: number; max: number; step: number;
    unit: string; onChange: (v: number) => void; color?: string;
  }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
        <span className="font-mono" style={{ color }}>{value} {unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: color }}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}
      >
        <canvas ref={canvasRef} width={640} height={260} className="w-full" style={{ maxHeight: 260 }} />
      </div>

      {/* Controls */}
      <SimulationControls
        running={sim.running} finished={sim.finished}
        onToggle={sim.toggle} onReset={sim.reset}
        color={COLOR} timeLabel={`t = ${sim.t.toFixed(2)} s`}
      />

      {/* Wave type toggle */}
      <div className="flex gap-2">
        {(["transverse", "longitudinal"] as const).map((type) => (
          <button key={type}
            onClick={() => setParams((p) => ({ ...p, waveType: type }))}
            className="flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all"
            style={{
              background:  params.waveType === type ? COLOR + "20" : "var(--color-surface)",
              color:       params.waveType === type ? COLOR : "var(--color-text-muted)",
              border:      `1px solid ${params.waveType === type ? COLOR + "40" : "var(--color-border)"}`,
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Sliders */}
      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}>Wave 1</p>
        <Slider label="Amplitude" value={params.amplitude} min={5} max={80} step={1} unit="px"
          onChange={(v) => setParams((p) => ({ ...p, amplitude: v }))} />
        <Slider label="Frequency" value={params.frequency} min={0.3} max={5} step={0.1} unit="Hz"
          onChange={(v) => setParams((p) => ({ ...p, frequency: v }))} />
        <Slider label="Wave Speed" value={params.speed} min={50} max={400} step={10} unit="px/s"
          onChange={(v) => setParams((p) => ({ ...p, speed: v }))} />

        {/* Interference toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setParams((p) => ({ ...p, showSecond: !p.showSecond }))}
            className="relative w-10 h-5 rounded-full transition-colors"
            style={{ background: params.showSecond ? COLOR : "var(--color-border)" }}
          >
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform"
              style={{ transform: params.showSecond ? "translateX(20px)" : "translateX(0)" }} />
          </div>
          <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            Show Wave 2 (interference)
          </span>
        </label>

        {params.showSecond && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider pt-2"
              style={{ color: "var(--color-text-muted)" }}>Wave 2</p>
            <Slider label="Amplitude 2" value={params.amp2} min={5} max={80} step={1} unit="px"
              onChange={(v) => setParams((p) => ({ ...p, amp2: v }))} color="#f97316" />
            <Slider label="Frequency 2" value={params.freq2} min={0.3} max={5} step={0.1} unit="Hz"
              onChange={(v) => setParams((p) => ({ ...p, freq2: v }))} color="#f97316" />
          </>
        )}
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Wavelength", value: `${wavelength.toFixed(0)} px`, color: COLOR    },
          { label: "Period",     value: `${(1/params.frequency).toFixed(2)} s`, color: "#a78bfa" },
          { label: "v = fλ",     value: `${params.speed} px/s`,         color: "#facc15"  },
        ].map((s) => (
          <div key={s.label}
            className="p-3 rounded-xl border text-center"
            style={{ background: "var(--color-surface)", borderColor: `${s.color}25` }}>
            <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>{s.label}</p>
            <p className="text-sm font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl text-xs"
        style={{ background: `${COLOR}08`, border: `1px solid ${COLOR}20`, color: "var(--color-text-secondary)" }}>
        💡 Enable Wave 2 with the <strong>same frequency</strong> to see standing waves. Change frequency slightly to see beat patterns.
      </div>
    </div>
  );
}
