// src/lib/constants/practice-data.ts
// Complete question bank for PhysicsVerse Practice Zone (Phase 5)

import type { PhysicsDomain } from "@/types";

export type QuestionType = "mcq" | "numerical" | "conceptual" | "assertion-reason";
export type ExamLevel    = "ssc" | "hsc" | "admission" | "olympiad";
export type Difficulty   = "easy" | "medium" | "hard";

export interface Option { id: string; text: string }

export interface SolutionStep {
  order:       number;
  explanation: string;
  latex?:      string;
}

export interface Question {
  id:           string;
  type:         QuestionType;
  domain:       PhysicsDomain;
  difficulty:   Difficulty;
  examLevels:   ExamLevel[];
  question:     string;
  questionLatex?: string;
  imageAlt?:    string;
  options?:     Option[];           // MCQ only
  correctAnswer: string;            // option id for MCQ, numeric string for numerical
  unit?:        string;             // for numerical
  tolerance?:   number;            // % tolerance for numerical answers
  solution:     SolutionStep[];
  hint:         string;
  tags:         string[];
  chapterSlug?: string;
  formulaSlug?: string;
  year?:        number;
  source?:      string;
}

// ── MECHANICS ─────────────────────────────────────────────────────────────────
const MECHANICS_QUESTIONS: Question[] = [
  {
    id: "mec-mcq-001",
    type: "mcq", domain: "mechanics", difficulty: "easy",
    examLevels: ["ssc", "hsc"],
    question: "A ball is dropped from rest. After 3 seconds, what is its velocity? (g = 10 m/s²)",
    options: [
      { id: "A", text: "10 m/s" },
      { id: "B", text: "20 m/s" },
      { id: "C", text: "30 m/s" },
      { id: "D", text: "40 m/s" },
    ],
    correctAnswer: "C",
    solution: [
      { order: 1, explanation: "Use v = u + at, with u = 0 (dropped from rest), a = g = 10 m/s², t = 3 s." },
      { order: 2, explanation: "v = 0 + (10)(3) = 30 m/s", latex: "v = u + at = 0 + 10 \\times 3 = 30 \\text{ m/s}" },
    ],
    hint: "Use the first equation of motion. The ball starts from rest so initial velocity u = 0.",
    tags: ["free fall", "kinematics", "velocity"],
    chapterSlug: "kinematics-1d", formulaSlug: "velocity",
  },
  {
    id: "mec-mcq-002",
    type: "mcq", domain: "mechanics", difficulty: "easy",
    examLevels: ["ssc", "hsc"],
    question: "A projectile is launched at 45° with speed 20 m/s. What is its maximum range? (g = 10 m/s²)",
    options: [
      { id: "A", text: "20 m"  },
      { id: "B", text: "30 m"  },
      { id: "C", text: "40 m"  },
      { id: "D", text: "50 m"  },
    ],
    correctAnswer: "C",
    solution: [
      { order: 1, explanation: "Use the range formula R = u²sin2θ / g." },
      { order: 2, latex: "R = \\frac{u^2 \\sin 2\\theta}{g} = \\frac{20^2 \\times \\sin 90°}{10} = \\frac{400 \\times 1}{10} = 40 \\text{ m}", explanation: "At 45°, sin2θ = sin90° = 1, giving maximum range." },
    ],
    hint: "At 45°, sin(2×45°) = sin90° = 1 — this gives the maximum possible range.",
    tags: ["projectile", "range", "kinematics"],
    chapterSlug: "projectile-motion", formulaSlug: "projectile-range",
  },
  {
    id: "mec-mcq-003",
    type: "mcq", domain: "mechanics", difficulty: "medium",
    examLevels: ["hsc", "admission"],
    question: "A 5 kg object accelerates at 4 m/s². What net force is applied?",
    options: [
      { id: "A", text: "1.25 N" },
      { id: "B", text: "9 N"   },
      { id: "C", text: "20 N"  },
      { id: "D", text: "45 N"  },
    ],
    correctAnswer: "C",
    solution: [
      { order: 1, explanation: "Apply Newton's Second Law: F = ma." },
      { order: 2, latex: "F = ma = 5 \\times 4 = 20 \\text{ N}", explanation: "Net force = mass × acceleration = 5 × 4 = 20 N." },
    ],
    hint: "Newton's Second Law: F = ma. Multiply mass by acceleration.",
    tags: ["Newton", "force", "acceleration"],
    chapterSlug: "newtons-laws", formulaSlug: "newtons-second-law",
  },
  {
    id: "mec-mcq-004",
    type: "mcq", domain: "mechanics", difficulty: "medium",
    examLevels: ["hsc", "admission"],
    question: "A 2 kg object moving at 10 m/s has kinetic energy of:",
    options: [
      { id: "A", text: "10 J"  },
      { id: "B", text: "20 J"  },
      { id: "C", text: "100 J" },
      { id: "D", text: "200 J" },
    ],
    correctAnswer: "C",
    solution: [
      { order: 1, explanation: "Use the kinetic energy formula KE = ½mv²." },
      { order: 2, latex: "KE = \\frac{1}{2}mv^2 = \\frac{1}{2} \\times 2 \\times 10^2 = \\frac{1}{2} \\times 2 \\times 100 = 100 \\text{ J}", explanation: "KE = ½ × 2 × 100 = 100 J." },
    ],
    hint: "KE = ½mv². Note that v is squared — speed has a big effect on kinetic energy.",
    tags: ["kinetic energy", "energy"],
    chapterSlug: "work-energy-power", formulaSlug: "kinetic-energy",
  },
  {
    id: "mec-mcq-005",
    type: "mcq", domain: "mechanics", difficulty: "hard",
    examLevels: ["admission", "olympiad"],
    question: "A satellite orbits Earth at radius r. If the radius is doubled to 2r, the orbital period becomes:",
    options: [
      { id: "A", text: "2T"      },
      { id: "B", text: "√2 T"    },
      { id: "C", text: "2√2 T"   },
      { id: "D", text: "4T"      },
    ],
    correctAnswer: "C",
    solution: [
      { order: 1, explanation: "Apply Kepler's Third Law: T² ∝ r³." },
      { order: 2, latex: "\\frac{T_2^2}{T_1^2} = \\frac{(2r)^3}{r^3} = 8", explanation: "So T₂² = 8T₁², meaning T₂ = 2√2 T₁." },
      { order: 3, latex: "T_2 = \\sqrt{8} \\cdot T = 2\\sqrt{2}\\,T", explanation: "The period increases by a factor of 2√2 ≈ 2.83." },
    ],
    hint: "Kepler's Third Law: T² ∝ r³. If r → 2r, what happens to T?",
    tags: ["Kepler", "orbit", "gravitation"],
    chapterSlug: "circular-motion-gravitation",
    source: "BUET 2019",
  },
  {
    id: "mec-num-001",
    type: "numerical", domain: "mechanics", difficulty: "medium",
    examLevels: ["hsc", "admission"],
    question: "A car starts from rest and accelerates at 3 m/s² for 8 seconds. How far does it travel? (in metres)",
    correctAnswer: "96",
    unit: "m", tolerance: 1,
    solution: [
      { order: 1, explanation: "Use the second kinematic equation: s = ut + ½at²." },
      { order: 2, latex: "s = ut + \\frac{1}{2}at^2 = 0 \\times 8 + \\frac{1}{2} \\times 3 \\times 8^2", explanation: "Initial velocity u = 0 (starts from rest)." },
      { order: 3, latex: "s = 0 + \\frac{1}{2} \\times 3 \\times 64 = 96 \\text{ m}", explanation: "The car travels 96 metres in 8 seconds." },
    ],
    hint: "s = ut + ½at². Since the car starts from rest, u = 0.",
    tags: ["kinematics", "displacement", "acceleration"],
    chapterSlug: "kinematics-1d", formulaSlug: "displacement",
  },
  {
    id: "mec-num-002",
    type: "numerical", domain: "mechanics", difficulty: "hard",
    examLevels: ["admission", "olympiad"],
    question: "A 500 g ball is thrown vertically upward with 20 m/s. What maximum height does it reach? (g = 10 m/s², answer in metres)",
    correctAnswer: "20",
    unit: "m", tolerance: 1,
    solution: [
      { order: 1, explanation: "At maximum height, final velocity v = 0. Use v² = u² + 2as." },
      { order: 2, latex: "0 = 20^2 + 2(-10)H \\Rightarrow 20H = 400", explanation: "Upward is positive; a = -g = -10 m/s²." },
      { order: 3, latex: "H = \\frac{400}{20} = 20 \\text{ m}", explanation: "Maximum height = 20 m. Note: mass (500 g) is irrelevant!" },
    ],
    hint: "At maximum height, v = 0. Use v² = u² + 2as with a = -g.",
    tags: ["free fall", "maximum height", "kinematics"],
    chapterSlug: "kinematics-1d",
  },
  {
    id: "mec-con-001",
    type: "conceptual", domain: "mechanics", difficulty: "medium",
    examLevels: ["hsc", "admission"],
    question: "A rocket in outer space fires its engine. According to Newton's Third Law, what provides the forward thrust?",
    options: [
      { id: "A", text: "The rocket pushing against the air" },
      { id: "B", text: "The exhaust gases pushing backward against the rocket" },
      { id: "C", text: "The exhaust gases pushing forward" },
      { id: "D", text: "The gravitational pull of distant stars" },
    ],
    correctAnswer: "B",
    solution: [
      { order: 1, explanation: "Newton's Third Law: every action has an equal and opposite reaction." },
      { order: 2, explanation: "The rocket engine pushes exhaust gases backward (action). The gases push the rocket forward with equal force (reaction). No air is needed — rockets work in vacuum." },
    ],
    hint: "Think about Newton's Third Law: action-reaction pairs always act on different objects.",
    tags: ["Newton's Third Law", "rocket", "reaction"],
    chapterSlug: "newtons-laws",
  },
];

