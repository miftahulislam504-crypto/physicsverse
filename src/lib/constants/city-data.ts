// src/lib/constants/city-data.ts
// Layout and metadata for the 3D Immersive Science City (Phase 13)

export interface CityBuilding {
  id:            string;
  slug:          string;
  name:          string;
  icon:          string;
  color:         string;
  description:   string;
  position:      [number, number, number];   // x, y, z in world units
  rotation:      number;                     // radians around Y axis
  scale:         [number, number, number];
  linkHref:      string;                     // where "Enter" navigates to
  unlockLevel:   number;                     // XP-level index required (0 = always unlocked)
  shape:         "tower" | "dome" | "cube" | "pyramid" | "cylinder";
}

export const CITY_BUILDINGS: CityBuilding[] = [
  {
    id: "academy", slug: "academy",
    name: "Physics Academy", icon: "📖", color: "#0090f0",
    description: "The Learn Module — chapter-wise physics education across all domains.",
    position: [0, 0, -30], rotation: 0, scale: [6, 8, 6],
    linkHref: "/learn", unlockLevel: 0, shape: "tower",
  },
  {
    id: "laboratory", slug: "laboratory",
    name: "Grand Laboratory", icon: "🧪", color: "#f97316",
    description: "The Physics Lab — 15 interactive virtual experiments across 9 zones.",
    position: [-28, 0, -10], rotation: Math.PI / 6, scale: [7, 6, 7],
    linkHref: "/lab", unlockLevel: 0, shape: "dome",
  },
  {
    id: "observatory", slug: "observatory",
    name: "Space Observatory", icon: "🔭", color: "#818cf8",
    description: "Orbital simulators, gravity sandbox, and the mysteries of the cosmos.",
    position: [28, 0, -10], rotation: -Math.PI / 6, scale: [6, 10, 6],
    linkHref: "/lab/orbital-simulator", unlockLevel: 0, shape: "dome",
  },
  {
    id: "energy-center", slug: "energy-center",
    name: "Energy Center", icon: "⚡", color: "#facc15",
    description: "Thermodynamics, energy conversion, and the physics of power.",
    position: [-34, 0, 18], rotation: Math.PI / 4, scale: [6, 7, 6],
    linkHref: "/lab/energy-conversion", unlockLevel: 1, shape: "cylinder",
  },
  {
    id: "quantum-building", slug: "quantum-building",
    name: "Quantum Building", icon: "⚛️", color: "#e879f9",
    description: "Modern physics zone — photoelectric effect, wave-particle duality.",
    position: [34, 0, 18], rotation: -Math.PI / 4, scale: [5, 9, 5],
    linkHref: "/lab/photoelectric-effect", unlockLevel: 2, shape: "pyramid",
  },
  {
    id: "wave-hall", slug: "wave-hall",
    name: "Wave Hall", icon: "〰️", color: "#34d399",
    description: "Sound, light, and electromagnetic waves — the wave zone.",
    position: [0, 0, 26], rotation: 0, scale: [8, 5, 8],
    linkHref: "/lab/wave-generator", unlockLevel: 1, shape: "cube",
  },
  {
    id: "history-gallery", slug: "history-gallery",
    name: "History Gallery", icon: "🖼️", color: "#a78bfa",
    description: "The Physics Encyclopedia — scientists, laws, Nobel Prizes through time.",
    position: [-18, 0, 42], rotation: Math.PI / 8, scale: [7, 6, 7],
    linkHref: "/encyclopedia", unlockLevel: 0, shape: "tower",
  },
  {
    id: "innovation-hub", slug: "innovation-hub",
    name: "Innovation Hub", icon: "🏗️", color: "#94a3b8",
    description: "Engineering Applications — physics powering the real world.",
    position: [18, 0, 42], rotation: -Math.PI / 8, scale: [7, 6, 7],
    linkHref: "/engineering", unlockLevel: 1, shape: "cube",
  },
  {
    id: "community-center", slug: "community-center",
    name: "Community Center", icon: "👥", color: "#22d3ee",
    description: "Meet other learners — the Community Hub.",
    position: [-42, 0, -30], rotation: 0, scale: [6, 5, 6],
    linkHref: "/community", unlockLevel: 0, shape: "dome",
  },
  {
    id: "research-institute", slug: "research-institute",
    name: "Research Institute", icon: "🔬", color: "#22c55e",
    description: "The Discovery Center — find physics laws yourself from data.",
    position: [42, 0, -30], rotation: 0, scale: [6, 6, 6],
    linkHref: "/discovery", unlockLevel: 2, shape: "pyramid",
  },
];

// ── Ground decoration (trees / lamp posts) — simple procedural placement ──────
export function generateDecorations(seed = 42) {
  const decorations: { type: "tree" | "lamp"; position: [number, number, number] }[] = [];
  let s = seed;
  function rand() { s = (s * 9301 + 49297) % 233280; return s / 233280; }

  for (let i = 0; i < 40; i++) {
    const angle = rand() * Math.PI * 2;
    const radius = 15 + rand() * 45;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    // Avoid placing on buildings (simple distance check)
    const tooClose = CITY_BUILDINGS.some((b) => {
      const dx = b.position[0] - x; const dz = b.position[2] - z;
      return Math.sqrt(dx * dx + dz * dz) < 10;
    });
    if (tooClose) continue;
    decorations.push({
      type: rand() > 0.6 ? "lamp" : "tree",
      position: [x, 0, z],
    });
  }
  return decorations;
}

// ── Path waypoints for the central plaza ──────────────────────────────────────
export const PLAZA_RADIUS = 12;
export const CITY_BOUNDS  = 60;  // half-extent of the walkable ground

export function getBuildingBySlug(slug: string) {
  return CITY_BUILDINGS.find((b) => b.slug === slug);
}
