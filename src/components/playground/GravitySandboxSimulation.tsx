"use client";

// src/components/playground/GravitySandboxSimulation.tsx
import { useRef, useEffect, useState, useCallback } from "react";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { SimulationControls } from "@/components/physics/SimulationControls";
import { Trash2, MousePointerClick } from "lucide-react";

const COLOR = "#94a3b8";
const G_SIM = 80;

interface Body { id: number; x: number; y: number; vx: number; vy: number; mass: number; trail: { x: number; y: number }[]; color: string }

const COLORS = ["#fbbf24", "#60a5fa", "#34d399", "#f97316", "#e879f9", "#ef4444"];

export function GravitySandboxSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bodies, setBodies] = useState<Body[]>([
    { id: 1, x: 250, y: 150, vx: 0,    vy: 0,   mass: 80, trail: [], color: COLORS[0] },
    { id: 2, x: 380, y: 150, vx: 0,    vy: 1.8, mass: 10, trail: [], color: COLORS[1] },
  ]);
  const nextId = useRef(3);
  const [mode,  setMode]  = useState<"add" | "watch">("watch");
  const [newMass, setNewMass] = useState(15);
  const bodiesRef = useRef(bodies);
  bodiesRef.current = bodies;

  const sim = useSimulation({ fps: 60, autoStart: false });

  // Physics step
  useEffect(() => {
    if (!sim.running) return;
    const dt = 0.02;
    setBodies((prev) => {
      const next = prev.map((b) => ({ ...b }));
      for (let i = 0; i < next.length; i++) {
        let fx = 0; let fy = 0;
        for (let j = 0; j < next.length; j++) {
          if (i === j) continue;
          const dx = next[j].x - next[i].x;
          const dy = next[j].y - next[i].y;
          const distSq = Math.max(dx * dx + dy * dy, 100);
          const dist = Math.sqrt(distSq);
          const F = (G_SIM * next[i].mass * next[j].mass) / distSq;
          fx += (F * dx) / dist;
          fy += (F * dy) / dist;
        }
        const ax = fx / next[i].mass;
        const ay = fy / next[i].mass;
        next[i].vx += ax * dt;
        next[i].vy += ay * dt;
      }
      for (const b of next) {
        b.x += b.vx * dt * 30;
        b.y += b.vy * dt * 30;
        b.trail = [...b.trail.slice(-150), { x: b.x, y: b.y }];
      }
      return next;
    });
  }, [sim.t, sim.running]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width; const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Stars background
    ctx.fillStyle = "rgba(148,163,184,0.015)"; ctx.fillRect(0, 0, W, H);

    bodiesRef.current.forEach((b) => {
      // Trail
      if (b.trail.length > 1) {
        for (let i = 1; i < b.trail.length; i++) {
          const alpha = i / b.trail.length;
          ctx.strokeStyle = b.color + Math.floor(alpha * 80).toString(16).padStart(2, "0");
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(b.trail[i - 1].x, b.trail[i - 1].y);
          ctx.lineTo(b.trail[i].x, b.trail[i].y);
          ctx.stroke();
        }
      }

      // Body
      const radius = 4 + Math.sqrt(b.mass) * 1.2;
      ctx.shadowColor = b.color; ctx.shadowBlur = 10;
      ctx.fillStyle = b.color;
      ctx.beginPath(); ctx.arc(b.x, b.y, radius, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (mode === "add") {
      ctx.fillStyle = "rgba(148,163,184,0.5)"; ctx.font = "11px sans-serif";
      ctx.fillText("Click anywhere to place a body", 10, 18);
    }
  }, [sim.t, mode]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "add") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    setBodies((prev) => [...prev, {
      id: nextId.current++, x, y, vx: 0, vy: 0,
      mass: newMass, trail: [], color: COLORS[prev.length % COLORS.length],
    }]);
  }, [mode, newMass]);

  const handleReset = () => {
    sim.reset();
    setBodies((prev) => prev.map((b) => ({ ...b, trail: [] })));
  };

  const handleClear = () => {
    sim.reset();
    setBodies([]);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border overflow-hidden cursor-crosshair"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}>
        <canvas ref={canvasRef} width={560} height={340} className="w-full"
          style={{ maxHeight: 340 }} onClick={handleCanvasClick} />
      </div>

      <SimulationControls running={sim.running} finished={sim.finished}
        onToggle={sim.toggle} onReset={handleReset}
        color={COLOR} timeLabel={`t = ${sim.t.toFixed(1)} s · ${bodies.length} bodies`} />

      <div className="flex gap-2">
        {([
          { id: "watch", label: "👁️ Watch",  },
          { id: "add",   label: "➕ Add Body" },
        ] as const).map(({ id, label }) => (
          <button key={id} onClick={() => setMode(id)}
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: mode === id ? COLOR + "22" : "var(--color-surface)",
              color:      mode === id ? "var(--color-text-primary)" : "var(--color-text-muted)",
              border:     `1px solid ${mode === id ? COLOR + "45" : "var(--color-border)"}`,
            }}>
            {label}
          </button>
        ))}
        <button onClick={handleClear}
          className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}>
          <Trash2 size={14} />
        </button>
      </div>

      {mode === "add" && (
        <div className="rounded-2xl border p-4 space-y-2"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
          <div className="flex justify-between text-xs">
            <span style={{ color: "var(--color-text-secondary)" }}>New Body Mass</span>
            <span className="font-mono" style={{ color: COLOR }}>{newMass}</span>
          </div>
          <input type="range" min={5} max={150} step={5} value={newMass}
            onChange={(e) => setNewMass(+e.target.value)}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: COLOR }} />
          <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--color-text-muted)" }}>
            <MousePointerClick size={12} /> Click on the canvas to place a body
          </p>
        </div>
      )}

      <div className="p-3 rounded-xl text-xs"
        style={{ background: `${COLOR}08`, border: `1px solid ${COLOR}20`, color: "var(--color-text-secondary)" }}>
        💡 Every body attracts every other body (Newton's Law of Gravitation, n-body problem).
        Try 3+ bodies — watch chaotic orbits emerge! This is why predicting solar system motion long-term is so hard.
      </div>
    </div>
  );
}
