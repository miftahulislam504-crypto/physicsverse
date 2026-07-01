// src/lib/constants/formulas-data.ts
// Complete formula database for PhysicsVerse Formula Explorer (Phase 3)

import type { PhysicsDomain } from "@/types";

export interface FormulaVariable {
  symbol:       string;
  name:         string;
  unit:         string;
  min:          number;
  max:          number;
  defaultValue: number;
  step:         number;
  description:  string;
}

export interface DerivationStep {
  order:       number;
  latex:       string;
  explanation: string;
}

export interface FormulaData {
  id:              string;
  slug:            string;
  name:            string;
  latex:           string;          // display formula
  latexExpanded:   string;         // full form with all variables
  domain:          PhysicsDomain;
  tags:            string[];
  description:     string;
  variables:       FormulaVariable[];
  derivationSteps: DerivationStep[];
  realWorldUses:   string[];
  relatedFormulas: string[];       // formula IDs
  chapterSlug:     string;
  dimensionalFormula: string;      // e.g. "M L T⁻²"
  siUnit:          string;
  // Graph config
  graphType:       "linear" | "quadratic" | "inverse" | "sinusoidal" | "exponential";
  xVar:            string;         // variable symbol for x-axis
  yVar:            string;         // computed output symbol
  graphLabel:      { x: string; y: string };
}

