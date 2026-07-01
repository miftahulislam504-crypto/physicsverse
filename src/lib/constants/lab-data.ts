// src/lib/constants/lab-data.ts
// All virtual lab experiments for PhysicsVerse Phase 4

import type { PhysicsDomain } from "@/types";

export type LabZone =
  | "motion" | "force" | "energy" | "electricity"
  | "waves"  | "light" | "thermal" | "space" | "modern";

export interface LabExperiment {
  id:          string;
  slug:        string;
  zone:        LabZone;
  domain:      PhysicsDomain;
  title:       string;
  description: string;
  icon:        string;
  difficulty:  "beginner" | "intermediate" | "advanced";
  duration:    number;          // minutes
  objectives:  string[];
  relatedChapterSlug?: string;
  relatedFormulaSlug?: string;
  isNew?:      boolean;
}

export const ZONE_META: Record<LabZone, {
  label: string; icon: string; color: string; description: string;
}> = {
  motion:      { label: "Motion Zone",      icon: "🏃", color: "#f97316", description: "Velocity, acceleration, projectile & circular motion" },
  force:       { label: "Force Zone",       icon: "💪", color: "#f59e0b", description: "Forces, friction, springs, torque & equilibrium"     },
  energy:      { label: "Energy Zone",      icon: "⚡", color: "#facc15", description: "Kinetic & potential energy, conservation, power"      },
  electricity: { label: "Electricity Zone", icon: "🔌", color: "#22d3ee", description: "Circuits, resistance, capacitors, electromagnets"     },
  waves:       { label: "Wave Zone",        icon: "〰️", color: "#34d399", description: "Wave properties, interference, resonance, Doppler"   },
  light:       { label: "Light Zone",       icon: "💡", color: "#a5f3fc", description: "Reflection, refraction, lenses, diffraction"          },
  thermal:     { label: "Thermal Zone",     icon: "🌡️", color: "#fb7185", description: "Heat transfer, gas laws, phase changes"              },
  space:       { label: "Space Zone",       icon: "🌌", color: "#818cf8", description: "Orbits, gravity, solar system, black holes"           },
  modern:      { label: "Modern Physics",   icon: "⚛️", color: "#e879f9", description: "Photoelectric effect, atomic structure, radioactivity"},
};

