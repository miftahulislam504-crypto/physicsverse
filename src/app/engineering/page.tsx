// src/app/engineering/page.tsx
import type { Metadata } from "next";
import { EngineeringClient } from "./EngineeringClient";
export const metadata: Metadata = {
  title: "Engineering Applications",
  description: "See how physics principles power real engineering — bridges, engines, power grids, aircraft, robots, and renewable energy.",
};
export default function EngineeringPage() { return <EngineeringClient />; }