// ─── MECHANICS ────────────────────────────────────────────────────────────────
export const MECHANICS_FORMULAS: FormulaData[] = [
  {
    id:   "f-velocity",
    slug: "velocity",
    name: "Velocity (Kinematics)",
    latex:         "v = u + at",
    latexExpanded: "v = u + at",
    domain: "mechanics",
    tags: ["kinematics", "velocity", "acceleration", "motion"],
    description: "Final velocity of an object under constant acceleration. One of the three equations of uniform motion.",
    siUnit: "m/s",
    dimensionalFormula: "L T⁻¹",
    graphType: "linear",
    xVar: "t",
    yVar: "v",
    graphLabel: { x: "Time (s)", y: "Velocity (m/s)" },
    variables: [
      { symbol: "v", name: "Final Velocity",   unit: "m/s",  min: -100, max: 100, defaultValue: 0,   step: 1,   description: "Velocity at time t" },
      { symbol: "u", name: "Initial Velocity", unit: "m/s",  min: 0,    max: 50,  defaultValue: 0,   step: 1,   description: "Velocity at t = 0" },
      { symbol: "a", name: "Acceleration",     unit: "m/s²", min: -20,  max: 20,  defaultValue: 9.8, step: 0.1, description: "Constant acceleration" },
      { symbol: "t", name: "Time",             unit: "s",    min: 0,    max: 20,  defaultValue: 5,   step: 0.5, description: "Elapsed time" },
    ],
    derivationSteps: [
      { order: 1, latex: "a = \\frac{\\Delta v}{\\Delta t} = \\frac{v - u}{t}", explanation: "Acceleration is defined as change in velocity per unit time." },
      { order: 2, latex: "at = v - u", explanation: "Multiply both sides by t." },
      { order: 3, latex: "v = u + at", explanation: "Rearrange — final velocity equals initial velocity plus the change due to acceleration." },
    ],
    realWorldUses: [
      "Calculating the speed of a car after braking for a known time.",
      "Determining rocket velocity after engine burn of a specific duration.",
      "Traffic accident reconstruction — finding speed from braking distance.",
    ],
    relatedFormulas: ["f-displacement", "f-velocity-squared", "f-projectile-range"],
    chapterSlug: "kinematics-1d",
  },
  {
    id:   "f-displacement",
    slug: "displacement",
    name: "Displacement (Kinematics)",
    latex:         "s = ut + \\frac{1}{2}at^2",
    latexExpanded: "s = ut + \\frac{1}{2}at^2",
    domain: "mechanics",
    tags: ["kinematics", "displacement", "distance", "motion"],
    description: "Distance travelled from starting point under constant acceleration. The second kinematic equation.",
    siUnit: "m",
    dimensionalFormula: "L",
    graphType: "quadratic",
    xVar: "t",
    yVar: "s",
    graphLabel: { x: "Time (s)", y: "Displacement (m)" },
    variables: [
      { symbol: "s", name: "Displacement",     unit: "m",    min: 0,    max: 1000, defaultValue: 0,   step: 1,   description: "Distance from starting point" },
      { symbol: "u", name: "Initial Velocity", unit: "m/s",  min: 0,    max: 50,   defaultValue: 5,   step: 0.5, description: "Velocity at t = 0" },
      { symbol: "a", name: "Acceleration",     unit: "m/s²", min: -20,  max: 20,   defaultValue: 2,   step: 0.5, description: "Constant acceleration" },
      { symbol: "t", name: "Time",             unit: "s",    min: 0,    max: 20,   defaultValue: 5,   step: 0.5, description: "Elapsed time" },
    ],
    derivationSteps: [
      { order: 1, latex: "s = \\bar{v} \\cdot t", explanation: "Displacement equals average velocity multiplied by time." },
      { order: 2, latex: "\\bar{v} = \\frac{u + v}{2} = \\frac{u + (u+at)}{2}", explanation: "Average velocity for uniform acceleration." },
      { order: 3, latex: "\\bar{v} = u + \\frac{1}{2}at", explanation: "Simplify the average." },
      { order: 4, latex: "s = \\left(u + \\frac{1}{2}at\\right)t = ut + \\frac{1}{2}at^2", explanation: "Substitute back — the second kinematic equation." },
    ],
    realWorldUses: [
      "Calculating how far a stone falls in a given time.",
      "Designing safe braking distances for vehicles on a road.",
      "Computing trajectory length for a launch vehicle.",
    ],
    relatedFormulas: ["f-velocity", "f-velocity-squared"],
    chapterSlug: "kinematics-1d",
  },
  {
    id:   "f-velocity-squared",
    slug: "velocity-squared",
    name: "Velocity² (Kinematic)",
    latex:         "v^2 = u^2 + 2as",
    latexExpanded: "v^2 = u^2 + 2as",
    domain: "mechanics",
    tags: ["kinematics", "velocity", "displacement", "no-time"],
    description: "Relates velocity and displacement without requiring time. Extremely useful in collision and braking problems.",
    siUnit: "m²/s²",
    dimensionalFormula: "L² T⁻²",
    graphType: "linear",
    xVar: "s",
    yVar: "v²",
    graphLabel: { x: "Displacement (m)", y: "v² (m²/s²)" },
    variables: [
      { symbol: "v", name: "Final Velocity",   unit: "m/s",  min: 0, max: 100, defaultValue: 20, step: 1,   description: "Velocity after displacement s" },
      { symbol: "u", name: "Initial Velocity", unit: "m/s",  min: 0, max: 50,  defaultValue: 0,  step: 1,   description: "Starting velocity" },
      { symbol: "a", name: "Acceleration",     unit: "m/s²", min: 0, max: 20,  defaultValue: 5,  step: 0.5, description: "Constant acceleration" },
      { symbol: "s", name: "Displacement",     unit: "m",    min: 0, max: 500, defaultValue: 40, step: 5,   description: "Distance covered" },
    ],
    derivationSteps: [
      { order: 1, latex: "v = u + at \\Rightarrow t = \\frac{v-u}{a}", explanation: "Express time from the first kinematic equation." },
      { order: 2, latex: "s = ut + \\frac{1}{2}at^2", explanation: "Write the second kinematic equation." },
      { order: 3, latex: "s = u\\cdot\\frac{v-u}{a} + \\frac{1}{2}a\\cdot\\frac{(v-u)^2}{a^2}", explanation: "Substitute t = (v-u)/a." },
      { order: 4, latex: "2as = 2u(v-u) + (v-u)^2 = v^2 - u^2", explanation: "Expand and simplify — the third kinematic equation." },
    ],
    realWorldUses: [
      "Accident reconstruction — police measure skid marks to find impact speed.",
      "Calculating minimum runway length for an aircraft to reach takeoff speed.",
    ],
    relatedFormulas: ["f-velocity", "f-displacement"],
    chapterSlug: "kinematics-1d",
  },
  {
    id:   "f-newtons-second",
    slug: "newtons-second-law",
    name: "Newton's Second Law",
    latex:         "F = ma",
    latexExpanded: "F_{net} = ma",
    domain: "mechanics",
    tags: ["Newton", "force", "acceleration", "mass"],
    description: "Net force on an object equals its mass times acceleration. The cornerstone of classical mechanics.",
    siUnit: "N (Newton) = kg·m/s²",
    dimensionalFormula: "M L T⁻²",
    graphType: "linear",
    xVar: "a",
    yVar: "F",
    graphLabel: { x: "Acceleration (m/s²)", y: "Force (N)" },
    variables: [
      { symbol: "F", name: "Net Force",    unit: "N",    min: 0, max: 1000, defaultValue: 100, step: 10,  description: "Total net force on the object" },
      { symbol: "m", name: "Mass",         unit: "kg",   min: 1, max: 200,  defaultValue: 10,  step: 1,   description: "Mass of the object" },
      { symbol: "a", name: "Acceleration", unit: "m/s²", min: 0, max: 50,   defaultValue: 10,  step: 0.5, description: "Resulting acceleration" },
    ],
    derivationSteps: [
      { order: 1, latex: "\\vec{F}_{net} = \\frac{d\\vec{p}}{dt}", explanation: "Newton's second law in its most general form: force equals rate of change of momentum." },
      { order: 2, latex: "\\vec{p} = m\\vec{v}", explanation: "For constant mass, momentum p = mv." },
      { order: 3, latex: "\\vec{F}_{net} = m\\frac{d\\vec{v}}{dt} = m\\vec{a}", explanation: "Since dv/dt = a, we get F = ma." },
    ],
    realWorldUses: [
      "Calculating the thrust needed to accelerate a rocket of given mass.",
      "Designing car crumple zones — longer deceleration time → lower force on passengers.",
      "Elevator engineering — calculating cable tension during acceleration.",
    ],
    relatedFormulas: ["f-weight", "f-kinetic-energy", "f-momentum"],
    chapterSlug: "newtons-laws",
  },
  {
    id:   "f-weight",
    slug: "weight",
    name: "Weight",
    latex:         "W = mg",
    latexExpanded: "W = mg",
    domain: "mechanics",
    tags: ["weight", "gravity", "force", "mass"],
    description: "Gravitational force on an object near Earth's surface. Weight varies with g; mass does not.",
    siUnit: "N",
    dimensionalFormula: "M L T⁻²",
    graphType: "linear",
    xVar: "m",
    yVar: "W",
    graphLabel: { x: "Mass (kg)", y: "Weight (N)" },
    variables: [
      { symbol: "W", name: "Weight",                unit: "N",    min: 0, max: 5000, defaultValue: 980,  step: 10,  description: "Gravitational force on the object" },
      { symbol: "m", name: "Mass",                  unit: "kg",   min: 0, max: 500,  defaultValue: 100,  step: 1,   description: "Mass of the object" },
      { symbol: "g", name: "Gravitational Field",   unit: "m/s²", min: 0, max: 30,   defaultValue: 9.81, step: 0.1, description: "g = 9.81 m/s² on Earth, 1.62 on Moon" },
    ],
    derivationSteps: [
      { order: 1, latex: "F = \\frac{GMm}{r^2}", explanation: "Newton's law of gravitation between Earth (mass M) and object (mass m) at distance r." },
      { order: 2, latex: "g = \\frac{GM}{r^2}", explanation: "Define gravitational field strength g at Earth's surface." },
      { order: 3, latex: "W = mg", explanation: "Substitute — weight is the gravitational force on mass m in field g." },
    ],
    realWorldUses: [
      "Astronauts on the Moon weigh 1/6 of Earth weight — same mass, different g.",
      "Luggage scales measure weight but display mass (assuming g = 9.81 m/s²).",
    ],
    relatedFormulas: ["f-newtons-second", "f-gravitational-force"],
    chapterSlug: "newtons-laws",
  },
  {
    id:   "f-kinetic-energy",
    slug: "kinetic-energy",
    name: "Kinetic Energy",
    latex:         "KE = \\frac{1}{2}mv^2",
    latexExpanded: "E_k = \\frac{1}{2}mv^2",
    domain: "mechanics",
    tags: ["energy", "kinetic", "velocity", "mass"],
    description: "Energy possessed by an object due to its motion. Proportional to mass and to the square of speed.",
    siUnit: "J (Joule) = kg·m²/s²",
    dimensionalFormula: "M L² T⁻²",
    graphType: "quadratic",
    xVar: "v",
    yVar: "KE",
    graphLabel: { x: "Speed (m/s)", y: "Kinetic Energy (J)" },
    variables: [
      { symbol: "KE", name: "Kinetic Energy", unit: "J",   min: 0, max: 50000, defaultValue: 500,  step: 100, description: "Energy of motion" },
      { symbol: "m",  name: "Mass",           unit: "kg",  min: 1, max: 5000,  defaultValue: 1000, step: 10,  description: "Mass of the object" },
      { symbol: "v",  name: "Speed",          unit: "m/s", min: 0, max: 100,   defaultValue: 10,   step: 1,   description: "Speed of the object" },
    ],
    derivationSteps: [
      { order: 1, latex: "W = Fs = mas", explanation: "Work done by net force over displacement s." },
      { order: 2, latex: "v^2 = u^2 + 2as \\Rightarrow as = \\frac{v^2 - u^2}{2}", explanation: "From the third kinematic equation." },
      { order: 3, latex: "W = m \\cdot \\frac{v^2 - u^2}{2}", explanation: "Substitute — work equals change in kinetic energy." },
      { order: 4, latex: "KE = \\frac{1}{2}mv^2 \\quad (\\text{when } u = 0)", explanation: "Kinetic energy starting from rest." },
    ],
    realWorldUses: [
      "A car at 100 km/h has 4× the KE of one at 50 km/h — why high-speed crashes are so much more deadly.",
      "Roller coaster designers calculate KE at the bottom using PE at the top.",
      "Wind turbines extract kinetic energy from moving air.",
    ],
    relatedFormulas: ["f-potential-energy", "f-work", "f-newtons-second"],
    chapterSlug: "work-energy-power",
  },
  {
    id:   "f-potential-energy",
    slug: "gravitational-potential-energy",
    name: "Gravitational Potential Energy",
    latex:         "PE = mgh",
    latexExpanded: "E_p = mgh",
    domain: "mechanics",
    tags: ["energy", "potential", "gravity", "height"],
    description: "Energy stored in an object due to its height above a reference level. Converts to kinetic energy as the object falls.",
    siUnit: "J",
    dimensionalFormula: "M L² T⁻²",
    graphType: "linear",
    xVar: "h",
    yVar: "PE",
    graphLabel: { x: "Height (m)", y: "Potential Energy (J)" },
    variables: [
      { symbol: "PE", name: "Potential Energy", unit: "J",    min: 0, max: 100000, defaultValue: 1000, step: 100, description: "Gravitational PE above reference" },
      { symbol: "m",  name: "Mass",             unit: "kg",   min: 1, max: 1000,   defaultValue: 10,   step: 1,   description: "Mass of the object" },
      { symbol: "g",  name: "Gravity",          unit: "m/s²", min: 0, max: 30,     defaultValue: 9.81, step: 0.1, description: "Gravitational field strength" },
      { symbol: "h",  name: "Height",           unit: "m",    min: 0, max: 1000,   defaultValue: 10,   step: 1,   description: "Height above reference level" },
    ],
    derivationSteps: [
      { order: 1, latex: "W = F \\cdot d = mg \\cdot h", explanation: "Work done lifting mass m by height h against gravity mg." },
      { order: 2, latex: "PE = W_{stored} = mgh", explanation: "This work is stored as gravitational potential energy — released when the object falls." },
    ],
    realWorldUses: [
      "Hydroelectric dams store PE in elevated water reservoirs.",
      "A pendulum continuously converts PE ↔ KE — energy is conserved.",
      "Pumped-storage power plants pump water uphill at night (cheap electricity) and release it during peak demand.",
    ],
    relatedFormulas: ["f-kinetic-energy", "f-work", "f-weight"],
    chapterSlug: "work-energy-power",
  },
  {
    id:   "f-projectile-range",
    slug: "projectile-range",
    name: "Projectile Range",
    latex:         "R = \\frac{u^2 \\sin 2\\theta}{g}",
    latexExpanded: "R = \\frac{u^2 \\sin 2\\theta}{g}",
    domain: "mechanics",
    tags: ["projectile", "range", "angle", "trajectory"],
    description: "Horizontal range of a projectile launched at angle θ with initial speed u. Maximum at θ = 45°.",
    siUnit: "m",
    dimensionalFormula: "L",
    graphType: "sinusoidal",
    xVar: "θ",
    yVar: "R",
    graphLabel: { x: "Launch Angle (°)", y: "Range (m)" },
    variables: [
      { symbol: "R", name: "Range",          unit: "m",    min: 0, max: 2000, defaultValue: 500,  step: 10, description: "Horizontal distance to landing" },
      { symbol: "u", name: "Launch Speed",   unit: "m/s",  min: 1, max: 200,  defaultValue: 50,   step: 1,  description: "Initial speed of projectile" },
      { symbol: "θ", name: "Launch Angle",   unit: "°",    min: 0, max: 90,   defaultValue: 45,   step: 1,  description: "Angle above horizontal" },
      { symbol: "g", name: "Gravity",        unit: "m/s²", min: 1, max: 30,   defaultValue: 9.81, step: 0.1,description: "Gravitational acceleration" },
    ],
    derivationSteps: [
      { order: 1, latex: "T = \\frac{2u\\sin\\theta}{g}", explanation: "Time of flight — twice the time to reach maximum height." },
      { order: 2, latex: "R = u\\cos\\theta \\cdot T", explanation: "Horizontal range = horizontal speed × total time." },
      { order: 3, latex: "R = u\\cos\\theta \\cdot \\frac{2u\\sin\\theta}{g} = \\frac{u^2 \\cdot 2\\sin\\theta\\cos\\theta}{g}", explanation: "Substitute T." },
      { order: 4, latex: "R = \\frac{u^2\\sin 2\\theta}{g}", explanation: "Use identity 2sinθcosθ = sin2θ." },
    ],
    realWorldUses: [
      "Sports analytics — optimizing shot angle in basketball and soccer.",
      "Military ballistics — computing artillery shell landing points.",
      "Irrigation systems — designing sprinkler throw distances.",
    ],
    relatedFormulas: ["f-velocity", "f-displacement"],
    chapterSlug: "projectile-motion",
  },
  {
    id:   "f-gravitational-force",
    slug: "gravitational-force",
    name: "Newton's Law of Gravitation",
    latex:         "F = \\frac{Gm_1 m_2}{r^2}",
    latexExpanded: "F = \\frac{Gm_1 m_2}{r^2}",
    domain: "mechanics",
    tags: ["gravity", "force", "universal", "Newton", "inverse square"],
    description: "Universal gravitational attraction between two masses. Falls off as the square of distance — an inverse-square law.",
    siUnit: "N",
    dimensionalFormula: "M L T⁻²",
    graphType: "inverse",
    xVar: "r",
    yVar: "F",
    graphLabel: { x: "Distance r (m)", y: "Gravitational Force (N)" },
    variables: [
      { symbol: "F",  name: "Gravitational Force", unit: "N",   min: 0,    max: 1e12,  defaultValue: 3.53e22, step: 1e20,description: "Attractive force between masses" },
      { symbol: "m₁", name: "Mass 1",              unit: "kg",  min: 1,    max: 1e30,  defaultValue: 5.97e24, step: 1e23,description: "First mass (e.g., Earth: 5.97×10²⁴ kg)" },
      { symbol: "m₂", name: "Mass 2",              unit: "kg",  min: 1,    max: 1e10,  defaultValue: 70,      step: 1,   description: "Second mass (e.g., a person: 70 kg)" },
      { symbol: "r",  name: "Distance",            unit: "m",   min: 1e6,  max: 1e10,  defaultValue: 6.37e6,  step: 1e5, description: "Centre-to-centre distance" },
      { symbol: "G",  name: "Gravitational Constant",unit:"N·m²/kg²",min:6.674e-11,max:6.674e-11,defaultValue:6.674e-11,step:0,description:"G = 6.674×10⁻¹¹ N·m²/kg² (constant)" },
    ],
    derivationSteps: [
      { order: 1, latex: "F \\propto m_1 m_2", explanation: "Force is proportional to each mass — double either mass, double the force." },
      { order: 2, latex: "F \\propto \\frac{1}{r^2}", explanation: "Inverse-square law — verified by observing the Moon's orbital acceleration matches free-fall scaled by (R_E/r)²." },
      { order: 3, latex: "F = \\frac{Gm_1 m_2}{r^2}", explanation: "Combine with proportionality constant G measured by Cavendish (1798)." },
    ],
    realWorldUses: [
      "Calculating orbital speeds and periods of satellites.",
      "Planning gravitational slingshot manoeuvres for space probes.",
      "Predicting tidal forces caused by the Moon and Sun.",
    ],
    relatedFormulas: ["f-weight", "f-circular-motion"],
    chapterSlug: "circular-motion-gravitation",
  },
];

