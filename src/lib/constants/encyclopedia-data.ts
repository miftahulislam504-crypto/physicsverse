// src/lib/constants/encyclopedia-data.ts

import type { PhysicsDomain } from "@/types";

// ── Scientists ─────────────────────────────────────────────────────────────────
export interface Scientist {
  id:           string;
  name:         string;
  born:         string;
  died?:        string;
  nationality:  string;
  flag:         string;
  portrait:     string;   // emoji placeholder
  domains:      PhysicsDomain[];
  bio:          string;
  contributions: string[];
  namedAfter:   string[];   // units, laws, constants
  nobelYear?:   number;
  nobelReason?: string;
  quote?:       string;
}

export const SCIENTISTS: Scientist[] = [
  {
    id: "newton", name: "Isaac Newton", born: "1643", died: "1727",
    nationality: "British", flag: "🇬🇧", portrait: "👨‍🔬",
    domains: ["mechanics", "optics", "mathematics" as any],
    bio: "Isaac Newton formulated the laws of motion and universal gravitation, laying the foundation for classical mechanics. He also made fundamental contributions to optics and co-invented calculus.",
    contributions: [
      "Three Laws of Motion (Principia Mathematica, 1687)",
      "Law of Universal Gravitation",
      "Corpuscular theory of light and prism dispersion",
      "Co-invention of calculus (independently with Leibniz)",
      "Reflecting telescope design",
    ],
    namedAfter: ["Newton (unit of force)", "Newton's Laws", "Newtonian mechanics"],
    quote: "If I have seen further, it is by standing on the shoulders of giants.",
  },
  {
    id: "einstein", name: "Albert Einstein", born: "1879", died: "1955",
    nationality: "German-American", flag: "🇩🇪", portrait: "👨‍🔬",
    domains: ["relativity", "quantum", "modern"],
    bio: "Albert Einstein revolutionised our understanding of space, time, gravity, and light. His special and general theories of relativity replaced Newtonian mechanics at high speeds and strong gravitational fields.",
    contributions: [
      "Special Theory of Relativity (1905) — E = mc²",
      "General Theory of Relativity (1915) — gravity as spacetime curvature",
      "Photoelectric Effect explanation (Nobel Prize, 1921)",
      "Brownian Motion theory",
      "Bose–Einstein condensate prediction",
    ],
    namedAfter: ["Einstein (unit)", "Einsteinium (element 99)", "Einstein field equations"],
    nobelYear: 1921, nobelReason: "Photoelectric effect — not relativity, which was still controversial",
    quote: "Imagination is more important than knowledge.",
  },
  {
    id: "faraday", name: "Michael Faraday", born: "1791", died: "1867",
    nationality: "British", flag: "🇬🇧", portrait: "👨‍🔬",
    domains: ["electricity", "magnetism"],
    bio: "Michael Faraday discovered electromagnetic induction, which made electric generators and transformers possible. With no formal mathematics education, he relied entirely on physical intuition and experiment.",
    contributions: [
      "Electromagnetic induction (1831)",
      "Faraday's Laws of Electrolysis",
      "Invention of the electric motor concept",
      "Discovery that magnetic fields can rotate polarised light (Faraday effect)",
      "Concept of electric and magnetic field lines",
    ],
    namedAfter: ["Faraday (unit of capacitance)", "Faraday's Law", "Faraday cage"],
    quote: "Nothing is too wonderful to be true.",
  },
  {
    id: "maxwell", name: "James Clerk Maxwell", born: "1831", died: "1879",
    nationality: "Scottish", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", portrait: "👨‍🔬",
    domains: ["electricity", "magnetism", "waves"],
    bio: "Maxwell unified electricity, magnetism, and light into a single theory through four equations. He predicted electromagnetic waves and calculated their speed — which matched the speed of light exactly.",
    contributions: [
      "Maxwell's four equations of electromagnetism",
      "Prediction of electromagnetic waves (1865)",
      "Maxwell–Boltzmann distribution (statistical mechanics)",
      "First permanent colour photograph",
      "Saturn's rings are made of particles (later confirmed)",
    ],
    namedAfter: ["Maxwell (unit of magnetic flux)", "Maxwell's equations"],
    quote: "The special theory of relativity owes its origins to Maxwell's equations.",
  },
  {
    id: "curie", name: "Marie Curie", born: "1867", died: "1934",
    nationality: "Polish-French", flag: "🇵🇱", portrait: "👩‍🔬",
    domains: ["modern"],
    bio: "Marie Curie pioneered research into radioactivity — a term she coined. She was the first woman to win a Nobel Prize and the only person to win Nobel Prizes in two different sciences (Physics and Chemistry).",
    contributions: [
      "Discovery of polonium and radium",
      "Coined the term 'radioactivity'",
      "First woman to win Nobel Prize (1903, Physics)",
      "Second Nobel Prize (1911, Chemistry)",
      "Developed mobile X-ray units in WWI (Petites Curies)",
    ],
    namedAfter: ["Curie (unit of radioactivity)", "Curium (element 96)", "Curie temperature"],
    nobelYear: 1903, nobelReason: "Radioactivity research (shared with Pierre Curie and Henri Becquerel)",
    quote: "Nothing in life is to be feared, only to be understood.",
  },
  {
    id: "bohr", name: "Niels Bohr", born: "1885", died: "1962",
    nationality: "Danish", flag: "🇩🇰", portrait: "👨‍🔬",
    domains: ["modern", "quantum"],
    bio: "Niels Bohr proposed the planetary model of the atom with quantised electron orbits, explaining the hydrogen spectrum. He later developed the Copenhagen interpretation of quantum mechanics.",
    contributions: [
      "Bohr model of the atom (1913) — quantised orbits",
      "Explanation of hydrogen spectral lines",
      "Copenhagen interpretation of quantum mechanics",
      "Principle of complementarity (wave-particle)",
      "Theory of nuclear fission with John Wheeler",
    ],
    namedAfter: ["Bohr radius", "Bohrium (element 107)", "Bohr magneton"],
    nobelYear: 1922, nobelReason: "Atomic structure and quantum mechanics",
    quote: "If quantum mechanics hasn't profoundly shocked you, you haven't understood it yet.",
  },
  {
    id: "planck", name: "Max Planck", born: "1858", died: "1947",
    nationality: "German", flag: "🇩🇪", portrait: "👨‍🔬",
    domains: ["quantum", "modern"],
    bio: "Max Planck introduced the quantum of action (Planck's constant) in 1900 to solve the ultraviolet catastrophe in blackbody radiation. This reluctant revolutionary founded quantum theory.",
    contributions: [
      "Planck's Law of blackbody radiation (1900)",
      "Introduction of energy quantisation (E = hf)",
      "Planck's constant h = 6.626×10⁻³⁴ J·s",
      "Planck units — natural system of measurement",
    ],
    namedAfter: ["Planck's constant", "Planck length/time/mass", "Max Planck Society"],
    nobelYear: 1918, nobelReason: "Energy quanta and Planck's constant",
  },
  {
    id: "feynman", name: "Richard Feynman", born: "1918", died: "1988",
    nationality: "American", flag: "🇺🇸", portrait: "👨‍🔬",
    domains: ["quantum", "modern"],
    bio: "Richard Feynman developed quantum electrodynamics (QED), the most precisely tested theory in physics. Famous for Feynman diagrams and his gift for explaining complex physics intuitively.",
    contributions: [
      "Quantum Electrodynamics (QED) — most accurate physics theory",
      "Feynman diagrams (path integral formulation)",
      "Feynman Lectures on Physics (landmark textbook)",
      "Theory of superfluidity in helium",
      "Early vision of nanotechnology (1959 lecture)",
    ],
    namedAfter: ["Feynman diagrams", "Feynman path integral", "Feynman point (π)"],
    nobelYear: 1965, nobelReason: "Quantum electrodynamics",
    quote: "I think I can safely say that nobody understands quantum mechanics.",
  },
  {
    id: "hawking", name: "Stephen Hawking", born: "1942", died: "2018",
    nationality: "British", flag: "🇬🇧", portrait: "👨‍🔬",
    domains: ["astrophysics", "quantum", "relativity"],
    bio: "Stephen Hawking made landmark contributions to theoretical physics despite being diagnosed with ALS at 21. He discovered that black holes emit radiation and championed the popularisation of cosmology.",
    contributions: [
      "Hawking radiation — black holes are not entirely black",
      "Singularity theorems (with Roger Penrose)",
      "Black hole area theorem",
      "Quantum cosmology — no-boundary proposal",
      "A Brief History of Time — 237 weeks on bestseller list",
    ],
    namedAfter: ["Hawking radiation", "Hawking–Penrose theorems"],
    quote: "However difficult life may seem, there is always something you can do and succeed at.",
  },
];

