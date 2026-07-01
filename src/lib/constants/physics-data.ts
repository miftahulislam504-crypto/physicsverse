// src/lib/constants/physics-data.ts
// Static seed data for Phase 1 — World Explorer
// In production these come from Firestore; here they power the UI immediately.

import type { PhysicsDomain, LearningPath } from "@/types";

// ─── Domain Nodes (for Interactive Map) ───────────────────────────────────────
export interface DomainNode {
  id: PhysicsDomain;
  label: string;
  icon: string;
  color: string;
  description: string;
  x: number; // % position on canvas
  y: number;
  connections: PhysicsDomain[];
  chapterCount: number;
  labCount: number;
}

export const DOMAIN_NODES: DomainNode[] = [
  {
    id: "mechanics",
    label: "Mechanics",
    icon: "⚙️",
    color: "#f97316",
    description: "Motion, forces, energy — the foundation of all physics.",
    x: 50, y: 20,
    connections: ["thermodynamics", "waves", "astrophysics"],
    chapterCount: 10,
    labCount: 8,
  },
  {
    id: "thermodynamics",
    label: "Thermodynamics",
    icon: "🌡️",
    color: "#fb7185",
    description: "Heat, temperature, and the laws governing energy flow.",
    x: 25, y: 40,
    connections: ["mechanics", "modern"],
    chapterCount: 6,
    labCount: 4,
  },
  {
    id: "electricity",
    label: "Electricity",
    icon: "⚡",
    color: "#facc15",
    description: "Electric charges, fields, circuits, and current.",
    x: 75, y: 40,
    connections: ["magnetism", "waves", "modern"],
    chapterCount: 8,
    labCount: 7,
  },
  {
    id: "magnetism",
    label: "Magnetism",
    icon: "🧲",
    color: "#60a5fa",
    description: "Magnetic fields, forces, and electromagnetic induction.",
    x: 85, y: 58,
    connections: ["electricity", "waves"],
    chapterCount: 5,
    labCount: 4,
  },
  {
    id: "waves",
    label: "Waves",
    icon: "〰️",
    color: "#34d399",
    description: "Oscillations, sound, and the nature of wave phenomena.",
    x: 50, y: 50,
    connections: ["mechanics", "optics", "electricity", "quantum"],
    chapterCount: 7,
    labCount: 6,
  },
  {
    id: "optics",
    label: "Optics",
    icon: "🔭",
    color: "#a5f3fc",
    description: "Light behavior — reflection, refraction, and wave optics.",
    x: 30, y: 65,
    connections: ["waves", "quantum", "modern"],
    chapterCount: 6,
    labCount: 6,
  },
  {
    id: "modern",
    label: "Modern Physics",
    icon: "⚛️",
    color: "#a78bfa",
    description: "Photoelectric effect, atomic structure, nuclear physics.",
    x: 65, y: 72,
    connections: ["quantum", "relativity", "optics", "thermodynamics"],
    chapterCount: 7,
    labCount: 5,
  },
  {
    id: "astrophysics",
    label: "Astrophysics",
    icon: "🌌",
    color: "#94a3b8",
    description: "Stars, galaxies, black holes, and the cosmos.",
    x: 15, y: 72,
    connections: ["mechanics", "relativity"],
    chapterCount: 5,
    labCount: 4,
  },
  {
    id: "quantum",
    label: "Quantum Mechanics",
    icon: "🔮",
    color: "#e879f9",
    description: "Wave-particle duality, probability, and the quantum world.",
    x: 50, y: 82,
    connections: ["modern", "waves", "relativity"],
    chapterCount: 4,
    labCount: 3,
  },
  {
    id: "relativity",
    label: "Relativity",
    icon: "🕰️",
    color: "#67e8f9",
    description: "Space, time, mass-energy equivalence — Einstein's revolution.",
    x: 78, y: 82,
    connections: ["modern", "astrophysics", "quantum"],
    chapterCount: 3,
    labCount: 2,
  },
];

