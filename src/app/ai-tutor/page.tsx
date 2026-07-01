// src/app/ai-tutor/page.tsx
import type { Metadata } from "next";
import { AiTutorClient } from "./AiTutorClient";
export const metadata: Metadata = {
  title: "AI Physics Tutor",
  description: "Ask any physics question. Get step-by-step explanations, hints, and guided problem solving — powered by Claude AI.",
};
export default function AiTutorPage() { return <AiTutorClient />; }
