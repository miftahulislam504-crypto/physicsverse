// src/app/dashboard/page.tsx
import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";
export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Track your physics learning progress, achievements, and personalized recommendations.",
};
export default function DashboardPage() { return <DashboardClient />; }
