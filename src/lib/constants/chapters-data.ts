// src/lib/constants/chapters-data.ts
// Full chapter catalog for PhysicsVerse Learn Module
// Each chapter has real content, formulas, misconceptions, key points

import type { PhysicsDomain, DifficultyLevel } from "@/types";

export interface ChapterMeta {
  id: string;
  slug: string;
  domain: PhysicsDomain;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  prerequisites: string[];   // chapter IDs
  estimatedMinutes: number;
  order: number;             // within domain
  tags: string[];
  keyPoints: string[];
  misconceptions: { wrong: string; correct: string }[];
  formulas: { name: string; latex: string; description: string }[];
  realWorldExamples: string[];
  relatedLabIds: string[];
}

// ─── MECHANICS ────────────────────────────────────────────────────────────────
export const MECHANICS_CHAPTERS: ChapterMeta[] = [
  {
    id: "mec-001",
    slug: "physical-quantities-measurement",
    domain: "mechanics",
    title: "Physical Quantities & Measurement",
    description: "Learn the language of physics — SI units, dimensions, significant figures, and measurement errors.",
    difficulty: "beginner",
    prerequisites: [],
    estimatedMinutes: 35,
    order: 1,
    tags: ["units", "SI", "measurement", "dimensions"],
    keyPoints: [
      "All physical quantities have a magnitude and a unit.",
      "The SI system has 7 base units: meter, kilogram, second, ampere, kelvin, mole, candela.",
      "Dimensional analysis can verify equations and derive unknown relationships.",
      "Significant figures communicate the precision of a measurement.",
      "Systematic errors shift all readings in one direction; random errors scatter around the true value.",
    ],
    misconceptions: [
      { wrong: "Weight and mass are the same thing.", correct: "Mass is the amount of matter (kg); weight is the gravitational force on that mass (N). They differ on other planets." },
      { wrong: "More decimal places always means more precision.", correct: "Precision depends on the instrument's smallest division, not on how many digits you write." },
    ],
    formulas: [
      { name: "Percentage Error", latex: "\\% \\text{ error} = \\frac{|x_{measured} - x_{true}|}{x_{true}} \\times 100", description: "How far a measurement is from the true value, expressed as a percentage." },
      { name: "Dimensional Formula", latex: "[F] = M L T^{-2}", description: "Force expressed in terms of mass (M), length (L), and time (T) dimensions." },
    ],
    realWorldExamples: [
      "The Mars Climate Orbiter crashed in 1999 because one team used SI units and another used imperial — a $327M lesson in unit consistency.",
      "GPS satellites must account for relativistic time dilation to maintain meter-level accuracy.",
    ],
    relatedLabIds: [],
  },
  {
    id: "mec-002",
    slug: "vectors-scalars",
    domain: "mechanics",
    title: "Vectors & Scalars",
    description: "Master vector algebra — addition, subtraction, dot and cross products, and resolving components.",
    difficulty: "beginner",
    prerequisites: ["mec-001"],
    estimatedMinutes: 40,
    order: 2,
    tags: ["vectors", "scalars", "components", "dot product"],
    keyPoints: [
      "Scalars have magnitude only (speed, temperature, mass).",
      "Vectors have magnitude and direction (velocity, force, displacement).",
      "Vectors add by the parallelogram law or by resolving into components.",
      "The dot product gives a scalar; the cross product gives a vector perpendicular to both.",
      "Unit vectors î, ĵ, k̂ have magnitude 1 and point along x, y, z axes.",
    ],
    misconceptions: [
      { wrong: "Speed and velocity mean the same thing.", correct: "Speed is the magnitude of velocity. A car driving in a circle at constant speed has changing velocity because direction changes." },
      { wrong: "Adding two vectors always gives a larger vector.", correct: "Two equal vectors pointing in opposite directions add to zero." },
    ],
    formulas: [
      { name: "Vector Magnitude", latex: "|\\vec{A}| = \\sqrt{A_x^2 + A_y^2 + A_z^2}", description: "The length of a vector from its components." },
      { name: "Dot Product", latex: "\\vec{A} \\cdot \\vec{B} = AB\\cos\\theta", description: "Scalar product; gives the projection of one vector onto another." },
      { name: "Cross Product Magnitude", latex: "|\\vec{A} \\times \\vec{B}| = AB\\sin\\theta", description: "Magnitude of the vector perpendicular to both A and B." },
    ],
    realWorldExamples: [
      "Pilots resolve wind velocity into headwind and crosswind components to calculate ground speed.",
      "Architects use vector addition of forces to ensure bridges are in static equilibrium.",
    ],
    relatedLabIds: [],
  },
  {
    id: "mec-003",
    slug: "kinematics-1d",
    domain: "mechanics",
    title: "Kinematics — 1D Motion",
    description: "Describe motion without asking why — displacement, velocity, acceleration, and the equations of uniform motion.",
    difficulty: "beginner",
    prerequisites: ["mec-001", "mec-002"],
    estimatedMinutes: 50,
    order: 3,
    tags: ["kinematics", "velocity", "acceleration", "free fall", "equations of motion"],
    keyPoints: [
      "Displacement is the change in position (vector); distance is total path length (scalar).",
      "Average velocity = displacement / time; instantaneous velocity is the derivative dx/dt.",
      "Uniform acceleration: a = constant → the three kinematic equations apply.",
      "Free fall is uniform acceleration with a = g ≈ 9.8 m/s² downward (ignoring air resistance).",
      "On a v-t graph, slope = acceleration and area under curve = displacement.",
    ],
    misconceptions: [
      { wrong: "A body with zero velocity must have zero acceleration.", correct: "A ball thrown upward has zero velocity at its peak but still has downward acceleration g." },
      { wrong: "Heavier objects fall faster.", correct: "In vacuum, all objects fall with the same acceleration regardless of mass (Galileo's experiment)." },
    ],
    formulas: [
      { name: "First Equation of Motion", latex: "v = u + at", description: "Final velocity after time t under constant acceleration." },
      { name: "Second Equation of Motion", latex: "s = ut + \\frac{1}{2}at^2", description: "Displacement covered in time t starting with velocity u." },
      { name: "Third Equation of Motion", latex: "v^2 = u^2 + 2as", description: "Relates velocity and displacement without using time." },
    ],
    realWorldExamples: [
      "Traffic police use v² = u² + 2as to reconstruct accident speeds from skid marks.",
      "Elevator designers use kinematics to ensure comfortable acceleration profiles.",
    ],
    relatedLabIds: ["lab-velocity-explorer", "lab-free-fall"],
  },
  {
    id: "mec-004",
    slug: "projectile-motion",
    domain: "mechanics",
    title: "Projectile Motion",
    description: "Analyze the parabolic path of objects launched at an angle — range, maximum height, and time of flight.",
    difficulty: "intermediate",
    prerequisites: ["mec-003"],
    estimatedMinutes: 45,
    order: 4,
    tags: ["projectile", "parabola", "range", "trajectory"],
    keyPoints: [
      "Projectile motion is 2D: horizontal (constant velocity) and vertical (uniform acceleration g) are independent.",
      "Maximum range occurs at 45° launch angle (ignoring air resistance).",
      "Complementary angles (e.g. 30° and 60°) give the same range.",
      "The time of flight depends only on the vertical component of initial velocity.",
      "Horizontal velocity is constant throughout — only vertical velocity changes.",
    ],
    misconceptions: [
      { wrong: "A bullet fired horizontally hits the ground later than one dropped from the same height.", correct: "Both hit the ground at the same time. Horizontal motion does not affect vertical free fall." },
      { wrong: "45° always gives maximum range.", correct: "45° gives maximum range on flat ground. On a slope or with air resistance the optimal angle changes." },
    ],
    formulas: [
      { name: "Horizontal Range", latex: "R = \\frac{u^2 \\sin 2\\theta}{g}", description: "Horizontal distance travelled before landing on flat ground." },
      { name: "Maximum Height", latex: "H = \\frac{u^2 \\sin^2\\theta}{2g}", description: "Peak height reached above launch point." },
      { name: "Time of Flight", latex: "T = \\frac{2u \\sin\\theta}{g}", description: "Total time in the air." },
    ],
    realWorldExamples: [
      "Basketball players intuitively adjust launch angle for different shot distances.",
      "Artillery engineers calculate projectile trajectories for accurate targeting.",
    ],
    relatedLabIds: ["lab-projectile"],
  },
  {
    id: "mec-005",
    slug: "newtons-laws",
    domain: "mechanics",
    title: "Newton's Laws of Motion",
    description: "The three laws that govern how forces change (or don't change) the state of motion of objects.",
    difficulty: "beginner",
    prerequisites: ["mec-003"],
    estimatedMinutes: 55,
    order: 5,
    tags: ["Newton", "force", "inertia", "action-reaction", "F=ma"],
    keyPoints: [
      "First Law (Inertia): An object remains at rest or in uniform motion unless acted upon by a net external force.",
      "Second Law: The net force equals mass times acceleration: F = ma.",
      "Third Law: Every action has an equal and opposite reaction — forces always occur in pairs.",
      "Normal force, tension, friction, and weight are common forces in problems.",
      "Free body diagrams isolate a single object and show all forces acting on it.",
    ],
    misconceptions: [
      { wrong: "A moving object needs a continuous force to keep moving.", correct: "This is Aristotelian thinking. Newton's First Law says no force is needed to maintain constant velocity." },
      { wrong: "Action and reaction forces cancel each other out.", correct: "They act on different objects, so they cannot cancel. Forces cancel only when they act on the same object." },
    ],
    formulas: [
      { name: "Newton's Second Law", latex: "\\vec{F}_{net} = m\\vec{a}", description: "Net force equals mass times acceleration. Direction of acceleration matches net force." },
      { name: "Weight", latex: "W = mg", description: "Gravitational force on a mass m near Earth's surface where g ≈ 9.8 m/s²." },
    ],
    realWorldExamples: [
      "Seatbelts apply Newton's First Law — they stop you continuing forward when the car decelerates suddenly.",
      "Rocket propulsion is Newton's Third Law — exhaust gases pushed backward propel the rocket forward.",
    ],
    relatedLabIds: ["lab-force-playground"],
  },
  {
    id: "mec-006",
    slug: "work-energy-power",
    domain: "mechanics",
    title: "Work, Energy & Power",
    description: "Understand the work-energy theorem, kinetic and potential energy, and the conservation of mechanical energy.",
    difficulty: "intermediate",
    prerequisites: ["mec-005"],
    estimatedMinutes: 50,
    order: 6,
    tags: ["work", "energy", "power", "conservation", "kinetic", "potential"],
    keyPoints: [
      "Work = Force × displacement × cos θ. Work is zero if force is perpendicular to displacement.",
      "The work-energy theorem: net work done on an object equals its change in kinetic energy.",
      "Gravitational PE = mgh; Elastic PE = ½kx².",
      "Conservation of mechanical energy: KE + PE = constant (no friction).",
      "Power is the rate of doing work: P = W/t = Fv.",
    ],
    misconceptions: [
      { wrong: "Carrying a heavy load across a flat floor requires work.", correct: "If displacement is horizontal and force is vertical (holding the load), W = Fd cos 90° = 0. No work done by the carrying force." },
      { wrong: "Energy is destroyed by friction.", correct: "Friction converts mechanical energy into heat. Total energy is conserved." },
    ],
    formulas: [
      { name: "Work Done", latex: "W = Fd\\cos\\theta", description: "Work done by a force F over displacement d at angle θ." },
      { name: "Kinetic Energy", latex: "KE = \\frac{1}{2}mv^2", description: "Energy of motion — depends on mass and speed squared." },
      { name: "Gravitational PE", latex: "PE = mgh", description: "Energy stored due to height h above reference level." },
      { name: "Power", latex: "P = \\frac{W}{t} = Fv", description: "Rate of energy transfer. 1 Watt = 1 J/s." },
    ],
    realWorldExamples: [
      "Roller coasters convert PE at the top to KE at the bottom — the first drop determines maximum speed.",
      "Hybrid cars recapture kinetic energy during braking (regenerative braking).",
    ],
    relatedLabIds: ["lab-energy-conversion"],
  },
  {
    id: "mec-007",
    slug: "circular-motion-gravitation",
    domain: "mechanics",
    title: "Circular Motion & Gravitation",
    description: "Centripetal force, orbital motion, Kepler's laws, and Newton's law of universal gravitation.",
    difficulty: "intermediate",
    prerequisites: ["mec-005", "mec-006"],
    estimatedMinutes: 55,
    order: 7,
    tags: ["circular motion", "centripetal", "gravitation", "orbit", "Kepler"],
    keyPoints: [
      "Objects in circular motion accelerate toward the center — centripetal acceleration a = v²/r.",
      "Centripetal force is not a new force; it is the net inward force (gravity, tension, normal force, etc.).",
      "Newton's Law of Gravitation: F = Gm₁m₂/r².",
      "Kepler's Third Law: T² ∝ r³ — planets farther from the Sun have longer periods.",
      "Orbital speed: v = √(GM/r) — faster for closer orbits.",
    ],
    misconceptions: [
      { wrong: "Centrifugal force is a real force pushing you outward in a curve.", correct: "Centrifugal force is a fictitious force in a rotating reference frame. In an inertial frame, only centripetal (inward) force exists." },
      { wrong: "Astronauts in the ISS are weightless because there is no gravity in space.", correct: "Gravity is ~90% as strong at ISS altitude. They are in continuous free fall — that's weightlessness." },
    ],
    formulas: [
      { name: "Centripetal Acceleration", latex: "a_c = \\frac{v^2}{r} = \\omega^2 r", description: "Acceleration directed toward the center of circular path." },
      { name: "Newton's Gravitation", latex: "F = \\frac{Gm_1 m_2}{r^2}", description: "Attractive force between two masses separated by distance r." },
      { name: "Orbital Period (Kepler III)", latex: "T^2 = \\frac{4\\pi^2}{GM} r^3", description: "Orbital period T for a circular orbit of radius r around mass M." },
    ],
    realWorldExamples: [
      "Satellites are launched to exact speeds so gravity provides exactly the centripetal force needed for orbit.",
      "The Moon's distance was first calculated using Newton's gravitation and orbital period.",
    ],
    relatedLabIds: ["lab-orbital-simulator", "lab-gravity-sandbox"],
  },
];