// ─── ELECTRICITY ──────────────────────────────────────────────────────────────
export const ELECTRICITY_FORMULAS: FormulaData[] = [
  {
    id:   "f-ohms-law",
    slug: "ohms-law",
    name: "Ohm's Law",
    latex:         "V = IR",
    latexExpanded: "V = IR",
    domain: "electricity",
    tags: ["Ohm", "voltage", "current", "resistance", "circuit"],
    description: "Voltage across an ohmic conductor equals current times resistance. The fundamental circuit relationship.",
    siUnit: "V (Volt)",
    dimensionalFormula: "M L² T⁻³ A⁻¹",
    graphType: "linear",
    xVar: "I",
    yVar: "V",
    graphLabel: { x: "Current (A)", y: "Voltage (V)" },
    variables: [
      { symbol: "V", name: "Voltage",    unit: "V", min: 0, max: 240, defaultValue: 12,  step: 1,   description: "Potential difference across the component" },
      { symbol: "I", name: "Current",    unit: "A", min: 0, max: 20,  defaultValue: 2,   step: 0.1, description: "Current flowing through" },
      { symbol: "R", name: "Resistance", unit: "Ω", min: 1, max: 1000,defaultValue: 6,   step: 1,   description: "Electrical resistance" },
    ],
    derivationSteps: [
      { order: 1, latex: "I = nqAv_d", explanation: "Current from drift velocity: n = carrier density, q = charge, A = cross-section, v_d = drift speed." },
      { order: 2, latex: "E = \\frac{V}{L}", explanation: "Electric field inside wire of length L under voltage V." },
      { order: 3, latex: "v_d = \\mu E", explanation: "Drift velocity proportional to electric field — μ is carrier mobility." },
      { order: 4, latex: "I = nqA\\mu\\frac{V}{L} \\Rightarrow V = \\frac{L}{nqA\\mu} \\cdot I = RI", explanation: "Collect constants into R — Ohm's Law emerges." },
    ],
    realWorldUses: [
      "Choosing the correct resistor to limit LED current and prevent burnout.",
      "Calculating home circuit loads to size fuses and circuit breakers.",
      "Designing voltage dividers in electronic circuits.",
    ],
    relatedFormulas: ["f-electrical-power", "f-series-resistance", "f-parallel-resistance"],
    chapterSlug: "current-resistance-ohms-law",
  },
  {
    id:   "f-electrical-power",
    slug: "electrical-power",
    name: "Electrical Power",
    latex:         "P = IV = I^2R = \\frac{V^2}{R}",
    latexExpanded: "P = IV",
    domain: "electricity",
    tags: ["power", "energy", "watt", "current", "voltage"],
    description: "Rate of electrical energy transfer. Three equivalent forms depending on which quantities are known.",
    siUnit: "W (Watt) = J/s",
    dimensionalFormula: "M L² T⁻³",
    graphType: "quadratic",
    xVar: "I",
    yVar: "P",
    graphLabel: { x: "Current (A)", y: "Power (W)" },
    variables: [
      { symbol: "P", name: "Power",     unit: "W", min: 0, max: 5000, defaultValue: 60,  step: 10,  description: "Rate of energy dissipation" },
      { symbol: "I", name: "Current",   unit: "A", min: 0, max: 20,   defaultValue: 5,   step: 0.1, description: "Current through component" },
      { symbol: "V", name: "Voltage",   unit: "V", min: 0, max: 240,  defaultValue: 12,  step: 1,   description: "Voltage across component" },
      { symbol: "R", name: "Resistance",unit: "Ω", min: 1, max: 1000, defaultValue: 2.4, step: 0.1, description: "Resistance of component" },
    ],
    derivationSteps: [
      { order: 1, latex: "P = \\frac{dW}{dt}", explanation: "Power is the rate of doing work (transferring energy)." },
      { order: 2, latex: "dW = V\\,dq", explanation: "Work done moving charge dq through potential difference V." },
      { order: 3, latex: "P = V\\frac{dq}{dt} = VI", explanation: "Since dq/dt = I (current), P = VI." },
      { order: 4, latex: "P = I^2R \\text{ and } P = \\frac{V^2}{R}", explanation: "Substitute V = IR to get the other two forms." },
    ],
    realWorldUses: [
      "A 60 W bulb on 240 V draws I = P/V = 0.25 A.",
      "Power lines transmit at high voltage to reduce I²R heating losses.",
      "Electric kettles are rated in watts — 3000 W boils water much faster than 1000 W.",
    ],
    relatedFormulas: ["f-ohms-law"],
    chapterSlug: "current-resistance-ohms-law",
  },
];

