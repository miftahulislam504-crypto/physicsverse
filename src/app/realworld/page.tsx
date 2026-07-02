// src/app/realworld/page.tsx
import type { Metadata } from "next";
import { RealWorldClient } from "./RealWorldClient";
export const metadata: Metadata = {
  title: "Real World Physics",
  description: "How physics explains everyday life — from airplanes to smartphones, rainbows to GPS.",
};
export default function RealWorldPage() { return <RealWorldClient />; }