// ── ELECTRICITY ───────────────────────────────────────────────────────────────
const ELECTRICITY_QUESTIONS: Question[] = [
  {
    id: "elec-mcq-001",
    type: "mcq", domain: "electricity", difficulty: "easy",
    examLevels: ["ssc", "hsc"],
    question: "A 6 V battery is connected to a 3 Ω resistor. What is the current?",
    options: [
      { id: "A", text: "0.5 A" },
      { id: "B", text: "2 A"   },
      { id: "C", text: "3 A"   },
      { id: "D", text: "18 A"  },
    ],
    correctAnswer: "B",
    solution: [
      { order: 1, explanation: "Apply Ohm's Law: I = V/R." },
      { order: 2, latex: "I = \\frac{V}{R} = \\frac{6}{3} = 2 \\text{ A}", explanation: "Current = 6/3 = 2 A." },
    ],
    hint: "Ohm's Law: V = IR, so I = V/R.",
    tags: ["Ohm's Law", "current", "resistance"],
    chapterSlug: "current-resistance-ohms-law", formulaSlug: "ohms-law",
  },
  {
    id: "elec-mcq-002",
    type: "mcq", domain: "electricity", difficulty: "medium",
    examLevels: ["hsc", "admission"],
    question: "Two resistors, 4 Ω and 6 Ω, are connected in parallel. What is the combined resistance?",
    options: [
      { id: "A", text: "10 Ω"   },
      { id: "B", text: "2.4 Ω"  },
      { id: "C", text: "5 Ω"    },
      { id: "D", text: "1.67 Ω" },
    ],
    correctAnswer: "B",
    solution: [
      { order: 1, explanation: "For parallel resistors: 1/R = 1/R₁ + 1/R₂." },
      { order: 2, latex: "\\frac{1}{R} = \\frac{1}{4} + \\frac{1}{6} = \\frac{3}{12} + \\frac{2}{12} = \\frac{5}{12}", explanation: "Adding the reciprocals." },
      { order: 3, latex: "R = \\frac{12}{5} = 2.4 \\ \\Omega", explanation: "Combined resistance = 2.4 Ω. Always less than the smallest individual resistance in parallel." },
    ],
    hint: "Parallel: 1/R_total = 1/R₁ + 1/R₂. Result is always less than the smallest resistor.",
    tags: ["parallel", "resistance", "circuit"],
    chapterSlug: "current-resistance-ohms-law",
  },
  {
    id: "elec-num-001",
    type: "numerical", domain: "electricity", difficulty: "medium",
    examLevels: ["hsc", "admission"],
    question: "A 60 W bulb operates on 240 V. What is its resistance? (answer in Ω)",
    correctAnswer: "960",
    unit: "Ω", tolerance: 2,
    solution: [
      { order: 1, explanation: "Use P = V²/R, so R = V²/P." },
      { order: 2, latex: "R = \\frac{V^2}{P} = \\frac{240^2}{60} = \\frac{57600}{60} = 960 \\ \\Omega", explanation: "Resistance of the bulb filament = 960 Ω." },
    ],
    hint: "P = V²/R, therefore R = V²/P. Rearrange the power formula.",
    tags: ["power", "resistance", "voltage"],
    chapterSlug: "current-resistance-ohms-law", formulaSlug: "electrical-power",
  },
  {
    id: "elec-mcq-003",
    type: "mcq", domain: "electricity", difficulty: "hard",
    examLevels: ["admission", "olympiad"],
    question: "A capacitor of 100 μF is charged to 12 V. What energy is stored?",
    options: [
      { id: "A", text: "7.2 mJ"  },
      { id: "B", text: "14.4 mJ" },
      { id: "C", text: "1.2 mJ"  },
      { id: "D", text: "72 mJ"   },
    ],
    correctAnswer: "A",
    solution: [
      { order: 1, explanation: "Energy stored in a capacitor: E = ½CV²." },
      { order: 2, latex: "E = \\frac{1}{2}CV^2 = \\frac{1}{2} \\times 100 \\times 10^{-6} \\times 12^2", explanation: "C = 100 μF = 100 × 10⁻⁶ F." },
      { order: 3, latex: "E = \\frac{1}{2} \\times 10^{-4} \\times 144 = 7.2 \\times 10^{-3} \\text{ J} = 7.2 \\text{ mJ}", explanation: "7.2 mJ of energy is stored in the capacitor." },
    ],
    hint: "E = ½CV². Convert μF to F: 100 μF = 10⁻⁴ F.",
    tags: ["capacitor", "energy", "electric field"],
    chapterSlug: "current-resistance-ohms-law",
  },
];