// ─── WAVES ────────────────────────────────────────────────────────────────────
export const WAVES_CHAPTERS: ChapterMeta[] = [
  {
    id: "wav-001",
    slug: "wave-properties",
    domain: "waves",
    title: "Wave Properties & Types",
    description: "Amplitude, wavelength, frequency, period, wave speed — and the difference between transverse and longitudinal waves.",
    difficulty: "beginner",
    prerequisites: ["mec-001"],
    estimatedMinutes: 40,
    order: 1,
    tags: ["waves", "amplitude", "frequency", "wavelength", "transverse", "longitudinal"],
    keyPoints: [
      "Waves transfer energy without transferring matter.",
      "Transverse waves: particles oscillate perpendicular to wave direction (light, water surface).",
      "Longitudinal waves: particles oscillate parallel to wave direction (sound).",
      "Wave speed v = fλ — a fundamental relationship.",
      "Period T = 1/f. Amplitude determines energy, not speed.",
    ],
    misconceptions: [
      { wrong: "Water waves move water forward.", correct: "Water molecules move in circles. The wave pattern moves forward; the water stays in roughly the same place." },
      { wrong: "Sound travels faster in air than in solids.", correct: "Sound travels much faster in solids (steel: ~5960 m/s) than air (~343 m/s) because molecules are closer together." },
    ],
    formulas: [
      { name: "Wave Speed", latex: "v = f\\lambda", description: "Speed equals frequency times wavelength." },
      { name: "Period-Frequency", latex: "T = \\frac{1}{f}", description: "Period is the reciprocal of frequency." },
    ],
    realWorldExamples: [
      "Tuning a guitar changes the wave frequency of vibrating strings.",
      "Doctors use ultrasound (high-frequency longitudinal waves) to image internal organs.",
    ],
    relatedLabIds: ["lab-wave-generator"],
  },
  {
    id: "wav-002",
    slug: "sound-waves",
    domain: "waves",
    title: "Sound Waves & Acoustics",
    description: "How sound is produced, transmitted, and perceived — including intensity, decibels, and the Doppler effect.",
    difficulty: "intermediate",
    prerequisites: ["wav-001"],
    estimatedMinutes: 45,
    order: 2,
    tags: ["sound", "intensity", "decibels", "doppler", "resonance"],
    keyPoints: [
      "Sound is a mechanical longitudinal wave — it needs a medium (cannot travel in vacuum).",
      "Speed of sound in air ≈ 343 m/s at 20°C; increases with temperature.",
      "Intensity I = P/A (W/m²). Loudness (dB) = 10 log₁₀(I/I₀).",
      "Resonance occurs when driving frequency matches natural frequency — amplitude becomes maximum.",
      "Doppler effect: moving source compresses/stretches wavefronts → pitch change.",
    ],
    misconceptions: [
      { wrong: "In space, explosions make huge sounds like in movies.", correct: "Sound cannot travel in a vacuum. Space explosions are completely silent." },
    ],
    formulas: [
      { name: "Sound Intensity Level", latex: "L = 10 \\log_{10}\\left(\\frac{I}{I_0}\\right) \\text{ dB}", description: "Loudness in decibels relative to threshold of hearing I₀ = 10⁻¹² W/m²." },
      { name: "Doppler Effect (source moving)", latex: "f' = f\\left(\\frac{v}{v \\pm v_s}\\right)", description: "+ when source moves away, − when approaching." },
    ],
    realWorldExamples: [
      "Bats navigate using echolocation — they emit ultrasonic pulses and detect the Doppler-shifted echo.",
      "Police radar guns use the Doppler effect to measure vehicle speeds.",
    ],
    relatedLabIds: ["lab-doppler", "lab-sound-visualizer"],
  },
];

