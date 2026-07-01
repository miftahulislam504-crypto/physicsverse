// src/lib/constants/discovery-data.ts
import type { PhysicsDomain } from "@/types";

export interface DataPoint { x: number; y: number }

export interface DiscoveryMission {
  id:           string;
  slug:         string;
  title:        string;
  icon:         string;
  domain:       PhysicsDomain;
  type:         "pattern" | "hypothesis";
  scenario:     string;
  data?:        DataPoint[];
  xLabel?:      string;
  yLabel?:      string;
  question:     string;
  options:      { id: string; text: string }[];
  correctAnswer: string;
  explanation:  string;
  revealedLaw:  string;
}

export const DISCOVERY_MISSIONS: DiscoveryMission[] = [
  {
    id: "disc-001", slug: "pendulum-pattern",
    title: "Discover the Pendulum Law", icon: "🕰️", domain: "mechanics", type: "pattern",
    scenario: "A student measures the period of a pendulum for different lengths. Here's the data collected:",
    data: [
      { x: 0.25, y: 1.00 }, { x: 0.5, y: 1.42 }, { x: 1.0, y: 2.01 },
      { x: 1.5, y: 2.46 }, { x: 2.0, y: 2.84 }, { x: 2.5, y: 3.17 },
    ],
    xLabel: "Length (m)", yLabel: "Period (s)",
    question: "Looking at this data pattern, what is the relationship between Period T and Length L?",
    options: [
      { id: "A", text: "T is directly proportional to L" },
      { id: "B", text: "T is directly proportional to L²" },
      { id: "C", text: "T is directly proportional to √L" },
      { id: "D", text: "T is inversely proportional to L" },
    ],
    correctAnswer: "C",
    explanation: "Notice: when L quadruples (0.25→1.0), T only doubles (1.00→2.01). When L is 4× and T is 2× — that's a square root relationship! T ∝ √L, which matches T = 2π√(L/g).",
    revealedLaw: "T = 2π√(L/g) — Simple Pendulum Period Formula",
  },
  {
    id: "disc-002", slug: "spring-force-pattern",
    title: "Discover Hooke's Law", icon: "🌀", domain: "mechanics", type: "pattern",
    scenario: "A spring is stretched by different amounts, and the restoring force is measured:",
    data: [
      { x: 0.02, y: 4 }, { x: 0.04, y: 8 }, { x: 0.06, y: 12 },
      { x: 0.08, y: 16 }, { x: 0.10, y: 20 }, { x: 0.12, y: 24 },
    ],
    xLabel: "Extension (m)", yLabel: "Force (N)",
    question: "What pattern do you see between Force and Extension?",
    options: [
      { id: "A", text: "Force is proportional to extension²" },
      { id: "B", text: "Force is directly proportional to extension" },
      { id: "C", text: "Force is inversely proportional to extension" },
      { id: "D", text: "No clear relationship" },
    ],
    correctAnswer: "B",
    explanation: "Every time extension doubles, force exactly doubles too. Force/Extension = 200 N/m consistently — a perfectly linear relationship. This constant ratio is the spring constant k!",
    revealedLaw: "F = kx — Hooke's Law (k = 200 N/m for this spring)",
  },
  {
    id: "disc-003", slug: "gravitation-pattern",
    title: "Discover the Inverse Square Law", icon: "🌍", domain: "mechanics", type: "pattern",
    scenario: "Gravitational force between two masses is measured at different separations:",
    data: [
      { x: 1, y: 100 }, { x: 2, y: 25 }, { x: 3, y: 11.1 },
      { x: 4, y: 6.25 }, { x: 5, y: 4 }, { x: 10, y: 1 },
    ],
    xLabel: "Distance (units)", yLabel: "Force (units)",
    question: "How does gravitational force change as distance increases?",
    options: [
      { id: "A", text: "Force ∝ 1/r (inversely proportional to distance)" },
      { id: "B", text: "Force ∝ 1/r² (inversely proportional to distance squared)" },
      { id: "C", text: "Force ∝ r (proportional to distance)" },
      { id: "D", text: "Force stays constant" },
    ],
    correctAnswer: "B",
    explanation: "When distance doubles (1→2), force drops to 1/4 (100→25). When distance is 10×, force is 1/100. This is the signature of an inverse-square relationship: F ∝ 1/r².",
    revealedLaw: "F = Gm₁m₂/r² — Newton's Law of Universal Gravitation",
  },
  {
    id: "disc-004", slug: "resistor-hypothesis",
    title: "Test: Does Wire Length Affect Resistance?", icon: "🔌", domain: "electricity", type: "hypothesis",
    scenario: "A student hypothesizes: 'Longer wires have more resistance.' They test wires of the same material and thickness but different lengths, measuring resistance with a multimeter.",
    data: [
      { x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 },
      { x: 4, y: 8 }, { x: 5, y: 10 },
    ],
    xLabel: "Length (m)", yLabel: "Resistance (Ω)",
    question: "Does this data support the hypothesis? What's the relationship?",
    options: [
      { id: "A", text: "Hypothesis rejected — no clear pattern" },
      { id: "B", text: "Hypothesis confirmed — R is directly proportional to length" },
      { id: "C", text: "Hypothesis confirmed — but R decreases with length" },
      { id: "D", text: "Cannot determine from this data" },
    ],
    correctAnswer: "B",
    explanation: "Resistance doubles when length doubles (perfectly linear, R/L = 2 Ω/m always). The hypothesis is confirmed: longer wires DO have proportionally more resistance, because electrons collide with more atoms along a longer path.",
    revealedLaw: "R = ρL/A — Resistance formula (ρ = resistivity, A = cross-sectional area)",
  },
  {
    id: "disc-005", slug: "gas-pressure-hypothesis",
    title: "Test: Pressure vs Volume at Constant T", icon: "🫧", domain: "thermodynamics", type: "hypothesis",
    scenario: "A student compresses gas in a sealed syringe at constant temperature and measures pressure:",
    data: [
      { x: 10, y: 100 }, { x: 20, y: 50 }, { x: 25, y: 40 },
      { x: 40, y: 25 }, { x: 50, y: 20 }, { x: 100, y: 10 },
    ],
    xLabel: "Volume (mL)", yLabel: "Pressure (kPa)",
    question: "What is the mathematical relationship between P and V here?",
    options: [
      { id: "A", text: "P × V = constant (inverse relationship)" },
      { id: "B", text: "P + V = constant" },
      { id: "C", text: "P/V = constant" },
      { id: "D", text: "No consistent relationship" },
    ],
    correctAnswer: "A",
    explanation: "Check: 10×100=1000, 20×50=1000, 25×40=1000, 50×20=1000. The product PV is always 1000! This is a hyperbolic (inverse) relationship — as volume decreases, pressure increases proportionally.",
    revealedLaw: "PV = constant — Boyle's Law (at constant temperature)",
  },
  {
    id: "disc-006", slug: "wavelength-frequency-pattern",
    title: "Discover the Wave Speed Relationship", icon: "〰️", domain: "waves", type: "pattern",
    scenario: "Different sound sources are measured — their wavelength and frequency in the same medium (air):",
    data: [
      { x: 100, y: 3.4 }, { x: 200, y: 1.7 }, { x: 340, y: 1.0 },
      { x: 500, y: 0.68 }, { x: 1000, y: 0.34 }, { x: 2000, y: 0.17 },
    ],
    xLabel: "Frequency (Hz)", yLabel: "Wavelength (m)",
    question: "What do you notice about frequency × wavelength for every point?",
    options: [
      { id: "A", text: "It's always different — no pattern" },
      { id: "B", text: "The product is always ~340 (constant)" },
      { id: "C", text: "The product increases with frequency" },
      { id: "D", text: "The sum is always constant" },
    ],
    correctAnswer: "B",
    explanation: "100×3.4=340, 200×1.7=340, 340×1.0=340... every single point gives f×λ=340! That constant is the speed of sound in air (340 m/s). You've just discovered why v=fλ.",
    revealedLaw: "v = fλ — Wave Speed Equation (v = 340 m/s, speed of sound in air)",
  },
];

export function getMissionBySlug(slug: string) {
  return DISCOVERY_MISSIONS.find((m) => m.slug === slug);
}