// ── WAVES ─────────────────────────────────────────────────────────────────────
const WAVES_QUESTIONS: Question[] = [
  {
    id: "wav-mcq-001",
    type: "mcq", domain: "waves", difficulty: "easy",
    examLevels: ["ssc", "hsc"],
    question: "A wave has frequency 5 Hz and wavelength 4 m. What is its speed?",
    options: [
      { id: "A", text: "0.8 m/s"  },
      { id: "B", text: "9 m/s"    },
      { id: "C", text: "20 m/s"   },
      { id: "D", text: "1.25 m/s" },
    ],
    correctAnswer: "C",
    solution: [
      { order: 1, explanation: "Use the wave speed equation v = fλ." },
      { order: 2, latex: "v = f\\lambda = 5 \\times 4 = 20 \\text{ m/s}", explanation: "Wave speed = frequency × wavelength = 5 × 4 = 20 m/s." },
    ],
    hint: "v = fλ. Wave speed = frequency × wavelength.",
    tags: ["wave speed", "frequency", "wavelength"],
    chapterSlug: "wave-properties", formulaSlug: "wave-speed",
  },
  {
    id: "wav-mcq-002",
    type: "mcq", domain: "waves", difficulty: "medium",
    examLevels: ["hsc", "admission"],
    question: "An ambulance siren at 800 Hz moves toward you at 30 m/s. You hear a frequency of (speed of sound = 330 m/s):",
    options: [
      { id: "A", text: "873 Hz" },
      { id: "B", text: "727 Hz" },
      { id: "C", text: "800 Hz" },
      { id: "D", text: "836 Hz" },
    ],
    correctAnswer: "A",
    solution: [
      { order: 1, explanation: "Apply the Doppler formula for a moving source approaching the observer." },
      { order: 2, latex: "f' = f \\cdot \\frac{v}{v - v_s} = 800 \\times \\frac{330}{330 - 30}", explanation: "Use minus because source is approaching (waves compressed)." },
      { order: 3, latex: "f' = 800 \\times \\frac{330}{300} = 800 \\times 1.1 = 880 \\approx 873 \\text{ Hz}", explanation: "Closest to 873 Hz — pitch increases as ambulance approaches." },
    ],
    hint: "Doppler formula: f' = f × v/(v - vs) when source approaches. Speed of sound is 330 m/s.",
    tags: ["Doppler", "sound", "frequency"],
    chapterSlug: "sound-waves",
  },
  {
    id: "wav-num-001",
    type: "numerical", domain: "waves", difficulty: "medium",
    examLevels: ["hsc", "admission"],
    question: "The speed of sound in air is 340 m/s. What is the wavelength of a 1700 Hz tone? (answer in metres)",
    correctAnswer: "0.2",
    unit: "m", tolerance: 2,
    solution: [
      { order: 1, explanation: "Rearrange v = fλ to find wavelength: λ = v/f." },
      { order: 2, latex: "\\lambda = \\frac{v}{f} = \\frac{340}{1700} = 0.2 \\text{ m}", explanation: "Wavelength = 20 cm = 0.2 m." },
    ],
    hint: "λ = v/f. Divide wave speed by frequency.",
    tags: ["wavelength", "sound", "wave speed"],
    chapterSlug: "wave-properties",
  },
];

