"use client";

// src/components/labs/PhotoelectricSimulation.tsx
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOR  = "#e879f9";
const H_PLANCK = 6.626e-34;
const C        = 3e8;
const EV       = 1.602e-19;

interface Metal { name: string; workFunction: number; color: string }

const METALS: Metal[] = [
  { name: "Caesium",  workFunction: 2.1, color: "#f97316" },
  { name: "Sodium",   workFunction: 2.3, color: "#facc15" },
  { name: "Potassium",workFunction: 2.3, color: "#34d399" },
  { name: "Zinc",     workFunction: 4.3, color: "#60a5fa" },
  { name: "Copper",   workFunction: 4.5, color: "#f97316" },
  { name: "Platinum", workFunction: 5.7, color: "#94a3b8" },
];

interface Electron { id: number; x: number; y: number; vx: number; vy: number; life: number }

export function PhotoelectricSimulation() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [metalIdx,   setMetalIdx]   = useState(0);
  const [frequency,  setFrequency]  = useState(8e14);   // Hz
  const [intensity,  setIntensity]  = useState(50);     // arbitrary
  const [electrons,  setElectrons]  = useState<Electron[]>([]);
  const rafRef     = useRef<number | null>(null);
  const nextId     = useRef(0);

  const metal     = METALS[metalIdx];
  const photonE   = H_PLANCK * frequency;               // Joules
  const photonEeV = photonE / EV;                       // eV
  const phiEV     = metal.workFunction;
  const ejected   = photonEeV >= phiEV;
  const keMax     = ejected ? photonEeV - phiEV : 0;    // eV
  const thresholdFreq = (phiEV * EV) / H_PLANCK;
  const wavelength = (C / frequency) * 1e9;             // nm

  // Colour based on wavelength
  const lightColor = useMemo(() => {
    const nm = wavelength;
    if (nm < 380) return "#9b30ff";   // UV
    if (nm < 450) return "#7b2fff";   // violet
    if (nm < 495) return "#2244ff";   // blue
    if (nm < 570) return "#22c55e";   // green
    if (nm < 590) return "#facc15";   // yellow
    if (nm < 620) return "#f97316";   // orange
    if (nm < 750) return "#ef4444";   // red
    return "#8b0000";                  // IR
  }, [wavelength]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width; const H = canvas.height;
    const metalX = 80; const metalH = 200;
    const metalY = (H - metalH) / 2;

    function spawn() {
      if (!ejected) return;
      const rate = intensity / 30;
      if (Math.random() < rate) {
        const angle = (Math.random() * Math.PI) - Math.PI / 2;
        const speed = 1 + keMax * 0.8;
        setElectrons((prev) => [
          ...prev.slice(-50),
          {
            id: nextId.current++,
            x: metalX + 18,
            y: metalY + Math.random() * metalH,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
          },
        ]);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "rgba(0,0,0,0.02)";
      ctx.fillRect(0, 0, W, H);

      // Metal surface
      const grad = ctx.createLinearGradient(0, 0, metalX + 20, 0);
      grad.addColorStop(0, metal.color + "30");
      grad.addColorStop(1, metal.color + "90");
      ctx.fillStyle   = grad;
      ctx.strokeStyle = metal.color + "80";
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.roundRect(10, metalY, metalX, metalH, 4);
      ctx.fill(); ctx.stroke();

      // Metal label
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font      = "11px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(metal.name, 10 + metalX / 2, H / 2 + 4);
      ctx.textAlign = "left";

      // Light beam (photons)
      const numPhotons = Math.floor(intensity / 15) + 1;
      for (let i = 0; i < numPhotons; i++) {
        const beamY = metalY + (metalH / (numPhotons + 1)) * (i + 1);
        const gradient = ctx.createLinearGradient(W, beamY, metalX + 10, beamY);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, lightColor + "cc");
        ctx.strokeStyle = gradient;
        ctx.lineWidth   = 2;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(W - 30, beamY);
        ctx.lineTo(metalX + 10, beamY);
        ctx.stroke();

        // Photon dot
        ctx.setLineDash([]);
        ctx.fillStyle   = lightColor;
        ctx.shadowColor = lightColor;
        ctx.shadowBlur  = 10;
        const phase = (Date.now() / 1000 * 3 + i) % 1;
        const dotX  = metalX + 10 + (W - metalX - 40) * (1 - phase);
        ctx.beginPath(); ctx.arc(dotX, beamY, 4, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.setLineDash([]);

      // TIR warning (if not ejected)
      if (!ejected) {
        ctx.fillStyle = "#ef444490";
        ctx.font      = "12px Inter, sans-serif";
        ctx.fillText("✗ Frequency too low — no electrons ejected", metalX + 30, H / 2);
      }
    }

    function frame() {
      spawn();
      setElectrons((prev) =>
        prev
          .map((e) => ({ ...e, x: e.x + e.vx * 1.5, y: e.y + e.vy * 0.5, life: e.life - 0.012 }))
          .filter((e) => e.life > 0 && e.x < W)
      );
      draw();
      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [ejected, intensity, lightColor, metal, keMax]);

  // Draw electrons on canvas overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    electrons.forEach((e) => {
      ctx.globalAlpha = e.life;
      ctx.fillStyle   = "#60a5fa";
      ctx.shadowColor = "#60a5fa";
      ctx.shadowBlur  = 8;
      ctx.beginPath(); ctx.arc(e.x, e.y, 3.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
  }, [electrons]);

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}>
        <canvas ref={canvasRef} width={520} height={300} className="w-full" style={{ maxHeight: 300 }} />
      </div>

      {/* Status banner */}
      <motion.div
        animate={{ background: ejected ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium"
        style={{ borderColor: ejected ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)" }}
      >
        <span className="text-lg">{ejected ? "⚡" : "🚫"}</span>
        <span style={{ color: ejected ? "#22c55e" : "#ef4444" }}>
          {ejected
            ? `Electrons ejected! KE_max = ${keMax.toFixed(3)} eV`
            : `No ejection — photon energy (${photonEeV.toFixed(3)} eV) < work function (${phiEV} eV)`}
        </span>
      </motion.div>

      {/* Sliders */}
      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>

        {/* Metal selector */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}>Metal Surface</p>
          <div className="flex flex-wrap gap-2">
            {METALS.map((m, i) => (
              <button key={m.name} onClick={() => setMetalIdx(i)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  background:  metalIdx === i ? m.color + "25" : "var(--color-surface-2)",
                  color:       metalIdx === i ? m.color : "var(--color-text-muted)",
                  border:      `1px solid ${metalIdx === i ? m.color + "50" : "transparent"}`,
                }}>
                {m.name} ({m.workFunction} eV)
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--color-text-secondary)" }}>
              Frequency (f) — {wavelength.toFixed(0)} nm
              <span className="ml-2 px-1.5 py-0.5 rounded text-xs"
                style={{ background: lightColor + "25", color: lightColor }}>
                {wavelength < 380 ? "UV" : wavelength < 750 ? "Visible" : "IR"}
              </span>
            </span>
            <span className="font-mono" style={{ color: COLOR }}>
              {(frequency / 1e14).toFixed(2)} × 10¹⁴ Hz
            </span>
          </div>
          <input type="range" min={3e14} max={15e14} step={0.1e14} value={frequency}
            onChange={(e) => setFrequency(+e.target.value)}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: lightColor }} />
          <div className="flex justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
            <span>3×10¹⁴ Hz (IR)</span>
            <span>Threshold: {(thresholdFreq / 1e14).toFixed(2)}×10¹⁴ Hz</span>
            <span>15×10¹⁴ Hz (UV)</span>
          </div>
        </div>

        {/* Intensity */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--color-text-secondary)" }}>Intensity (brightness)</span>
            <span className="font-mono" style={{ color: "#facc15" }}>{intensity}%</span>
          </div>
          <input type="range" min={10} max={100} step={5} value={intensity}
            onChange={(e) => setIntensity(+e.target.value)}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: "#facc15" }} />
        </div>
      </div>

      {/* Readings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Photon Energy",  value: `${photonEeV.toFixed(3)} eV`,  color: lightColor },
          { label: "Work Function",  value: `${phiEV} eV`,                 color: metal.color },
          { label: "KE_max",         value: ejected ? `${keMax.toFixed(3)} eV` : "0 eV", color: ejected ? "#22c55e" : "#ef4444" },
          { label: "Wavelength",     value: `${wavelength.toFixed(0)} nm`, color: lightColor },
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
        💡 Key insight: Increasing <strong>intensity</strong> ejects <em>more</em> electrons but doesn&apos;t change their speed.
        Only increasing <strong>frequency</strong> gives electrons more kinetic energy. This proved light comes in quanta.
      </div>
    </div>
  );
}
