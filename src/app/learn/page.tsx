// src/app/learn/page.tsx
import type { Metadata } from "next";
import { LearnClient } from "./LearnClient";

export const metadata: Metadata = {
  title: "Learn Physics",
  description:
    "65+ chapters across 10 physics domains — Mechanics, Waves, Electricity, Quantum and more.",
};

export default function LearnPage() {
  return <LearnClient />;
}