// ── OPTICS ────────────────────────────────────────────────────────────────────
const OPTICS_QUESTIONS: Question[] = [
  {
    id: "opt-mcq-001",
    type: "mcq", domain: "optics", difficulty: "easy",
    examLevels: ["ssc", "hsc"],
    question: "Light travels from air (n=1) into glass (n=1.5) at 30° to the normal. What is the angle of refraction?",
    options: [
      { id: "A", text: "19.5°" },
      { id: "B", text: "30°"   },
      { id: "C", text: "45°"   },
      { id: "D", text: "48.6°" },
    ],
    correctAnswer: "A",
    solution: [
      { order: 1, explanation: "Apply Snell's Law: n₁ sinθ₁ = n₂ sinθ₂." },
      { order: 2, latex: "1 \\times \\sin 30° = 1.5 \\times \\sin\\theta_2", explanation: "n₁ = 1 (air), n₂ = 1.5 (glass), θ₁ = 30°." },
      { order: 3, latex: "\\sin\\theta_2 = \\frac{\\sin 30°}{1.5} = \\frac{0.5}{1.5} = 0.333 \\Rightarrow \\theta_2 = 19.5°", explanation: "Light bends toward normal when entering denser medium." },
    ],
    hint: "Snell's Law: n₁sinθ₁ = n₂sinθ₂. Light bends toward normal when entering denser medium.",
    tags: ["Snell's Law", "refraction", "optics"],
    chapterSlug: "reflection-refraction", formulaSlug: "snells-law",
  },
  {
    id: "opt-mcq-002",
    type: "mcq", domain: "optics", difficulty: "hard",
    examLevels: ["admission", "olympiad"],
    question: "A glass slab (n = 1.5) is surrounded by air. What is the critical angle for total internal reflection?",
    options: [
      { id: "A", text: "41.8°" },
      { id: "B", text: "48.2°" },
      { id: "C", text: "33.6°" },
      { id: "D", text: "60°"   },
    ],
    correctAnswer: "A",
    solution: [
      { order: 1, explanation: "At critical angle θc, the refracted ray just grazes the surface (θ₂ = 90°)." },
      { order: 2, latex: "\\sin\\theta_c = \\frac{n_2}{n_1} = \\frac{1}{1.5} = 0.667", explanation: "For glass-to-air: n₁ = 1.5, n₂ = 1." },
      { order: 3, latex: "\\theta_c = \\sin^{-1}(0.667) = 41.8°", explanation: "Any angle above 41.8° gives TIR — the basis of optical fibers." },
    ],
    hint: "sinθc = n₂/n₁. Use the smaller n in numerator (the medium you're going INTO).",
    tags: ["TIR", "critical angle", "optical fiber"],
    chapterSlug: "reflection-refraction", formulaSlug: "snells-law",
    source: "HSC 2021",
  },
];