// ── Physics Laws ───────────────────────────────────────────────────────────────
export interface PhysicsLaw {
  id:          string;
  name:        string;
  scientist:   string;
  year:        number;
  domain:      PhysicsDomain;
  statement:   string;
  latex?:      string;
  applications: string[];
  limitations:  string;
}

export const PHYSICS_LAWS: PhysicsLaw[] = [
  {
    id: "newton-1", name: "Newton's First Law (Inertia)", scientist: "Isaac Newton",
    year: 1687, domain: "mechanics",
    statement: "Every object remains at rest or in uniform motion in a straight line unless acted upon by a net external force.",
    applications: ["Seatbelts (passengers continue forward when car stops)", "Spacecraft coasting in space", "Objects on a bus lurching when it brakes"],
    limitations: "Only valid in inertial (non-accelerating) reference frames.",
  },
  {
    id: "newton-2", name: "Newton's Second Law", scientist: "Isaac Newton",
    year: 1687, domain: "mechanics",
    statement: "The net force on an object equals its mass times acceleration.",
    latex: "\\vec{F}_{net} = m\\vec{a}",
    applications: ["Rocket propulsion", "Car acceleration", "Structural engineering loads"],
    limitations: "Breaks down at speeds approaching c (special relativity takes over).",
  },
  {
    id: "ohm", name: "Ohm's Law", scientist: "Georg Ohm",
    year: 1827, domain: "electricity",
    statement: "The current through a conductor is proportional to the voltage across it, at constant temperature.",
    latex: "V = IR",
    applications: ["Circuit design", "Electrical safety", "Resistor calculation"],
    limitations: "Only for ohmic materials at constant temperature. Semiconductors, diodes do not obey Ohm's Law.",
  },
  {
    id: "faraday", name: "Faraday's Law of Induction", scientist: "Michael Faraday",
    year: 1831, domain: "magnetism",
    statement: "The induced EMF in a circuit is proportional to the rate of change of magnetic flux through it.",
    latex: "\\mathcal{E} = -\\frac{d\\Phi_B}{dt}",
    applications: ["Electric generators", "Transformers", "Induction cooktops", "Wireless charging"],
    limitations: "Lenz's Law (the minus sign) describes direction of induced current.",
  },
  {
    id: "snell", name: "Snell's Law", scientist: "Willebrord Snell",
    year: 1621, domain: "optics",
    statement: "The ratio of sines of angles of incidence and refraction equals the ratio of refractive indices.",
    latex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2",
    applications: ["Eyeglass lens design", "Optical fibre TIR", "Camera lenses", "Diamond cut"],
    limitations: "Assumes homogeneous, isotropic media with a sharp boundary.",
  },
  {
    id: "conservation-energy", name: "Conservation of Energy", scientist: "Joule, Helmholtz, Mayer",
    year: 1847, domain: "thermodynamics",
    statement: "Energy cannot be created or destroyed, only converted from one form to another.",
    applications: ["All of engineering", "Power plant design", "Nutrition science (calories)", "Chemical reactions"],
    limitations: "In general relativity, energy conservation is more subtle in expanding space.",
  },
  {
    id: "newton-gravity", name: "Newton's Law of Gravitation", scientist: "Isaac Newton",
    year: 1687, domain: "mechanics",
    statement: "Every two masses attract each other with a force proportional to their masses and inversely proportional to the square of the distance.",
    latex: "F = \\frac{Gm_1m_2}{r^2}",
    applications: ["Satellite orbits", "Tidal prediction", "Space mission planning"],
    limitations: "Superseded by General Relativity for strong fields and high precision.",
  },
  {
    id: "boyle", name: "Boyle's Law", scientist: "Robert Boyle",
    year: 1662, domain: "thermodynamics",
    statement: "At constant temperature, the pressure of a fixed amount of gas is inversely proportional to its volume.",
    latex: "PV = \\text{constant} \\quad (T \\text{ fixed})",
    applications: ["Scuba diving (gas compression)", "Syringes", "Car engines", "Weather balloons"],
    limitations: "Ideal gas only. Real gases deviate at high pressure or low temperature.",
  },
];

