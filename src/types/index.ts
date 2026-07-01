// ─── PhysicsVerse Global Types ────────────────────────────────────────────────

// ── Language ──────────────────────────────────────────────────────────────────
export type Locale = "en" | "bn";

// ── Physics Domains ───────────────────────────────────────────────────────────
export type PhysicsDomain =
  | "mechanics"
  | "thermodynamics"
  | "electricity"
  | "magnetism"
  | "waves"
  | "optics"
  | "modern"
  | "astrophysics"
  | "quantum"
  | "relativity";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "olympiad";

export type LearningPath = "ssc" | "hsc" | "admission" | "olympiad" | "curious";

// ── User ──────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  locale: Locale;
  learningPath: LearningPath;
  level: UserLevel;
  createdAt: Date;
  lastActiveAt: Date;
}

export type UserLevel =
  | "electron"
  | "proton"
  | "neutron"
  | "atom"
  | "molecule"
  | "star";

export interface UserProgress {
  id: string;
  uid: string;
  completedChapters: string[];       // chapter IDs
  completedLabs: string[];           // lab IDs
  solvedProblems: string[];          // problem IDs
  bookmarks: Bookmark[];
  streakDays: number;
  lastStreakDate: string;            // ISO date
  totalXP: number;
  badges: string[];                  // badge IDs
  weakTopics: PhysicsDomain[];
}

// ── Chapter / Learn ───────────────────────────────────────────────────────────
export interface Chapter {
  id: string;
  slug: string;
  domain: PhysicsDomain;
  title: LocalizedText;
  description: LocalizedText;
  difficulty: DifficultyLevel;
  prerequisites: string[];           // chapter IDs
  estimatedMinutes: number;
  order: number;
  sections: Section[];
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  title: LocalizedText;
  content: LocalizedText;            // MDX or rich text
  type: SectionType;
  formulas?: Formula[];
  diagrams?: Diagram[];
  examples?: Example[];
  misconceptions?: Misconception[];
}

export type SectionType =
  | "concept"
  | "formula"
  | "example"
  | "misconception"
  | "summary"
  | "quiz";

// ── Formula ───────────────────────────────────────────────────────────────────
export interface Formula {
  id: string;
  name: LocalizedText;
  latex: string;                     // KaTeX string
  variables: FormulaVariable[];
  domain: PhysicsDomain;
  derivationSteps?: LocalizedText[];
  realWorldUses: LocalizedText[];
  relatedFormulas: string[];         // formula IDs
  unit?: string;
}

export interface FormulaVariable {
  symbol: string;
  name: LocalizedText;
  unit: string;
  min?: number;
  max?: number;
  defaultValue: number;
  step?: number;
}

// ── Lab / Simulation ──────────────────────────────────────────────────────────
export interface Lab {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  domain: PhysicsDomain;
  zone: LabZone;
  difficulty: DifficultyLevel;
  relatedChapters: string[];         // chapter IDs
  relatedFormulas: string[];         // formula IDs
  parameters: LabParameter[];
  learningObjectives: LocalizedText[];
  estimatedMinutes: number;
}

export type LabZone =
  | "motion"
  | "force"
  | "energy"
  | "electricity"
  | "waves"
  | "light"
  | "thermal"
  | "space"
  | "modern";

export interface LabParameter {
  id: string;
  label: LocalizedText;
  symbol: string;
  unit: string;
  min: number;
  max: number;
  defaultValue: number;
  step: number;
}

// ── Practice ──────────────────────────────────────────────────────────────────
export interface Problem {
  id: string;
  type: ProblemType;
  domain: PhysicsDomain;
  difficulty: DifficultyLevel;
  examLevel: ExamLevel[];
  question: LocalizedText;
  questionImage?: string;            // URL
  options?: LocalizedText[];         // MCQ only
  correctAnswer: string | number;
  solution: Solution;
  tags: string[];
  sourceExam?: string;
  year?: number;
}

export type ProblemType =
  | "mcq"
  | "numerical"
  | "conceptual"
  | "derivation"
  | "image-based"
  | "cq";

export type ExamLevel = "ssc" | "hsc" | "admission" | "olympiad" | "university";

export interface Solution {
  steps: SolutionStep[];
  finalAnswer: LocalizedText;
  alternativeMethods?: SolutionStep[][];
  relatedFormulas: string[];         // formula IDs
  relatedChapters: string[];         // chapter IDs
}

export interface SolutionStep {
  order: number;
  explanation: LocalizedText;
  latex?: string;
  diagram?: string;                  // URL or SVG string
}

// ── Community ─────────────────────────────────────────────────────────────────
export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  type: PostType;
  title: string;
  content: string;
  tags: string[];
  domain?: PhysicsDomain;
  upvotes: number;
  views: number;
  answers: Answer[];
  isPinned: boolean;
  isSolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PostType = "question" | "discussion" | "showcase" | "challenge";

export interface Answer {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: Date;
}

// ── Encyclopedia ──────────────────────────────────────────────────────────────
export interface Scientist {
  id: string;
  name: string;
  born: string;
  died?: string;
  nationality: string;
  photoURL?: string;
  bio: LocalizedText;
  contributions: LocalizedText[];
  namedAfter: string[];              // laws, units, constants
  nobelPrize?: { year: number; reason: LocalizedText };
}

export interface PhysicsLaw {
  id: string;
  name: LocalizedText;
  statement: LocalizedText;
  latex?: string;
  discoveredBy: string;             // Scientist ID
  year: number;
  domain: PhysicsDomain;
  applications: LocalizedText[];
  limitations?: LocalizedText;
  relatedLaws: string[];
}

export interface PhysicsConstant {
  id: string;
  name: LocalizedText;
  symbol: string;
  value: number;
  unit: string;
  uncertainty?: string;
  description: LocalizedText;
  usedIn: string[];                 // formula IDs
}

// ── Shared ────────────────────────────────────────────────────────────────────
export interface LocalizedText {
  en: string;
  bn: string;
}

export interface Diagram {
  id: string;
  type: "svg" | "image" | "animation";
  src: string;
  alt: LocalizedText;
  caption?: LocalizedText;
}

export interface Example {
  id: string;
  title: LocalizedText;
  context: LocalizedText;
  explanation: LocalizedText;
  formula?: string;                  // formula ID
}

export interface Misconception {
  id: string;
  wrong: LocalizedText;
  correct: LocalizedText;
  explanation: LocalizedText;
}

export interface Bookmark {
  id: string;
  type: "chapter" | "formula" | "problem" | "lab" | "article";
  targetId: string;
  title: string;
  savedAt: Date;
}

// ── UI State ──────────────────────────────────────────────────────────────────
export interface NavItem {
  label: LocalizedText;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}