// ── MODERN PHYSICS ────────────────────────────────────────────────────────────
const MODERN_QUESTIONS: Question[] = [
  {
    id: "mod-mcq-001",
    type: "mcq", domain: "modern", difficulty: "medium",
    examLevels: ["hsc", "admission"],
    question: "Light of frequency 8×10¹⁴ Hz hits a metal with work function 2.0 eV. What is KE_max of the ejected electron? (h = 6.6×10⁻³⁴ J·s, 1eV = 1.6×10⁻¹⁹ J)",
    options: [
      { id: "A", text: "1.3 eV" },
      { id: "B", text: "2.0 eV" },
      { id: "C", text: "3.3 eV" },
      { id: "D", text: "0.8 eV" },
    ],
    correctAnswer: "A",
    solution: [
      { order: 1, explanation: "Photoelectric equation: KE_max = hf - φ." },
      { order: 2, latex: "E_{photon} = hf = 6.6\\times10^{-34} \\times 8\\times10^{14} = 5.28\\times10^{-19} \\text{ J}", explanation: "Convert to eV: 5.28×10⁻¹⁹ / 1.6×10⁻¹⁹ = 3.3 eV." },
      { order: 3, latex: "KE_{max} = 3.3 - 2.0 = 1.3 \\text{ eV}", explanation: "KE_max = photon energy minus work function = 3.3 - 2.0 = 1.3 eV." },
    ],
    hint: "KE_max = hf - φ. First find photon energy in eV, then subtract work function.",
    tags: ["photoelectric", "photon energy", "work function"],
    chapterSlug: "photoelectric-effect", formulaSlug: "photon-energy",
  },
  {
    id: "mod-mcq-002",
    type: "mcq", domain: "modern", difficulty: "hard",
    examLevels: ["admission", "olympiad"],
    question: "An electron moves at 2×10⁶ m/s. What is its de Broglie wavelength? (h = 6.6×10⁻³⁴ J·s, mₑ = 9.1×10⁻³¹ kg)",
    options: [
      { id: "A", text: "3.6×10⁻¹⁰ m" },
      { id: "B", text: "7.2×10⁻¹⁰ m" },
      { id: "C", text: "1.8×10⁻¹⁰ m" },
      { id: "D", text: "3.6×10⁻⁹ m"  },
    ],
    correctAnswer: "A",
    solution: [
      { order: 1, explanation: "de Broglie wavelength: λ = h/mv." },
      { order: 2, latex: "\\lambda = \\frac{h}{mv} = \\frac{6.6\\times10^{-34}}{9.1\\times10^{-31} \\times 2\\times10^6}", explanation: "Substitute values carefully." },
      { order: 3, latex: "\\lambda = \\frac{6.6\\times10^{-34}}{1.82\\times10^{-24}} = 3.6\\times10^{-10} \\text{ m} = 0.36 \\text{ nm}", explanation: "This is the atomic scale — why electron microscopes can image atoms!" },
    ],
    hint: "λ = h/(mv). This is matter wave — de Broglie's brilliant insight.",
    tags: ["de Broglie", "matter wave", "quantum"],
    chapterSlug: "wave-particle-duality", formulaSlug: "de-broglie-wavelength",
  },
];