// ─── Timeline Events ──────────────────────────────────────────────────────────
export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  scientist: string;
  domain: PhysicsDomain;
  significance: "major" | "landmark" | "revolutionary";
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "t1",  year: 1687, title: "Laws of Motion & Gravitation",      scientist: "Isaac Newton",       domain: "mechanics",      significance: "revolutionary",  description: "Newton publishes Principia Mathematica, establishing classical mechanics." },
  { id: "t2",  year: 1752, title: "Lightning is Electricity",          scientist: "Benjamin Franklin",  domain: "electricity",    significance: "major",          description: "Franklin proves lightning is an electrical phenomenon." },
  { id: "t3",  year: 1800, title: "Infrared Radiation Discovered",     scientist: "William Herschel",   domain: "optics",         significance: "major",          description: "Discovery of radiation beyond visible light." },
  { id: "t4",  year: 1820, title: "Electromagnetism",                  scientist: "Hans Ørsted",        domain: "magnetism",      significance: "landmark",       description: "Electric current produces a magnetic field — unifying two forces." },
  { id: "t5",  year: 1847, title: "Conservation of Energy",            scientist: "James Joule",        domain: "thermodynamics", significance: "revolutionary",  description: "Energy cannot be created or destroyed — the first law of thermodynamics." },
  { id: "t6",  year: 1865, title: "Maxwell's Equations",               scientist: "James Maxwell",      domain: "magnetism",      significance: "revolutionary",  description: "Four equations unifying electricity, magnetism, and light." },
  { id: "t7",  year: 1887, title: "Michelson-Morley Experiment",       scientist: "Michelson & Morley", domain: "relativity",     significance: "landmark",       description: "No evidence of ether — speed of light is constant." },
  { id: "t8",  year: 1895, title: "X-Rays Discovered",                 scientist: "Wilhelm Röntgen",    domain: "modern",         significance: "major",          description: "Discovery of X-rays opens the era of medical physics." },
  { id: "t9",  year: 1897, title: "Electron Discovered",               scientist: "J.J. Thomson",       domain: "modern",         significance: "revolutionary",  description: "The first subatomic particle — atoms are divisible." },
  { id: "t10", year: 1900, title: "Quantum Theory Born",               scientist: "Max Planck",         domain: "quantum",        significance: "revolutionary",  description: "Energy is quantized — the birth of quantum mechanics." },
  { id: "t11", year: 1905, title: "Special Relativity & E=mc²",        scientist: "Albert Einstein",    domain: "relativity",     significance: "revolutionary",  description: "Space and time are relative; mass and energy are equivalent." },
  { id: "t12", year: 1911, title: "Atomic Nucleus Discovered",         scientist: "Ernest Rutherford",  domain: "modern",         significance: "landmark",       description: "The gold foil experiment reveals the nuclear atom." },
  { id: "t13", year: 1913, title: "Bohr Model of Atom",                scientist: "Niels Bohr",         domain: "modern",         significance: "landmark",       description: "Electrons orbit in discrete energy levels." },
  { id: "t14", year: 1915, title: "General Relativity",                scientist: "Albert Einstein",    domain: "relativity",     significance: "revolutionary",  description: "Gravity is the curvature of spacetime." },
  { id: "t15", year: 1924, title: "Matter Waves",                      scientist: "Louis de Broglie",   domain: "quantum",        significance: "landmark",       description: "Particles have wave-like properties — wave-particle duality." },
  { id: "t16", year: 1927, title: "Uncertainty Principle",             scientist: "Werner Heisenberg",  domain: "quantum",        significance: "revolutionary",  description: "Position and momentum cannot both be precisely known." },
  { id: "t17", year: 1932, title: "Neutron Discovered",                scientist: "James Chadwick",     domain: "modern",         significance: "major",          description: "Completing the picture of the atomic nucleus." },
  { id: "t18", year: 1938, title: "Nuclear Fission",                   scientist: "Hahn & Strassmann",  domain: "modern",         significance: "revolutionary",  description: "Heavy atoms can split, releasing enormous energy." },
  { id: "t19", year: 1964, title: "Quark Model",                       scientist: "Gell-Mann & Zweig",  domain: "modern",         significance: "landmark",       description: "Hadrons are made of quarks — a deeper layer of matter." },
  { id: "t20", year: 1967, title: "Standard Model Begins",             scientist: "Weinberg & Salam",   domain: "modern",         significance: "revolutionary",  description: "Electroweak unification — a theory of almost everything." },
  { id: "t21", year: 1974, title: "Hawking Radiation",                 scientist: "Stephen Hawking",    domain: "astrophysics",   significance: "landmark",       description: "Black holes are not entirely black — they emit radiation." },
  { id: "t22", year: 2012, title: "Higgs Boson Discovered",            scientist: "CERN / LHC Team",    domain: "modern",         significance: "revolutionary",  description: "The 'God particle' confirms how matter gets mass." },
  { id: "t23", year: 2015, title: "Gravitational Waves Detected",      scientist: "LIGO Collaboration", domain: "astrophysics",   significance: "revolutionary",  description: "Direct confirmation of Einstein's century-old prediction." },
  { id: "t24", year: 2019, title: "First Black Hole Image",            scientist: "Event Horizon Telescope", domain: "astrophysics", significance: "landmark",    description: "First direct image of a black hole's shadow — M87*." },
];

