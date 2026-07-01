// src/lib/utils/index.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PhysicsDomain, DifficultyLevel, UserLevel } from "@/types";

// ─── Tailwind class merger ────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Domain metadata ──────────────────────────────────────────────────────────
export const DOMAIN_META: Record<
  PhysicsDomain,
  { label: string; color: string; bg: string; icon: string }
> = {
  mechanics:      { label: "Mechanics",      color: "#f97316", bg: "rgba(249,115,22,0.1)",  icon: "⚙️" },
  thermodynamics: { label: "Thermodynamics", color: "#fb7185", bg: "rgba(251,113,133,0.1)", icon: "🌡️" },
  electricity:    { label: "Electricity",    color: "#facc15", bg: "rgba(250,204,21,0.1)",  icon: "⚡" },
  magnetism:      { label: "Magnetism",      color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  icon: "🧲" },
  waves:          { label: "Waves",          color: "#34d399", bg: "rgba(52,211,153,0.1)",  icon: "〰️" },
  optics:         { label: "Optics",         color: "#a5f3fc", bg: "rgba(165,243,252,0.1)", icon: "🔭" },
  modern:         { label: "Modern Physics", color: "#a78bfa", bg: "rgba(167,139,250,0.1)", icon: "⚛️" },
  astrophysics:   { label: "Astrophysics",   color: "#94a3b8", bg: "rgba(148,163,184,0.1)", icon: "🌌" },
  quantum:        { label: "Quantum",        color: "#e879f9", bg: "rgba(232,121,249,0.1)", icon: "🔮" },
  relativity:     { label: "Relativity",     color: "#67e8f9", bg: "rgba(103,232,249,0.1)", icon: "🕰️" },
};

export function getDomainColor(domain: PhysicsDomain) {
  return DOMAIN_META[domain]?.color ?? "#0090f0";
}

export function getDomainBg(domain: PhysicsDomain) {
  return DOMAIN_META[domain]?.bg ?? "rgba(0,144,240,0.1)";
}

// ─── Difficulty metadata ──────────────────────────────────────────────────────
export const DIFFICULTY_META: Record<
  DifficultyLevel,
  { label: string; color: string }
> = {
  beginner:     { label: "Beginner",     color: "#22c55e" },
  intermediate: { label: "Intermediate", color: "#f59e0b" },
  advanced:     { label: "Advanced",     color: "#ef4444" },
  olympiad:     { label: "Olympiad",     color: "#a78bfa" },
};

// ─── User level metadata ──────────────────────────────────────────────────────
export const LEVEL_META: Record<
  UserLevel,
  { label: string; minXP: number; color: string; icon: string }
> = {
  electron: { label: "Electron", minXP: 0,     color: "#94a3b8", icon: "⚡" },
  proton:   { label: "Proton",   minXP: 500,   color: "#22c55e", icon: "🔵" },
  neutron:  { label: "Neutron",  minXP: 1500,  color: "#60a5fa", icon: "⚪" },
  atom:     { label: "Atom",     minXP: 3500,  color: "#f59e0b", icon: "⚛️" },
  molecule: { label: "Molecule", minXP: 8000,  color: "#f97316", icon: "🔗" },
  star:     { label: "Star",     minXP: 20000, color: "#facc15", icon: "⭐" },
};

export function xpToLevel(xp: number): UserLevel {
  const levels = Object.entries(LEVEL_META).reverse() as [UserLevel, { minXP: number }][];
  for (const [level, meta] of levels) {
    if (xp >= meta.minXP) return level;
  }
  return "electron";
}

export function xpToNextLevel(xp: number): { current: UserLevel; next: UserLevel | null; progress: number } {
  const current = xpToLevel(xp);
  const levels = Object.keys(LEVEL_META) as UserLevel[];
  const currentIdx = levels.indexOf(current);
  const next = levels[currentIdx + 1] ?? null;

  if (!next) return { current, next: null, progress: 100 };

  const currentMin = LEVEL_META[current].minXP;
  const nextMin    = LEVEL_META[next].minXP;
  const progress   = Math.round(((xp - currentMin) / (nextMin - currentMin)) * 100);

  return { current, next, progress };
}

// ─── Formatters ───────────────────────────────────────────────────────────────
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year:  "numeric",
    month: "short",
    day:   "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours   = Math.floor(diff / 3_600_000);
  const days    = Math.floor(diff / 86_400_000);

  if (minutes < 1)  return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24)   return `${hours}h ago`;
  if (days < 7)     return `${days}d ago`;
  return formatDate(date);
}

export function formatReadTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min read`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m read` : `${h}h read`;
}

// ─── Slug helpers ─────────────────────────────────────────────────────────────
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── LaTeX / KaTeX ───────────────────────────────────────────────────────────
export function isLatex(str: string): boolean {
  return /\$.*\$|\\[a-zA-Z]/.test(str);
}

// ─── Local storage safe ───────────────────────────────────────────────────────
export function safeLocalStorage() {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}