// ── THERMODYNAMICS ────────────────────────────────────────────────────────────
const THERMO_QUESTIONS: Question[] = [
  {
    id: "thm-mcq-001",
    type: "mcq", domain: "thermodynamics", difficulty: "easy",
    examLevels: ["ssc", "hsc"],
    question: "500 g of water is heated from 20°C to 100°C. How much heat is absorbed? (c = 4200 J/kg·K)",
    options: [
      { id: "A", text: "168 kJ" },
      { id: "B", text: "84 kJ"  },
      { id: "C", text: "336 kJ" },
      { id: "D", text: "42 kJ"  },
    ],
    correctAnswer: "A",
    solution: [
      { order: 1, explanation: "Use Q = mcΔT." },
      { order: 2, latex: "Q = mc\\Delta T = 0.5 \\times 4200 \\times (100-20) = 0.5 \\times 4200 \\times 80", explanation: "m = 500 g = 0.5 kg, ΔT = 80 K." },
      { order: 3, latex: "Q = 168000 \\text{ J} = 168 \\text{ kJ}", explanation: "168 kJ of heat is absorbed." },
    ],
    hint: "Q = mcΔT. Convert mass to kg. ΔT = final - initial temperature.",
    tags: ["heat", "specific heat", "water"],
    chapterSlug: "temperature-heat",
  },
  {
    id: "thm-num-001",
    type: "numerical", domain: "thermodynamics", difficulty: "medium",
    examLevels: ["hsc", "admission"],
    question: "An ideal gas at 27°C (300 K) and 1 atm is heated to 327°C at constant pressure. By what factor does its volume increase?",
    correctAnswer: "2",
    unit: "×", tolerance: 1,
    solution: [
      { order: 1, explanation: "Charles's Law (constant pressure): V/T = constant, so V₁/T₁ = V₂/T₂." },
      { order: 2, latex: "\\frac{V_2}{V_1} = \\frac{T_2}{T_1} = \\frac{600}{300} = 2", explanation: "T₁ = 300 K, T₂ = 327°C + 273 = 600 K. Volume doubles." },
    ],
    hint: "Charles's Law: V ∝ T (at constant P). Must use Kelvin! T(K) = T(°C) + 273.",
    tags: ["Charles's Law", "gas", "temperature"],
    chapterSlug: "temperature-heat",
  },
];