// ─── WAVES ────────────────────────────────────────────────────────────────────
export const WAVES_FORMULAS: FormulaData[] = [
  {
    id:   "f-wave-speed",
    slug: "wave-speed",
    name: "Wave Speed",
    latex:         "v = f\\lambda",
    latexExpanded: "v = f\\lambda",
    domain: "waves",
    tags: ["wave", "speed", "frequency", "wavelength"],
    description: "Wave speed equals frequency times wavelength. A universal relationship for all wave types.",
    siUnit: "m/s",
    dimensionalFormula: "L T⁻¹",
    graphType: "inverse",
    xVar: "λ",
    yVar: "f",
    graphLabel: { x: "Wavelength λ (m)", y: "Frequency f (Hz)" },
    variables: [
      { symbol: "v", name: "Wave Speed",   unit: "m/s", min: 1,    max: 3e8,  defaultValue: 343, step: 10, description: "Speed of wave propagation" },
      { symbol: "f", name: "Frequency",    unit: "Hz",  min: 1,    max: 1e12, defaultValue: 440, step: 10, description: "Number of cycles per second" },
      { symbol: "λ", name: "Wavelength",   unit: "m",   min: 1e-9, max: 1000, defaultValue: 0.78,step: 0.01,description: "Distance between successive crests" },
    ],
    derivationSteps: [
      { order: 1, latex: "v = \\frac{\\text{distance}}{\\text{time}} = \\frac{\\lambda}{T}", explanation: "In one period T, the wave advances exactly one wavelength λ." },
      { order: 2, latex: "T = \\frac{1}{f}", explanation: "Period is the reciprocal of frequency." },
      { order: 3, latex: "v = \\frac{\\lambda}{1/f} = f\\lambda", explanation: "Substitute — wave speed equation." },
    ],
    realWorldUses: [
      "Middle A note (440 Hz) in air has wavelength λ = 343/440 ≈ 0.78 m.",
      "Visible light (v = 3×10⁸ m/s, λ ≈ 400–700 nm) gives f ≈ 4–7 × 10¹⁴ Hz.",
      "Sonar systems use v = fλ to calculate distance from echo timing.",
    ],
    relatedFormulas: ["f-doppler"],
    chapterSlug: "wave-properties",
  },
];