// ── Nobel Prizes in Physics ───────────────────────────────────────────────────
export interface NobelPrize {
  year:       number;
  laureates:  string[];
  country:    string;
  discovery:  string;
  domain:     PhysicsDomain;
  significance: string;
}

export const NOBEL_PRIZES: NobelPrize[] = [
  { year: 2023, laureates: ["Pierre Agostini", "Ferenc Krausz", "Anne L'Huillier"], country: "France/Hungary/Sweden", discovery: "Attosecond pulses of light for electron dynamics", domain: "modern", significance: "Enabled real-time observation of electrons moving inside atoms (attosecond = 10⁻¹⁸ s)" },
  { year: 2022, laureates: ["Alain Aspect", "John Clauser", "Anton Zeilinger"], country: "France/USA/Austria", discovery: "Entangled photons and Bell inequality violations", domain: "quantum", significance: "Proved quantum entanglement is real — foundation for quantum computing and cryptography" },
  { year: 2021, laureates: ["Syukuro Manabe", "Klaus Hasselmann", "Giorgio Parisi"], country: "Japan/Germany/Italy", discovery: "Complex systems — climate modelling and disorder", domain: "thermodynamics", significance: "Physics of climate change — physical basis for global warming models" },
  { year: 2020, laureates: ["Roger Penrose", "Reinhard Genzel", "Andrea Ghez"], country: "UK/Germany/USA", discovery: "Black holes and Milky Way galactic centre", domain: "astrophysics", significance: "Penrose proved black holes are GR prediction; Genzel/Ghez discovered supermassive black hole at galactic centre" },
  { year: 2019, laureates: ["James Peebles", "Michel Mayor", "Didier Queloz"], country: "Canada/Switzerland", discovery: "Physical cosmology and first exoplanet around sun-like star", domain: "astrophysics", significance: "Confirmed we live in a dark energy–dominated universe; discovered first planet outside our solar system" },
  { year: 2017, laureates: ["Rainer Weiss", "Barry Barish", "Kip Thorne"], country: "USA", discovery: "Gravitational wave detector LIGO", domain: "astrophysics", significance: "First direct detection of gravitational waves from colliding black holes — confirmed Einstein's 1915 prediction" },
  { year: 2015, laureates: ["Takaaki Kajita", "Arthur McDonald"], country: "Japan/Canada", discovery: "Neutrino oscillations — neutrinos have mass", domain: "modern", significance: "Proved neutrinos have mass — the Standard Model needed revision" },
  { year: 2013, laureates: ["François Englert", "Peter Higgs"], country: "Belgium/UK", discovery: "Higgs mechanism and Higgs boson", domain: "modern", significance: "Explained why fundamental particles have mass; Higgs boson confirmed by LHC in 2012" },
  { year: 1921, laureates: ["Albert Einstein"], country: "Germany", discovery: "Photoelectric effect", domain: "modern", significance: "Founded quantum theory of light — photons are real" },
  { year: 1903, laureates: ["Pierre Curie", "Marie Curie", "Henri Becquerel"], country: "France/Poland", discovery: "Radioactivity research", domain: "modern", significance: "First Nobel in radioactivity; Marie Curie first woman laureate" },
  { year: 1901, laureates: ["Wilhelm Röntgen"], country: "Germany", discovery: "X-rays", domain: "modern", significance: "First ever Nobel Prize in Physics; X-rays immediately transformed medicine" },
];

