// src/lib/constants/playground-data.ts

export interface PlaygroundItem {
  id:          string;
  slug:        string;
  title:       string;
  description: string;
  icon:        string;
  color:       string;
  category:    "sandbox" | "space";
}

export const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  {
    id: "collision", slug: "collision",
    title: "Collision Simulator", icon: "💥", color: "#f97316",
    description: "Crash two balls together. Compare elastic vs inelastic collisions and watch momentum stay conserved.",
    category: "sandbox",
  },
  {
    id: "rocket", slug: "rocket-launch",
    title: "Rocket Launch", icon: "🚀", color: "#ef4444",
    description: "Design your own rocket. Control thrust, mass, and burn time. Will it reach orbit or fall back to Earth?",
    category: "sandbox",
  },
  {
    id: "gravity", slug: "gravity-sandbox",
    title: "Gravity Sandbox", icon: "🌌", color: "#94a3b8",
    description: "Place multiple masses in space and watch n-body gravitational chaos unfold in real time.",
    category: "space",
  },
];

export function getPlaygroundBySlug(slug: string) {
  return PLAYGROUND_ITEMS.find((p) => p.slug === slug);
}
