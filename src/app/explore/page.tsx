// src/app/explore/page.tsx
import type { Metadata } from "next";
import { ExploreClient } from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore Physics",
  description:
    "Interactive physics map, timeline, roadmaps, and daily facts — your gateway into the physics universe.",
};

export default function ExplorePage() {
  return <ExploreClient />;
}
