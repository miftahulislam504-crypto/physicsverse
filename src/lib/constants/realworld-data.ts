// src/lib/constants/realworld-data.ts
import type { PhysicsDomain } from "@/types";

export interface RealWorldArticle {
  id:          string;
  slug:        string;
  title:       string;
  question:    string;   // "why does X happen?"
  domain:      PhysicsDomain;
  category:    "transport" | "technology" | "medical" | "nature" | "energy" | "sports";
  icon:        string;
  principle:   string;   // physics principle involved
  summary:     string;
  keyPoints:   string[];
  funFact:     string;
  chapterSlug?: string;
  formulaSlug?: string;
}

export const REALWORLD_ARTICLES: RealWorldArticle[] = [
  {
    id: "rw-001", slug: "why-planes-fly",
    title: "Why Airplanes Fly",
    question: "How does a 400-ton aircraft stay in the air?",
    domain: "mechanics", category: "transport",
    icon: "✈️", principle: "Bernoulli's Principle + Newton's Third Law",
    summary: "Aircraft wings (aerofoils) are curved on top and flat on the bottom. Air moving over the curved top travels faster, creating lower pressure above the wing. The pressure difference generates lift — upward force. Newton's Third Law also contributes: wings deflect air downward, so air pushes the wing upward.",
    keyPoints: [
      "Wing shape (aerofoil) causes faster airflow above → lower pressure above",
      "Pressure difference = Lift force (Bernoulli's Principle)",
      "Angle of attack also generates lift via Newton's Third Law",
      "Lift must equal weight for level flight",
      "At takeoff: thrust > drag, lift > weight",
    ],
    funFact: "A Boeing 747 wing generates enough lift to support 4 million kg — but it only weighs 178,000 kg!",
    chapterSlug: "work-energy-power",
  },
  {
    id: "rw-002", slug: "how-gps-works",
    title: "How GPS Works",
    question: "How does your phone know exactly where you are?",
    domain: "relativity", category: "technology",
    icon: "📡", principle: "Special & General Relativity + Trilateration",
    summary: "GPS satellites send time-stamped signals. Your phone measures the delay to calculate distance from each satellite. With signals from 4+ satellites, it triangulates your exact position. But here's the physics twist: satellites move fast (special relativity slows their clocks) and are far from Earth's gravity (general relativity speeds their clocks). Without relativistic corrections, GPS would drift by 11 km per day!",
    keyPoints: [
      "24+ GPS satellites orbit at 20,200 km altitude",
      "Each satellite broadcasts its position and precise time",
      "Distance = speed of light × time delay",
      "Need 4+ satellites for 3D position fix",
      "Special relativity: satellite clocks run 7 μs/day slow (velocity)",
      "General relativity: satellite clocks run 45 μs/day fast (weaker gravity)",
      "Net correction: +38 μs/day — without this, GPS fails completely",
    ],
    funFact: "Einstein's relativity is not just theory — it's built into every GPS chip manufactured today.",
    chapterSlug: "circular-motion-gravitation",
  },
  {
    id: "rw-003", slug: "why-rainbows",
    title: "Why Rainbows Form",
    question: "What creates the colours of a rainbow?",
    domain: "optics", category: "nature",
    icon: "🌈", principle: "Dispersion + Total Internal Reflection + Refraction",
    summary: "Sunlight entering a water droplet is refracted (bent). Different colours bend by different amounts — red least, violet most (dispersion). The light reflects off the inside of the droplet (internal reflection), then refracts again as it exits. This separates the colours and sends them back at different angles: red at 42°, violet at 40°.",
    keyPoints: [
      "White sunlight = mixture of all visible colours",
      "Water droplets act as tiny prisms",
      "Refraction separates colours (dispersion) because n varies with wavelength",
      "Total internal reflection inside droplet sends light back toward you",
      "Red: 42° from anti-solar point. Violet: 40°",
      "You see a rainbow when the Sun is behind you",
      "Double rainbows: two internal reflections — colours reversed in outer bow",
    ],
    funFact: "No two people see the exact same rainbow — each person's eyes receive light from different droplets!",
    chapterSlug: "reflection-refraction", formulaSlug: "snells-law",
  },
  {
    id: "rw-004", slug: "how-mri-works",
    title: "How MRI Scanners Work",
    question: "How can magnets create images of your internal organs?",
    domain: "magnetism", category: "medical",
    icon: "🏥", principle: "Nuclear Magnetic Resonance (NMR)",
    summary: "Your body contains billions of hydrogen nuclei (protons), which behave like tiny magnets. An MRI machine creates a powerful magnetic field (1.5–3 Tesla — 30,000× Earth's field) that aligns these protons. Radio-frequency pulses knock them out of alignment. As they realign, they emit radio signals. Different tissues realign at different rates, allowing a computer to construct detailed 3D images — without any radiation!",
    keyPoints: [
      "Hydrogen protons in water and fat are like tiny bar magnets",
      "Strong magnetic field aligns all protons",
      "RF pulse knocks protons out of alignment",
      "Protons 'relax' back and emit radio signals",
      "Different tissues: different relaxation times → contrast in image",
      "No ionising radiation (unlike X-rays or CT scans)",
      "MRI field strength: 1.5 T (clinical) to 21 T (research)",
    ],
    funFact: "MRI machines need liquid helium at -269°C to keep the superconducting magnets working. They use more helium than most countries produce!",
    chapterSlug: "circular-motion-gravitation",
  },
  {
    id: "rw-005", slug: "solar-panels-physics",
    title: "How Solar Panels Work",
    question: "How does sunlight become electricity?",
    domain: "modern", category: "energy",
    icon: "☀️", principle: "Photoelectric Effect + p-n Junction",
    summary: "Solar cells use the photoelectric effect — photons of light knock electrons free from silicon atoms. Silicon is doped to create a p-n junction: one layer has excess electrons (n-type) and another has 'holes' (p-type). The electric field at the junction sweeps free electrons in one direction, creating electric current. More photons = more electrons = more current.",
    keyPoints: [
      "Photons with E > silicon bandgap (1.1 eV) free electrons",
      "p-n junction creates built-in electric field",
      "Field drives electrons toward the n-side = current",
      "Typical silicon solar cell efficiency: 15–22%",
      "Series cells → higher voltage. Parallel cells → higher current",
      "Theoretical max (Shockley-Queisser limit): 33.7% for single junction",
    ],
    funFact: "The entire world's electricity demand could be met by covering 0.3% of the Sahara Desert with solar panels.",
    chapterSlug: "photoelectric-effect", formulaSlug: "photon-energy",
  },
  {
    id: "rw-006", slug: "cricket-ball-swing",
    title: "Cricket Ball Swing",
    question: "Why does a cricket ball curve through the air?",
    domain: "mechanics", category: "sports",
    icon: "🏏", principle: "Bernoulli's Principle + Magnus Effect",
    summary: "A cricket ball's seam and surface roughness create different airflow conditions on each side. The rough side creates turbulent airflow (higher pressure); the smooth side creates laminar flow (lower pressure). The pressure difference generates a lateral force — swing. Reverse swing occurs at high speeds when the smooth side paradoxically creates turbulence.",
    keyPoints: [
      "One side of the ball is kept smooth, other is left rough (scuffed)",
      "Rough side: turbulent boundary layer, separates early → higher pressure",
      "Smooth side: laminar flow separates later → lower pressure",
      "Pressure difference = swing force (sideways)",
      "Reverse swing at speeds >85 mph — pressure distribution reverses",
      "Magnus effect: spin also causes deviation (leg spin, off spin)",
    ],
    funFact: "Fast bowlers like Wasim Akram mastered reverse swing before physicists fully understood it. Sport drove the science!",
    chapterSlug: "newtons-laws",
  },
  {
    id: "rw-007", slug: "smartphone-physics",
    title: "Physics Inside Your Smartphone",
    question: "How much physics is in your pocket?",
    domain: "electricity", category: "technology",
    icon: "📱", principle: "Electrostatics, EM, Quantum, Optics, Acoustics",
    summary: "Your smartphone is a marvel of applied physics. The touchscreen uses capacitive sensing (electrostatics). The processor is built from quantum-mechanical transistors at 3nm scale. The camera uses optics + photoelectric effect. GPS uses relativity. WiFi/4G use electromagnetic waves. The speaker and microphone use electromagnetic induction. The battery uses electrochemistry.",
    keyPoints: [
      "Touchscreen: capacitance changes when finger (conductor) touches",
      "Processor: billions of quantum transistors, each 3 nm wide (30 atoms!)",
      "Camera sensor: CMOS — light triggers photoelectric effect in each pixel",
      "Gyroscope: MEMS — microscopic vibrating structure detects rotation",
      "WiFi (2.4/5 GHz): electromagnetic waves",
      "Battery: Li-ion electrochemistry — ions move between electrodes",
      "Face ID: infrared laser grid + time-of-flight measurement",
    ],
    funFact: "The computing power in your smartphone is roughly 1 million times more powerful than all of NASA's computers in 1969 when they landed on the Moon.",
  },
  {
    id: "rw-008", slug: "nuclear-power",
    title: "Nuclear Power vs Nuclear Bomb",
    question: "Same fuel — why so different?",
    domain: "modern", category: "energy",
    icon: "⚛️", principle: "Nuclear Fission + Critical Mass + Chain Reaction",
    summary: "Both use uranium-235 fission — splitting heavy nuclei releases enormous energy (E = mc²). The difference is control speed. A nuclear bomb achieves supercritical chain reaction in microseconds (uncontrolled). A reactor uses control rods to absorb neutrons, maintaining exactly critical conditions — steady, controlled power output. Same physics, completely different engineering.",
    keyPoints: [
      "Fission: U-235 + neutron → 2 smaller nuclei + 2-3 neutrons + 200 MeV energy",
      "1 kg U-235 releases energy equivalent to 20,000 tonnes of TNT",
      "Chain reaction: each fission releases neutrons that trigger more fissions",
      "Bomb: supercritical — chain reaction grows exponentially in μs",
      "Reactor: control rods absorb neutrons → exactly k=1 (critical, steady)",
      "Reactor can never explode like a bomb — fuel enrichment too low",
      "E = mc² explains the enormous energy from tiny mass change",
    ],
    funFact: "The mass lost in fission is only 0.1% of the original — but E=mc² means even that tiny mass converts to enormous energy.",
    chapterSlug: "photoelectric-effect",
  },
];

export function getArticleBySlug(slug: string) {
  return REALWORLD_ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(cat: string) {
  return REALWORLD_ARTICLES.filter((a) => a.category === cat);
}

export const CATEGORIES = [
  { id: "transport",  label: "Transport",   icon: "🚀" },
  { id: "technology", label: "Technology",  icon: "💻" },
  { id: "medical",    label: "Medical",     icon: "🏥" },
  { id: "nature",     label: "Nature",      icon: "🌍" },
  { id: "energy",     label: "Energy",      icon: "⚡" },
  { id: "sports",     label: "Sports",      icon: "🏆" },
] as const;