// ── Physical Instruments ──────────────────────────────────────────────────────
export interface Instrument {
  id:           string;
  name:         string;
  icon:         string;
  domain:       PhysicsDomain;
  purpose:      string;
  principle:    string;
  invented:     string;
  applications: string[];
}

export const INSTRUMENTS: Instrument[] = [
  { id: "oscilloscope", name: "Oscilloscope", icon: "📺", domain: "electricity", purpose: "Visualise electrical signals vs time", principle: "Electron beam deflected by voltages to trace waveform on screen", invented: "1897 (Braun tube)", applications: ["Circuit debugging", "Audio analysis", "Medical ECG display"] },
  { id: "spectrometer", name: "Spectrometer", icon: "🌈", domain: "optics", purpose: "Measure wavelengths of light", principle: "Diffraction grating or prism separates light by wavelength", invented: "1814 (Fraunhofer)", applications: ["Chemical analysis", "Astronomical spectroscopy", "Identifying elements"] },
  { id: "geiger", name: "Geiger Counter", icon: "☢️", domain: "modern", purpose: "Detect ionising radiation", principle: "Radiation ionises gas in tube → electrical pulse counted", invented: "1908 (Geiger)", applications: ["Radiation safety", "Nuclear research", "Mineral prospecting"] },
  { id: "manometer", name: "Manometer", icon: "🌡️", domain: "thermodynamics", purpose: "Measure gas pressure", principle: "Pressure difference supports a column of liquid (mercury/water)", invented: "1643 (Torricelli barometer)", applications: ["Weather forecasting", "Medical (blood pressure)", "Industrial gas pressure"] },
  { id: "galvanometer", name: "Galvanometer", icon: "🔌", domain: "electricity", purpose: "Detect tiny electric currents", principle: "Current-carrying coil in magnetic field — deflection ∝ current", invented: "1820 (Schweigger)", applications: ["Voltmeter/ammeter (with modifications)", "Lie detectors", "Seismographs"] },
  { id: "cyclotron", name: "Cyclotron", icon: "⚛️", domain: "modern", purpose: "Accelerate charged particles", principle: "Alternating electric field + magnetic field curves particles into spiral", invented: "1930 (Ernest Lawrence)", applications: ["Nuclear physics research", "Medical isotope production", "Cancer proton therapy"] },
];

