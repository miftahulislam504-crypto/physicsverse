// src/app/lab/page.tsx
import type { Metadata } from "next";
import { LabClient } from "./LabClient";

export const metadata: Metadata = {
  title: "Physics Lab",
  description:
    "24 interactive virtual experiments across 9 physics zones — run simulations, adjust parameters, and see physics in action.",
};

export default function LabPage() {
  return <LabClient />;
}