// ─── Learning Paths / Roadmaps ────────────────────────────────────────────────
export interface RoadmapPath {
  id: LearningPath;
  label: string;
  icon: string;
  color: string;
  description: string;
  totalChapters: number;
  estimatedWeeks: number;
  steps: RoadmapStep[];
}

export interface RoadmapStep {
  order: number;
  domain: PhysicsDomain;
  title: string;
  chaptersCount: number;
  isCore: boolean;
}

export const ROADMAP_PATHS: RoadmapPath[] = [
  {
    id: "ssc",
    label: "SSC Physics",
    icon: "📘",
    color: "#22c55e",
    description: "Complete SSC Physics curriculum — all chapters covered.",
    totalChapters: 14,
    estimatedWeeks: 16,
    steps: [
      { order: 1, domain: "mechanics",      title: "Physical Quantities & Motion",    chaptersCount: 3, isCore: true  },
      { order: 2, domain: "mechanics",      title: "Force & Newton's Laws",           chaptersCount: 2, isCore: true  },
      { order: 3, domain: "thermodynamics", title: "States of Matter & Heat",         chaptersCount: 2, isCore: true  },
      { order: 4, domain: "waves",          title: "Wave & Sound",                    chaptersCount: 2, isCore: true  },
      { order: 5, domain: "optics",         title: "Light & Optics",                  chaptersCount: 2, isCore: true  },
      { order: 6, domain: "electricity",    title: "Electricity & Magnetism",         chaptersCount: 2, isCore: true  },
      { order: 7, domain: "modern",         title: "Modern Physics Intro",            chaptersCount: 1, isCore: false },
    ],
  },
  {
    id: "hsc",
    label: "HSC Physics",
    icon: "📗",
    color: "#0090f0",
    description: "HSC 1st & 2nd paper — complete board preparation.",
    totalChapters: 22,
    estimatedWeeks: 24,
    steps: [
      { order: 1,  domain: "mechanics",      title: "Vectors & Kinematics",           chaptersCount: 2, isCore: true  },
      { order: 2,  domain: "mechanics",      title: "Dynamics & Circular Motion",     chaptersCount: 2, isCore: true  },
      { order: 3,  domain: "mechanics",      title: "Work, Energy & Gravitation",     chaptersCount: 2, isCore: true  },
      { order: 4,  domain: "waves",          title: "Simple Harmonic Motion",         chaptersCount: 1, isCore: true  },
      { order: 5,  domain: "thermodynamics", title: "Thermal Physics",                chaptersCount: 2, isCore: true  },
      { order: 6,  domain: "waves",          title: "Waves & Sound",                  chaptersCount: 2, isCore: true  },
      { order: 7,  domain: "optics",         title: "Geometric & Wave Optics",        chaptersCount: 2, isCore: true  },
      { order: 8,  domain: "electricity",    title: "Electrostatics & Current",       chaptersCount: 3, isCore: true  },
      { order: 9,  domain: "magnetism",      title: "Magnetism & Induction",          chaptersCount: 2, isCore: true  },
      { order: 10, domain: "modern",         title: "Modern & Nuclear Physics",       chaptersCount: 2, isCore: true  },
      { order: 11, domain: "astrophysics",   title: "Astrophysics",                   chaptersCount: 2, isCore: false },
    ],
  },
  {
    id: "admission",
    label: "University Admission",
    icon: "🎯",
    color: "#f59e0b",
    description: "BUET, DU, CUET — high-speed targeted preparation.",
    totalChapters: 18,
    estimatedWeeks: 12,
    steps: [
      { order: 1, domain: "mechanics",      title: "Mechanics (High Priority)",       chaptersCount: 4, isCore: true  },
      { order: 2, domain: "electricity",    title: "Electricity & Circuits",          chaptersCount: 3, isCore: true  },
      { order: 3, domain: "magnetism",      title: "Magnetism & EM Induction",        chaptersCount: 2, isCore: true  },
      { order: 4, domain: "optics",         title: "Optics",                          chaptersCount: 3, isCore: true  },
      { order: 5, domain: "modern",         title: "Modern Physics",                  chaptersCount: 3, isCore: true  },
      { order: 6, domain: "waves",          title: "Waves & SHM",                     chaptersCount: 2, isCore: true  },
      { order: 7, domain: "thermodynamics", title: "Thermodynamics",                  chaptersCount: 1, isCore: false },
    ],
  },
  {
    id: "olympiad",
    label: "Physics Olympiad",
    icon: "🏆",
    color: "#a78bfa",
    description: "BPhO, IPhO preparation — deep conceptual mastery.",
    totalChapters: 30,
    estimatedWeeks: 40,
    steps: [
      { order: 1, domain: "mechanics",      title: "Classical Mechanics (Deep)",      chaptersCount: 6, isCore: true  },
      { order: 2, domain: "thermodynamics", title: "Thermodynamics & Stat Mech",      chaptersCount: 4, isCore: true  },
      { order: 3, domain: "electricity",    title: "Electromagnetism",                chaptersCount: 5, isCore: true  },
      { order: 4, domain: "optics",         title: "Wave & Geometric Optics",         chaptersCount: 4, isCore: true  },
      { order: 5, domain: "modern",         title: "Modern & Nuclear Physics",        chaptersCount: 4, isCore: true  },
      { order: 6, domain: "quantum",        title: "Intro Quantum Mechanics",         chaptersCount: 4, isCore: true  },
      { order: 7, domain: "relativity",     title: "Special Relativity",              chaptersCount: 3, isCore: false },
    ],
  },
  {
    id: "curious",
    label: "Curious Explorer",
    icon: "🌌",
    color: "#e879f9",
    description: "No exams, just wonder — follow what excites you.",
    totalChapters: 0,
    estimatedWeeks: 0,
    steps: [
      { order: 1, domain: "mechanics",   title: "Start with Motion",       chaptersCount: 2, isCore: false },
      { order: 2, domain: "astrophysics","title": "Space & Black Holes",   chaptersCount: 2, isCore: false },
      { order: 3, domain: "quantum",     title: "Quantum Weirdness",       chaptersCount: 2, isCore: false },
      { order: 4, domain: "relativity",  title: "Einstein's Universe",     chaptersCount: 2, isCore: false },
    ],
  },
];

// ─── Daily Physics Facts ──────────────────────────────────────────────────────
export const DAILY_FACTS = [
  { fact: "Light takes about 8 minutes and 20 seconds to travel from the Sun to Earth.", domain: "astrophysics" as PhysicsDomain },
  { fact: "A neutron star is so dense that a teaspoon of its material would weigh about a billion tons on Earth.", domain: "astrophysics" as PhysicsDomain },
  { fact: "The speed of sound in air is about 343 m/s, but in steel it's nearly 5,960 m/s.", domain: "waves" as PhysicsDomain },
  { fact: "If you removed all empty space from atoms in the human body, we would fit in a cube less than 1/500th of a centimeter.", domain: "modern" as PhysicsDomain },
  { fact: "Quantum entanglement allows particles to affect each other instantly regardless of distance.", domain: "quantum" as PhysicsDomain },
  { fact: "The human eye can detect a single photon of light in complete darkness.", domain: "optics" as PhysicsDomain },
  { fact: "Lightning bolts heat the air around them to about 30,000 K — five times hotter than the Sun's surface.", domain: "electricity" as PhysicsDomain },
];

export function getDailyFact() {
  const index = new Date().getDate() % DAILY_FACTS.length;
  return DAILY_FACTS[index];
}
