// src/app/practice/page.tsx
import type { Metadata } from "next";
import { PracticeClient } from "./PracticeClient";

export const metadata: Metadata = {
  title: "Practice Zone",
  description:
    "MCQ, numerical, conceptual and Olympiad problems with step-by-step solutions, daily challenges, and mock exams.",
};

export default function PracticePage() {
  return <PracticeClient />;
}
