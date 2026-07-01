// src/app/city/page.tsx
import type { Metadata } from "next";
import { CityClient } from "./CityClient";

export const metadata: Metadata = {
  title: "3D Science City",
  description: "Walk through PhysicsVerse's immersive 3D Science City — 10 buildings, each a gateway to a different part of the platform.",
};

export default function CityPage() {
  return <CityClient />;
}
