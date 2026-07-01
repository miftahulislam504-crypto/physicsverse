// src/app/formulas/page.tsx
import type { Metadata } from "next";
import { FormulasClient } from "./FormulasClient";

export const metadata: Metadata = {
  title: "Formula Explorer",
  description:
    "Interactive physics formulas with live sliders, real-time graphs, step-by-step derivations, and real-world applications.",
};

export default function FormulasPage() {
  return <FormulasClient />;
}