// ── OLYMPIAD CHALLENGES ───────────────────────────────────────────────────────
const OLYMPIAD_QUESTIONS: Question[] = [
  {
    id: "oly-mcq-001",
    type: "mcq", domain: "mechanics", difficulty: "hard",
    examLevels: ["olympiad"],
    question: "A uniform rod of mass M and length L is pivoted at one end and released from horizontal. What is its angular velocity when it reaches vertical position?",
    options: [
      { id: "A", text: "√(g/L)"    },
      { id: "B", text: "√(2g/L)"   },
      { id: "C", text: "√(3g/L)"   },
      { id: "D", text: "√(6g/L)"   },
    ],
    correctAnswer: "C",
    solution: [
      { order: 1, explanation: "Use energy conservation: PE lost = Rotational KE gained." },
      { order: 2, latex: "Mg\\frac{L}{2} = \\frac{1}{2}I\\omega^2 = \\frac{1}{2} \\cdot \\frac{ML^2}{3} \\cdot \\omega^2", explanation: "PE lost = Mg(L/2). Moment of inertia of rod about end = ML²/3." },
      { order: 3, latex: "\\omega^2 = \\frac{MgL}{\\frac{ML^2}{3}} = \\frac{3g}{L} \\Rightarrow \\omega = \\sqrt{\\frac{3g}{L}}", explanation: "Angular velocity when vertical = √(3g/L)." },
    ],
    hint: "Use energy conservation. The CM drops by L/2. I_rod_end = ML²/3.",
    tags: ["rotation", "energy", "moment of inertia"],
    source: "BPhO",
  },
  {
    id: "oly-mcq-002",
    type: "mcq", domain: "electricity", difficulty: "hard",
    examLevels: ["olympiad"],
    question: "In a Wheatstone bridge with R₁=10Ω, R₂=20Ω, R₃=15Ω, find R₄ for balance.",
    options: [
      { id: "A", text: "25 Ω" },
      { id: "B", text: "30 Ω" },
      { id: "C", text: "10 Ω" },
      { id: "D", text: "40 Ω" },
    ],
    correctAnswer: "B",
    solution: [
      { order: 1, explanation: "Wheatstone bridge balance condition: R₁/R₂ = R₃/R₄." },
      { order: 2, latex: "\\frac{R_1}{R_2} = \\frac{R_3}{R_4} \\Rightarrow R_4 = \\frac{R_2 \\cdot R_3}{R_1} = \\frac{20 \\times 15}{10}", explanation: "Cross-multiply to find R₄." },
      { order: 3, latex: "R_4 = \\frac{300}{10} = 30 \\ \\Omega", explanation: "R₄ = 30 Ω for zero galvanometer current." },
    ],
    hint: "Balance condition: R₁/R₂ = R₃/R₄. No current through galvanometer means cross-products are equal.",
    tags: ["Wheatstone bridge", "circuit", "balance"],
    source: "IPhO preparation",
  },
];