// ── Natural Phenomena ─────────────────────────────────────────────────────────
export interface Phenomenon {
  id:        string;
  name:      string;
  icon:      string;
  domain:    PhysicsDomain;
  description: string;
  physics:   string;
  example:   string;
}

export const PHENOMENA: Phenomenon[] = [
  { id: "aurora", name: "Aurora Borealis", icon: "🌌", domain: "magnetism", description: "Colourful light displays in polar skies (Northern/Southern Lights)", physics: "Solar wind particles guided by Earth's magnetic field collide with atmospheric atoms (N₂, O), exciting them. They emit light as they return to ground state — red (O at high altitude), green (O at low altitude), blue/purple (N₂).", example: "Visible in Norway, Iceland, Alaska, Antarctica" },
  { id: "lightning", name: "Lightning", icon: "⚡", domain: "electricity", description: "Enormous electrical discharge between clouds or cloud and ground", physics: "Separation of charges in thunderclouds (positive top, negative bottom) creates electric fields up to 100 MV. Ionised air (plasma) forms a conducting channel — lightning bolt. Peak current ~30,000 A, temperature ~30,000 K (5× hotter than Sun surface).", example: "~100 lightning bolts strike Earth every second" },
  { id: "mirage", name: "Mirage", icon: "🏜️", domain: "optics", description: "Optical illusion of water or inverted images in desert heat", physics: "Layers of hot air near the ground have lower refractive index. Light from sky refracts gradually, eventually undergoing total internal reflection in hot air layers — appearing to come from below, like a reflection in water.", example: "Desert roads appearing wet on hot days" },
  { id: "doppler", name: "Doppler Effect", icon: "🚑", domain: "waves", description: "Frequency change when source and observer move relative to each other", physics: "Moving source compresses wavefronts in the direction of motion (higher frequency heard) and stretches them behind (lower frequency). f' = f(v/(v±vs)).", example: "Ambulance siren pitch drops as it passes; redshift of receding galaxies" },
  { id: "interference", name: "Wave Interference", icon: "〰️", domain: "waves", description: "Superposition of two or more waves creating reinforcement or cancellation", physics: "Constructive interference: waves in phase → amplitude adds. Destructive: waves out of phase by half wavelength → cancellation. Requires coherent sources (same frequency and phase).", example: "Colours in soap bubbles, noise-cancelling headphones, double-slit experiment" },
  { id: "superconductivity", name: "Superconductivity", icon: "🔵", domain: "modern", description: "Zero electrical resistance below a critical temperature", physics: "Below Tc, electron pairs (Cooper pairs) form and condense into a quantum state immune to scattering. No resistance = current flows forever with zero energy loss.", example: "MRI magnets, maglev trains, quantum computers; record Tc ≈ −70°C (under pressure)" },
];