// ─── OPTICS ───────────────────────────────────────────────────────────────────
export const OPTICS_FORMULAS: FormulaData[] = [
  {
    id:   "f-snells-law",
    slug: "snells-law",
    name: "Snell's Law",
    latex:         "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2",
    latexExpanded: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2",
    domain: "optics",
    tags: ["refraction", "Snell", "refractive index", "optics"],
    description: "Relates the angles of incidence and refraction at a boundary between two optical media.",
    siUnit: "dimensionless",
    dimensionalFormula: "dimensionless",
    graphType: "linear",
    xVar: "θ₁",
    yVar: "θ₂",
    graphLabel: { x: "Angle of Incidence (°)", y: "Angle of Refraction (°)" },
    variables: [
      { symbol: "n₁", name: "Index (medium 1)", unit: "",  min: 1,   max: 3,  defaultValue: 1,    step: 0.01, description: "Refractive index of first medium (air ≈ 1)" },
      { symbol: "θ₁", name: "Angle of Incidence", unit:"°",min:0, max:89,  defaultValue: 45,   step: 1,    description: "Angle from normal in medium 1" },
      { symbol: "n₂", name: "Index (medium 2)", unit: "",  min: 1,   max: 3,  defaultValue: 1.5,  step: 0.01, description: "Refractive index of second medium (glass ≈ 1.5)" },
      { symbol: "θ₂", name: "Angle of Refraction","unit":"°",min:0,max:89, defaultValue: 28.1, step: 1,    description: "Angle from normal in medium 2" },
    ],
    derivationSteps: [
      { order: 1, latex: "v = \\frac{c}{n}", explanation: "Speed of light in medium with refractive index n." },
      { order: 2, latex: "\\frac{\\sin\\theta_1}{v_1} = \\frac{\\sin\\theta_2}{v_2}", explanation: "Wavefront geometry at the boundary (Huygens' principle)." },
      { order: 3, latex: "\\frac{\\sin\\theta_1}{c/n_1} = \\frac{\\sin\\theta_2}{c/n_2}", explanation: "Substitute v = c/n." },
      { order: 4, latex: "n_1\\sin\\theta_1 = n_2\\sin\\theta_2", explanation: "Snell's Law." },
    ],
    realWorldUses: [
      "Designing optical fiber — total internal reflection when θ exceeds critical angle.",
      "Corrective lenses — refraction at curved surfaces focuses light onto the retina.",
      "Mirages — hot air near the ground has lower n, bending light upward.",
    ],
    relatedFormulas: ["f-wave-speed"],
    chapterSlug: "reflection-refraction",
  },
];

