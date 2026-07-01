// src/app/community/page.tsx
import type { Metadata } from "next";
import { CommunityClient } from "./CommunityClient";
export const metadata: Metadata = {
  title: "Community",
  description: "Ask physics questions, discuss concepts, and showcase your projects with fellow learners.",
};
export default function CommunityPage() { return <CommunityClient />; }
