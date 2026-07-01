"use client";

// src/components/playground/RocketLaunchSimulation.tsx
import { useRef, useEffect, useState } from "react";
import { useSimulation } from "@/lib/hooks/useSimulation";
import { SimulationControls } from "@/components/physics/SimulationControls";

const COLOR = "#ef4444";
const G = 9.81;

export function RocketLaunchSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [thrust,   setThrust]   = useState(15000);   // N
  const [mass,     setMass]     = useState(1000);    // kg
  const [burnTime, setBurnTime] = useState(10);      // s
  const [dragCoeff,setDragCoeff]= useState(0.3);

  const altRef = useRef(0);
  const velRef = useRef(0);
  const fuelMassRef = useRef(0.6); // fraction of mass that's fuel
  const exhaustRef = useRef<{ y: number; life: number }[]>([]);

  const sim = useSimulation({ fps: 60, autoStart: false, maxTime: 40 });

  useEffect(() => {
    if (!sim.running) return;
    const dt = 0.016;
    const burning = sim.t < burnTime;
    const currentMass = burning
      ? mass * (1 - fuelMassRef.current * (sim.t / burnTime))
      : mass * (1 - fuelMassRef.current);

    const thrustForce = burning ? thrust : 0;
    const dragForce = dragCoeff * velRef.current ** 2 * Math.sign(velRef.current);
    const netForce = thrustForce - currentMass * G - dragForce;
    const accel = netForce / currentMass;

    velRef.current += accel * dt;
    altRef.current  = Math.max(0, altRef.current + velRef.current * dt);

    if (altRef.current <= 0 && sim.t > 1) {
      velRef.current = 0;
    }

    // Exhaust particles
    if (burning && Math.random() < 0.6) {
      exhaustRef.current.push({ y: 0, life: 1 });
    }
    exhaustRef.current = exhaustRef.current
      .map((p) => ({ ...p, life: p.life - 0.04 }))
      .filter((p) => p.life > 0);
  }, [sim.t, sim.running, thrust, mass, burnTime, dragCoeff]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width; const H = canvas.height;
    const groundY = H - 30;
    const maxAlt = 6000;
    const scale = (groundY - 30) / maxAlt;

    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "rgba(0,0,30,0.3)");
    sky.addColorStop(1, "rgba(239,68,68,0.02)");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

    // Altitude markers
    [1000, 2000, 3000, 4000, 5000].forEach((alt) => {
      const y = groundY - alt * scale;
      ctx.strokeStyle = "rgba(239,68,68,0.08)"; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "rgba(239,68,68,0.4)"; ctx.font = "9px monospace";
      ctx.fillText(`${alt}m`, 4, y - 2);
    });

    // Ground
    ctx.fillStyle = "rgba(100,80,60,0.3)"; ctx.fillRect(0, groundY, W, H - groundY);
    ctx.strokeStyle = "rgba(239,68,68,0.4)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

    const rocketX = W / 2;
    const rocketY = groundY - altRef.current * scale;

    // Exhaust particles
    exhaustRef.current.forEach((p, i) => {
      const px = rocketX + (Math.random() - 0.5) * 8;
      const py = rocketY + 22 + p.life * 30;
      ctx.globalAlpha = p.life * 0.6;
      ctx.fillStyle = `hsl(${20 + Math.random() * 30}, 90%, 55%)`;
      ctx.beginPath(); ctx.arc(px, py, 4 * (1 - p.life * 0.3), 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Rocket body
    const burning = sim.t < burnTime && sim.running;
    ctx.save();
    ctx.translate(rocketX, rocketY);
    if (burning) { ctx.shadowColor = "#f97316"; ctx.shadowBlur = 14; }

    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(-7, 5);
    ctx.lineTo(-7, 18);
    ctx.lineTo(7, 18);
    ctx.lineTo(7, 5);
    ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;

    // Fins
    ctx.fillStyle = COLOR;
    ctx.beginPath(); ctx.moveTo(-7, 12); ctx.lineTo(-14, 20); ctx.lineTo(-7, 18); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(7, 12); ctx.lineTo(14, 20); ctx.lineTo(7, 18); ctx.closePath(); ctx.fill();

    ctx.restore();

    // Telemetry
    ctx.fillStyle = "rgba(239,68,68,0.8)"; ctx.font = "11px monospace";
    ctx.fillText(`Alt: ${altRef.current.toFixed(0)} m`, 8, 16);
    ctx.fillText(`Vel: ${velRef.current.toFixed(1)} m/s`, 8, 30);
    ctx.fillText(burning ? "🔥 BURNING" : "Coasting", W - 100, 16);
  }, [sim.t, sim.running, burnTime]);

  const handleReset = () => {
    sim.reset();
    altRef.current = 0;
    velRef.current = 0;
    exhaustRef.current = [];
  };

  const maxAltitude = (() => {
    // Quick estimate using rocket equation approximation
    return ((thrust - mass * G) / mass) * burnTime * burnTime * 0.5;
  })();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--color-bg-secondary)", borderColor: `${COLOR}25` }}>
        <canvas ref={canvasRef} width={500} height={360} className="w-full" style={{ maxHeight: 360 }} />
      </div>

      <SimulationControls running={sim.running} finished={sim.finished}
        onToggle={() => { if (sim.t === 0) handleReset(); sim.toggle(); }}
        onReset={handleReset} color={COLOR} timeLabel={`t = ${sim.t.toFixed(1)} s`} />

      <div className="rounded-2xl border p-4 space-y-4"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        {([
          { label: "Thrust",      val: thrust,    setV: setThrust,    min: 5000, max: 30000, step: 500, unit: "N",  color: COLOR    },
          { label: "Rocket Mass", val: mass,      setV: setMass,      min: 500,  max: 3000,  step: 100, unit: "kg", color: "#94a3b8"},
          { label: "Burn Time",   val: burnTime,  setV: setBurnTime,  min: 3,    max: 25,    step: 1,   unit: "s",  color: "#f97316"},
          { label: "Drag Coeff.", val: dragCoeff, setV: setDragCoeff, min: 0,    max: 1,     step: 0.05,unit: "",   color: "#60a5fa"},
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

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl border text-center"
          style={{ background: "var(--color-surface)", borderColor: thrust > mass * G ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)" }}>
          <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Thrust vs Weight</p>
          <p className="text-sm font-bold font-mono" style={{ color: thrust > mass * G ? "#22c55e" : "#ef4444" }}>
            {thrust > mass * G ? "✓ Will lift off" : "✗ Too heavy"}
          </p>
        </div>
        <div className="p-3 rounded-xl border text-center"
          style={{ background: "var(--color-surface)", borderColor: `${COLOR}25` }}>
          <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>Thrust-to-Weight</p>
          <p className="text-sm font-bold font-mono" style={{ color: COLOR }}>
            {(thrust / (mass * G)).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="p-3 rounded-xl text-xs"
        style={{ background: `${COLOR}08`, border: `1px solid ${COLOR}20`, color: "var(--color-text-secondary)" }}>
        💡 Newton's Third Law: hot gas expelled downward (thrust) pushes the rocket upward.
        Net force = Thrust − Weight − Drag. If thrust ≤ weight, the rocket won't lift off at all.
      </div>
    </div>
  );
}