export const LAB_EXPERIMENTS: LabExperiment[] = [
  // ── MOTION ZONE ──────────────────────────────────────────────────────────
  {
    id: "lab-velocity-explorer", slug: "velocity-explorer",
    zone: "motion", domain: "mechanics",
    title: "Velocity Explorer",
    description: "Visualise displacement-time and velocity-time graphs for 1D motion under constant acceleration.",
    icon: "🏃", difficulty: "beginner", duration: 15,
    objectives: ["Interpret s-t and v-t graphs", "Relate slope to velocity and acceleration", "Apply kinematic equations"],
    relatedChapterSlug: "kinematics-1d", relatedFormulaSlug: "velocity",
  },
  {
    id: "lab-projectile", slug: "projectile-motion",
    zone: "motion", domain: "mechanics",
    title: "Projectile Motion",
    description: "Launch a projectile at any angle and speed. Watch the parabolic path and measure range, height, and time of flight.",
    icon: "🎯", difficulty: "intermediate", duration: 20,
    objectives: ["Decompose motion into horizontal and vertical components", "Find maximum range angle", "Verify complementary angle rule"],
    relatedChapterSlug: "projectile-motion", relatedFormulaSlug: "projectile-range",
  },
  {
    id: "lab-free-fall", slug: "free-fall",
    zone: "motion", domain: "mechanics",
    title: "Free Fall",
    description: "Drop objects of different masses in vacuum vs air. Measure fall time, final speed, and verify Galileo's insight.",
    icon: "🪨", difficulty: "beginner", duration: 10,
    objectives: ["Verify all masses fall at same rate in vacuum", "See effect of air resistance", "Calculate g from timing data"],
    relatedChapterSlug: "kinematics-1d",
  },
  {
    id: "lab-circular-motion", slug: "circular-motion",
    zone: "motion", domain: "mechanics",
    title: "Circular Motion",
    description: "Spin an object in a circle. Control speed and radius to see centripetal acceleration and the required tension.",
    icon: "⭕", difficulty: "intermediate", duration: 15,
    objectives: ["Measure centripetal acceleration", "Relate speed, radius, and force", "Understand why centrifugal force is fictitious"],
    relatedChapterSlug: "circular-motion-gravitation",
  },

  // ── FORCE ZONE ───────────────────────────────────────────────────────────
  {
    id: "lab-force-playground", slug: "force-playground",
    zone: "force", domain: "mechanics",
    title: "Force Playground",
    description: "Apply multiple forces to an object. Watch the resultant, measure acceleration, and verify Newton's Second Law.",
    icon: "➡️", difficulty: "beginner", duration: 15,
    objectives: ["Add force vectors", "Verify F = ma", "Observe equilibrium conditions"],
    relatedChapterSlug: "newtons-laws", relatedFormulaSlug: "newtons-second-law",
  },
  {
    id: "lab-spring-oscillation", slug: "spring-oscillation",
    zone: "force", domain: "mechanics",
    title: "Spring & Oscillation (SHM)",
    description: "Stretch or compress a spring and watch simple harmonic motion. Measure period, amplitude, and energy.",
    icon: "🌀", difficulty: "intermediate", duration: 20,
    objectives: ["Verify Hooke's Law: F = -kx", "Measure SHM period", "Observe KE ↔ PE exchange"],
    relatedChapterSlug: "newtons-laws",
  },
  {
    id: "lab-friction", slug: "friction-simulator",
    zone: "force", domain: "mechanics",
    title: "Friction Simulator",
    description: "Push a block on surfaces with different friction coefficients. Compare static vs kinetic friction.",
    icon: "🧱", difficulty: "beginner", duration: 12,
    objectives: ["Distinguish static and kinetic friction", "Measure coefficient of friction", "See effect of normal force"],
    relatedChapterSlug: "newtons-laws",
  },

  // ── ENERGY ZONE ──────────────────────────────────────────────────────────
  {
    id: "lab-energy-conversion", slug: "energy-conversion",
    zone: "energy", domain: "mechanics",
    title: "Energy Conversion",
    description: "A roller coaster track shows real-time KE, PE, and total energy as the cart moves. Adjust height and mass.",
    icon: "🎢", difficulty: "beginner", duration: 15,
    objectives: ["Verify conservation of energy", "Relate height to speed via KE = PE", "See effect of friction on energy"],
    relatedChapterSlug: "work-energy-power", relatedFormulaSlug: "kinetic-energy",
  },
  {
    id: "lab-pendulum", slug: "pendulum",
    zone: "energy", domain: "mechanics",
    title: "Pendulum Lab",
    description: "Swing a pendulum. Change length, mass, and angle. Measure period and verify T = 2π√(L/g).",
    icon: "🕰️", difficulty: "beginner", duration: 15,
    objectives: ["Verify period formula T = 2π√(L/g)", "Show period is independent of mass and small angles", "Measure g"],
    relatedChapterSlug: "work-energy-power",
  },

  // ── ELECTRICITY ZONE ─────────────────────────────────────────────────────
  {
    id: "lab-circuit-builder", slug: "circuit-builder",
    zone: "electricity", domain: "electricity",
    title: "Circuit Builder",
    description: "Drag and connect batteries, resistors, bulbs, and switches. Measure voltage and current at any point.",
    icon: "🔋", difficulty: "beginner", duration: 20,
    objectives: ["Build series and parallel circuits", "Apply Ohm's Law", "Verify Kirchhoff's laws"],
    relatedChapterSlug: "current-resistance-ohms-law", relatedFormulaSlug: "ohms-law",
  },
  {
    id: "lab-ohms-law", slug: "ohms-law-lab",
    zone: "electricity", domain: "electricity",
    title: "Ohm's Law Lab",
    description: "Vary voltage across a resistor. Plot I-V graph and extract resistance from the slope.",
    icon: "📉", difficulty: "beginner", duration: 12,
    objectives: ["Plot I-V characteristic", "Identify ohmic vs non-ohmic behaviour", "Calculate resistance from graph slope"],
    relatedChapterSlug: "current-resistance-ohms-law", relatedFormulaSlug: "ohms-law",
  },
  {
    id: "lab-capacitor", slug: "capacitor-charge",
    zone: "electricity", domain: "electricity",
    title: "Capacitor Charge / Discharge",
    description: "Charge and discharge a capacitor through a resistor. Watch the exponential voltage curve in real time.",
    icon: "⚡", difficulty: "intermediate", duration: 15,
    objectives: ["Understand RC time constant τ = RC", "Plot exponential charge/discharge curves", "Calculate energy stored"],
    relatedChapterSlug: "current-resistance-ohms-law",
  },

  // ── WAVE ZONE ────────────────────────────────────────────────────────────
  {
    id: "lab-wave-generator", slug: "wave-generator",
    zone: "waves", domain: "waves",
    title: "Wave Generator",
    description: "Generate transverse and longitudinal waves. Control frequency, amplitude, and wavelength. See v = fλ live.",
    icon: "〰️", difficulty: "beginner", duration: 15,
    objectives: ["Verify v = fλ", "Compare transverse and longitudinal waves", "Observe standing waves"],
    relatedChapterSlug: "wave-properties", relatedFormulaSlug: "wave-speed",
  },
  {
    id: "lab-interference", slug: "wave-interference",
    zone: "waves", domain: "waves",
    title: "Wave Interference",
    description: "Two wave sources create an interference pattern. Move the sources and see constructive/destructive interference.",
    icon: "🌊", difficulty: "intermediate", duration: 20,
    objectives: ["Distinguish constructive and destructive interference", "Measure path difference", "Observe interference fringes"],
    relatedChapterSlug: "wave-properties",
  },
  {
    id: "lab-doppler", slug: "doppler-effect",
    zone: "waves", domain: "waves",
    title: "Doppler Effect",
    description: "Move a sound source toward or away from an observer. Hear and see the frequency shift in real time.",
    icon: "🚑", difficulty: "intermediate", duration: 12,
    objectives: ["Hear Doppler pitch change", "Calculate observed frequency", "Apply to astronomy and radar"],
    relatedChapterSlug: "sound-waves",
  },

  // ── LIGHT ZONE ───────────────────────────────────────────────────────────
  {
    id: "lab-refraction", slug: "refraction-simulator",
    zone: "light", domain: "optics",
    title: "Refraction Simulator",
    description: "Shine a ray of light into glass, water, or diamond. Control angle and medium. Verify Snell's Law.",
    icon: "💡", difficulty: "beginner", duration: 15,
    objectives: ["Apply Snell's Law", "Find critical angle for TIR", "Compare refractive indices"],
    relatedChapterSlug: "reflection-refraction", relatedFormulaSlug: "snells-law",
  },
  {
    id: "lab-mirror-lens", slug: "mirror-lens-lab",
    zone: "light", domain: "optics",
    title: "Mirror & Lens Lab",
    description: "Move an object in front of concave/convex mirrors and converging/diverging lenses. See real and virtual images form.",
    icon: "🔭", difficulty: "intermediate", duration: 20,
    objectives: ["Apply mirror formula 1/f = 1/v + 1/u", "Locate image using ray diagrams", "Understand magnification"],
    relatedChapterSlug: "reflection-refraction",
  },

  // ── THERMAL ZONE ─────────────────────────────────────────────────────────
  {
    id: "lab-heat-transfer", slug: "heat-transfer",
    zone: "thermal", domain: "thermodynamics",
    title: "Heat Transfer Lab",
    description: "Add heat to materials. Plot temperature-time graphs and identify phase changes and latent heat plateaus.",
    icon: "🔥", difficulty: "beginner", duration: 15,
    objectives: ["Calculate specific heat capacity Q = mcΔT", "Identify latent heat plateaus", "Compare conduction rates"],
    relatedChapterSlug: "temperature-heat",
  },
  {
    id: "lab-ideal-gas", slug: "ideal-gas-law",
    zone: "thermal", domain: "thermodynamics",
    title: "Ideal Gas Law",
    description: "A piston-cylinder with a gas. Change P, V, or T and watch the others respond. Verify Boyle's and Charles's Laws.",
    icon: "🫧", difficulty: "intermediate", duration: 15,
    objectives: ["Verify PV = nRT", "Apply Boyle's Law (T constant)", "Apply Charles's Law (P constant)"],
    relatedChapterSlug: "temperature-heat",
  },

  // ── SPACE ZONE ───────────────────────────────────────────────────────────
  {
    id: "lab-orbital-simulator", slug: "orbital-simulator",
    zone: "space", domain: "astrophysics",
    title: "Orbital Simulator",
    description: "Place a planet at any distance from a star. Control mass and velocity. Watch circular, elliptical, or escape orbits.",
    icon: "🪐", difficulty: "intermediate", duration: 20,
    objectives: ["Apply Kepler's Third Law T² ∝ r³", "Distinguish orbit types", "Calculate escape velocity"],
    relatedChapterSlug: "solar-system", relatedFormulaSlug: "gravitational-force",
  },
  {
    id: "lab-gravity-sandbox", slug: "gravity-sandbox",
    zone: "space", domain: "astrophysics",
    title: "Gravity Sandbox",
    description: "Place multiple masses anywhere in space. Watch gravitational attraction, orbits, and collisions unfold.",
    icon: "🌌", difficulty: "advanced", duration: 25,
    objectives: ["Observe multi-body gravitational interaction", "See Lagrange points", "Witness gravitational slingshot"],
    relatedChapterSlug: "circular-motion-gravitation",
  },

  // ── MODERN PHYSICS ───────────────────────────────────────────────────────
  {
    id: "lab-photoelectric", slug: "photoelectric-effect",
    zone: "modern", domain: "modern",
    title: "Photoelectric Effect",
    description: "Shine light of different frequencies on a metal surface. See electrons ejected only above the threshold frequency.",
    icon: "☀️", difficulty: "intermediate", duration: 15,
    objectives: ["Verify threshold frequency concept", "Calculate work function φ", "Plot stopping voltage vs frequency"],
    relatedChapterSlug: "photoelectric-effect", relatedFormulaSlug: "photon-energy",
    isNew: true,
  },
  {
    id: "lab-double-slit", slug: "double-slit",
    zone: "modern", domain: "quantum",
    title: "Double-Slit Experiment",
    description: "Send electrons or photons through double slits. Switch detection on/off and watch the interference pattern collapse.",
    icon: "🔮", difficulty: "advanced", duration: 20,
    objectives: ["Observe wave-particle duality", "Measure fringe spacing", "Understand role of measurement"],
    relatedChapterSlug: "wave-particle-duality", relatedFormulaSlug: "de-broglie-wavelength",
    isNew: true,
  },
];

export function getExperimentsByZone(zone: LabZone): LabExperiment[] {
  return LAB_EXPERIMENTS.filter((e) => e.zone === zone);
}

export function getExperimentBySlug(slug: string): LabExperiment | undefined {
  return LAB_EXPERIMENTS.find((e) => e.slug === slug);
}

export function getAllZones(): LabZone[] {
  return Object.keys(ZONE_META) as LabZone[];
}
