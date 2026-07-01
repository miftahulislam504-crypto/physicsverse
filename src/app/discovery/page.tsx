// src/app/discovery/page.tsx
import type { Metadata } from "next";
import { DiscoveryClient } from "./DiscoveryClient";
export const metadata: Metadata = {
  title: "Discovery Center",
  description: "Discover physics laws yourself — analyze real data patterns and test hypotheses like a real scientist.",
};
export default function DiscoveryPage() { return <DiscoveryClient />; }