// ── Glossary ──────────────────────────────────────────────────────────────────
export interface GlossaryTerm {
  term:       string;
  definition: string;
  domain:     PhysicsDomain;
  latex?:     string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: "Acceleration",     domain: "mechanics",      definition: "Rate of change of velocity. Vector quantity measured in m/s².", latex: "a = \\frac{\\Delta v}{\\Delta t}" },
  { term: "Amplitude",        domain: "waves",          definition: "Maximum displacement of a wave from its equilibrium position." },
  { term: "Capacitance",      domain: "electricity",    definition: "Ability to store electric charge per unit voltage. C = Q/V. Measured in Farads.", latex: "C = \\frac{Q}{V}" },
  { term: "Critical Angle",   domain: "optics",         definition: "Minimum angle of incidence (in denser medium) at which total internal reflection occurs.", latex: "\\theta_c = \\sin^{-1}(n_2/n_1)" },
  { term: "Diffraction",      domain: "waves",          definition: "Bending of waves around obstacles or through gaps, most pronounced when gap ≈ wavelength." },
  { term: "Electric Field",   domain: "electricity",    definition: "Force per unit positive charge at a point in space. E = F/q. Vector quantity.", latex: "E = \\frac{F}{q} = k\\frac{Q}{r^2}" },
  { term: "Entropy",          domain: "thermodynamics", definition: "Measure of disorder or number of microstates of a system. Always increases in an isolated system (2nd Law of Thermodynamics)." },
  { term: "Half-life",        domain: "modern",         definition: "Time for half the radioactive nuclei in a sample to decay. Constant for a given isotope." },
  { term: "Inertia",          domain: "mechanics",      definition: "Tendency of an object to resist changes in its state of motion. Quantified by mass." },
  { term: "Latent Heat",      domain: "thermodynamics", definition: "Energy absorbed or released during a phase change at constant temperature." },
  { term: "Magnetic Flux",    domain: "magnetism",      definition: "Total magnetic field lines passing through a surface. Φ = BA cosθ. Measured in Webers.", latex: "\\Phi = BA\\cos\\theta" },
  { term: "Momentum",         domain: "mechanics",      definition: "Product of mass and velocity. Conserved in isolated systems.", latex: "p = mv" },
  { term: "Photon",           domain: "modern",         definition: "Quantum (particle) of electromagnetic radiation. Massless, travels at c." },
  { term: "Refraction",       domain: "optics",         definition: "Bending of a wave as it passes from one medium to another due to speed change." },
  { term: "Torque",           domain: "mechanics",      definition: "Rotational equivalent of force. τ = r × F. Depends on force, distance from pivot, and angle.", latex: "\\tau = rF\\sin\\theta" },
  { term: "Wave Function",    domain: "quantum",        definition: "Mathematical description of quantum state. |ψ|² gives probability density of finding particle at a location." },
  { term: "Work Function",    domain: "modern",         definition: "Minimum energy required to free an electron from a metal surface in the photoelectric effect." },
  { term: "Young's Modulus",  domain: "mechanics",      definition: "Measure of stiffness of a material — stress divided by strain within elastic limit.", latex: "E = \\frac{\\text{stress}}{\\text{strain}}" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getScientistById(id: string) { return SCIENTISTS.find((s) => s.id === id); }
export function getLawById(id: string)       { return PHYSICS_LAWS.find((l) => l.id === id); }
export function getGlossaryByLetter(letter: string) {
  return GLOSSARY.filter((g) => g.term.toUpperCase().startsWith(letter.toUpperCase()));
}
