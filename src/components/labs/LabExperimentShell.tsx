"use client";

// src/components/labs/LabExperimentShell.tsx
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui";

function SimLoader() {
  return (
    <div className="space-y-3">
      <Skeleton height={300} rounded="rounded-2xl" />
      <Skeleton height={52}  rounded="rounded-2xl" />
      <Skeleton height={120} rounded="rounded-2xl" />
    </div>
  );
}

const load = (fn: () => Promise<any>, name: string) =>
  dynamic(() => fn().then((m) => ({ default: m[name] })), { ssr: false, loading: () => <SimLoader /> });

const SIMULATIONS: Record<string, React.ComponentType> = {
  // Motion Zone
  "velocity-explorer":    load(() => import("./VelocityExplorerSimulation"), "VelocityExplorerSimulation"),
  "projectile-motion":    load(() => import("./ProjectileSimulation"),        "ProjectileSimulation"),
  "free-fall":            load(() => import("./FreeFallSimulation"),          "FreeFallSimulation"),
  "circular-motion":      load(() => import("./CircularMotionSimulation"),    "CircularMotionSimulation"),

  // Force Zone
  "force-playground":     load(() => import("./ProjectileSimulation"),        "ProjectileSimulation"), // placeholder
  "spring-oscillation":   load(() => import("./SpringSimulation"),            "SpringSimulation"),

  // Energy Zone
  "energy-conversion":    load(() => import("./EnergyConversionSimulation"),  "EnergyConversionSimulation"),
  "pendulum":             load(() => import("./PendulumSimulation"),          "PendulumSimulation"),

  // Electricity Zone
  "circuit-builder":      load(() => import("./OhmsLawSimulation"),          "OhmsLawSimulation"),
  "ohms-law-lab":         load(() => import("./OhmsLawSimulation"),          "OhmsLawSimulation"),
  "capacitor-charge":     load(() => import("./CapacitorSimulation"),         "CapacitorSimulation"),

  // Wave Zone
  "wave-generator":       load(() => import("./WaveSimulation"),              "WaveSimulation"),
  "wave-interference":    load(() => import("./WaveSimulation"),              "WaveSimulation"),
  "doppler-effect":       load(() => import("./WaveSimulation"),              "WaveSimulation"),

  // Light Zone
  "refraction-simulator": load(() => import("./RefractionSimulation"),        "RefractionSimulation"),
  "mirror-lens-lab":      load(() => import("./RefractionSimulation"),        "RefractionSimulation"),

  // Thermal Zone
  "heat-transfer":        load(() => import("./HeatTransferSimulation"),      "HeatTransferSimulation"),
  "ideal-gas-law":        load(() => import("./IdealGasSimulation"),          "IdealGasSimulation"),

  // Space Zone
  "orbital-simulator":    load(() => import("./OrbitalSimulatorSimulation"),  "OrbitalSimulatorSimulation"),
  "gravity-sandbox":      load(() => import("./OrbitalSimulatorSimulation"),  "OrbitalSimulatorSimulation"),

  // Modern Physics Zone
  "photoelectric-effect": load(() => import("./PhotoelectricSimulation"),     "PhotoelectricSimulation"),
  "double-slit":          load(() => import("./PhotoelectricSimulation"),     "PhotoelectricSimulation"),
};

export function LabExperimentShell({ slug }: { slug: string }) {
  const Simulation = SIMULATIONS[slug];

  if (!Simulation) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border text-center"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <p className="text-4xl mb-3">🔬</p>
        <p className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
          Simulation Coming Soon
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
          This experiment is being built. Check back soon!
        </p>
      </div>
    );
  }

  return <Simulation />;
}
