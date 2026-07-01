// src/app/encyclopedia/page.tsx
import type { Metadata } from "next";
import { EncyclopediaClient } from "./EncyclopediaClient";
export const metadata: Metadata = {
  title: "Physics Encyclopedia",
  description: "Scientists, laws, Nobel prizes, instruments, phenomena, and a complete physics glossary.",
};
export default function EncyclopediaPage() { return <EncyclopediaClient />; }