// ─── ELECTRICITY & MAGNETISM ──────────────────────────────────────────────────
export const ELECTRICITY_CHAPTERS: ChapterMeta[] = [
  {
    id: "elec-001",
    slug: "electric-charge-field",
    domain: "electricity",
    title: "Electric Charge & Field",
    description: "Coulomb's Law, electric field lines, electric flux, and Gauss's Law.",
    difficulty: "intermediate",
    prerequisites: ["mec-007"],
    estimatedMinutes: 50,
    order: 1,
    tags: ["charge", "coulomb", "electric field", "Gauss"],
    keyPoints: [
      "Electric charge is quantized: q = ne, where e = 1.6 × 10⁻¹⁹ C.",
      "Like charges repel; unlike charges attract (Coulomb's Law).",
      "Electric field E = F/q — force per unit positive charge.",
      "Field lines point from + to −; closer lines mean stronger field.",
      "Gauss's Law: total electric flux through a closed surface = Q_enc/ε₀.",
    ],
    misconceptions: [
      { wrong: "Electrons are negative because they have less charge.", correct: "Negative and positive are labels for two types of charge. Electrons simply carry the type we call negative." },
    ],
    formulas: [
      { name: "Coulomb's Law", latex: "F = k\\frac{q_1 q_2}{r^2}", description: "Force between two point charges. k = 9×10⁹ N·m²/C²." },
      { name: "Electric Field", latex: "E = \\frac{F}{q} = k\\frac{Q}{r^2}", description: "Field strength due to point charge Q at distance r." },
    ],
    realWorldExamples: [
      "Lightning rods work by creating a strong electric field at the tip, ionizing air to provide a safe discharge path.",
      "Photocopiers use electrostatic attraction to move toner powder onto paper.",
    ],
    relatedLabIds: ["lab-electric-field"],
  },
  {
    id: "elec-002",
    slug: "current-resistance-ohms-law",
    domain: "electricity",
    title: "Current, Resistance & Ohm's Law",
    description: "Electric current, resistance, Ohm's Law, resistivity, and power dissipation in resistors.",
    difficulty: "beginner",
    prerequisites: ["elec-001"],
    estimatedMinutes: 45,
    order: 2,
    tags: ["current", "resistance", "Ohm", "resistivity", "power"],
    keyPoints: [
      "Current I = Q/t — rate of charge flow, measured in amperes (A).",
      "Resistance R = V/I. Ohm's Law applies to ohmic conductors at constant temperature.",
      "Resistivity ρ: R = ρL/A — longer and thinner wire → higher resistance.",
      "Power dissipated: P = IV = I²R = V²/R.",
      "Series: R_total = R₁ + R₂. Parallel: 1/R_total = 1/R₁ + 1/R₂.",
    ],
    misconceptions: [
      { wrong: "Voltage is used up as current flows through a circuit.", correct: "Voltage (potential difference) drives the current. Energy is dissipated, not voltage." },
      { wrong: "Thick wires have more resistance than thin wires.", correct: "Thick wires have lower resistance because more cross-sectional area allows more current to flow." },
    ],
    formulas: [
      { name: "Ohm's Law", latex: "V = IR", description: "Voltage equals current times resistance for an ohmic conductor." },
      { name: "Electrical Power", latex: "P = IV = I^2R = \\frac{V^2}{R}", description: "Power dissipated as heat in a resistor." },
      { name: "Resistance Formula", latex: "R = \\frac{\\rho L}{A}", description: "Resistance from material resistivity ρ, length L, cross-section A." },
    ],
    realWorldExamples: [
      "Fuses protect circuits by melting when current (and thus heat: P=I²R) exceeds a safe limit.",
      "Electric heaters intentionally use high-resistance wire to convert electrical energy to heat.",
    ],
    relatedLabIds: ["lab-circuit-builder", "lab-ohms-law"],
  },
];