// ─── MODERN PHYSICS ───────────────────────────────────────────────────────────
export const MODERN_FORMULAS: FormulaData[] = [
  {
    id:   "f-photon-energy",
    slug: "photon-energy",
    name: "Photon Energy",
    latex:         "E = hf",
    latexExpanded: "E = hf = \\frac{hc}{\\lambda}",
    domain: "modern",
    tags: ["photon", "quantum", "Planck", "frequency", "energy"],
    description: "Energy of a single photon. Planck's discovery that light energy is quantized, launching quantum mechanics.",
    siUnit: "J (or eV: 1 eV = 1.6×10⁻¹⁹ J)",
    dimensionalFormula: "M L² T⁻²",
    graphType: "linear",
    xVar: "f",
    yVar: "E",
    graphLabel: { x: "Frequency (Hz)", y: "Photon Energy (J)" },
    variables: [
      { symbol: "E", name: "Photon Energy",      unit: "J",   min: 0,      max: 1e-18, defaultValue: 3.97e-19, step: 1e-20, description: "Energy of one photon" },
      { symbol: "h", name: "Planck's Constant",  unit: "J·s", min: 6.626e-34,max:6.626e-34,defaultValue:6.626e-34,step:0,    description: "h = 6.626×10⁻³⁴ J·s (constant)" },
      { symbol: "f", name: "Frequency",          unit: "Hz",  min: 1e14,   max: 1e18,  defaultValue: 6e14,    step: 1e13,  description: "Frequency of light (visible: 4–7×10¹⁴ Hz)" },
    ],
    derivationSteps: [
      { order: 1, latex: "E_{oscillator} = nhf \\quad n = 0, 1, 2, \\ldots", explanation: "Planck's 1900 hypothesis: oscillator energies are integer multiples of hf." },
      { order: 2, latex: "E_{photon} = hf", explanation: "Einstein (1905) extended this — light itself comes in quanta of energy hf." },
      { order: 3, latex: "E = \\frac{hc}{\\lambda}", explanation: "Since v = fλ and v = c for light, substitute f = c/λ." },
    ],
    realWorldUses: [
      "Solar cells — photons with E > semiconductor bandgap eject electrons.",
      "X-ray machines use very high-f photons (high E) to penetrate tissue.",
      "LED colour depends on photon energy — higher gap → higher f → bluer light.",
    ],
    relatedFormulas: ["f-wave-speed", "f-snells-law"],
    chapterSlug: "photoelectric-effect",
  },
  {
    id:   "f-de-broglie",
    slug: "de-broglie-wavelength",
    name: "De Broglie Wavelength",
    latex:         "\\lambda = \\frac{h}{mv}",
    latexExpanded: "\\lambda = \\frac{h}{p} = \\frac{h}{mv}",
    domain: "modern",
    tags: ["de Broglie", "matter wave", "momentum", "quantum", "wavelength"],
    description: "Every particle with momentum p has an associated wavelength. The foundation of wave-particle duality.",
    siUnit: "m",
    dimensionalFormula: "L",
    graphType: "inverse",
    xVar: "v",
    yVar: "λ",
    graphLabel: { x: "Speed (m/s)", y: "Wavelength (m)" },
    variables: [
      { symbol: "λ", name: "de Broglie Wavelength",unit:"m",  min:1e-15,max:1e-8, defaultValue:7.27e-11,step:1e-12,description: "Matter wave wavelength" },
      { symbol: "h", name: "Planck's Constant",    unit:"J·s",min:6.626e-34,max:6.626e-34,defaultValue:6.626e-34,step:0,description:"h = 6.626×10⁻³⁴ J·s" },
      { symbol: "m", name: "Particle Mass",        unit:"kg", min:9.11e-31,max:1,  defaultValue:9.11e-31,step:1e-32,description:"Mass (electron: 9.11×10⁻³¹ kg)" },
      { symbol: "v", name: "Speed",                unit:"m/s",min:1e4,    max:3e8, defaultValue:1e7,     step:1e6, description:"Speed of particle" },
    ],
    derivationSteps: [
      { order: 1, latex: "E = hf \\text{ (photon)}", explanation: "Photon energy from Planck/Einstein." },
      { order: 2, latex: "p = \\frac{E}{c} = \\frac{hf}{c} = \\frac{h}{\\lambda}", explanation: "Photon momentum from special relativity." },
      { order: 3, latex: "\\lambda = \\frac{h}{p}", explanation: "De Broglie (1924): extend this to all particles — p = mv for non-relativistic case." },
    ],
    realWorldUses: [
      "Electron microscopes — electrons at 100 keV have λ ≈ 0.004 nm, far smaller than visible light.",
      "Neutron diffraction — thermal neutrons have λ ≈ 0.1 nm, ideal for probing crystal structures.",
    ],
    relatedFormulas: ["f-photon-energy"],
    chapterSlug: "wave-particle-duality",
  },
];

// ─── All formulas combined ─────────────────────────────────────────────────────
export const ALL_FORMULAS: FormulaData[] = [
  ...MECHANICS_FORMULAS,
  ...ELECTRICITY_FORMULAS,
  ...WAVES_FORMULAS,
  ...OPTICS_FORMULAS,
  ...MODERN_FORMULAS,
];

export function getFormulaById(id: string):   FormulaData | undefined { return ALL_FORMULAS.find((f) => f.id   === id);   }
export function getFormulaBySlug(slug: string):FormulaData | undefined { return ALL_FORMULAS.find((f) => f.slug === slug); }
export function getFormulasByDomain(domain: PhysicsDomain): FormulaData[] { return ALL_FORMULAS.filter((f) => f.domain === domain); }
export function getRelatedFormulas(formula: FormulaData): FormulaData[] {
  return formula.relatedFormulas.map(getFormulaById).filter(Boolean) as FormulaData[];
}
