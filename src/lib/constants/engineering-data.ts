// src/lib/constants/engineering-data.ts
import type { PhysicsDomain } from "@/types";

export interface EngineeringCase {
  id:           string;
  slug:         string;
  field:        "civil" | "mechanical" | "electrical" | "aerospace" | "robotics" | "renewable";
  title:        string;
  icon:         string;
  domain:       PhysicsDomain;
  problem:      string;
  principle:    string;
  solution:     string;
  formula?:     string;
  formulaSlug?: string;
  careerPath:   string;
}

export const ENGINEERING_CASES: EngineeringCase[] = [
  {
    id: "eng-001", slug: "bridge-load",
    field: "civil", title: "Why Bridges Don't Collapse",
    icon: "🌉", domain: "mechanics",
    problem: "A bridge must support its own weight plus traffic, wind, and seismic loads without bending or breaking.",
    principle: "Static equilibrium (ΣF=0, Στ=0) + Material strength (stress/strain)",
    solution: "Engineers calculate the maximum bending moment and shear force at every point. Trusses distribute load through tension and compression members. Steel reinforcement handles tension; concrete handles compression. Safety factor (typically 1.5–3×) accounts for material uncertainty.",
    formula: "\\sigma = \\frac{F}{A} \\quad (\\text{stress} = \\text{force} / \\text{area})",
    formulaSlug: "newtons-second-law",
    careerPath: "Civil/Structural Engineering — requires Statics, Mechanics of Materials, Structural Analysis",
  },
  {
    id: "eng-002", slug: "engine-thermodynamics",
    field: "mechanical", title: "Internal Combustion Engine Efficiency",
    icon: "🔧", domain: "thermodynamics",
    problem: "Car engines convert only ~25-35% of fuel energy into useful work — the rest is lost as heat.",
    principle: "Otto Cycle thermodynamics + Carnot efficiency limit",
    solution: "The theoretical maximum efficiency depends on compression ratio: η = 1 - 1/r^(γ-1). Higher compression ratios improve efficiency but risk knock. Turbochargers recover wasted exhaust energy. Modern engines use variable valve timing to optimise combustion at different RPMs.",
    formula: "\\eta = 1 - \\frac{1}{r^{\\gamma-1}}",
    careerPath: "Mechanical Engineering — Thermodynamics, Fluid Mechanics, Engine Design",
  },
  {
    id: "eng-003", slug: "power-grid",
    field: "electrical", title: "High-Voltage Power Transmission",
    icon: "⚡", domain: "electricity",
    problem: "Power must travel hundreds of kilometres from plants to cities with minimal energy loss.",
    principle: "P = I²R — power loss scales with current squared, not voltage",
    solution: "Transmission lines use very high voltage (110kV-765kV) and low current to minimise I²R heating losses. Transformers step voltage up at plants and down near homes. P = VI is conserved, so high V allows low I for the same power delivery — a clever trick using Ohm's Law and power formulas together.",
    formula: "P_{loss} = I^2 R",
    formulaSlug: "electrical-power",
    careerPath: "Electrical/Power Engineering — Circuit Theory, Power Systems, Transformers",
  },
  {
    id: "eng-004", slug: "aircraft-lift",
    field: "aerospace", title: "Designing Aircraft Wings",
    icon: "✈️", domain: "mechanics",
    problem: "A wing must generate enough lift to overcome weight, at the lowest possible drag for fuel efficiency.",
    principle: "Bernoulli's Principle + Newton's Third Law + Lift coefficient",
    solution: "Wing aerofoil shape is optimised in wind tunnels and CFD simulations. Lift = ½ρv²A·Cl, where Cl (lift coefficient) depends on aerofoil shape and angle of attack. Engineers balance lift, drag, weight, and structural strength across all flight phases — takeoff, cruise, landing.",
    formula: "L = \\frac{1}{2}\\rho v^2 A C_l",
    careerPath: "Aerospace Engineering — Aerodynamics, Fluid Dynamics, Structural Design",
  },
  {
    id: "eng-005", slug: "robot-sensors",
    field: "robotics", title: "How Robots Sense Distance",
    icon: "🤖", domain: "waves",
    problem: "A robot needs to detect obstacles and measure distances without touching them.",
    principle: "Time-of-flight using ultrasonic or laser (LiDAR) waves",
    solution: "Ultrasonic sensors emit a sound pulse and measure the echo time: distance = (speed × time)/2. LiDAR uses laser light (much faster, more precise) for the same principle. Multiple sensors combine into point clouds for 3D mapping — the technology behind self-driving cars.",
    formula: "d = \\frac{v \\cdot t}{2}",
    careerPath: "Robotics Engineering — Sensors, Control Systems, Computer Vision",
  },
  {
    id: "eng-006", slug: "wind-turbine",
    field: "renewable", title: "Wind Turbine Power Generation",
    icon: "🌬️", domain: "mechanics",
    problem: "Convert kinetic energy of moving air into electrical power as efficiently as possible.",
    principle: "Kinetic energy of air + Betz limit (max 59.3% theoretical efficiency)",
    solution: "Power available in wind scales with the CUBE of wind speed: P = ½ρAv³. This is why turbine siting (windy locations) matters enormously — doubling wind speed gives 8× more power! Blade design balances aerodynamic efficiency against structural stress and noise.",
    formula: "P = \\frac{1}{2}\\rho A v^3",
    careerPath: "Renewable Energy Engineering — Fluid Dynamics, Power Electronics, Materials Science",
  },
  {
    id: "eng-007", slug: "solar-tracking",
    field: "renewable", title: "Solar Panel Sun Tracking",
    icon: "☀️", domain: "optics",
    problem: "Fixed solar panels lose up to 30% efficiency because the sun's angle changes throughout the day.",
    principle: "Cosine law of illumination — power ∝ cos(angle of incidence)",
    solution: "Single-axis trackers follow the sun east-to-west; dual-axis trackers also adjust for seasonal elevation changes. Power output follows P = P_max × cos(θ), where θ is the angle between sunlight and panel normal. Tracking systems increase annual energy yield 15-35% but add mechanical cost and complexity.",
    formula: "P = P_{max} \\cos\\theta",
    careerPath: "Solar/Renewable Engineering — Optics, Control Systems, Mechanical Design",
  },
  {
    id: "eng-008", slug: "biomedical-imaging",
    field: "mechanical", title: "Prosthetic Limb Biomechanics",
    icon: "🦾", domain: "mechanics",
    problem: "A prosthetic leg must replicate natural gait while handling impact forces several times body weight.",
    principle: "Energy storage and return — springs mimic tendon elasticity",
    solution: "Carbon-fibre prosthetic 'blades' store elastic potential energy during the stance phase (like a compressed spring: PE=½kx²) and release it during push-off, similar to a natural Achilles tendon. Engineers tune the spring constant k to match the user's weight and activity level.",
    formula: "PE = \\frac{1}{2}kx^2",
    careerPath: "Biomedical Engineering — Biomechanics, Materials Science, Prosthetics Design",
  },
];

export const FIELDS = [
  { id: "civil",      label: "Civil",      icon: "🏗️", color: "#94a3b8" },
  { id: "mechanical", label: "Mechanical", icon: "⚙️", color: "#f97316" },
  { id: "electrical", label: "Electrical", icon: "⚡", color: "#facc15" },
  { id: "aerospace",  label: "Aerospace",  icon: "✈️", color: "#60a5fa" },
  { id: "robotics",   label: "Robotics",   icon: "🤖", color: "#a78bfa" },
  { id: "renewable",  label: "Renewable",  icon: "🌱", color: "#34d399" },
] as const;

export function getEngineeringBySlug(slug: string) { return ENGINEERING_CASES.find((e) => e.slug === slug); }
export function getEngineeringByField(field: string) { return ENGINEERING_CASES.filter((e) => e.field === field); }