// ─── OPTICS ───────────────────────────────────────────────────────────────────
export const OPTICS_CHAPTERS: ChapterMeta[] = [
  {
    id: "opt-001",
    slug: "reflection-refraction",
    domain: "optics",
    title: "Reflection & Refraction",
    description: "Laws of reflection, Snell's Law of refraction, total internal reflection, and real-world optical phenomena.",
    difficulty: "beginner",
    prerequisites: ["wav-001"],
    estimatedMinutes: 45,
    order: 1,
    tags: ["reflection", "refraction", "Snell", "TIR", "refractive index"],
    keyPoints: [
      "Law of reflection: angle of incidence = angle of reflection (both measured from normal).",
      "Refraction: light bends when it changes speed between media. n = c/v.",
      "Snell's Law: n₁ sin θ₁ = n₂ sin θ₂.",
      "Total Internal Reflection (TIR) occurs when angle exceeds critical angle θ_c = sin⁻¹(n₂/n₁).",
      "Optical fibers use TIR to transmit light (and data) with minimal loss.",
    ],
    misconceptions: [
      { wrong: "Light slows down because it bounces between atoms like a pinball.", correct: "Light slows because it is absorbed and re-emitted by atoms in the medium, but always travels at c between atoms." },
    ],
    formulas: [
      { name: "Snell's Law", latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2", description: "Relates angles and refractive indices at a boundary between two media." },
      { name: "Critical Angle", latex: "\\sin\\theta_c = \\frac{n_2}{n_1}", description: "Minimum angle for total internal reflection (n₁ > n₂)." },
      { name: "Refractive Index", latex: "n = \\frac{c}{v}", description: "Ratio of speed of light in vacuum to speed in the medium." },
    ],
    realWorldExamples: [
      "Rainbows form because water droplets refract and internally reflect sunlight, dispersing colors by wavelength.",
      "Diamond's high refractive index (2.42) and small critical angle cause total internal reflection — creating sparkle.",
    ],
    relatedLabIds: ["lab-refraction", "lab-mirror-lens"],
  },
];

// ─── MODERN PHYSICS ───────────────────────────────────────────────────────────
export const MODERN_CHAPTERS: ChapterMeta[] = [
  {
    id: "mod-001",
    slug: "photoelectric-effect",
    domain: "modern",
    title: "Photoelectric Effect",
    description: "Einstein's Nobel Prize-winning explanation of how light ejects electrons from metals — proving light is quantized.",
    difficulty: "intermediate",
    prerequisites: ["wav-001", "elec-001"],
    estimatedMinutes: 45,
    order: 1,
    tags: ["photoelectric", "photon", "quantum", "Einstein", "work function"],
    keyPoints: [
      "Light ejects electrons from metal surfaces only if frequency exceeds a threshold — regardless of intensity.",
      "Einstein explained this by proposing light travels in packets called photons: E = hf.",
      "Work function φ: minimum energy needed to remove an electron from the surface.",
      "Maximum KE of ejected electron: KE_max = hf − φ.",
      "This experiment proved light has particle-like properties, starting quantum mechanics.",
    ],
    misconceptions: [
      { wrong: "Brighter light always ejects more electrons faster.", correct: "Brighter light (more photons) ejects more electrons, but speed depends on frequency, not intensity." },
    ],
    formulas: [
      { name: "Photon Energy", latex: "E = hf = \\frac{hc}{\\lambda}", description: "Energy of a single photon. h = 6.626×10⁻³⁴ J·s (Planck's constant)." },
      { name: "Photoelectric Equation", latex: "KE_{max} = hf - \\phi", description: "Maximum kinetic energy of ejected electron equals photon energy minus work function." },
    ],
    realWorldExamples: [
      "Solar panels use the photoelectric effect — photons eject electrons in silicon, generating current.",
      "Automatic door sensors use photoelectric cells to detect when a beam is broken.",
    ],
    relatedLabIds: ["lab-photoelectric"],
  },
];

// ─── THERMODYNAMICS ───────────────────────────────────────────────────────────
export const THERMO_CHAPTERS: ChapterMeta[] = [
  {
    id: "thm-001",
    slug: "temperature-heat",
    domain: "thermodynamics",
    title: "Temperature, Heat & Thermal Expansion",
    description: "Temperature scales, heat transfer, specific heat capacity, latent heat, and thermal expansion.",
    difficulty: "beginner",
    prerequisites: ["mec-001"],
    estimatedMinutes: 40,
    order: 1,
    tags: ["temperature", "heat", "specific heat", "latent heat", "expansion"],
    keyPoints: [
      "Temperature measures average kinetic energy of particles; heat is energy transferred due to temperature difference.",
      "Q = mcΔT — heat absorbed depends on mass, specific heat, and temperature change.",
      "Latent heat: energy absorbed/released during phase change at constant temperature.",
      "Metals expand when heated: ΔL = αLΔT.",
      "Three mechanisms of heat transfer: conduction, convection, radiation.",
    ],
    misconceptions: [
      { wrong: "Cold is a type of energy that flows from cold to hot objects.", correct: "Cold is the absence of heat energy. Heat always flows from hot to cold, never the other way." },
    ],
    formulas: [
      { name: "Specific Heat Capacity", latex: "Q = mc\\Delta T", description: "Heat energy Q absorbed by mass m with specific heat c over temperature change ΔT." },
      { name: "Linear Expansion", latex: "\\Delta L = \\alpha L_0 \\Delta T", description: "Change in length due to temperature change. α is the coefficient of linear expansion." },
    ],
    realWorldExamples: [
      "Railroad tracks have expansion gaps to prevent buckling in summer heat.",
      "A fever of just 2°C above normal (37°C) signals significant metabolic disturbance.",
    ],
    relatedLabIds: ["lab-heat-transfer"],
  },
];

// ─── ASTROPHYSICS ─────────────────────────────────────────────────────────────
export const ASTRO_CHAPTERS: ChapterMeta[] = [
  {
    id: "ast-001",
    slug: "solar-system",
    domain: "astrophysics",
    title: "The Solar System",
    description: "Planets, moons, orbital mechanics, and the scale of our solar system.",
    difficulty: "beginner",
    prerequisites: ["mec-007"],
    estimatedMinutes: 40,
    order: 1,
    tags: ["solar system", "planets", "orbits", "Kepler", "Sun"],
    keyPoints: [
      "The Sun contains 99.86% of the solar system's total mass.",
      "Eight planets orbit the Sun in elliptical orbits (Kepler's First Law).",
      "Planet distances follow the Titius-Bode rule approximately.",
      "Earth is in the 'habitable zone' — liquid water can exist on the surface.",
      "Light from the Sun takes 8 minutes 20 seconds to reach Earth.",
    ],
    misconceptions: [
      { wrong: "Earth is closest to the Sun in summer (Northern Hemisphere).", correct: "Earth is actually slightly farther from the Sun in Northern Hemisphere summer. Seasons are caused by Earth's axial tilt." },
    ],
    formulas: [
      { name: "Kepler's Third Law", latex: "\\frac{T_1^2}{T_2^2} = \\frac{r_1^3}{r_2^3}", description: "Ratio of orbital periods squared equals ratio of orbital radii cubed." },
    ],
    realWorldExamples: [
      "GPS satellites require Kepler's laws to predict their positions for accurate navigation.",
      "The Voyager probes, launched in 1977, used gravitational slingshots around planets — orbital mechanics in action.",
    ],
    relatedLabIds: ["lab-solar-system", "lab-orbital-simulator"],
  },
];

// ─── QUANTUM MECHANICS ────────────────────────────────────────────────────────
export const QUANTUM_CHAPTERS: ChapterMeta[] = [
  {
    id: "qnt-001",
    slug: "wave-particle-duality",
    domain: "quantum",
    title: "Wave-Particle Duality",
    description: "De Broglie's hypothesis, double-slit experiment, and why quantum objects behave as both waves and particles.",
    difficulty: "advanced",
    prerequisites: ["mod-001", "wav-001"],
    estimatedMinutes: 50,
    order: 1,
    tags: ["wave-particle", "de Broglie", "double-slit", "quantum", "probability"],
    keyPoints: [
      "De Broglie: every particle has an associated wavelength λ = h/mv.",
      "The double-slit experiment shows electrons create an interference pattern — wave behavior.",
      "Measurement collapses the wave function — the act of observation affects the outcome.",
      "Heisenberg Uncertainty Principle: Δx·Δp ≥ ℏ/2. Position and momentum cannot both be precisely known.",
      "The wave function |ψ|² gives the probability density of finding the particle.",
    ],
    misconceptions: [
      { wrong: "Quantum effects only apply to subatomic particles — not to everyday objects.", correct: "Macroscopic objects also have de Broglie wavelengths, but they are so tiny (e.g. 10⁻³⁴ m for a ball) as to be completely undetectable." },
    ],
    formulas: [
      { name: "De Broglie Wavelength", latex: "\\lambda = \\frac{h}{mv} = \\frac{h}{p}", description: "Matter wave wavelength of a particle with momentum p = mv." },
      { name: "Heisenberg Uncertainty", latex: "\\Delta x \\cdot \\Delta p \\geq \\frac{\\hbar}{2}", description: "Fundamental limit on simultaneous knowledge of position and momentum." },
    ],
    realWorldExamples: [
      "Electron microscopes use the wave nature of electrons (very short de Broglie wavelength) to image atoms.",
      "Quantum tunneling allows nuclear fusion in the Sun at temperatures lower than classical physics would require.",
    ],
    relatedLabIds: ["lab-double-slit", "lab-quantum-visualizer"],
  },
];

// ─── All chapters combined ────────────────────────────────────────────────────
export const ALL_CHAPTERS: ChapterMeta[] = [
  ...MECHANICS_CHAPTERS,
  ...WAVES_CHAPTERS,
  ...ELECTRICITY_CHAPTERS,
  ...OPTICS_CHAPTERS,
  ...MODERN_CHAPTERS,
  ...THERMO_CHAPTERS,
  ...ASTRO_CHAPTERS,
  ...QUANTUM_CHAPTERS,
];

export function getChaptersByDomain(domain: PhysicsDomain): ChapterMeta[] {
  return ALL_CHAPTERS.filter((c) => c.domain === domain);
}

export function getChapterById(id: string): ChapterMeta | undefined {
  return ALL_CHAPTERS.find((c) => c.id === id);
}

export function getChapterBySlug(slug: string): ChapterMeta | undefined {
  return ALL_CHAPTERS.find((c) => c.slug === slug);
}

export function getPrerequisiteChapters(chapter: ChapterMeta): ChapterMeta[] {
  return chapter.prerequisites
    .map((id) => getChapterById(id))
    .filter(Boolean) as ChapterMeta[];
}