// ── Combined ──────────────────────────────────────────────────────────────────
export const ALL_QUESTIONS: Question[] = [
  ...MECHANICS_QUESTIONS,
  ...ELECTRICITY_QUESTIONS,
  ...WAVES_QUESTIONS,
  ...OPTICS_QUESTIONS,
  ...MODERN_QUESTIONS,
  ...THERMO_QUESTIONS,
  ...OLYMPIAD_QUESTIONS,
];

// ── Daily challenges (rotates daily) ─────────────────────────────────────────
export const DAILY_CHALLENGE_IDS = [
  "mec-mcq-001", "elec-mcq-001", "wav-mcq-001",
  "opt-mcq-001", "mod-mcq-001", "thm-mcq-001",
  "mec-num-001",
];

export function getDailyChallenge(): Question {
  const idx = new Date().getDate() % DAILY_CHALLENGE_IDS.length;
  return ALL_QUESTIONS.find((q) => q.id === DAILY_CHALLENGE_IDS[idx])!;
}

export function getQuestionsByDomain(domain: PhysicsDomain): Question[] {
  return ALL_QUESTIONS.filter((q) => q.domain === domain);
}

export function getQuestionsByLevel(level: ExamLevel): Question[] {
  return ALL_QUESTIONS.filter((q) => q.examLevels.includes(level));
}

export function getQuestionsByType(type: QuestionType): Question[] {
  return ALL_QUESTIONS.filter((q) => q.type === type);
}

export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

// Mock exam papers (question IDs)
export const MOCK_PAPERS: Record<string, { title: string; duration: number; questionIds: string[] }> = {
  "hsc-physics-1": {
    title:     "HSC Physics First Paper",
    duration:  180,  // minutes
    questionIds: ["mec-mcq-001","mec-mcq-002","mec-mcq-003","mec-mcq-004",
                  "wav-mcq-001","wav-mcq-002","opt-mcq-001","thm-mcq-001",
                  "mec-num-001","mec-num-002","wav-num-001","thm-num-001"],
  },
  "admission-buet": {
    title:     "BUET Admission Prep",
    duration:  120,
    questionIds: ["mec-mcq-004","mec-mcq-005","elec-mcq-002","elec-mcq-003",
                  "wav-mcq-002","opt-mcq-002","mod-mcq-001","mod-mcq-002",
                  "mec-num-002","elec-num-001"],
  },
  "olympiad-prep": {
    title:     "Physics Olympiad Practice",
    duration:  150,
    questionIds: ["mec-mcq-005","oly-mcq-001","oly-mcq-002",
                  "mod-mcq-002","opt-mcq-002","elec-mcq-003"],
  },
};
