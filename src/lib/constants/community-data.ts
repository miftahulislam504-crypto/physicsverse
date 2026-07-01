// src/lib/constants/community-data.ts
import type { PhysicsDomain } from "@/types";

export interface CommunityAnswer {
  id:          string;
  author:      string;
  avatar:      string;
  content:     string;
  upvotes:     number;
  isAccepted:  boolean;
  createdAt:   string;
}

export interface CommunityPost {
  id:          string;
  type:        "question" | "discussion" | "showcase";
  author:      string;
  avatar:      string;
  title:       string;
  content:     string;
  domain?:     PhysicsDomain;
  tags:        string[];
  upvotes:     number;
  views:       number;
  isSolved:    boolean;
  isPinned:    boolean;
  createdAt:   string;
  answers:     CommunityAnswer[];
}

// Seed data — in production this comes from Firestore `posts` collection
export const SEED_POSTS: CommunityPost[] = [
  {
    id: "post-001", type: "question",
    author: "Rafiq_Ahmed", avatar: "🧑‍🎓",
    title: "Why does centripetal force not do any work?",
    content: "I understand F=mv²/r points toward the center, but my teacher says it does zero work on the object. How can a force exist but do no work? This confuses me a lot.",
    domain: "mechanics", tags: ["circular motion", "work", "centripetal force"],
    upvotes: 24, views: 312, isSolved: true, isPinned: true,
    createdAt: "2026-06-25T10:30:00Z",
    answers: [
      {
        id: "ans-001", author: "Dr_Karim", avatar: "👨‍🏫",
        content: "Great question! Work = F·d·cos(θ). Centripetal force is always perpendicular to velocity (which is tangential to the circle). Since θ=90°, cos(90°)=0, so W=0. The force changes direction of motion but not speed — that's why no work is done.",
        upvotes: 18, isAccepted: true, createdAt: "2026-06-25T11:15:00Z",
      },
      {
        id: "ans-002", author: "Fatima_S", avatar: "👩‍🎓",
        content: "Think of it this way: if work were done, kinetic energy would change. But in uniform circular motion, speed stays constant, so KE stays constant. No KE change = no net work done!",
        upvotes: 9, isAccepted: false, createdAt: "2026-06-25T14:20:00Z",
      },
    ],
  },
  {
    id: "post-002", type: "question",
    author: "Nusrat_Jahan", avatar: "👩‍🎓",
    title: "HSC Physics: Doppler effect problem help",
    content: "A car horn at 500 Hz approaches a stationary observer at 25 m/s. Speed of sound = 340 m/s. I'm getting 540 Hz but the answer key says 537 Hz. Where am I going wrong?",
    domain: "waves", tags: ["doppler effect", "HSC", "sound waves"],
    upvotes: 15, views: 203, isSolved: true, isPinned: false,
    createdAt: "2026-06-26T09:00:00Z",
    answers: [
      {
        id: "ans-003", author: "PhysicsGuru99", avatar: "🧑‍🔬",
        content: "f' = f × v/(v-vs) = 500 × 340/(340-25) = 500 × 340/315 = 539.7 ≈ 540 Hz. Your answer is correct! The answer key might be using v_sound = 343 m/s instead of 340. Always double check given constants.",
        upvotes: 12, isAccepted: true, createdAt: "2026-06-26T10:30:00Z",
      },
    ],
  },
  {
    id: "post-003", type: "discussion",
    author: "Tanvir_Hasan", avatar: "🧑‍💻",
    title: "What's the most counter-intuitive physics concept you've learned?",
    content: "For me it's quantum entanglement — two particles affecting each other instantly regardless of distance. Einstein called it 'spooky action at a distance' and even he was uncomfortable with it! What blew your mind?",
    tags: ["discussion", "quantum", "fun"],
    upvotes: 47, views: 580, isSolved: false, isPinned: false,
    createdAt: "2026-06-24T16:45:00Z",
    answers: [
      {
        id: "ans-004", author: "Sumaiya_R", avatar: "👩‍💻",
        content: "Time dilation for me! The idea that a clock moving fast literally ticks slower, and it's been experimentally verified with atomic clocks on airplanes. Reality is weirder than fiction.",
        upvotes: 22, isAccepted: false, createdAt: "2026-06-24T18:00:00Z",
      },
      {
        id: "ans-005", author: "Rakib_Islam", avatar: "🧑‍🎓",
        content: "Negative absolute temperature in some quantum systems is mind-bending. It's technically HOTTER than positive temperature, not colder!",
        upvotes: 14, isAccepted: false, createdAt: "2026-06-25T08:30:00Z",
      },
    ],
  },
  {
    id: "post-004", type: "question",
    author: "Mehedi_Hasan", avatar: "🧑‍🎓",
    title: "Admission test: Capacitor combination confusion",
    content: "For BUET prep — when capacitors are in series, why does the SMALLER capacitor dominate the combined capacitance (like resistance in parallel)? It feels backwards intuitively.",
    domain: "electricity", tags: ["capacitor", "admission", "BUET"],
    upvotes: 19, views: 245, isSolved: false, isPinned: false,
    createdAt: "2026-06-27T07:20:00Z",
    answers: [],
  },
  {
    id: "post-005", type: "showcase",
    author: "Ayesha_Khan", avatar: "👩‍🔬",
    title: "Built a simple electromagnet for my school science fair!",
    content: "Used a nail, copper wire, and a 9V battery. Could pick up small paperclips. The physics: current through coiled wire creates a magnetic field that's amplified by the iron core's domains aligning. Got 1st place! 🏆",
    domain: "magnetism", tags: ["project", "DIY", "electromagnet"],
    upvotes: 63, views: 890, isSolved: false, isPinned: true,
    createdAt: "2026-06-20T12:00:00Z",
    answers: [
      {
        id: "ans-006", author: "Dr_Karim", avatar: "👨‍🏫",
        content: "Excellent project! Try varying the number of coil turns next — you'll see the relationship B ∝ N directly. Congratulations on first place!",
        upvotes: 8, isAccepted: false, createdAt: "2026-06-20T15:00:00Z",
      },
    ],
  },
  {
    id: "post-006", type: "question",
    author: "Imran_Chowdhury", avatar: "🧑‍🎓",
    title: "Why is the sky blue but sunset red? (Same scattering, different colors?)",
    content: "I know it's Rayleigh scattering, but I don't fully understand why the SAME phenomenon gives blue sky at noon and red/orange sky at sunset. Can someone explain the geometry?",
    domain: "optics", tags: ["scattering", "atmosphere", "color"],
    upvotes: 31, views: 412, isSolved: true, isPinned: false,
    createdAt: "2026-06-23T14:00:00Z",
    answers: [
      {
        id: "ans-007", author: "Fatima_S", avatar: "👩‍🎓",
        content: "At noon, sunlight travels a short path through atmosphere — blue scatters most (Rayleigh: intensity ∝ 1/λ⁴) and reaches your eyes from all directions = blue sky. At sunset, light travels a MUCH longer path through atmosphere. Blue gets scattered away completely before reaching you — only red/orange (longer wavelength, less scattered) survives the journey to your eyes!",
        upvotes: 25, isAccepted: true, createdAt: "2026-06-23T16:30:00Z",
      },
    ],
  },
];

export function getPostById(id: string) { return SEED_POSTS.find((p) => p.id === id); }
export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
