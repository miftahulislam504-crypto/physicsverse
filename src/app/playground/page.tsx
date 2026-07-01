// src/app/playground/page.tsx
import type { Metadata } from "next";
import { PlaygroundClient } from "./PlaygroundClient";
export const metadata: Metadata = {
  title: "Physics Playground",
  description: "Game-like physics sandbox — collisions, rockets, and n-body gravity simulations.",
};
export default function PlaygroundPage() { return <PlaygroundClient />; }
